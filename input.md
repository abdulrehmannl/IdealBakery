# Lab Assignment #4 — Semester Project Development
### CLO-06: Develop dynamic clients using modern development technologies

**Student Name:** Abdul Rehman
**Project Title:** Ideal Bakery Management System
**Technology Stack:** MERN (MongoDB, Express.js, React.js, Node.js)
**GitHub:** https://github.com/abdulrehmannl/IdealBakery

---

## 1. Market Research

### 1.1 Existing Solutions & Competitors

| System | Strengths | Weaknesses |
|---|---|---|
| Square POS | Easy payments, widely adopted | No bakery-specific features, expensive |
| Lightspeed Restaurant | Good inventory tracking | Complex UI, not suited for small bakeries |
| Poster POS | Multi-branch support | No staff HR module, no custom orders |
| Custom Excel Sheets | Free, familiar | No real-time data, no automation, error-prone |

### 1.2 Current Market Trends

- **Cloud-based systems** — businesses prefer web apps accessible from any device
- **Role-based dashboards** — admin vs staff vs customer views are standard
- **Real-time inventory alerts** — automated low-stock notifications are expected
- **Online ordering integration** — customers want to browse menus and place orders online
- **Multi-branch management** — growing businesses need centralized control across locations

### 1.3 Identified Gaps

After analyzing the market:
- No affordable, all-in-one bakery solution exists for small-to-medium Pakistani bakeries
- Most systems lack **Urdu/local category support** (Desi Items, mithai)
- None integrate **customer-facing ordering + admin HR management** in one system
- **Salary & attendance** tracking is missing from all restaurant POS tools

**Conclusion:** There is a clear market gap for a localized, full-stack bakery management system that combines customer ordering with internal business operations.

---

## 2. Project Idea Analysis

### 2.1 Project Overview

**Ideal Bakery Management System** is a full-stack MERN web application designed to digitize and streamline bakery operations. It serves two audiences:

- **Customers** — Browse the menu, place orders, track delivery
- **Admin/Staff** — Manage products, inventory, staff, orders, finances, and branches

### 2.2 Real-World Problem Solved

Most bakeries in Pakistan operate manually — orders are taken on paper, inventory is tracked in registers, and salary calculations are done by hand. This leads to:
- Stock-outs due to no real-time tracking
- Revenue loss from unrecorded sales
- Payroll errors from manual calculations
- No visibility into which branch is performing better

The Ideal Bakery system solves all of these with a single, integrated digital platform.

### 2.3 Objectives

1. Provide customers with a modern, online menu and ordering experience
2. Give admins full control over products, staff, inventory, and finances
3. Support multiple bakery branches from a single dashboard
4. Automate salary, attendance, and expense tracking
5. Generate real-time sales and performance reports

### 2.4 Target Users

| User Type | Access | Key Actions |
|---|---|---|
| Customer | Public frontend | Browse menu, place orders, track orders |
| Staff | Limited admin view | Mark attendance, view own salary |
| Manager | Most admin features | Manage products, inventory, orders |
| Admin | Full access | All features + staff management + reports |

### 2.5 Scope

**In Scope:** Product management, order processing, inventory tracking, staff HR (attendance, salary, leave), expense tracking, multi-branch support, customer authentication, admin dashboard, reports.

**Out of Scope (Future):** Mobile app, payment gateway integration, email notifications, SMS alerts.

---

## 3. Client Requirements

### 3.1 Functional Requirements

