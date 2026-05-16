import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Phone, User, UserPlus } from 'lucide-react';

/**
 * RegisterPage
 * ============
 * The account creation page for Super Ideal Sweets & Bakers.
 * Collects: Full Name, Email, Phone Number, Password, Confirm Password.
 *
 * Design theme: Matches rest of site —
 *   Primary maroon (#8B1A1A), cream (#F5F0EB), Playfair Display + Lato fonts.
 *
 * Route: /register
 */
function RegisterPage() {
    // ── Form State ─────────────────────────────────────────────
    const [name, setName]                     = useState('');
    const [email, setEmail]                   = useState('');
    const [phone, setPhone]                   = useState('');
    const [password, setPassword]             = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // ── UI State ───────────────────────────────────────────────
    // Toggle to show/hide the password field as readable text
    const [showPassword, setShowPassword]           = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Tracks API call so we can show a loading spinner on the button
    const [isLoading, setIsLoading] = useState(false);

    // Stores any validation error message to show the user
    const [error, setError] = useState('');

    // ── Handlers ───────────────────────────────────────────────
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // clear any previous error

        // Client-side validation: make sure passwords match before sending to API
        if (password !== confirmPassword) {
            setError('Passwords do not match. Please check and try again.');
            return;
        }

        // Basic password strength check: must be at least 6 characters
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setIsLoading(true);

        /*
         * DUMMY SUBMIT — NO REAL API CALL YET
         * ------------------------------------
         * TODO (Future API): Replace this with a real axios call:
         *
         *   import axios from 'axios';
         *
         *   axios.post('/api/users/register', { name, email, phone, password })
         *     .then(res => {
         *       // Optionally log in the user right away with their token
         *       localStorage.setItem('token', res.data.token);
         *       navigate('/');
         *     })
         *     .catch(err => {
         *       setError(err.response?.data?.message || 'Registration failed.');
         *       setIsLoading(false);
         *     });
         *
         * NOTE: Do NOT send `confirmPassword` to the server — it's only for client validation.
         */
        console.log('Register submitted (dummy):', { name, email, phone, password });

        // Simulate API delay
        setTimeout(() => setIsLoading(false), 1500);
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen px-4 py-12 font-body"
            style={{ background: 'linear-gradient(135deg, #F5F0EB 0%, #EBE2D5 100%)' }}
        >
            <div className="w-full max-w-md">

                {/* ── Card Container ── */}
                <div className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">

                    {/* ── Card Header: Maroon Banner ── */}
                    <div className="bg-primary px-8 py-8 text-center">
                        <h1 className="font-logo text-2xl font-bold text-white mb-2 tracking-tight">
                            Ideal Sweets & Bakers
                        </h1>
                        <h2 className="font-heading text-3xl font-bold text-white">
                            Create Account
                        </h2>
                        <p className="mt-2 text-white/75 text-sm font-body">
                            Join us today and enjoy exclusive offers
                        </p>
                    </div>

                    {/* ── Registration Form ── */}
                    <form className="px-8 py-8 space-y-4" onSubmit={handleSubmit}>

                        {/* ── Validation Error Message ── */}
                        {/* Only renders if `error` state is set */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg font-semibold">
                                {error}
                            </div>
                        )}

                        {/* Full Name Field */}
                        <div>
                            <label
                                className="block text-sm font-semibold text-text-dark mb-1.5"
                                htmlFor="register-name"
                            >
                                Full Name
                            </label>
                            <div className="relative">
                                {/* User icon inside the input */}
                                <User
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light pointer-events-none"
                                />
                                <input
                                    id="register-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your full name"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm font-body text-text-dark bg-secondary/40 placeholder-text-light/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label
                                className="block text-sm font-semibold text-text-dark mb-1.5"
                                htmlFor="register-email"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light pointer-events-none"
                                />
                                <input
                                    id="register-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm font-body text-text-dark bg-secondary/40 placeholder-text-light/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        {/* Phone Number Field */}
                        <div>
                            <label
                                className="block text-sm font-semibold text-text-dark mb-1.5"
                                htmlFor="register-phone"
                            >
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light pointer-events-none"
                                />
                                <input
                                    id="register-phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="03XX-XXXXXXX"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm font-body text-text-dark bg-secondary/40 placeholder-text-light/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                className="block text-sm font-semibold text-text-dark mb-1.5"
                                htmlFor="register-password"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light pointer-events-none"
                                />
                                <input
                                    id="register-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 6 characters"
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-border rounded-lg text-sm font-body text-text-dark bg-secondary/40 placeholder-text-light/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                />
                                {/* Toggle show/hide for password */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-primary transition-colors"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label
                                className="block text-sm font-semibold text-text-dark mb-1.5"
                                htmlFor="register-confirm-password"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light pointer-events-none"
                                />
                                <input
                                    id="register-confirm-password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter your password"
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-border rounded-lg text-sm font-body text-text-dark bg-secondary/40 placeholder-text-light/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                />
                                {/* Toggle show/hide for confirm password field */}
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-primary transition-colors"
                                    aria-label="Toggle confirm password visibility"
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary text-white font-bold text-sm tracking-widest rounded-lg hover:bg-[#6A1414] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
                            >
                                {/* Loading spinner or register icon */}
                                {isLoading ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <UserPlus size={16} />
                                )}
                                {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                            </button>
                        </div>

                    </form>

                    {/* ── Card Footer: Login Link ── */}
                    <div className="px-8 pb-8 text-center border-t border-border/40 pt-5">
                        <p className="text-sm text-text-light font-body">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-bold text-primary hover:text-[#6A1414] transition-colors underline underline-offset-2"
                            >
                                Sign in here →
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

export default RegisterPage;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - useState for all 5 form fields + 3 UI state variables.
 *    - Separate showPassword / showConfirmPassword toggles for each password field.
 *    - Error state to display validation messages inline (no alert() popups).
 *    - `disabled` attribute on submit button while loading to prevent double-submit.
 * 2. Design:
 *    - Matches site color theme: #8B1A1A primary, #F5F0EB cream, Playfair + Lato fonts.
 *    - Previously used orange (incorrect) — now corrected to maroon theme.
 *    - Icon inputs: User, Mail, Phone, Lock, Eye/EyeOff from lucide-react.
 * 3. Dummy Data:
 *    - Form submission only console.logs. No API call yet.
 *    - TODO: Replace with axios.post('/api/users/register', { name, email, phone, password })
 * 4. Route: /register
 * 5. Validation:
 *    - Password match check (client-side)
 *    - Minimum 6-character password (client-side)
 *    - HTML5 `required` attribute handles empty field validation
 */