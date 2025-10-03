# TechBuilder - CMD Setup Guide

## 🚀 Starting Servers with CMD

### Option 1: Start Both Servers (Recommended)
Double-click: `start_both_servers.bat`
- This opens 2 CMD windows automatically
- Backend runs on http://localhost:8000
- Frontend runs on http://localhost:3000

### Option 2: Start Individually

#### Backend Only:
Double-click: `start_backend.bat`
Or in CMD:
```cmd
cd "C:\Users\Anindo\Desktop\TechBuilder\Backend"
python manage.py runserver localhost:8000
```

#### Frontend Only:
Double-click: `start_frontend.bat`
Or in CMD:
```cmd
cd "C:\Users\Anindo\Desktop\TechBuilder\Frontend\tbfront"
npm run dev
```

## 🌐 Access URLs
- **Your Store**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/products/
- **Django Admin**: http://localhost:8000/admin/

## 🔧 Manual CMD Commands

### Backend Commands:
```cmd
cd "C:\Users\Anindo\Desktop\TechBuilder\Backend"

REM Start server
python manage.py runserver localhost:8000

REM Create more products
python manage.py create_products --count 20

REM Create admin user
python manage.py createsuperuser
```

### Frontend Commands:
```cmd
cd "C:\Users\Anindo\Desktop\TechBuilder\Frontend\tbfront"

REM Install dependencies
npm install

REM Start development server
npm run dev

REM Build for production
npm run build
```

## 🛑 Stopping Servers
- Press `Ctrl+C` in each CMD window
- Or close the CMD windows

## ✅ Everything Ready!
- All Python dependencies installed
- 12 realistic tech products created
- Frontend connected to local backend
- High-quality product images loaded

**Just double-click `start_both_servers.bat` to begin!**