from django.urls import path,include

from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers

from .views import (
    ProductViewSet,
    CategoryViewSet,
    BrandViewSet,
    ProductReviewViewSet,
)

router = routers.DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'brands', BrandViewSet, basename='brand')

product_router = routers.NestedDefaultRouter(router, r'products', lookup='product')
product_router.register(r'reviews', ProductReviewViewSet, basename='product-reviews')



urlpatterns = [
    path('', include(router.urls)),
    path('', include(product_router.urls)),  # Include nested routes
]