| # | Requirement | Implementation |
|---|---|---|
| FR-01 | User registration and login with JWT | `POST /api/auth/register`, `POST /api/auth/login` |
| FR-02 | Browse products by category | `GET /api/products?category=id` |
| FR-03 | Place and track orders | `POST /api/orders`, `GET /api/orders/:id` |
| FR-04 | Admin: manage products (CRUD) | Full CRUD on `/api/products` |
| FR-05 | Admin: manage categories | Full CRUD on `/api/categories` |
| FR-06 | Admin: manage inventory with alerts | `/api/inventory` with low-stock logic |
| FR-07 | Admin: manage staff records | `/api/staff` CRUD |
| FR-08 | Admin: track attendance | `/api/attendance` with daily logs |
| FR-09 | Admin: process monthly salaries | `/api/salaries` with deductions |
| FR-10 | Admin: log daily expenses | `/api/expenses` |
| FR-11 | Admin: manage multi-branch system | `/api/branches` CRUD |
| FR-12 | Admin: view reports & analytics | `/api/reports` aggregated data |
| FR-13 | Staff leave request management | `/api/leaves` CRUD |
| FR-14 | Apply discounts to products | `/api/discounts` |
| FR-15 | Customer feedback collection | Stored in `CustomerFeedback` model |

### 3.2 Non-Functional Requirements

| # | Requirement | How Addressed |
|---|---|---|
| NFR-01 | Security | JWT authentication, bcrypt password hashing, role-based middleware |
| NFR-02 | Performance | MongoDB indexing, `.populate()` only on needed fields |
| NFR-03 | Usability | Modern React UI with loading states, error messages, responsive design |
| NFR-04 | Scalability | Modular Express routes/controllers, Mongoose models per resource |
| NFR-05 | Maintainability | Clean code with comments, MVC architecture, separate concerns |
| NFR-06 | Reliability | Global error handler, try/catch in all controllers, proper HTTP codes |

---

## 4. System Design & Architecture

### 4.1 System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                         │
│                                                          │
│  Customer Frontend          Admin Dashboard              │
│  React + Vite (5173)        React + Vite (5173)          │
│  ─────────────────          ─────────────────────        │
│  HomePage, MenuPage         ManageProducts, Orders,      │
│  OrderTracking              Staff, Inventory, Reports    │
└────────────────────┬─────────────────────────────────────┘
                     │ HTTP Requests (axios)
                     │ JSON Responses
┌────────────────────▼─────────────────────────────────────┐
│                    API LAYER (Express)                   │
│                    Node.js / Express.js                  │
│                    Port 5000                             │
│                                                          │
│  Middleware: CORS, JSON Parser, JWT Auth, Error Handler  │
│                                                          │
│  Routes: /api/auth  /api/products  /api/orders           │
│          /api/staff /api/inventory /api/salaries         │
│          /api/attendance /api/reports /api/branches      │
└────────────────────┬─────────────────────────────────────┘
                     │ Mongoose ODM
