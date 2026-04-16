# 📦 Amazon Clone scaler assignment - Full Stack E-Commerce Platform

![Amazon Clone](https://img.shields.io/badge/Amazon-Clone-FF9900?style=for-the-badge&logo=amazon&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)

**Project Overview**  
A production-style Amazon clone demonstrating end-to-end full-stack engineering: scalable REST APIs, normalized relational schema, responsive UI, and cloud deployment. Built to showcase system design + implementation skills for SDE role.

**Live Demo:** https://amazon.tharun06.dev  

---

## 🚀 Key Features

### ✨ Frontend Experience
- **Scalable Product Discovery**: Category filters, price/rating sliders, and full-text search with keyset pagination
- **Dynamic Homepage**: Hero carousel, category grids, "Keep Shopping" + "Deals" sections from DB
- **Advanced Product Pages**: Multi-image carousel, zoom, variant selection, real-time stock
- **Seamless Cart & Checkout**: Persistent cart, quantity updates, multi-step checkout, order confirmation
- **Orders & Tracking**: Order history with status pipeline: `Processing → Shipped → Delivered`
- **Resilient Images**: `onError` fallbacks + `loading="lazy"` for broken/slow networks

### ⚙️ Backend & Infrastructure
- **Relational Integrity**: 10+ normalized MySQL tables with foreign keys for products, users, cart, orders
- **High-Performance Queries**: Composite indexes + `position` column to avoid N+1 queries
- **Keyset Pagination**: `WHERE id < cursor ORDER BY id DESC` for O(log n) page loads vs O(n) OFFSET
- **Secure Architecture**: Parameterized queries, dotenv secrets, CORS whitelist, SSL to Railway DB
- **Transactional Emails**: Resend API for order confirmation + shipping updates
- **Health Monitoring**: `/health` and `/health/db` endpoints for uptime checks

---

## 🛠️ Tech Stack

### **Frontend**
- **Core**: React 19 + Vite
- **Styling**: Tailwind CSS 4.0 + Lucide React Icons
- **Routing**: React Router DOM 7
- **State/Data**: Context API + Axios
- **Deploy**: Vercel

### **Backend**
- **Runtime**: Node.js LTS + Express.js
- **Database**: MySQL 8.0 on Railway with `mysql2/promise` pool
- **Email**: Resend SDK
- **Security**: dotenv, helmet, rate-limit
- **Deploy**: Railway

---

**Database Design Decisions**
- Used **normalized schema** to reduce redundancy
- Separate tables for:
  - cart & cart_items
  - orders & order_items
- Stored product images in separate table for scalability
- Used indexing on frequently queried columns (category, price, id)

**ER Model**
<img width="1324" height="918" alt="amazon clone scaler er model" src="https://github.com/user-attachments/assets/eba7255f-8d3a-4f16-8eed-3bf4dadaecf9" />

## ⚙️ Local Setup

### 1. Prerequisites
- Node.js v18+
- MySQL 8.0+ or Railway account
- Git

### 2. Clone & Install
```bash
git clone [https://github.com/yourusername/amazon-clone.git](https://github.com/TharunSapavat/Amazon-clone.git)
cd amazon-clone

# Backend
cd Backend && npm install

# Frontend  
cd ../Frontend && npm install
```
### 3. Environment Variables
Backend/.env:
PORT=5000
NODE_ENV=development
DATABASE_URL=mysql://root:password@localhost:3306/amazon_clone
FRONTEND_URL=http://localhost:5173
RESEND_API_KEY=re_xxxxxxxxxx

Frontend/.env:
VITE_API_URL=http://localhost:5000


### 4.Seed Data
cd Backend
npm run seed 

**📂 Project Structure**
Amazon-clone/
├── Backend/
│   ├── config/db.js          # MySQL pool with SSL for Railway
│   ├── controllers/          # productController, cartController
│   ├── routes/               # /api/products, /api/cart, /api/orders
│   ├── seed/seed.js          # Bulk insert with transactions
│   ├── product_images.json   # Working CDN URLs mapped by name
│   ├── schema.sql            # Tables + indexes
│   └── server.js             # Express entry
├── Frontend/
│   ├── src/
│   │   ├── components/       # Navbar, ProductCard, SafeImage, StarRating
│   │   ├── context/CartContext.jsx
│   │   ├── pages/            # Home, ProductListing, ProductDetail, Cart
│   │   ├── api/axios.js      # Base URL from env
│   │   └── App.jsx
│   └── .env
└── README.md


Made by Tharun for scaler assignment
