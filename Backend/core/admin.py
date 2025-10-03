from django.contrib import admin
from .models import UserProfile, Order, OrderItem, Coupon

# User profile
admin.site.register(UserProfile)


class OrderItemInline(admin.TabularInline):
	model = OrderItem
	extra = 0
	readonly_fields = ("name", "unit_price", "quantity")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
	list_display = ("id", "status", "total_amount", "discount_amount", "shipping_cost", "tax_amount", "currency", "email", "created_at")
	list_filter = ("status", "currency", "created_at")
	search_fields = ("id", "email", "stripe_session_id")
	inlines = [OrderItemInline]


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
	list_display = ("code", "discount_type", "value", "is_active", "uses_count", "max_uses", "valid_from", "valid_to")
	search_fields = ("code",)
	list_filter = ("discount_type", "is_active")