┌────────────────────▼─────────────────────────────────────┐
│                  DATABASE LAYER                          │
│              MongoDB Atlas (Cloud)                       │
│                                                          │
│  Collections: users, products, categories, orders,      │
│  staff, inventory, attendance, salaries, branches,       │
│  expenses, leaves, discounts, machinery, reports         │
└──────────────────────────────────────────────────────────┘
```

### 4.2 MVC Architecture (Backend)

```
backend/
├── models/          ← M: Mongoose schemas (data layer)
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Staff.js
│   ├── Inventory.js
│   ├── Attendance.js
│   ├── Salary.js
│   ├── Branch.js
│   ├── Category.js
│   ├── Discount.js
│   ├── Expense.js
│   ├── StaffLeave.js
│   ├── Machinery.js
│   ├── MaintenanceRecord.js
│   ├── Notification.js
│   └── CustomerFeedback.js
├── controllers/     ← C: Business logic
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   └── ... (one per resource)
├── routes/          ← V: API endpoints (Express Router)
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── ... (one per resource)
├── middleware/
│   ├── auth.js          ← JWT protect + role check
│   └── errorHandler.js  ← Global error handling
├── config/
│   └── db.js            ← MongoDB Atlas connection
└── server.js            ← App entry point
```

### 4.3 Database Design (Key Mongoose Models)

#### User Model
```js
{
  name:     String (required),
  email:    String (required, unique),
  password: String (required, hashed),
  role:     String (enum: ['customer','staff','manager','admin']),
  phone:    String,
  address:  String,
  timestamps: true
}
```

#### Product Model
```js
{
  name:        String (required),
  description: String,
  price:       Number (required),
  discount:    Number (default: 0),
  weight:      String,
  stock:       Number (default: 0),
  tags:        [String],
  isAvailable: Boolean (default: true),
  isSugarFree: Boolean (default: false),
  image:       String,
  category:    ObjectId → Category,
  branch:      [ObjectId → Branch],
  timestamps:  true
}
```

#### Order Model
```js
{
  customer:    ObjectId → User,
  items:       [{ product: ObjectId, quantity: Number, price: Number }],
  totalAmount: Number,
  status:      String (enum: ['pending','processing','ready','delivered','cancelled']),
  branch:      ObjectId → Branch,
  timestamps:  true
}
```

#### Staff Model
```js
{
  name:        String (required),
  role:        String (required),
  phone:       String,
  salary:      Number,
  joiningDate: Date,
  branch:      ObjectId → Branch,
  isActive:    Boolean (default: true),
  timestamps:  true
}
```

---

## 5. MERN Stack Implementation

### 5.1 MongoDB — Data Storage

- **Database:** MongoDB Atlas (cloud-hosted cluster)
- **ODM:** Mongoose v8 for schema validation and querying
- **Key features used:**
  - `ref` + `.populate()` for relational joins
  - `timestamps: true` for auto createdAt/updatedAt
  - `$in` operator for array field filtering
  - Unique indexes on email field

### 5.2 Express.js — REST API

The backend is a RESTful API with 15+ resources:

```js
// server.js — route mounting
app.use('/api/auth',       authRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/branches',   branchRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/staff',      staffRoutes);
app.use('/api/inventory',  inventoryRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/salaries',   salaryRoutes);
app.use('/api/expenses',   expenseRoutes);
app.use('/api/leaves',     leaveRoutes);
app.use('/api/discounts',  discountRoutes);
app.use('/api/machinery',  machineryRoutes);
app.use('/api/reports',    reportRoutes);
```

**Authentication Middleware:**
```js
// middleware/auth.js
const protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
};

const adminOnly = (req, res, next) => {
    if (!['admin', 'manager'].includes(req.user.role))
        return res.status(403).json({ message: 'Access denied' });
    next();
};
```

### 5.3 React.js — Frontend

**Tech used:** React 19, Vite, React Router DOM v7, axios, Tailwind CSS, Lucide Icons

**Frontend Structure:**
```
frontend/src/
├── App.jsx              ← BrowserRouter + 25 routes
├── pages/
│   ├── HomePage.jsx     ← Landing page with hero + bestsellers
│   ├── MenuPage.jsx     ← Category browsing
│   ├── LoginPage.jsx    ← JWT login form
│   ├── RegisterPage.jsx ← User registration
│   ├── CheckoutPage.jsx ← Order placement
│   ├── categories/      ← 6 category pages (FastFood, Bakery, etc.)
│   ├── special/         ← Birthday cakes, gift boxes, event orders
│   └── admin/           ← 15 admin management pages
└── components/
    ├── layout/          ← Navbar, Footer, AnnouncementBar
    └── admin/           ← AdminLayout, AdminSidebar
```

**Key React Patterns Used:**
- `useState` — local component state for forms, modals, filters
- `useEffect` — API calls on component mount
- `useLocation` — read current URL for conditional rendering
- `useParams` — dynamic route params (e.g., `/product/:id`)
- Conditional rendering — loading states, error states, empty states
- Controlled components — all form inputs linked to state

### 5.4 Node.js — Runtime

- Node.js runtime powers the Express server
- `dotenv` loads environment variables from `.env`
- `nodemon` used in development for auto-restart on file changes
- `bcryptjs` for secure password hashing
- `jsonwebtoken` for JWT creation and verification

---

## 6. UI/UX Design

### 6.1 Design Philosophy

The frontend follows a **premium bakery brand aesthetic**:
- **Color Palette:** Deep maroon (`#8B1A1A`) as primary, warm cream (`#F5F0EB`) as background
- **Typography:** Playfair Display (headings) + Inter (body) from Google Fonts
- **Design system:** Custom CSS utility classes for consistent spacing, colors, and shadows

