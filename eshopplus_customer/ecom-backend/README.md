# eShop Plus Hyperlocal API

Production-grade multi-vendor ecommerce backend built with **Node.js + Express + MySQL (Sequelize)** for the eShop Plus Flutter application. The new service replaces the old mock server with real authentication, role-based access, retailer onboarding, hyperlocal product filtering, carts, wishlists, orders, and Swagger documentation.

## ✨ Highlights

- Hyperlocal enforcement: every retailer, product, cart, wishlist, and order is bound to a city. Requests must include `x-city-id` (or default to the user’s preferred city). Cities are seeded with **Delhi, Noida, Gurugram, Varanasi, Patna, Mumbai** as requested.
- Multi-role JWT auth (Admin, Retailer, Customer) with bcrypt hashing, refresh token storage, and profile management.
- Retailer onboarding + approval workflow, store dashboards, and category/product CRUD with image uploads (Multer).
- Customer experiences: persistent cart, wishlist, address book, location-aware product browsing, and full order lifecycle (Pending → Delivered).
- Clean **MVC + Service + Repository** architecture, async error wrapping, and centralized logging.
- OpenAPI/Swagger docs at `/api-docs` plus Mermaid ERD (`docs/ERD.md`).

## 🚀 Quick start

```bash
cd ecom-backend
npm install
cp env.example .env        # update DB + secrets
npm run dev                # hot reload via nodemon
# or
npm start                  # production mode
```

1. Create a MySQL database (defaults to `eshopplus_hyperlocal`).
2. Update `.env` with DB credentials, JWT secrets, and default admin info.
3. Run the server. Sequelize syncs schemas automatically and seeds the six cities + default admin user.
4. Point the Flutter app’s `baseUrl` (see `lib/core/configs/appConfig.dart`) to `http://<host>:4000`.

## 🧱 Tech stack

- **Runtime:** Node.js 18+, Express 4
- **Database:** MySQL 8 (via Sequelize ORM)
- **Auth:** JWT (access + refresh tokens)
- **Uploads:** Multer (stored under `storage/uploads`)
- **Docs:** Swagger UI + Mermaid ER diagram
- **Utilities:** Winston logger, Day.js, express-validator

## 📁 Project structure

```
src/
  app.js                 # Express config, middlewares
  routes/                # Feature routers (auth, products, orders...)
  controllers/           # HTTP orchestration
  services/              # Business logic
  repositories/          # DB access via Sequelize models
  models/                # Sequelize models + associations
  middlewares/           # Auth, roles, location guard, uploads, errors
  utils/                 # Logger, ApiError, responses, slugify, etc.
  config/                # env + Sequelize setup
  loaders/               # Seed default cities/admin at boot
  docs/                  # Swagger spec + ER diagram
```

## 🔐 Authentication & roles

- `POST /api/v1/auth/register/customer` – create customer bound to a city.
- `POST /api/v1/auth/register/retailer` – submit store for approval.
- `POST /api/v1/auth/login` – returns JWT access/refresh tokens.
- `GET /api/v1/auth/me` / `PUT /api/v1/auth/me` – profile & updates.
- Roles enforced via middleware (`authorizeRoles`) with `admin`, `retailer`, `customer`.

## 🌐 Hyperlocal behaviour

- `x-city-id` header (or `cityId` query/body) is required for location-aware endpoints (products, retailers, cart, wishlist, orders).
- Retailers store `cityId`, and every product automatically inherits it.
- Carts & wishlists auto-sync to the active city; cross-city add attempts fail fast.

## 🛍 Core modules & key routes

- **Locations:** `GET /api/v1/locations/cities`
- **Retailers:** list by city, retailer dashboard, admin approvals (`PATCH /retailers/:id/status`)
- **Categories:** admin CRUD
- **Products:** retailer CRUD + image uploads (`POST /products/:id/images`)
- **Cart:** persistent per user (`GET /cart`, `POST /cart/items`, `DELETE /cart`)
- **Wishlist:** `GET/POST/DELETE /wishlist`
- **Addresses:** CRUD under `/addresses`
- **Orders:** `POST /orders` (city-aware), status transitions (`PATCH /orders/:id/status`) matching flow Pending → Accepted → Packed → Out for delivery → Delivered

See `src/routes/*.js` for exhaustive lists and Swagger for request/response schemas.

## 📄 Documentation

- **Swagger UI:** `http://localhost:4000/api-docs`
- **Mermaid ERD:** [`docs/ERD.md`](./docs/ERD.md)
- **Env template:** [`env.example`](./env.example)

## 🧪 Testing hooks

Automated tests are not wired yet. Recommended next steps:

1. Add Jest or Vitest test harness.
2. Mock Sequelize with an in-memory SQLite DB for unit tests.

## 🛠 Tooling & scripts

- `npm run dev` – nodemon watch mode.
- `npm start` – production mode.
- `npm run swagger:check` – validates the generated OpenAPI spec.

## 📬 Notes for Flutter integration

- All responses follow `{ error: boolean, message, data, meta }`.
- Use the same city list (Delhi, Noida, Gurugram, Varanasi, Patna, Mumbai) in the app picker to match backend IDs (seed order).
- Headers required by the app (`Language-Id`, `ngrok-skip-browser-warning`) are still accepted; JWT lives in `Authorization: Bearer <token>`.

Happy shipping! 🛒

