# 🚀 TechBuilder Status & Access Guide

## ✅ Current Server Status

### Backend (Django)
- **URL**: http://localhost:8000
- **Status**: ✅ RUNNING
- **API Endpoint**: http://localhost:8000/api/products/
- **Admin Panel**: http://localhost:8000/admin/
- **Media Files**: http://localhost:8000/media/

### Frontend (Next.js)
- **URL**: http://localhost:3001 (Port 3001 because 3000 was in use)
- **Status**: ✅ RUNNING
- **Connected to Backend**: http://localhost:8000

## 🌐 Access Your Application

1. **Visit your store**: http://localhost:3001
2. **Check API data**: http://localhost:8000/api/products/
3. **View product images**: http://localhost:8000/media/product_images/

## 🔧 If Images Don't Show

### Step 1: Verify Products Exist
```bash
curl http://localhost:8000/api/products/
```

### Step 2: Check Media Files
```bash
cd "C:\Users\Anindo\Desktop\TechBuilder\Backend"
ls -la media/product_images/
```

### Step 3: Test Direct Image Access
Visit: http://localhost:8000/media/product_images/

## 🐛 Troubleshooting

### If Backend Won't Start:
```bash
cd "C:\Users\Anindo\Desktop\TechBuilder\Backend"
python manage.py runserver 0.0.0.0:8000
```

### If Frontend Won't Connect:
1. Check backend is running at http://localhost:8000
2. Verify CORS settings allow localhost:3001
3. Check browser console for errors

### If No Images Show:
1. Verify products were created: `python manage.py create_products --count 5`
2. Check media directory exists: `C:\Users\Anindo\Desktop\TechBuilder\Backend\media\product_images\`
3. Test direct image URL in browser

## 📊 Database Info
- **Products**: 12 realistic tech items
- **Categories**: 9 tech categories
- **Brands**: 10 major brands
- **Images**: High-quality photos from Unsplash

## 🔄 Quick Commands

### Restart Backend:
```bash
cd "C:\Users\Anindo\Desktop\TechBuilder\Backend"
python manage.py runserver 0.0.0.0:8000
```

### Restart Frontend:
```bash
cd "C:\Users\Anindo\Desktop\TechBuilder\Frontend\tbfront"
npm run dev
```

### Add More Products:
```bash
cd "C:\Users\Anindo\Desktop\TechBuilder\Backend"
python manage.py create_products --count 10
```

**Both servers should now be fully operational! 🎉**