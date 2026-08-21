# E-Commerce Web Application

A complete beginner-friendly full-stack e-commerce project for the assignment:

- Product catalog
- Product details
- Register/login
- JWT authentication
- User/Admin role-based access
- Shopping cart
- Checkout
- Order history
- Admin product CRUD
- Admin order management
- MongoDB integration
- Express REST APIs
- React frontend

## Stack

Frontend:
- React + Vite
- React Router
- Plain CSS

Backend:
- Node.js
- Express
- MongoDB + Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

## Requirements

Install these first:

- Node.js 18+
- MongoDB Community Server OR a MongoDB Atlas account
- VS Code (recommended)

## 1. Database

Option A: Local MongoDB

Start MongoDB and use:

MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce_db

Option B: MongoDB Atlas

Create a database and put your connection string into backend/.env.

## 2. Backend setup

Open a terminal:

    cd backend
    npm install

Create `backend/.env`:

    PORT=5000
    MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce_db
    JWT_SECRET=change_this_to_a_long_random_secret
    CLIENT_URL=http://localhost:5173

Start the API:

    npm run dev

API runs at:

    http://localhost:5000

Health check:

    http://localhost:5000/api/health

## 3. Seed demo data

In another terminal:

    cd backend
    npm run seed

This creates:

Admin:
    email: admin@example.com
    password: Admin@123

Customer:
    email: user@example.com
    password: User@123

It also creates sample products.

## 4. Frontend setup

Open another terminal:

    cd frontend
    npm install
    npm run dev

Open:

    http://localhost:5173

## 5. Demo flow

Customer:
1. Login with user@example.com / User@123
2. Browse products
3. Add products to cart
4. Change quantities
5. Checkout
6. View My Orders

Admin:
1. Login with admin@example.com / Admin@123
2. Open Admin Dashboard
3. Add/edit/delete products
4. View all orders
5. Change order status

## 6. API summary

Auth:
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

Products:
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id

Cart:
GET    /api/cart
POST   /api/cart
PUT    /api/cart/:productId
DELETE /api/cart/:productId
DELETE /api/cart

Orders:
POST /api/orders
GET  /api/orders/my
GET  /api/orders
PUT  /api/orders/:id/status

## Notes

This project uses a simple checkout/order flow and does NOT process real card payments.
For a college assignment, this is enough to demonstrate checkout and order management.
A real payment gateway such as Stripe/Razorpay can be added later.

## Troubleshooting

If MongoDB connection fails:
- Make sure MongoDB is running.
- Check MONGODB_URI.
- For Atlas, allow your IP and use the correct database user/password.

If frontend cannot reach backend:
- Make sure backend is running on port 5000.
- Check `frontend/.env`.
- The default API URL is `http://localhost:5000/api`.
