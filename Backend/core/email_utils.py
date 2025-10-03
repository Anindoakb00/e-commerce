from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string

from .models import Order


def send_order_confirmation(order: Order):
    if not order.email:
        return
    site_name = getattr(settings, 'SITE_NAME', 'TechBuilder')
    subject = f"Your {site_name} Order #{order.id} is confirmed"
    # Compute totals
    items = list(order.items.all())
    subtotal = sum((it.unit_price * it.quantity for it in items), start=0)
    grand_total = (order.shipping_cost or 0) + (order.tax_amount or 0) + subtotal
    lines = [
        f"Hi,",
        "",
        f"Thanks for your purchase! Your order #{order.id} has been confirmed.",
        f"Items:",
    ]
    for it in items:
        lines.append(f"- {it.name} × {it.quantity} @ {order.currency.upper()} {it.unit_price} = {order.currency.upper()} {it.unit_price * it.quantity}")
    lines += [
        "",
        f"Subtotal: {order.currency.upper()} {subtotal}",
        f"Shipping: {order.currency.upper()} {order.shipping_cost}",
        f"Tax: {order.currency.upper()} {order.tax_amount}",
        f"Grand Total: {order.currency.upper()} {grand_total}",
    ]
    if order.shipping_address1:
        lines += [
            "",
            "Shipping to:",
            f"{order.shipping_name}",
            f"{order.shipping_address1}",
            f"{order.shipping_city} {order.shipping_postal_code}",
            f"{order.shipping_country}",
        ]
    lines += [
        "",
        "You can view your orders in your account.",
        "",
        f"— {site_name}"
    ]
    body = "\n".join(lines)
    # Try to render HTML alternative
    html_body = None
    try:
        html_body = render_to_string(
            'emails/order_confirmation.html',
            {
                'order': order,
                'site_name': site_name,
                'items': [
                    {
                        'name': it.name,
                        'quantity': it.quantity,
                        'unit_price': it.unit_price,
                        'line_total': it.unit_price * it.quantity,
                    } for it in items
                ],
                'subtotal': subtotal,
                'grand_total': grand_total,
            }
        )
    except Exception:
        html_body = None

    if html_body:
        email = EmailMultiAlternatives(
            subject=subject,
            body=body,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@techbuilder.local'),
            to=[order.email],
        )
        email.attach_alternative(html_body, "text/html")
        try:
            email.send(fail_silently=True)
        except Exception:
            # Fallback to plain send if HTML send fails
            send_mail(
                subject=subject,
                message=body,
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@techbuilder.local'),
                recipient_list=[order.email],
                fail_silently=True,
            )
    else:
        send_mail(
            subject=subject,
            message=body,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@techbuilder.local'),
            recipient_list=[order.email],
            fail_silently=True,
        )
