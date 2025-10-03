# TECHBUILDER — and advance E-commerce Website


This repository contains the frontend for the TECHBUILDER sample store — a Next.js (App Router) TypeScript app with a modern, responsive UI for product listing, product details, cart, and JWT-based authentication. The app is designed to talk to a Django REST backend (examples in-code reference `/api/...`).

## Quick blurb

TECHBUILDER is a small e-commerce frontend built with Next.js + TypeScript and Tailwind CSS. It demonstrates connecting a modern React frontend to a Django REST backend (products, cart, checkout, JWT auth), persistent client-side cart state, normalized image handling, and a simple user authentication flow using JWT tokens.

## Key features

- Product listing and detail pages
- Add-to-cart with persistent cart (Zustand + persist)
- JWT authentication (signup / login / profile fetch)
- Checkout endpoint wiring for order creation
- Robust image normalization with backend-relative path handling and placeholder fallbacks
- Responsive UI: hero, featured products, product grid, related-products area (deterministic 4-slot layout)

## Tech stack

- Next.js (App Router) + TypeScript
- React 19
- Tailwind CSS
- Zustand for client state (cart/auth) with persistence
- react-hook-form + zod for forms/validation
- Axios for HTTP requests
- Sonner for toast notifications

## Local development

The project includes scripts in `package.json`. From the `tbfront` directory run:

```bash
# install deps (npm, pnpm, or yarn)
npm install

# start dev server (uses turbopack when available)
npm run dev
```

Open `http://localhost:3000` in your browser.

Build and run production locally:

```bash
npm run build
npm start
```

Linting:

```bash
npm run lint
```

## Environment & backend

This frontend expects a Django REST backend exposing endpoints similar to the following:

- `POST /api/auth/users/` — create user (signup)
- `POST /api/auth/jwt/create` — obtain JWT access token (login)
- `GET /api/auth/users/me/` — fetch authenticated profile
- `GET /api/products/` — list products
- `GET /api/products/:id/` — product detail
- `POST /api/orders/` — create an order (checkout)

By default the frontend uses a `BACKEND_ORIGIN` constant in `src/lib/images.ts` to resolve relative image paths to an absolute origin. If you run a backend locally, update that value or set a matching environment configuration as needed.

If your backend runs on a different origin, ensure CORS is configured on the backend and that the frontend points to the correct API base URL when making requests.

## Running the app with a local backend (example)

1. Start the backend on `http://localhost:8000` (or wherever you prefer).
2. Set any required constants in the frontend (search for `BACKEND_ORIGIN` in `src/lib/images.ts` and adjust if necessary).
3. Start the frontend with `npm run dev` and visit `http://localhost:3000`.

## Known limitations / security notes

- Access tokens are stored in `localStorage` (not HttpOnly cookies) for simplicity. For production, prefer HttpOnly cookies and refresh-token flows to reduce XSS/CSRF risks.
- No refresh-token rotation is currently implemented: access tokens will expire unless a refresh flow is added.
- Product images may be provided by the backend as relative paths or full URLs. The frontend normalizes both, but malformed image payloads may fall back to a bundled placeholder image.

## How to test common flows

- Signup / Login: open the auth modal and use a username + password. The frontend calls `POST /api/auth/users/` for signup and `POST /api/auth/jwt/create` for login, then fetches `GET /api/auth/users/me/`.
- Add to cart: on a product page click "Add to cart" — cart state is persisted between sessions.
- Checkout: complete an order and confirm `POST /api/orders/` call in the browser Network panel.

## Contributing / notes

This frontend was built as part of a demo portfolio project. If you want to extend it, consider adding:

- Refresh-token / HttpOnly cookie authentication
- Server-side rendering for SEO-sensitive product pages
- Unit/integration tests for key flows



