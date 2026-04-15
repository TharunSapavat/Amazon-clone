# 📦 Amazon Clone - Full Stack E-Commerce Platform

![Amazon Clone](https://img.shields.io/badge/Amazon-Clone-FF9900?style=for-the-badge&logo=amazon&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Data-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)

A high-performance, feature-rich Amazon clone designed with a scalable architecture, featuring a full-stack implementation with React, Node.js, and MySQL.

---

## 🚀 Key Features

### ✨ Frontend experience
- **Scalable Product Discovery**: Detailed search and filtering system for millions of products.
- **Dynamic Homepage**: Multi-section homepage with banners, category-based grids, and personalized product highlights.
- **Advanced Product Pages**: Support for multiple images, high-resolution zoom, detailed specifications, and color/variant selection.
- **Seamless Cart & Checkout**: Real-time cart management with a multi-step checkout workflow and order confirmation.
- **Returns & Orders tracking**: Professional order history page with real-time shipping status (Processing, Shipped, Delivered).

### ⚙️ Backend & Infrastructure
- **Relational Data Integrity**: Robust MySQL schema with over 10 optimized tables for products, users, cart, orders, and more.
- **High Sensitivity Search**: Backend-driven search and filtering optimized with SQL indexing.
- **Secure Architecture**: JWT-based authentication (internal) and sanitized SQL queries via Prisma ORM.
- **Automated Notifications**: Integrated email system via **Resend API** for transaction confirmations.
- **Health Monitoring**: Built-in specialized endpoints for database and system health checks.

---

## 🛠️ Tech Stack

### **Frontend**
- **Core**: React 19 (Hooks, Context API)
- **Styling**: Tailwind CSS 4.0 & Lucide React Icons
- **Routing**: React Router DOM 7
- **Networking**: Axios

### **Backend**
- **Runtime**: Node.js & Express.js
- **Database**: MySQL (Hosted on Railway/Local)
- **ORM**: Prisma
- **Emailing**: Resend SDK
- **Environment**: Dotenv for secure configuration

---

## ⚙️ How to run locally

### 1. Prerequisites
- **Node.js**: v18 or higher.
- **MySQL**: 8.0 or higher.

### 2. Backend configuration
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   npm install
   ```
2. Create a `.env` file and fill in your credentials:
   ```env
   PORT=5000
   DATABASE_URL="mysql://root:password@localhost:3306/amazon_clone"
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=amazon_clone
   FRONTEND_URL=http://localhost:5173
   RESEND_API_KEY=your_resend_api_key
   ```
3. Initialize the database schema and seed data:
   ```bash
   npx prisma db push
   npm run seed
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend configuration
1. Navigate to the `Frontend` directory:
   ```bash
   cd ../Frontend
   npm install
   ```
2. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
3. Start the application:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
Amazon-clone/
├── Backend/
│   ├── prisma/         # Database schema
│   ├── controllers/    # Request handlers
│   ├── routes/         # API endpoint definitions
│   ├── models/         # SQL query layers
│   ├── schema.sql      # Raw SQL schema backup
│   └── seed.js         # Initial data population script
├── Frontend/
│   ├── src/
│   │   ├── components/ # Shared UI components
│   │   ├── pages/      # View layouts (Cart, Order, Search)
│   │   ├── api/        # Axios configurations
│   │   └── context/    # Global state management
└── README.md
```

---

## 🌐 Live Demo
The application is deployed and can be visited at:  
👉 **[amazon.tharun06.dev](https://amazon.tharun06.dev)**

---

## 📄 License
This project is licensed under the **ISC License**.
