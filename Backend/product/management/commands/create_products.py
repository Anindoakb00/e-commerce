from django.core.management.base import BaseCommand
from product.models import Product, Category, Brand, ProductReview, ProductImage
import random
from decimal import Decimal
from django.core.files.base import ContentFile
import requests

class Command(BaseCommand):
    help = 'Create realistic tech products with high-quality images'

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=12,
            help='Number of products to create (default: 12)'
        )

    def handle(self, *args, **options):
        count = options['count']
        
        # Realistic tech products with curated images
        TECH_PRODUCTS = [
            {
                'name': 'iPhone 15 Pro Max',
                'category': 'Smartphones',
                'brand': 'Apple',
                'price': 1199.00,
                'description': 'The most advanced iPhone ever with titanium design, A17 Pro chip, and professional camera system featuring 48MP main camera with 5x telephoto zoom.',
                'images': [
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=center'
                ]
            },
            {
                'name': 'MacBook Pro M3 14-inch',
                'category': 'Laptops',
                'brand': 'Apple',
                'price': 1999.00,
                'description': 'MacBook Pro with M3 chip delivers exceptional performance for professional workflows with up to 22 hours of battery life and Liquid Retina XDR display.',
                'images': [
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop&crop=center'
                ]
            },
            {
                'name': 'Samsung Galaxy S24 Ultra',
                'category': 'Smartphones',
                'brand': 'Samsung',
                'price': 1299.00,
                'description': 'Galaxy S24 Ultra with built-in S Pen, 200MP camera with AI zoom, and titanium frame for the ultimate Android experience.',
                'images': [
                    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=600&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&h=600&fit=crop&crop=center'
                ]
            },
            {
                'name': 'Apple Watch Series 9',
                'category': 'Smart Watches',
                'brand': 'Apple',
                'price': 429.00,
                'description': 'Apple Watch Series 9 with Double Tap gesture, advanced health features, and seamless iPhone integration for the complete smartwatch experience.',
                'images': [
                    'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=600&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?w=800&h=600&fit=crop&crop=center'
                ]
            },
            {
                'name': 'Sony WH-1000XM5',
                'category': 'Headphones',
                'brand': 'Sony',
                'price': 399.99,
                'description': 'Industry-leading noise canceling headphones with exceptional sound quality, 30-hour battery life, and crystal-clear call quality.',
                'images': [
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop&crop=center'
                ]
            },
            {
                'name': 'iPad Pro 12.9" M2',
                'category': 'Tablets',
                'brand': 'Apple',
                'price': 1099.00,
                'description': 'iPad Pro with M2 chip and stunning 12.9-inch Liquid Retina XDR display. Perfect for creative professionals and productivity.',
                'images': [
                    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=800&h=600&fit=crop&crop=center'
                ]
            },
            {
                'name': 'Gaming Mechanical Keyboard RGB',
                'category': 'Gaming',
                'brand': 'Razer',
                'price': 179.99,
                'description': 'Premium RGB mechanical gaming keyboard with tactile switches, programmable keys, and aluminum frame for competitive gaming.',
                'images': [
                    'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&h=600&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop&crop=center'
                ]
            },
            {
                'name': 'Wireless Gaming Mouse Pro',
                'category': 'Gaming',
                'brand': 'Logitech',
                'price': 149.99,
                'description': 'High-precision wireless gaming mouse with customizable buttons, RGB lighting, and 25,600 DPI sensor for ultimate gaming performance.',
                'images': [
                    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=600&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop&crop=center'
                ]
            },
            {
                'name': 'JBL Flip 6 Portable Speaker',
                'category': 'Audio Equipment',
                'brand': 'JBL',
                'price': 129.99,
                'description': 'Portable Bluetooth speaker with powerful JBL Original Pro Sound, 12-hour battery life, and IP67 waterproof rating.',
                'images': [
                    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=600&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&h=600&fit=crop&crop=center'
                ]
            },
            {
                'name': 'Canon EOS R6 Mark II',
                'category': 'Cameras',
                'brand': 'Canon',
                'price': 2499.00,
                'description': 'Professional mirrorless camera with 24.2MP full-frame sensor, advanced autofocus system, and 4K video recording capabilities.',
                'images': [
                    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop&crop=center'
                ]
            },
            {
                'name': 'ASUS ROG 4K Gaming Monitor',
                'category': 'Accessories',
                'brand': 'ASUS',
                'price': 649.99,
                'description': '27-inch 4K UHD gaming monitor with 144Hz refresh rate, HDR support, and G-SYNC compatibility for immersive gaming.',
                'images': [
                    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=600&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop&crop=center'
                ]
            },
            {
                'name': 'Samsung Fast Wireless Charger',
                'category': 'Accessories',
                'brand': 'Samsung',
                'price': 59.99,
                'description': 'Fast wireless charging pad with cooling fan, LED indicator, and universal Qi compatibility for all compatible devices.',
                'images': [
                    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=600&fit=crop&crop=center'
                ]
            },
            {
                'name': 'AirPods Pro 2nd Generation',
                'category': 'Headphones',
                'brand': 'Apple',
                'price': 249.00,
                'description': 'AirPods Pro with H2 chip, adaptive audio, personalized spatial audio, and up to 6 hours of listening time with ANC.',
                'images': [
                    'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&h=600&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&h=600&fit=crop&crop=center'
                ]
            },
            {
                'name': 'Dell XPS 13 Laptop',
                'category': 'Laptops',
                'brand': 'Dell',
                'price': 1299.00,
                'description': '13-inch ultrabook with Intel Core i7 processor, 16GB RAM, 512GB SSD, and stunning InfinityEdge display.',
                'images': [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop&crop=center'
                ]
            },
            {
                'name': 'Google Pixel 8 Pro',
                'category': 'Smartphones',
                'brand': 'Google',
                'price': 999.00,
                'description': 'Pixel 8 Pro with Google Tensor G3 chip, advanced AI photography features, and 7 years of OS updates.',
                'images': [
                    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&crop=center',
                    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=600&fit=crop&crop=center'
                ]
            }
        ]

        # Create categories and brands
        categories = {}
        brands = {}
        
        for product_data in TECH_PRODUCTS:
            # Create category
            cat_name = product_data['category']
            if cat_name not in categories:
                category, created = Category.objects.get_or_create(name=cat_name)
                categories[cat_name] = category
                if created:
                    self.stdout.write(f'✅ Created category: {cat_name}')
            
            # Create brand
            brand_name = product_data['brand']
            if brand_name not in brands:
                brand, created = Brand.objects.get_or_create(name=brand_name)
                brands[brand_name] = brand
                if created:
                    self.stdout.write(f'✅ Created brand: {brand_name}')

        # Create products with images (limit to requested count)
        products_to_create = TECH_PRODUCTS[:count]
        
        for product_data in products_to_create:
            category = categories[product_data['category']]
            brand = brands[product_data['brand']]
            
            # Create product
            product = Product.objects.create(
                name=product_data['name'],
                description=product_data['description'],
                price=Decimal(str(product_data['price'])),
                category=category,
                brand=brand
            )
            
            self.stdout.write(f'📱 Created product: {product.name} - ${product.price}')
            
            # Download and save images
            for i, image_url in enumerate(product_data['images']):
                try:
                    response = requests.get(image_url, timeout=15)
                    if response.status_code == 200:
                        image_content = ContentFile(response.content)
                        image_name = f"{product.name.replace(' ', '_').lower()}_{i+1}.jpg"
                        
                        product_image = ProductImage(product=product)
                        product_image.image.save(image_name, image_content, save=True)
                        
                        self.stdout.write(f'  🖼️  Downloaded image {i+1} for {product.name}')
                    else:
                        self.stdout.write(f'  ❌ Failed to download image {i+1} for {product.name}')
                        
                except Exception as e:
                    self.stdout.write(f'  ⚠️  Error downloading image for {product.name}: {str(e)}')

            # Add realistic reviews
            reviews = [
                {"rating": 5, "username": "tech_reviewer", "text": f"Outstanding {product.name}! The build quality is exceptional and performance exceeds expectations."},
                {"rating": 4, "username": "verified_customer", "text": f"Very satisfied with my {product.name} purchase. Great value for the price point."},
                {"rating": 5, "username": "pro_user", "text": f"Perfect for professional use. The {product.name} handles everything I throw at it."},
                {"rating": 4, "username": "daily_user", "text": f"Excellent {product.name} for everyday use. Highly recommend to anyone looking for quality tech."},
                {"rating": 5, "username": "tech_enthusiast", "text": f"Amazing features and design. The {product.name} is definitely worth the investment."}
            ]
            
            # Add 2-4 random reviews per product
            selected_reviews = random.sample(reviews, random.randint(2, 4))
            for review_data in selected_reviews:
                ProductReview.objects.create(
                    username=review_data["username"],
                    product=product,
                    review_text=review_data["text"],
                    rating=review_data["rating"]
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\n🎉 Successfully created {len(products_to_create)} realistic tech products with high-quality images!'
            )
        )
        self.stdout.write(
            self.style.SUCCESS(
                f'📊 Total categories: {len(categories)}, Total brands: {len(brands)}'
            )
        )