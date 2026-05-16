import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';

/**
 * LoginPage
 * =========
 * The sign-in page for Super Ideal Sweets & Bakers.
 * Allows users to log in with email and password.
 *
 * Design theme: Matches the rest of the site —
 *   Primary maroon (#8B1A1A), cream background (#F5F0EB),
 *   Playfair Display for heading, Lato for body text.
 *
 * Route: /login
 */
function LoginPage() {
    // ── State ──────────────────────────────────────────────────
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Controls whether the password text is visible or hidden
    const [showPassword, setShowPassword] = useState(false);

    // Tracks form submission loading state (for future API call)
    const [isLoading, setIsLoading] = useState(false);

    // ── Handlers ───────────────────────────────────────────────
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        /*
         * DUMMY SUBMIT — NO REAL API CALL YET
         * ------------------------------------
         * TODO (Future API): Replace this with a real axios call:
         *
         *   import axios from 'axios';
         *
         *   axios.post('/api/users/login', { email, password })
         *     .then(res => {
         *       // Store token in localStorage or context
         *       localStorage.setItem('token', res.data.token);
         *       // Redirect to home or dashboard
         *       navigate('/');
         *     })
         *     .catch(err => {
         *       console.error('Login failed:', err.response.data.message);
         *       setIsLoading(false);
         *     });
         */
        console.log('Login submitted (dummy):', { email, password });

        // Simulate a brief loading state, then stop
        setTimeout(() => setIsLoading(false), 1500);
    };

    return (
        /*
         * Full-screen centered layout with cream gradient background.
         * Same warm color feel as the rest of the website.
         */
        <div
            className="flex items-center justify-center min-h-screen px-4 py-12 font-body"
            style={{ background: 'linear-gradient(135deg, #F5F0EB 0%, #EBE2D5 100%)' }}
        >
            <div className="w-full max-w-md">

                {/* ── Card Container ── */}
                <div className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">

                    {/* ── Card Header: Maroon Banner ── */}
                    {/* This maroon top strip ties the form into the overall site theme */}
                    <div className="bg-primary px-8 py-8 text-center">
                        {/* Logo text */}
                        <h1 className="font-logo text-2xl font-bold text-white mb-2 tracking-tight">
                            Ideal Sweets & Bakers
                        </h1>
                        {/* Page title */}
                        <h2 className="font-heading text-3xl font-bold text-white">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-white/75 text-sm font-body">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* ── Login Form ── */}
                    <form className="px-8 py-8 space-y-5" onSubmit={handleSubmit}>

                        {/* Email Field */}
                        <div>
                            <label
                                className="block text-sm font-semibold text-text-dark mb-1.5"
                                htmlFor="login-email"
                            >
                                Email Address
                            </label>
                            {/* Input with icon inside */}
                            <div className="relative">
                                {/* Mail icon on the left side of the input */}
                                <Mail
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light pointer-events-none"
                                />
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    // pl-10 = left padding to make room for the Mail icon
                                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm font-body text-text-dark bg-secondary/40 placeholder-text-light/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                className="block text-sm font-semibold text-text-dark mb-1.5"
                                htmlFor="login-password"
                            >
                                Password
                            </label>
                            <div className="relative">
                                {/* Lock icon on the left */}
                                <Lock
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light pointer-events-none"
                                />
                                <input
                                    id="login-password"
                                    // Toggle between "password" and "text" type based on showPassword state
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-border rounded-lg text-sm font-body text-text-dark bg-secondary/40 placeholder-text-light/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                />
                                {/* Show/Hide password toggle button on the right */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-primary transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {/* Swap icon when toggled */}
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password link → navigates to the forgot password page */}
                        <div className="text-right">
                            <Link
                                to="/forgot-password"
                                className="text-xs font-semibold text-primary hover:text-[#6A1414] transition-colors"
                            >
                                Forgot your password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary text-white font-bold text-sm tracking-widest rounded-lg hover:bg-[#6A1414] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
                        >
                            {/* Show loading spinner when isLoading, otherwise show icon */}
                            {isLoading ? (
                                // Simple CSS spinner — no external library needed
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <LogIn size={16} />
                            )}
                            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
                        </button>

                        {/* Divider */}
                        <div className="relative flex items-center gap-3 py-2">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-text-light font-semibold uppercase tracking-wide shrink-0">
                                or
                            </span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                    </form>

                    {/* ── Card Footer: Register Link ── */}
                    <div className="px-8 pb-8 text-center">
                        <p className="text-sm text-text-light font-body">
                            Don&apos;t have an account?{' '}
                            <Link
                                to="/register"
                                className="font-bold text-primary hover:text-[#6A1414] transition-colors underline underline-offset-2"
                            >
                                Create one here →
                            </Link>
                        </p>
                    </div>

                </div>

                {/* Back to home link below the card */}
                <p className="text-center mt-6 text-sm text-text-light">
                    <Link to="/" className="hover:text-primary transition-colors font-semibold">
                        ← Back to Home
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default LoginPage;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - useState for controlled form inputs (email, password).
 *    - useState for UI state (showPassword toggle, isLoading spinner).
 *    - Lucide React icons (Mail, Lock, Eye, EyeOff, LogIn) for clean icon usage.
 *    - CSS spinner using Tailwind's `animate-spin` utility — no extra library.
 * 2. Design:
 *    - Matches site color theme: #8B1A1A primary, #F5F0EB cream, Playfair + Lato fonts.
 *    - Previously used orange (from default Tailwind) — now fully corrected to maroon theme.
 * 3. Dummy Data:
 *    - Form submission only logs to console. No real API call yet.
 *    - TODO: Replace console.log with axios.post('/api/users/login', ...)
 * 4. Route: /login
 * 5. Security Note:
 *    - Do NOT store raw passwords in state after login — only the JWT token.
 */