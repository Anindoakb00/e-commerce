from rest_framework import viewsets
from rest_framework.permissions import (
    IsAuthenticated, 
    AllowAny, 
    IsAdminUser
)

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    Product, 
    ProductReview,
    Category,
    Brand,
)
from .serializers import (
    ProductListViewSerializer,
    ProductDetailViewSerializer,
    ProductCreateSerializer,  
    ProductUpdateSerializer,
    ProductReviewSerializer,
    ProductReviewCreateSerializer,
    CategorySerializer,
    BrandSerializer,
)

# Create your views here.
class ProductViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete']
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'brand']
    ordering_fields = ['price']
    search_fields = ['name']

    def get_permissions(self):
        if self.request.method in ['POST', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsAdminUser()]
        return [AllowAny()]
    
    def get_queryset(self):
        qs = Product.objects.all().prefetch_related('images').select_related('category', 'brand')
        # Support filtering by category/brand slug for SEO-friendly URLs
        cat = self.request.query_params.get('category_slug')
        br = self.request.query_params.get('brand_slug')
        if cat:
            qs = qs.filter(category__slug=cat)
        if br:
            qs = qs.filter(brand__slug=br)
        return qs
    
    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return ProductCreateSerializer
        if self.request.method in ['PATCH']:
            return ProductUpdateSerializer
        if self.action == 'retrieve':
            return ProductDetailViewSerializer
        return ProductListViewSerializer

    def get_serializer_context(self):
        # Ensure request is available to serializers for absolute media URLs
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx

    @action(detail=False, url_path=r'by-slug/(?P<slug>[^/.]+)', methods=['get'], permission_classes=[AllowAny])
    def by_slug(self, request, slug=None):
        try:
            obj = Product.objects.prefetch_related('images').select_related('category','brand').get(slug=slug)
        except Product.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)
        ser = ProductDetailViewSerializer(obj)
        return Response(ser.data)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_permissions(self):
        if self.request.method in ['POST', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsAdminUser()]
        return [AllowAny()]

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_permissions(self):
        if self.request.method in ['POST', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsAdminUser()]
        return [AllowAny()]
    
class ProductReviewViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'delete']
    
    def get_permissions(self):
        if self.request.method in ['POST', 'DELETE']:
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get_queryset(self):
        return ProductReview.objects.all().select_related('product')
    
    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return ProductReviewCreateSerializer
        return ProductReviewSerializer

