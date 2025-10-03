# TechBuilder - Complete Setup Guide

## 🚀 Quick Start Commands

### 1. Start Django Backend
```bash
cd "C:\Users\Anindo\Desktop\TechBuilder\Backend"
python manage.py runserver 8000
```

### 2. Start Next.js Frontend (in new terminal)
```bash
cd "C:\Users\Anindo\Desktop\TechBuilder\Frontend\tbfront"
npm run dev
```

## 📋 Project Status
✅ **Backend Setup Complete**
- Django backend connected to localhost:8000
- All Python dependencies installed
- Database migrations applied
- 12 realistic tech products created with high-quality images
- CORS configured for frontend connection

✅ **Frontend Setup**
- Connected to local backend (http://localhost:8000)
- Ready to receive data from Django API

## 🗂️ Database Contents
- **Products**: 12 realistic tech items (iPhone 15 Pro Max, MacBook Pro M3, Galaxy S24 Ultra, etc.)
- **Categories**: 9 categories (Smartphones, Laptops, Tablets, Smart Watches, Headphones, Gaming, Audio Equipment, Cameras, Accessories)
- **Brands**: 10 brands (Apple, Samsung, Sony, Razer, Logitech, JBL, Canon, ASUS, Dell, Google)
- **Images**: High-quality product photos from Unsplash
- **Reviews**: Realistic customer reviews for each product

## 📱 Available Endpoints
- `GET /api/products/` - All products
- `GET /api/products/featured/` - Featured products  
- `GET /api/categories/` - All categories
- `GET /api/brands/` - All brands
- `GET /media/product_images/` - Product images

## 🔧 Management Commands
```bash
# Create more products
python manage.py create_products --count 20

# Access Django admin
python manage.py createsuperuser
```

## 🌐 Access URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin
- **Media Files**: http://localhost:8000/media/

## 📂 Project Structure
```
TechBuilder/
├── Backend/
│   ├── product/
│   │   ├── models.py (Product, Category, Brand, ProductImage, ProductReview)
│   │   ├── views.py (API endpoints)
│   │   └── management/commands/create_products.py (unified product creator)
│   ├── techbuilder/settings.py (CORS configured)
│   └── requirements.txt (all dependencies)
└── Frontend/tbfront/
    └── src/lib/images.ts (connected to localhost:8000)
```

## 🎯 Next Steps
1. Run both servers using the commands above
2. Visit http://localhost:3000 to see your tech store
3. Check that realistic product images load properly
4. Customize products or add more using the management command

**Everything is now connected and ready to run!**