### 6.2 Key UI Components

| Component | Description |
|---|---|
| `AnnouncementBar` | Top promotional banner (rotating deals) |
| `Navbar` | Sticky navigation with cart, auth links |
| `AdminLayout` | Sidebar + topbar shell for all admin pages |
| `AdminSidebar` | 15-link navigation for all admin modules |
| Product Table | Searchable, filterable data table with CRUD actions |
| Modal Forms | Overlay forms for add/edit operations |
| Confirm Dialog | Trash icon + confirmation before delete |
| Status Badges | Green/red pills showing availability/status |

### 6.3 Responsive Design

- Mobile-first CSS using Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- Grid layouts collapse from 3 columns → 2 → 1 on smaller screens
- Admin sidebar becomes hidden on mobile
- Tables become horizontally scrollable on small screens

---

## 7. Testing & Validation

### 7.1 API Testing (Postman)

All API routes were tested in Postman with the following scenarios:

| Test Case | Input | Expected Output | Status Code |
|---|---|---|---|
| Register new user | Valid name, email, password | JWT token returned | 201 |
| Login with wrong password | Valid email, wrong password | Error message | 401 |
| Get all products | No auth needed | Array of products | 200 |
| Create product (no auth) | Valid body, no token | Unauthorized error | 401 |
| Create product (admin) | Valid body + JWT | Product created | 201 |
| Delete non-existent product | Invalid ID | Not found error | 404 |
| Invalid route | Any unknown path | Route not found | 404 |

### 7.2 Frontend Validation

- Required field validation on all forms (`required` attribute)
- Number type enforcement on price, stock, salary fields
- Checkbox states for boolean fields (isAvailable, isSugarFree)
- Search/filter logic tested with edge cases (empty string, partial match)
- Loading state verified by throttling network in DevTools
- Error state verified by stopping the backend server and reloading

### 7.3 Error Handling

```js
// Global error handler — catches ALL controller errors
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message    = err.message    || 'Internal Server Error';

    if (err.name === 'ValidationError')              statusCode = 400;
    if (err.code === 11000)                          statusCode = 400; // duplicate key
    if (err.name === 'CastError')                    statusCode = 400; // invalid ObjectId
    if (err.name === 'JsonWebTokenError')            statusCode = 401;
    if (err.name === 'TokenExpiredError')            statusCode = 401;

    res.status(statusCode).json({ success: false, message });
};
```

---

## 8. Project Deliverables

### 8.1 Complete Working Application

| Layer | Status | Details |
|---|---|---|
| Database | ✅ | MongoDB Atlas cluster, 15+ collections |
| Backend API | ✅ | Express server, 50+ API endpoints |
| Frontend | ✅ | React app, 25 routes, 15 admin pages |
| Authentication | ✅ | JWT login/register/protected routes |
| Admin Dashboard | ✅ | Products, Orders, Staff, Inventory, Reports |
| Customer Interface | ✅ | Menu, Product Detail, Checkout, Order Tracking |

### 8.2 Project Documentation

This document serves as the primary project report covering:
- Market research and competitive analysis
- System architecture and database design
- Implementation details for all MERN layers
- Testing results and validation

### 8.3 Source Code with Comments

Every file in the project includes documentation comments:
```js
/**
 * controllers/productController.js — Product Business Logic
 * Handles all CRUD operations for bakery products.
 *
 * Function           HTTP     Route                Access
 * getAllProducts      GET      /api/products        Public
 * getSingleProduct   GET      /api/products/:id    Public
 * createProduct      POST     /api/products        Admin/Manager
 * updateProduct      PUT      /api/products/:id    Admin/Manager
 * deleteProduct      DELETE   /api/products/:id    Admin/Manager
 */
```

### 8.4 User Manual

#### For Customers:
1. Visit `http://localhost:5173`
2. Register an account or log in
3. Click **MENU** to browse bakery categories
4. Click a product to view details and add to cart
5. Go to **Checkout** to place the order
6. Track order status on the **Order Tracking** page

