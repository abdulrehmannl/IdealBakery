/**
 * server.js — Main Entry Point for IdealBakery Backend
 * ======================================================
 * This is the first file that runs when you start the server.
 * It sets up Express, connects to MongoDB, registers all middleware,
 * mounts all API routes, and starts listening on a port.
 *
 * HOW TO RUN:
 *   Development:  npm run dev   (uses nodemon — auto restarts on file changes)
 *   Production:   npm start     (uses node directly)
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
// express: The web framework that handles HTTP requests and routing.

const cors = require('cors');
// cors: "Cross-Origin Resource Sharing" — allows our React frontend (running on
// port 5173) to communicate with this backend (running on port 5000).
// Without this, the browser will BLOCK all requests from the frontend.

require('dotenv').config();
// dotenv: Reads the .env file and loads its values into process.env
// This must be called BEFORE we access any process.env variables like PORT.

const connectDB = require('./config/db');
// Our custom function that connects to MongoDB Atlas.

// ── Error Handler Middleware ──
const errorHandler = require('./middleware/errorHandler');
// Global error handler — catches any error passed via next(error) from routes.

// ─────────────────────────────────────────────────────────────────────────────
// 2. ROUTE IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
// Each route file handles one "resource" of the API.
// We import them here and mount them below using app.use().
//
// NOTE: Routes are commented out until their files are created.
//       Uncomment each one as we build it.
//
// ✅ = Active (file exists)
// ⏳ = Coming soon (file not built yet)

const authRoutes      = require('./routes/authRoutes');       // ✅ /api/auth
const productRoutes   = require('./routes/productRoutes');    // ✅ /api/products
const categoryRoutes  = require('./routes/categoryRoutes');   // ✅ /api/categories
// const orderRoutes     = require('./routes/orderRoutes');    // ⏳ /api/orders
// const staffRoutes     = require('./routes/staffRoutes');    // ⏳ /api/staff
const branchRoutes    = require('./routes/branchRoutes');     // ✅ /api/branches
// const inventoryRoutes = require('./routes/inventoryRoutes');// ⏳ /api/inventory
// const attendanceRoutes= require('./routes/attendanceRoutes');// ⏳ /api/attendance
// const salaryRoutes    = require('./routes/salaryRoutes');   // ⏳ /api/salaries
// const counterRoutes   = require('./routes/counterRoutes');  // ⏳ /api/counter
// const discountRoutes  = require('./routes/discountRoutes'); // ⏳ /api/discounts
// const reportRoutes    = require('./routes/reportRoutes');   // ⏳ /api/reports
// const leaveRoutes     = require('./routes/leaveRoutes');    // ⏳ /api/leaves
// const expenseRoutes   = require('./routes/expenseRoutes');  // ⏳ /api/expenses
// const machineryRoutes = require('./routes/machineryRoutes');// ⏳ /api/machinery

// ─────────────────────────────────────────────────────────────────────────────
// 3. CREATE EXPRESS APP
// ─────────────────────────────────────────────────────────────────────────────

const app = express();
// Creates the Express application. Think of this as the "server object"
// that we attach middleware and routes to.

// ─────────────────────────────────────────────────────────────────────────────
// 4. DATABASE CONNECTION
// ─────────────────────────────────────────────────────────────────────────────

connectDB();
// Connects to MongoDB Atlas using the URI from .env (MONGO_URI).
// This is async — if it fails, the app logs the error and exits.

// ─────────────────────────────────────────────────────────────────────────────
// 5. GLOBAL MIDDLEWARE
// ─────────────────────────────────────────────────────────────────────────────
// Middleware = functions that run on EVERY request before reaching route handlers.
// Think of them as "checkpoints" — every request passes through these first.

// ── 5a. CORS (Cross-Origin Resource Sharing) ──
app.use(cors({
    origin: 'http://localhost:5173',
    // ONLY allow requests from our React frontend (Vite dev server).
    // In production this would be your real domain e.g. 'https://idealbakery.pk'

    credentials: true,
    // Allows the frontend to send cookies and Authorization headers.
    // Required for JWT token authentication to work properly.
}));

// ── 5b. JSON Body Parser ──
app.use(express.json());
// Parses incoming request bodies that have Content-Type: application/json
// Without this, req.body would be undefined when frontend sends JSON data.
// Example: A POST /api/auth/register sends { name, email, password } as JSON.

// ── 5c. URL-Encoded Body Parser ──
app.use(express.urlencoded({ extended: true }));
// Parses incoming requests with URL-encoded bodies (HTML form submissions).
// extended: true allows for rich objects and arrays to be encoded.

// ─────────────────────────────────────────────────────────────────────────────
// 6. HEALTH CHECK ROUTE
// ─────────────────────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
    // A simple test route to confirm the server is running.
    // Visit http://localhost:5000/ in browser — should see this message.
    res.json({
        success: true,
        message: 'IdealBakery API is running 🥐',
        version: '1.0.0',
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. API ROUTES
// ─────────────────────────────────────────────────────────────────────────────
// Mount each route file at its URL prefix.
// HOW IT WORKS:
//   app.use('/api/auth', authRoutes)
//   means: any request to /api/auth/... is handed off to authRoutes to handle.
//   Inside authRoutes, only the REMAINING path matters:
//     POST /api/auth/register → authRoutes handles "/register"
//     POST /api/auth/login    → authRoutes handles "/login"

app.use('/api/auth',       authRoutes);        // ✅ Register & Login
app.use('/api/products',   productRoutes);    // ✅ Products CRUD
app.use('/api/categories', categoryRoutes);   // ✅ Categories CRUD
app.use('/api/branches',   branchRoutes);     // ✅ Branches CRUD
// app.use('/api/orders',     orderRoutes);    // ⏳ Uncomment when built
// app.use('/api/staff',      staffRoutes);    // ⏳ Uncomment when built
// app.use('/api/inventory',  inventoryRoutes);// ⏳ Uncomment when built
// app.use('/api/attendance', attendanceRoutes);// ⏳ Uncomment when built
// app.use('/api/salaries',   salaryRoutes);   // ⏳ Uncomment when built
// app.use('/api/counter',    counterRoutes);  // ⏳ Uncomment when built
// app.use('/api/discounts',  discountRoutes); // ⏳ Uncomment when built
// app.use('/api/reports',    reportRoutes);   // ⏳ Uncomment when built
// app.use('/api/leaves',     leaveRoutes);    // ⏳ Uncomment when built
// app.use('/api/expenses',   expenseRoutes);  // ⏳ Uncomment when built
// app.use('/api/machinery',  machineryRoutes);// ⏳ Uncomment when built

// ─────────────────────────────────────────────────────────────────────────────
// 8. 404 HANDLER
// ─────────────────────────────────────────────────────────────────────────────

app.use('/{*any}', (req, res) => {
    // If no route above matched the request, this runs.
    // Express 5 requires a named wildcard parameter — '/{*any}' matches everything.
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. GLOBAL ERROR HANDLER
// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: This MUST be the LAST middleware registered.
// It has 4 parameters (err, req, res, next) — Express recognizes this as an
// error-handling middleware automatically because of the 4th parameter.
// Any route/controller that calls next(error) will end up here.

app.use(errorHandler);

// ─────────────────────────────────────────────────────────────────────────────
// 10. START SERVER
// ─────────────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
// Read PORT from .env, or fall back to 5000 if not set.

app.listen(PORT, () => {
    console.log('═══════════════════════════════════════════');
    console.log(`  IdealBakery Server running on port ${PORT}`);
    console.log(`  URL: http://localhost:${PORT}`);
    console.log(`  Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log('═══════════════════════════════════════════');
});

/*
 * END OF FILE SUMMARY
 * =====================
 * File:    server.js
 * Purpose: App entry point — wires everything together.
 *
 * Execution order when a request comes in:
 *   1. CORS middleware     → checks if request origin is allowed
 *   2. JSON parser         → parses request body
 *   3. URL encoder         → parses form data
 *   4. Router match        → finds matching route file
 *   5. Controller          → runs business logic
 *   6. Error handler       → catches any thrown errors
 *
 * Active API endpoints right now:
 *   POST /api/auth/register
 *   POST /api/auth/login
 *
 * To add more routes later:
 *   1. Create backend/routes/yourRoutes.js
 *   2. Create backend/controllers/yourController.js
 *   3. Uncomment the import at the top of this file
 *   4. Uncomment the app.use() line in section 7
 */