from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from product.models import Product
from .models import Order, OrderItem, Coupon
from .serializers import OrderSerializer
import math
import decimal
from .models import UserProfile
from .serializers import (
    UserProfileViewSerializer,
    UserProfileUpdateSerializer,
    UserCreateSerializer,
)
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import logging

# Module logger
logger = logging.getLogger(__name__)
class LoginJwtView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Accept username OR email
        data = request.data or {}
        identifier = (data.get('login') or data.get('username') or data.get('email') or '').strip()
        password = (data.get('password') or '').strip()
        if not identifier or not password:
            logger.debug("Login attempt missing credentials: identifier_present=%s", bool(identifier))
            return Response({'detail': 'Missing credentials'}, status=status.HTTP_400_BAD_REQUEST)

        User = get_user_model()
        user = User.objects.filter(Q(username__iexact=identifier) | Q(email__iexact=identifier)).first()
        logger.debug("Login lookup: identifier='%s', found_user=%s", identifier, bool(user))
        if not user or not user.check_password(password):
            logger.debug("Login failed: user_found=%s, password_valid=%s", bool(user), (user.check_password(password) if user else False))
            return Response({'detail': 'No active account found with the given credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        if not user.is_active:
            logger.debug("Login blocked: user '%s' inactive", getattr(user, 'username', 'unknown'))
            return Response({'detail': 'User is inactive'}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        logger.debug("Login success for user '%s' (id=%s)", user.username, user.id)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {'id': user.id, 'username': user.username, 'email': user.email},
        })
class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileViewSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_permissions(self):
        if self.request.method in ['POST']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return UserProfileUpdateSerializer
        elif self.request.method == 'POST':
            return UserCreateSerializer
        return UserProfileViewSerializer
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return UserProfile.objects.all()
        return super().get_queryset().filter(user=self.request.user)


class CreateCheckoutSession(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Body: { items: [{ id: number, qty: number }], coupon?: string }
        Returns: { url: string }
        """
        # Safe request diagnostics (debug only)
        try:
            auth_hdr = request.META.get('HTTP_AUTHORIZATION') or ''
            masked_auth = 'present' if auth_hdr else 'missing'
            logger.debug(
                "Checkout attempt: user=%s, is_authenticated=%s, origin=%s, referer=%s, auth_header=%s, path=%s",
                (getattr(request.user, 'username', None) if getattr(request, 'user', None) and request.user.is_authenticated else 'anon'),
                bool(getattr(request, 'user', None) and request.user.is_authenticated),
                request.META.get('HTTP_ORIGIN'),
                request.META.get('HTTP_REFERER'),
                masked_auth,
                request.path,
            )
        except Exception:
            pass
        if not settings.STRIPE_SECRET_KEY:
            return Response({
                'error': 'Stripe not configured. Set STRIPE_SECRET_KEY in backend environment (.env).'
            }, status=400)

        items = request.data.get('items', []) or []
        if not isinstance(items, list) or not items:
            return Response({'error': 'No items provided'}, status=400)
        logger.debug("Checkout items payload: %s", [{"id": it.get('id'), "qty": it.get('qty')} for it in items if isinstance(it, dict)])

    # Validate items and build Stripe line_items from DB data
        product_ids = [it.get('id') for it in items if isinstance(it, dict) and 'id' in it]
        products = {p.id: p for p in Product.objects.filter(id__in=product_ids)}
        line_items = []
        product_entries = []  # track product line items for discount distribution
        for it in items:
            try:
                pid = int(it.get('id'))
                qty = int(it.get('qty', 1))
            except Exception:
                logger.warning("Checkout invalid item format: %s", it)
                return Response({'error': 'Invalid item format'}, status=400)
            if qty < 1:
                continue
            p = products.get(pid)
            if not p:
                logger.warning("Checkout product not found: id=%s", pid)
                return Response({'error': f'Product {pid} not found'}, status=400)
            # Optional inventory check if product has stock_qty
            if hasattr(p, 'stock_qty'):
                if int(p.stock_qty) < qty:
                    logger.warning("Checkout insufficient stock: product=%s, have=%s, want=%s", p.name, p.stock_qty, qty)
                    return Response({'error': f'Insufficient stock for {p.name}'}, status=400)
            # Convert Decimal price to integer cents
            cents = int(decimal.Decimal(p.price) * 100)
            if cents < 0:
                return Response({'error': 'Invalid product price'}, status=400)
            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'product_data': {'name': p.name},
                    'unit_amount': cents,
                },
                'quantity': qty,
            })
            product_entries.append({'index': len(line_items)-1, 'unit_amount': cents, 'quantity': qty, 'name': p.name})

        try:
            import stripe
            stripe.api_key = settings.STRIPE_SECRET_KEY
            # Create pending order first
            order = Order.objects.create(
                user=request.user if request.user and request.user.is_authenticated else None,
                status='pending',
                currency='usd',
                total_amount=sum((decimal.Decimal(p.price) * it.get('qty', 1) for it in items for p in [products.get(int(it.get('id')))] if p)),
                shipping_cost=decimal.Decimal('0.00'),
                tax_amount=decimal.Decimal('0.00'),
            )
            for it in items:
                pid = int(it.get('id'))
                qty = int(it.get('qty', 1))
                p = products.get(pid)
                if not p:
                    continue
                OrderItem.objects.create(
                    order=order,
                    product=p,
                    name=p.name,
                    unit_price=p.price,
                    quantity=qty,
                )

            # Simple flat shipping: free over $99 else $9.99 (mirrors frontend)
            subtotal = sum((decimal.Decimal(p.price) * it.get('qty', 1) for it in items for p in [products.get(int(it.get('id')))] if p))
            shipping = decimal.Decimal('0.00') if subtotal >= decimal.Decimal('99.00') else decimal.Decimal('9.99')
            tax = (subtotal * decimal.Decimal('0.08')).quantize(decimal.Decimal('0.01'))

            # Store estimations; we’ll persist exact addresses in webhook
            order.shipping_cost = shipping
            order.tax_amount = tax
            order.save(update_fields=['shipping_cost', 'tax_amount'])
            # Prepare cents for shipping/tax (may be adjusted by coupon)
            shipping_cents = int(shipping * 100)
            tax_cents = int(tax * 100)

            # Apply coupon if provided and valid (adjust product/shipping/tax amounts)
            coupon_code = (request.data.get('coupon') or '').strip()
            if coupon_code:
                cp = Coupon.objects.filter(code__iexact=coupon_code, is_active=True).first()
                if not cp:
                    logger.warning("Checkout invalid coupon: %s", coupon_code)
                    return Response({'error': 'Invalid coupon code'}, status=400)
                if cp.valid_from and cp.valid_from > timezone.now():
                    return Response({'error': 'Coupon not yet valid'}, status=400)
                if cp.valid_to and cp.valid_to < timezone.now():
                    return Response({'error': 'Coupon expired'}, status=400)
                if cp.max_uses and cp.uses_count >= cp.max_uses:
                    return Response({'error': 'Coupon usage limit reached'}, status=400)
                if subtotal < cp.min_subtotal:
                    return Response({'error': f'Minimum subtotal {cp.min_subtotal} not met'}, status=400)
                discount = decimal.Decimal('0.00')
                if cp.discount_type == 'percent':
                    discount = (subtotal * (cp.value / decimal.Decimal('100'))).quantize(decimal.Decimal('0.01'))
                elif cp.discount_type == 'fixed':
                    discount = decimal.Decimal(cp.value).quantize(decimal.Decimal('0.01'))
                else:
                    # free shipping: shipping becomes free; account discount equal to shipping
                    discount = shipping
                # Cap discount to subtotal + shipping + tax to avoid negative totals
                max_discount = (subtotal + shipping + tax).quantize(decimal.Decimal('0.01'))
                if discount > max_discount:
                    discount = max_discount
                order.coupon_code = cp.code
                order.discount_amount = discount
                order.save(update_fields=['coupon_code', 'discount_amount'])

                # Distribute discount across product items, then shipping, then tax
                discount_cents = int(discount * 100)
                total_prod_cents = sum(e['unit_amount'] * e['quantity'] for e in product_entries)
                remaining = discount_cents
                if total_prod_cents > 0 and remaining > 0:
                    reductions = []
                    allocated = 0
                    for e in product_entries:
                        share = (remaining * (e['unit_amount'] * e['quantity'])) // total_prod_cents
                        reductions.append(share)
                        allocated += share
                    remainder = remaining - allocated
                    i = 0
                    while remainder > 0 and i < len(reductions):
                        reductions[i] += 1
                        remainder -= 1
                        i += 1
                    for e, red_total in zip(product_entries, reductions):
                        per_unit_red = red_total // max(1, e['quantity'])
                        new_unit = e['unit_amount'] - per_unit_red
                        if new_unit < 0:
                            # clamp to 0, overflow handled next
                            new_unit = 0
                        line_items[e['index']]['price_data']['unit_amount'] = new_unit
                    used = sum(max(0, (e['unit_amount'] - line_items[e['index']]['price_data']['unit_amount'])) * e['quantity'] for e in product_entries)
                    remaining = max(0, discount_cents - used)
                if remaining > 0 and shipping_cents > 0:
                    delta = min(remaining, shipping_cents)
                    shipping_cents -= delta
                    remaining -= delta
                if remaining > 0 and tax_cents > 0:
                    delta = min(remaining, tax_cents)
                    tax_cents -= delta
                    remaining -= delta

            # Add shipping and tax line items (after coupon adjustments)
            if shipping_cents > 0:
                line_items.append({
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {'name': 'Shipping'},
                        'unit_amount': shipping_cents
                    },
                    'quantity': 1
                })
            if tax_cents > 0:
                line_items.append({
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {'name': 'Tax'},
                        'unit_amount': tax_cents
                    },
                    'quantity': 1
                })

            session = stripe.checkout.Session.create(
                mode='payment',
                line_items=line_items,
                success_url=f"{settings.FRONTEND_ORIGIN}/checkout/success",
                cancel_url=f"{settings.FRONTEND_ORIGIN}/checkout/cancel",
                client_reference_id=str(order.id),
                shipping_address_collection={
                    'allowed_countries': ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IN']
                },
                customer_creation='always',
            )
            order.stripe_session_id = session.id
            order.save(update_fields=['stripe_session_id'])
            logger.debug("Checkout session created: order_id=%s, session_id=%s", order.id, session.id)
            return Response({'url': session.url, 'orderId': order.id})
        except Exception as e:
            logger.exception("Checkout error: %s", e)
            return Response({'error': str(e)}, status=500)


class StripeWebhook(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        event = None
        # If a webhook secret is configured, verify signature
        secret = getattr(settings, 'STRIPE_WEBHOOK_SECRET', '')
        if secret:
            try:
                import stripe
                stripe.api_key = settings.STRIPE_SECRET_KEY
                event = stripe.Webhook.construct_event(
                    payload=payload,
                    sig_header=sig_header,
                    secret=secret
                )
            except Exception:
                return Response(status=400)
        else:
            # Fallback: accept unverified events in dev/demo
            try:
                import json
                event = json.loads(payload.decode('utf-8'))
            except Exception:
                return Response(status=400)

        etype = event.get('type')
        data = event.get('data', {}).get('object', {})
        if etype == 'checkout.session.completed':
            session_id = data.get('id')
            client_ref = data.get('client_reference_id')
            email = data.get('customer_details', {}).get('email', '')
            try:
                order = None
                if client_ref:
                    order = Order.objects.filter(id=client_ref).first()
                if not order and session_id:
                    order = Order.objects.filter(stripe_session_id=session_id).first()
                if order:
                    order.status = 'paid'
                    order.email = email or order.email
                    # Save addresses when available
                    shipping_details = data.get('shipping_details') or {}
                    addr = shipping_details.get('address') or {}
                    order.shipping_name = shipping_details.get('name') or order.shipping_name
                    order.shipping_address1 = (addr.get('line1') or '')
                    order.shipping_city = (addr.get('city') or '')
                    order.shipping_country = (addr.get('country') or '')
                    order.shipping_postal_code = (addr.get('postal_code') or '')
                    # Billing details (if provided)
                    billing_details = data.get('customer_details') or {}
                    baddr = (billing_details.get('address') or {})
                    order.billing_name = billing_details.get('name') or order.billing_name
                    order.billing_address1 = (baddr.get('line1') or '')
                    order.billing_city = (baddr.get('city') or '')
                    order.billing_country = (baddr.get('country') or '')
                    order.billing_postal_code = (baddr.get('postal_code') or '')
                    order.save(update_fields=['status', 'email', 'shipping_name', 'shipping_address1', 'shipping_city', 'shipping_country', 'shipping_postal_code', 'billing_name', 'billing_address1', 'billing_city', 'billing_country', 'billing_postal_code'])
                    # Increment coupon use if applied
                    if order.coupon_code:
                        try:
                            cp = Coupon.objects.get(code=order.coupon_code)
                            cp.uses_count = (cp.uses_count or 0) + 1
                            cp.save(update_fields=['uses_count'])
                        except Coupon.DoesNotExist:
                            pass
                    # Send confirmation email (console backend by default; SMTP if configured)
                    try:
                        from .email_utils import send_order_confirmation
                        send_order_confirmation(order)
                    except Exception:
                        pass
            except Exception:
                pass
        return Response(status=200)


class MyOrdersViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


class StripeConfigCheck(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        key = settings.STRIPE_SECRET_KEY or ''
        masked = (key[:7] + '…') if key.startswith('sk_') else ''
        return Response({
            'configured': bool(key),
            'stripe_key_prefix': masked,
            'frontend_origin': settings.FRONTEND_ORIGIN,
        })


class ValidateCoupon(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = (request.data.get('code') or '').strip()
        subtotal = request.data.get('subtotal')
        if not code:
            return Response({'error': 'No coupon code provided'}, status=400)
        try:
            subtotal = decimal.Decimal(str(subtotal or '0'))
        except Exception:
            subtotal = decimal.Decimal('0.00')
        cp = Coupon.objects.filter(code__iexact=code, is_active=True).first()
        if not cp:
            return Response({'valid': False, 'reason': 'Invalid coupon code'}, status=200)
        if cp.valid_from and cp.valid_from > timezone.now():
            return Response({'valid': False, 'reason': 'Coupon not yet valid'}, status=200)
        if cp.valid_to and cp.valid_to < timezone.now():
            return Response({'valid': False, 'reason': 'Coupon expired'}, status=200)
        if cp.max_uses and cp.uses_count >= cp.max_uses:
            return Response({'valid': False, 'reason': 'Coupon usage limit reached'}, status=200)
        if subtotal < cp.min_subtotal:
            return Response({'valid': False, 'reason': f'Minimum subtotal {cp.min_subtotal} not met'}, status=200)
        # Compute potential discount
        if cp.discount_type == 'percent':
            discount = (subtotal * (cp.value / decimal.Decimal('100'))).quantize(decimal.Decimal('0.01'))
        elif cp.discount_type == 'fixed':
            discount = decimal.Decimal(cp.value).quantize(decimal.Decimal('0.01'))
        else:  # free_shipping
            discount = decimal.Decimal('0.00')
        return Response({'valid': True, 'code': cp.code, 'type': cp.discount_type, 'value': str(cp.value), 'discount': str(discount)})
    
