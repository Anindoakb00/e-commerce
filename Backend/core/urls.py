from django.urls import path

from rest_framework import routers
from rest_framework.routers import DefaultRouter


from .views import (
  UserProfileViewSet, 
  CreateCheckoutSession, 
  StripeWebhook, 
  MyOrdersViewSet, 
  StripeConfigCheck, 
  ValidateCoupon,
  LoginJwtView,
  CreateCheckoutSession,
  StripeWebhook,
  StripeConfigCheck,
  ValidateCoupon,
  UserProfileViewSet,
  MyOrdersViewSet)

router = DefaultRouter()
router.register(r'user-profiles', UserProfileViewSet, basename='user-profiles')
router.register(r'my-orders', MyOrdersViewSet, basename='my-orders')

urlpatterns = router.urls

# Extra endpoints
urlpatterns += [
   # Auth (our override: accepts username or email)
    path('auth/jwt/create/', LoginJwtView.as_view(), name='jwt-create'),
 #payments
	path('payments/create-checkout-session/', CreateCheckoutSession.as_view(), name='create-checkout-session'),
	path('payments/stripe-webhook/', StripeWebhook.as_view(), name='stripe-webhook'),
  path('payments/config-check/', StripeConfigCheck.as_view(), name='stripe-config-check'),
  
	path('coupons/validate/', ValidateCoupon.as_view(), name='validate-coupon'),
]