#### For Admins:
1. Log in with admin credentials
2. Navigate to `http://localhost:5173/admin`
3. Use the sidebar to access:
   - **Products** → Add/Edit/Delete bakery items
   - **Orders** → View and update order status
   - **Inventory** → Track stock levels
   - **Staff** → Manage employees
   - **Attendance** → Daily attendance records
   - **Salaries** → Monthly payroll processing
   - **Reports** → Sales and performance analytics

### 8.5 Deployment Instructions

```bash
# Clone repository
git clone https://github.com/abdulrehmannl/IdealBakery.git
cd IdealBakery

# Backend setup
cd backend
npm install
# Create .env:
#   MONGO_URI=<your MongoDB Atlas connection string>
#   PORT=5000
#   JWT_SECRET=<your secret key>
#   NODE_ENV=development
npm run dev          # starts on port 5000

# Frontend setup (new terminal)
cd ../frontend
npm install
npm run dev          # starts on port 5173
```

---

## 9. Professional Standards

### 9.1 Version Control

- Project hosted on GitHub: https://github.com/abdulrehmannl/IdealBakery
- `.gitignore` excludes `node_modules/`, `.env`, `dist/`
- Meaningful commit messages documenting progress
- Separate `frontend/` and `backend/` directories in the monorepo

### 9.2 Code Quality

- **MVC pattern** strictly followed — routes → controllers → models
- **DRY principle** — shared middleware reused across all protected routes
- **Consistent naming** — camelCase for JS, PascalCase for React components
- **Comments on every file** — purpose, exports, and function summaries
- **No hardcoded values** — all config in `.env`, all magic numbers in constants

### 9.3 Security Practices

- Passwords hashed with `bcryptjs` (never stored in plain text)
- JWT tokens expire in 7 days (`JWT_EXPIRE=7d`)
- Role-based access control on all admin routes
- `.env` file excluded from Git via `.gitignore`
- CORS configured to only allow requests from the frontend origin

---

## 10. MERN Stack Concepts Demonstrated

### Understanding of Concepts (10 Marks)

| Concept | Demonstrated In |
|---|---|
| MongoDB schema design | 15 Mongoose models with proper types, refs, validators |
| Mongoose ODM | `.find()`, `.findById()`, `.findByIdAndUpdate()`, `.populate()`, `.create()` |
| Express routing | 14 route files, each mounted at `/api/<resource>` |
| Middleware chain | `protect → adminOnly → controller` on all protected routes |
| React component lifecycle | `useEffect` for data fetching, `useState` for UI state |
| React Router | 25 routes with dynamic params (`/product/:id`) |
| JWT Authentication | Token created on login, verified on every protected request |
| REST API design | Proper verbs (GET/POST/PUT/DELETE) + HTTP status codes |
| Axios HTTP client | Used for all 3 CRUD operations from React to Express |
| Error handling | Global middleware catches all errors, returns JSON |

### Logical Application (10 Marks)

| Problem | MERN Solution Applied |
|---|---|
| Multi-branch product filtering | `GET /api/products?branch=id` using MongoDB `$in` operator |
| Role-based access | JWT payload includes `role`, middleware checks before controller runs |
| Partial product updates | `findByIdAndUpdate` with `{ new: true, runValidators: true }` |
| Avoid prop drilling | `useLocation` + conditional rendering in `AppLayout` |
| Admin layout isolation | `AdminLayout` wraps all `/admin/*` routes, hides customer nav |
| Low stock detection | Inventory model with `quantity < minStock` flag |
| Attendance + salary link | `Attendance` records feed into monthly `Salary` calculation |
| Loading UX | `loading` state shows spinner, prevents empty table flash |
| Duplicate email prevention | `unique: true` on User schema + duplicate key error handler |
| Clean API responses | Consistent `{ success, message, data }` shape on all endpoints |

---

*Project: IdealBakery Management System | Lab Assignment #4 — Semester Project*
*CLO-06: Develop dynamic clients using modern development technologies*
