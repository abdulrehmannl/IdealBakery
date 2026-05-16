/**
 * routes/authRoutes.js — Authentication Routes
 * ==============================================
 * Defines the URL endpoints related to user authentication.
 *
 * This file is mounted in server.js as:
 *   app.use('/api/auth', authRoutes)
 *
 * So the full URLs become:
 *   POST /api/auth/register  → Creates a new user account
 *   POST /api/auth/login     → Logs in an existing user, returns JWT token
 *
 * HOW EXPRESS ROUTER WORKS:
 * ──────────────────────────
 * Instead of defining all routes in server.js (which would get massive),
 * we create a "mini-app" called a Router for each resource.
 * The router only handles the TAIL of the URL (after the prefix in server.js).
 *
 * HOW WE KEEP ROUTES CLEAN:
 * ───────────────────────────
 * Routes here are thin — they just say:
 *   "For this HTTP method + path, call this controller function"
 * All the actual LOGIC is in the controller file.
 * This separation keeps code organized and testable.
 */

const express = require('express');
const router = express.Router();
// Creates a new Express Router — a mini-app that handles routes independently.

// ── Import Controller Functions ──
// These functions contain the actual business logic.
// We keep them in a separate file to keep this routes file clean and readable.
const { registerUser, loginUser } = require('../controllers/authController');

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE 1: POST /api/auth/register
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @route   POST /api/auth/register
 * @desc    Register a new customer account
 * @access  Public (no token required — anyone can register)
 *
 * Request Body (JSON):
 *   {
 *     "name":     "Ahmed Khan",
 *     "email":    "ahmed@example.com",
 *     "password": "mypassword123",
 *     "phone":    "03001234567"
 *   }
 *
 * Success Response (201 Created):
 *   {
 *     "success": true,
 *     "token": "eyJhbGci...",
 *     "user": { "id", "name", "email", "role" }
 *   }
 */
router.post('/register', registerUser);
// When a POST request hits /register, call registerUser from authController.

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE 2: POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @route   POST /api/auth/login
 * @desc    Log in an existing user, return a JWT token
 * @access  Public (no token required — user needs to log in to GET a token)
 *
 * Request Body (JSON):
 *   {
 *     "email":    "ahmed@example.com",
 *     "password": "mypassword123"
 *   }
 *
 * Success Response (200 OK):
 *   {
 *     "success": true,
 *     "token": "eyJhbGci...",
 *     "user": { "id", "name", "email", "role" }
 *   }
 *
 * Error Responses:
 *   401 → Email not found or password incorrect
 */
router.post('/login', loginUser);
// When a POST request hits /login, call loginUser from authController.

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────
module.exports = router;
// Export the router so server.js can mount it with:
//   app.use('/api/auth', authRoutes)

/*
 * END OF FILE SUMMARY
 * =====================
 * File:    routes/authRoutes.js
 * Mounted: /api/auth (in server.js)
 *
 * Routes:
 *   POST /api/auth/register → registerUser (controllers/authController.js)
 *   POST /api/auth/login    → loginUser    (controllers/authController.js)
 *
 * Both routes are PUBLIC — no JWT token required.
 * After login/register, the returned token is used for protected routes.
 */
