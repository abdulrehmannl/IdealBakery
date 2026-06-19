import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Phone, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import api from '../utils/api';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    // UI State
    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
    const [isLoadingPhone, setIsLoadingPhone] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    
    // Form State
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleRoleRedirect = (role) => {
        if (role === 'admin' || role === 'manager') {
            navigate('/admin/dashboard');
        } else if (role === 'staff' || role === 'delivery') {
            navigate('/admin/orders');
        } else {
            // Customer or unknown stays or goes to home
            navigate('/');
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoadingGoogle(true);
        setError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();

            const response = await api.post('/api/auth/google', { idToken });
            
            if (response.data.success) {
                login(response.data.user);
                handleRoleRedirect(response.data.user.role);
            } else {
                setError(response.data.message || 'Google login failed');
            }
        } catch (err) {
            console.error('Google login error:', err);
            setError('Failed to login with Google. Please try again.');
        } finally {
            setIsLoadingGoogle(false);
        }
    };

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        setIsLoadingPhone(true);
        setError(null);
        
        try {
            const response = await api.post('/api/auth/login-phone', { phone, password });
            
            if (response.data.success) {
                login(response.data.user);
                handleRoleRedirect(response.data.user.role);
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Phone login error:', err);
            setError(err.response?.data?.message || 'Invalid phone number or password.');
        } finally {
            setIsLoadingPhone(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-12 font-body" style={{ background: 'linear-gradient(135deg, #F5F0EB 0%, #EBE2D5 100%)' }}>
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
                    <div className="bg-primary px-8 py-8 text-center">
                        <h1 className="font-logo text-2xl font-bold text-white mb-2 tracking-tight">
                            Ideal Sweets & Bakers
                        </h1>
                        <h2 className="font-heading text-3xl font-bold text-white">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-white/75 text-sm font-body">
                            Sign in to your account
                        </p>
                    </div>

                    <div className="px-8 py-8">
                        {error && (
                            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* ── CUSTOMER SECTION (Google) ── */}
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-text-light uppercase tracking-wide mb-3 text-center">Customers</h3>
                            <button
                                onClick={handleGoogleLogin}
                                disabled={isLoadingGoogle || isLoadingPhone}
                                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-border text-text-dark font-bold text-sm rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                            >
                                {isLoadingGoogle ? (
                                    <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                ) : (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                )}
                                {isLoadingGoogle ? 'WAIT...' : 'SIGN IN WITH GOOGLE'}
                            </button>
                        </div>

                        <div className="relative flex items-center gap-3 mb-6">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-text-light font-semibold uppercase tracking-wide shrink-0">
                                OR STAFF LOGIN
                            </span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        {/* ── STAFF SECTION (Phone + Password) ── */}
                        <form className="space-y-4" onSubmit={handlePhoneSubmit}>
                            <div>
                                <label className="block text-sm font-semibold text-text-dark mb-1.5" htmlFor="login-phone">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
                                    <input
                                        id="login-phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="03001234567"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm font-body text-text-dark bg-secondary/40 placeholder-text-light/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-text-dark mb-1.5" htmlFor="login-password">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
                                    <input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full pl-10 pr-12 py-3 border border-border rounded-lg text-sm font-body text-text-dark bg-secondary/40 placeholder-text-light/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoadingPhone || isLoadingGoogle}
                                className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 bg-primary text-white font-bold text-sm tracking-widest rounded-lg hover:bg-[#6A1414] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
                            >
                                {isLoadingPhone ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <LogIn size={16} />
                                )}
                                {isLoadingPhone ? 'SIGNING IN...' : 'STAFF LOGIN'}
                            </button>
                        </form>
                    </div>

                    <div className="px-8 pb-8 text-center">
                        <p className="text-sm text-text-light font-body">
                            Customer without an account?{' '}
                            <Link to="/register" className="font-bold text-primary hover:text-[#6A1414] transition-colors underline underline-offset-2">
                                Sign up here →
                            </Link>
                        </p>
                    </div>
                </div>

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