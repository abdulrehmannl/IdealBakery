/**
 * middleware/auth.js — Authentication & Authorization Middleware
 * ==============================================================
 * This file exports TWO middleware functions:
 *
 *   1. protect    → Verifies the user is LOGGED IN (has a valid JWT token)
 *   2. adminOnly  → Verifies the logged-in user is an admin or manager
 *
 * HOW MIDDLEWARE WORKS IN EXPRESS:
 * ─────────────────────────────────
 * A middleware is just a function with (req, res, next) parameters.
 *   - req  = the incoming request object
 *   - res  = the response object (used to send replies)
 *   - next = a function to call when this middleware is DONE and Express
 *            should proceed to the next middleware or route handler
 *
 * USAGE IN ROUTES:
 * ────────────────
 *   const { protect, adminOnly } = require('../middleware/auth');
 *
 *   // Public route — anyone can access
 *   router.get('/products', getAllProducts);
 *
 *   // Protected route — user must be logged in
 *   router.get('/profile', protect, getProfile);
 *
 *   // Admin-only route — user must be logged in AND be admin/manager
 *   router.delete('/products/:id', protect, adminOnly, deleteProduct);
 */

const jwt = require('jsonwebtoken');
// jwt: The library used to CREATE and VERIFY JSON Web Tokens.
// A JWT is a digitally signed string that proves who the user is.

const User = require('../models/User');
// We import the User model so we can look up the user in MongoDB
// to confirm they still exist (e.g., haven't been deleted since login).

// ─────────────────────────────────────────────────────────────────────────────
// MIDDLEWARE 1: protect
// ─────────────────────────────────────────────────────────────────────────────
/**
 * protect — Ensures the request has a valid JWT token.
 *
 * WHAT IS A JWT TOKEN?
 * ─────────────────────
 * When a user logs in, the server gives them a "token" — a long string like:
 *   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YWJjZGVmIiwicm9sZSI6
 *   ImFkbWluIiwiaWF0IjoxNjI1MDAwMDAwLCJleHAiOjE2MjU2MDQ4MDB9.SflKxwRJSMeKKF2
 *
 * This token is split into 3 parts separated by dots:
 *   [Header].[Payload].[Signature]
 *   - Header: Algorithm used (HS256)
 *   - Payload: The data we stored: { id, role, iat (issued at), exp (expires) }
 *   - Signature: A cryptographic hash that proves nobody tampered with the token
 *
 * HOW THE TOKEN IS SENT:
 * ──────────────────────
 * The frontend stores the token (in localStorage) and sends it in every
 * request inside the Authorization header:
 *   Authorization: Bearer eyJhbGci...
 *
 * We extract "Bearer eyJhbGci..." then split at the space to get "eyJhbGci..."
 */
const protect = async (req, res, next) => {
    let token;

    try {
        // ── Step 1: Extract the token from the request header ──
        // Check if the Authorization header exists AND starts with "Bearer"
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            // Split "Bearer eyJhbGci..." on the space — take index 1 (the token)
            token = req.headers.authorization.split(' ')[1];
        }

        // ── Step 2: If no token was found, reject the request ──
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized. No token provided. Please log in.',
            });
            // 401 = Unauthorized — valid credentials not provided
        }

        // ── Step 3: Verify the token ──
        // jwt.verify() decodes the token AND checks:
        //   a) The signature is valid (wasn't tampered with)
        //   b) The token hasn't expired (we set JWT_EXPIRE=7d in .env)
        // If either check fails, it throws an error which we catch below.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // decoded = { id: '64abcdef123', role: 'admin', iat: ..., exp: ... }

        // ── Step 4: Fetch the actual user from MongoDB ──
        // We use the ID stored inside the token to find the user.
        // We call .select('-password') to exclude the hashed password from
        // the result — we never need to send the password anywhere.
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            // Token is valid but the user was deleted from the DB
            return res.status(401).json({
                success: false,
                message: 'User belonging to this token no longer exists.',
            });
        }

        if (!user.isActive) {
            // User account has been deactivated by an admin
            return res.status(401).json({
                success: false,
                message: 'Your account has been deactivated. Contact admin.',
            });
        }

        // ── Step 5: Attach user to req and proceed ──
        // We store the user object on req.user so any route handler AFTER
        // this middleware can access it:
        //   req.user.id    → the user's MongoDB _id
        //   req.user.role  → 'customer', 'admin', 'manager', or 'cashier'
        //   req.user.name  → user's full name
        req.user = user;

        // Call next() to proceed to the next middleware or the route handler
        next();

    } catch (error) {
        // ── JWT-specific error handling ──
        if (error.name === 'JsonWebTokenError') {
            // Token exists but signature is invalid (tampered / corrupted)
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please log in again.',
            });
        }

        if (error.name === 'TokenExpiredError') {
            // Token was valid but has expired (past the 7-day limit)
            return res.status(401).json({
                success: false,
                message: 'Token has expired. Please log in again.',
            });
        }

        // Unknown error — pass to global error handler
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// MIDDLEWARE 2: adminOnly
// ─────────────────────────────────────────────────────────────────────────────
/**
 * adminOnly — Ensures the logged-in user is an admin or manager.
 *
 * IMPORTANT: This middleware MUST be used AFTER protect.
 * Why? Because protect puts the user on req.user. adminOnly reads from req.user.
 * If you use adminOnly without protect, req.user will be undefined → crash.
 *
 * Usage example:
 *   router.delete('/staff/:id', protect, adminOnly, deleteStaff);
 *                                ───────  ─────────
 *                                runs 1st  runs 2nd
 */
const adminOnly = (req, res, next) => {
    // Check the role stored on req.user (put there by protect middleware above)
    const allowedRoles = ['admin', 'manager'];

    if (!req.user || !allowedRoles.includes(req.user.role)) {
        // User is logged in but doesn't have sufficient privileges
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admins and managers only.',
            // 403 = Forbidden — the server understood the request but refuses it.
            // 401 = "who are you?" (not authenticated)
            // 403 = "I know who you are, but you can't do this" (not authorized)
        });
    }

    // User has the right role — proceed to the next handler
    next();
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { protect, adminOnly };
// Export both functions so route files can destructure what they need:
//   const { protect, adminOnly } = require('../middleware/auth');

/*
 * END OF FILE SUMMARY
 * =====================
 * File:    middleware/auth.js
 * Exports: { protect, adminOnly }
 *
 * protect:
 *   - Reads Authorization: Bearer <token> header
 *   - Verifies JWT using JWT_SECRET from .env
 *   - Fetches user from MongoDB (excludes password)
 *   - Attaches user to req.user
 *   - Calls next() if all checks pass
 *
 * adminOnly:
 *   - Must be used AFTER protect
 *   - Checks req.user.role is 'admin' or 'manager'
 *   - Returns 403 if not allowed
 *   - Calls next() if allowed
 *
 * Error codes:
 *   401 → Not authenticated (no token / bad token / expired token)
 *   403 → Not authorized (wrong role)
 */
