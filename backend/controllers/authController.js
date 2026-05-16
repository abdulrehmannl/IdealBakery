/**
 * controllers/authController.js — Authentication Business Logic
 * ==============================================================
 * This file contains the actual logic for user registration and login.
 *
 * WHAT IS A CONTROLLER?
 * ──────────────────────
 * A controller is the function that runs when a route is matched.
 * It receives the request (req), builds a response (res), and returns it.
 * It contains the "business logic" — the rules of HOW the app works.
 *
 * CONTROLLER vs ROUTE:
 * ──────────────────────
 *   Route:      "For POST /register, call registerUser"
 *   Controller: "registerUser does: validate → hash password → save to DB → return token"
 *
 * SECURITY PRINCIPLES FOLLOWED HERE:
 * ────────────────────────────────────
 *   1. Passwords are NEVER stored as plain text — always hashed with bcrypt
 *   2. JWT tokens are signed with a secret key only the server knows
 *   3. Error messages are generic for login (don't reveal if email exists)
 *      — Actually for this bakery app we keep messages clear for UX
 */

const bcrypt = require('bcryptjs');
// bcrypt: Used to hash passwords before storing in DB.
// Hashing is a one-way process — you can't "un-hash" a password.
// To verify: hash the input and compare with the stored hash.
// NEVER store plain text passwords — if DB is hacked, all passwords are exposed.

const jwt = require('jsonwebtoken');
// jwt: Used to create signed tokens that prove a user is logged in.
// The token contains encoded data (user ID, role) and an expiry time.

const User = require('../models/User');
// Our Mongoose User model — used to create and query users in MongoDB.

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: generateToken
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Creates and returns a signed JWT token for a user.
 *
 * @param {string} id   - The user's MongoDB _id (e.g. "64abcdef123")
 * @param {string} role - The user's role (e.g. "customer", "admin")
 * @returns {string}    - A signed JWT token string
 *
 * HOW jwt.sign() WORKS:
 * ──────────────────────
 *   jwt.sign(payload, secretKey, options)
 *     - payload:   The data to encode in the token { id, role }
 *     - secretKey: A secret string only the server knows (from .env)
 *     - options:   Settings like { expiresIn: '7d' }
 *
 * The token is signed using the secret key. Anyone can DECODE a JWT (it's
 * just base64), but only the server can VERIFY the signature. This means
 * the server can detect if the token was modified/tampered with.
 */
