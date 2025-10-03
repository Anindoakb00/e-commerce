from .models import (
    Product, 
    ProductImage,
    ProductReview,
    Category,
    Brand,
)
from rest_framework import serializers

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()
    class Meta:
        model = ProductImage
        fields = ['id', 'image']


class ProductListViewSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'price', 'stock_qty', 'images']

class ProductDetailViewSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category = serializers.StringRelatedField()
    brand = serializers.StringRelatedField()
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'description', 'price', 'stock_qty', 'category', 'brand', 'images']

class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ProductUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['name', 'description', 'price', 'category', 'brand']


#product review serializers
class ProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = '__all__'

class ProductReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = ['product', 'review_text', 'rating']

    def create(self, validated_data):
        user = self.context['request'].user
        review = ProductReview.objects.create(
            username=user.username,
            **validated_data
        )
        return review




class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug']