# Environment Variables Setup

## ✅ What We've Implemented

### 1. **Environment Variables (.env file)**
Your sensitive database credentials are now stored in `.env` file instead of hardcoded in `settings.py`.

### 2. **Secure Configuration**
- Database URL is loaded from `DATABASE_URL` environment variable
- Secret key is loaded from `SECRET_KEY` environment variable
- Debug mode is configurable via `DEBUG` environment variable
- Allowed hosts are configurable via `ALLOWED_HOSTS` environment variable

### 3. **File Structure**
```
Backend/
├── .env                 # Contains actual secrets (NOT in git)
├── .env.example        # Template showing required variables
├── .gitignore          # Ensures .env is not committed to git
├── requirements.txt    # Updated with python-dotenv
└── techbuilder/
    └── settings.py     # Now uses environment variables
```

## 🔒 Security Benefits

1. **No hardcoded secrets** in your codebase
2. **Different configurations** for development/production
3. **Git-safe** - secrets won't be accidentally committed
4. **Easy deployment** - just change environment variables

## 🎯 How It Works

### settings.py now uses:
```python
from dotenv import load_dotenv
load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-key')
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
DATABASE_URL = os.getenv('DATABASE_URL')

if DATABASE_URL:
    DATABASES = {'default': dj_database_url.parse(DATABASE_URL)}
else:
    # Fallback to SQLite
```

### .env file contains:
```
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgresql://username:password@host:port/database
```

## ✅ Testing Results
- ✅ Django configuration check passed
- ✅ Database connection working
- ✅ All migrations applied
- ✅ Environment variables loaded correctly

## 🚀 Next Steps
1. Never commit the `.env` file to git
2. Use `.env.example` as a template for new environments
3. In production, set environment variables through your hosting platform
4. Keep `.env` file secure and backed up separately

---

## 💳 Stripe Test Configuration

To enable the checkout flow, you must set your Stripe test secret key.

1) Create `Backend/.env` (copy from `.env.example`):

```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
FRONTEND_URL=http://localhost:3001

# Stripe
STRIPE_SECRET_KEY=sk_test_...            # from https://dashboard.stripe.com/test/apikeys
FRONTEND_ORIGIN=http://127.0.0.1:3000    # where your Next.js app runs
```

2) Install backend dependencies and run migrations:

```
pip install -r requirements.txt
python manage.py migrate
```

3) Start the backend:

```
python manage.py runserver 127.0.0.1:8000
```

4) Test the endpoint quickly (optional):

```
curl -X POST http://127.0.0.1:8000/api/payments/create-checkout-session/ \
    -H "Content-Type: application/json" \
    -d '{"items":[{"id":1,"qty":1}]}'
```

If STRIPE_SECRET_KEY is missing, the API returns:

```
{"error":"Stripe not configured. Set STRIPE_SECRET_KEY in backend environment (.env)."}
```

When configured, it returns a JSON with a `url` to the Stripe Checkout page.

5) Webhooks (optional for marking orders as paid automatically):
- Expose your server and set the endpoint to `/api/payments/stripe-webhook/`
- If using Stripe CLI: `stripe listen --forward-to 127.0.0.1:8000/api/payments/stripe-webhook/`
- Add `STRIPE_WEBHOOK_SECRET=whsec_...` to `.env` and enable signature verification in code if needed.