const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },                   // payload — data baked into the token
        process.env.JWT_SECRET,         // secret key from .env
        { expiresIn: process.env.JWT_EXPIRE || '7d' }  // token expires in 7 days
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTROLLER 1: registerUser
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
    try {
        // ── Step 1: Extract fields from request body ──
        // req.body contains the JSON data sent by the frontend
        const { name, email, password, phone, address } = req.body;

        // ── Step 2: Manual validation — check required fields ──
        // Make sure all required fields were actually sent in the request.
        // We check each field and collect any missing ones.
        const missingFields = [];
        if (!name)     missingFields.push('name');
        if (!email)    missingFields.push('email');
        if (!password) missingFields.push('password');
        if (!phone)    missingFields.push('phone');

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`,
                // Example: "Missing required fields: name, phone"
            });
        }

        // ── Step 3: Validate password length ──
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long.',
            });
        }

        // ── Step 4: Check if email is already registered ──
        // We search the database for any user with this email.
        // MongoDB is case-sensitive, so "Ahmed@test.com" ≠ "ahmed@test.com"
        // We normalize to lowercase first.
        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists. Please log in.',
            });
        }

        // ── Step 5: Hash the password ──
        // bcrypt.hash(plainText, saltRounds)
        //
        // What is a "salt"?
        // A salt is random data added to the password before hashing.
        // This ensures that even if two users have the same password,
        // their hashes will be completely different in the database.
        //
        // saltRounds = 10: The higher the number, the more secure (but slower).
        // 10 is the industry standard — it's strong enough and fast enough.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // hashedPassword looks like: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh4y

        // ── Step 6: Create the user in MongoDB ──
        // User.create() saves a new document to the 'users' collection.
        // We save the HASHED password, never the original plain text.
        const user = await User.create({
            name:     name.trim(),
            email:    normalizedEmail,
            password: hashedPassword,   // ← hashed, NOT plain text
            phone:    phone.trim(),
            address:  address ? address.trim() : undefined,
            role:     'customer',       // new registrations are always customers
        });

        // ── Step 7: Generate JWT token ──
        // Now that the user is saved, create a token for them so they're
        // immediately logged in without needing to log in separately.
        const token = generateToken(user._id, user.role);

        // ── Step 8: Send success response ──
        // Return 201 (Created) — the standard HTTP code for a new resource.
        // We return the token + safe user details (no password).
        return res.status(201).json({
            success: true,
            message: 'Account created successfully! Welcome to Ideal Bakery.',
            token,
            user: {
                id:    user._id,
                name:  user.name,
                email: user.email,
                role:  user.role,
                phone: user.phone,
            },
        });

    } catch (error) {
        // If ANYTHING goes wrong (DB error, network error, etc.),
        // pass it to the global error handler in middleware/errorHandler.js
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTROLLER 2: loginUser
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @desc    Log in an existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
    try {
        // ── Step 1: Extract credentials from request body ──
        const { email, password } = req.body;

        // ── Step 2: Validate that both fields were provided ──
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password.',
            });
        }

        // ── Step 3: Find the user by email ──
        // We normalize the email to lowercase to match how we stored it.
        // .select('+password') is needed if the password field has select: false
        // in the schema. Our User schema doesn't have that, but it's good practice.
        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            // No user found with this email address
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
                // Note: We use a vague message on purpose in many apps so hackers
                // can't determine which emails are registered. For this bakery CMS
                // we keep it vague as best practice.
            });
        }

        // ── Step 4: Check if account is active ──
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Your account has been deactivated. Please contact support.',
            });
        }

        // ── Step 5: Compare the submitted password with the stored hash ──
        // bcrypt.compare(plainTextPassword, hashedPassword)
        //
        // HOW THIS WORKS:
        // bcrypt takes the submitted password, applies the SAME salt that was
        // used during registration (stored inside the hash string), hashes it,
        // and compares the result. If they match, it returns true.
        // This is the ONLY correct way to verify a bcrypt-hashed password.
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            // Passwords don't match — wrong password
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        // ── Step 6: Generate a fresh JWT token for this session ──
        const token = generateToken(user._id, user.role);

        // ── Step 7: Send success response ──
        // Return 200 (OK) — successful login.
        return res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}!`,
            token,
            user: {
                id:    user._id,
                name:  user.name,
                email: user.email,
                role:  user.role,
                phone: user.phone,
            },
        });

    } catch (error) {
        // Pass any unexpected errors to the global error handler
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────
module.exports = { registerUser, loginUser };
// Export both controllers so authRoutes.js can import and use them.

/*
 * END OF FILE SUMMARY
 * =====================
 * File:    controllers/authController.js
 * Exports: { registerUser, loginUser }
 *
 * registerUser (POST /api/auth/register):
 *   1. Validates required fields (name, email, password, phone)
 *   2. Checks password is 6+ characters
 *   3. Checks email not already in DB
 *   4. Hashes password with bcrypt (saltRounds: 10)
 *   5. Creates User in MongoDB with role: 'customer'
 *   6. Generates JWT token (id + role, expires 7d)
 *   7. Returns { success, message, token, user }
 *
 * loginUser (POST /api/auth/login):
 *   1. Validates email + password provided
 *   2. Finds user by email (lowercase normalized)
 *   3. Checks account is active
 *   4. Compares password with bcrypt.compare()
 *   5. Generates JWT token
 *   6. Returns { success, message, token, user }
 *
 * Password policy:
 *   - Minimum 6 characters
 *   - Stored as bcrypt hash (saltRounds: 10)
 *   - NEVER stored or returned as plain text
 *
 * Token policy:
 *   - Signed with JWT_SECRET from .env
 *   - Expires after JWT_EXPIRE (default 7 days)
 *   - Payload: { id, role }
 */
