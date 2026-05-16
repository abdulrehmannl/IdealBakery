import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Send } from 'lucide-react';

/**
 * ForgotPasswordPage
 * ==================
 * Allows users to request a password reset link via their email address.
 * This page is intentionally full-screen with NO navbar or footer —
 * it uses the same clean auth-page layout as Login and Register.
 *
 * Route: /forgot-password
 */
function ForgotPasswordPage() {
    // ── State ──────────────────────────────────────────────────
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // When true, hides the form and shows a success message instead
    const [isSubmitted, setIsSubmitted] = useState(false);

    // ── Handlers ───────────────────────────────────────────────
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        /*
         * DUMMY SUBMIT — NO REAL API CALL YET
         * ------------------------------------
         * TODO (Future API): Replace with:
         *   axios.post('/api/users/forgot-password', { email })
         *     .then(() => setIsSubmitted(true))
         *     .catch(err => console.error(err));
         */
        console.log('Password reset requested for (dummy):', email);

        // Simulate API call with a 1.5s delay, then show success state
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
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
                            Reset Password
                        </h2>
                        <p className="mt-2 text-white/75 text-sm font-body">
                            We'll send a reset link to your email
                        </p>
                    </div>

                    {/* ── Card Body ── */}
                    <div className="px-8 py-8">

                        {/* ── Success State ── */}
                        {/* Shows after form submission — hides the form */}
                        {isSubmitted ? (
                            <div className="text-center py-6">
                                {/* Big green checkmark circle */}
                                <div className="flex justify-center mb-5">
                                    <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                                        <CheckCircle size={40} className="text-green-500" />
                                    </div>
                                </div>

                                <h3 className="font-heading text-2xl font-bold text-text-dark mb-3">
                                    Check Your Email!
                                </h3>
                                <p className="font-body text-text-light text-sm mb-2 leading-relaxed">
                                    We've sent a password reset link to:
                                </p>
                                {/* Show the email they entered */}
                                <p className="font-bold text-primary text-base mb-6">
                                    {email}
                                </p>
                                <p className="font-body text-text-light text-xs mb-8">
                                    Didn't receive it? Check your spam folder or{' '}
                                    {/* Reset the form to let them try again */}
                                    <button
                                        onClick={() => { setIsSubmitted(false); setEmail(''); }}
                                        className="text-primary font-bold underline underline-offset-2 hover:text-[#6A1414] transition-colors"
                                    >
                                        try again
                                    </button>
                                    .
                                </p>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm tracking-widest hover:bg-[#6A1414] transition-colors"
                                >
                                    <ArrowLeft size={16} />
                                    BACK TO LOGIN
                                </Link>
                            </div>
                        ) : (
                            /* ── Email Input Form ── */
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <p className="font-body text-text-light text-sm leading-relaxed">
                                    Enter the email address linked to your account and we'll send you a link to reset your password.
                                </p>

                                {/* Email Input */}
                                <div>
                                    <label
                                        className="block text-sm font-semibold text-text-dark mb-1.5"
                                        htmlFor="forgot-email"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        {/* Mail icon inside input */}
                                        <Mail
                                            size={16}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light pointer-events-none"
                                        />
                                        <input
                                            id="forgot-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm font-body text-text-dark bg-secondary/40 placeholder-text-light/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary text-white font-bold text-sm tracking-widest rounded-lg hover:bg-[#6A1414] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
                                >
                                    {/* Loading spinner when API is being called */}
                                    {isLoading ? (
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Send size={16} />
                                    )}
                                    {isLoading ? 'SENDING...' : 'SEND RESET LINK'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* ── Card Footer: Back to Login ── */}
                    {!isSubmitted && (
                        <div className="px-8 pb-8 text-center border-t border-border/40 pt-5">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-light hover:text-primary transition-colors"
                            >
                                <ArrowLeft size={14} />
                                Back to Login
                            </Link>
                        </div>
                    )}

                </div>

                {/* Go back to home */}
                <p className="text-center mt-6 text-sm text-text-light">
                    <Link to="/" className="hover:text-primary transition-colors font-semibold">
                        ← Back to Home
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default ForgotPasswordPage;

/*
 * END OF FILE SUMMARY
 * =====================
 * 1. Concepts used:
 *    - Two-state UI: form state vs success state controlled by `isSubmitted`.
 *    - Pure CSS spinner (animate-spin) while waiting for API.
 *    - `isLoading` disables the button to prevent double-submits.
 * 2. Route: /forgot-password
 * 3. No Navbar/Footer: This page is hidden from the global layout — see App.jsx.
 * 4. Dummy Data: Submission only console.logs. No real API call.
 *    TODO: Replace with axios.post('/api/users/forgot-password', { email })
 */
