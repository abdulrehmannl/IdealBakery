# 🥐 Ideal Bakery Management System

![Ideal Bakery Banner](https://via.placeholder.com/1200x400/FFB347/ffffff?text=Ideal+Bakery+Management+System) <!-- Replace with a real screenshot of your app -->

A comprehensive Full-Stack Web Application designed to streamline operations for a modern bakery. This system handles everything from customer orders and inventory tracking to staff management and daily expense tracking.

## 🚀 Tech Stack

**Frontend:**
- React.js (Vite)
- React Router DOM
- CSS3 / Modern UI Design

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for secure authentication
- RESTful API Architecture

## ✨ Key Features

- **Authentication & Authorization**: Secure login system with JWT, supporting role-based access (Admin, Staff).
- **Inventory Management**: Real-time tracking of bakery ingredients, stock levels, and automated low-stock alerts.
- **Order Processing**: Seamless order creation, tracking, and fulfillment workflow.
- **Expense Tracking**: Logging daily operational expenses to maintain bakery profitability.
- **Category & Product Management**: Dynamic organization of bakery goods and supplies.

## 📂 Project Structure

This repository is organized as a monorepo containing both the frontend and backend of the application:

- `/frontend` - The React application
- `/backend` - The Node.js / Express server

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB connection string

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abdulrehmannl/IdealBakery.git
   cd IdealBakery
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   npm install
   # Create a .env file in the backend directory with your MONGO_URI and JWT_SECRET
   npm start
   ```

3. **Setup the Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 👨‍💻 Developed By

**Abdul Rehman**  
[GitHub](https://github.com/abdulrehmannl) | [LinkedIn](https://linkedin.com/in/your-profile) <!-- Add your LinkedIn link here -->
