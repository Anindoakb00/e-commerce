from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal
from product.models import Product


#user profile
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    billing_address = models.CharField(max_length=255, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)


    def __str__(self):
        return self.user.username


class Order(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("cancelled", "Cancelled"),
    )

    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default="pending")
    stripe_session_id = models.CharField(max_length=255, blank=True, default="")
    currency = models.CharField(max_length=8, default="usd")
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    email = models.EmailField(blank=True, default="")
    # Discounts
    coupon_code = models.CharField(max_length=64, blank=True, default="")
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    # Costs
    shipping_cost = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))

    # Shipping address snapshot
    shipping_name = models.CharField(max_length=255, blank=True, default="")
    shipping_address1 = models.CharField(max_length=255, blank=True, default="")
    shipping_city = models.CharField(max_length=128, blank=True, default="")
    shipping_country = models.CharField(max_length=2, blank=True, default="")
    shipping_postal_code = models.CharField(max_length=20, blank=True, default="")

    # Billing address snapshot
    billing_name = models.CharField(max_length=255, blank=True, default="")
    billing_address1 = models.CharField(max_length=255, blank=True, default="")
    billing_city = models.CharField(max_length=128, blank=True, default="")
    billing_country = models.CharField(max_length=2, blank=True, default="")
    billing_postal_code = models.CharField(max_length=20, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.status}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, null=True, blank=True, on_delete=models.SET_NULL)
    name = models.CharField(max_length=255)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    def line_total(self):
        return self.unit_price * self.quantity


class Coupon(models.Model):
    TYPE_CHOICES = (
        ("percent", "Percent Off"),
        ("fixed", "Fixed Amount Off"),
        ("free_shipping", "Free Shipping"),
    )
    code = models.CharField(max_length=64, unique=True)
    discount_type = models.CharField(max_length=16, choices=TYPE_CHOICES)
    value = models.DecimalField(max_digits=12, decimal_places=2)
    is_active = models.BooleanField(default=True)
    valid_from = models.DateTimeField(null=True, blank=True)
    valid_to = models.DateTimeField(null=True, blank=True)
    min_subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    max_uses = models.PositiveIntegerField(null=True, blank=True)
    uses_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.code