import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import api from '../utils/api';

function RegisterPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGoogleRegister = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();

            const response = await api.post('/api/auth/google', { idToken });
            
            if (response.data.success) {
                login(response.data.user);
                navigate('/');
            } else {
                setError(response.data.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Google registration error:', err);
            setError('Failed to sign up with Google. Please try again.');
        } finally {
            setIsLoading(false);
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
                            Create Account
                        </h2>
                        <p className="mt-2 text-white/75 text-sm font-body">
                            Join us to order your favorites!
                        </p>
                    </div>

                    <div className="px-8 py-10">
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleGoogleRegister}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border-2 border-border text-text-dark font-bold text-sm rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                        >
                            {isLoading ? (
                                <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            )}
                            {isLoading ? 'PLEASE WAIT...' : 'SIGN UP WITH GOOGLE'}
                        </button>
                    </div>

                    <div className="px-8 pb-8 text-center">
                        <p className="text-sm text-text-light font-body">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-primary hover:text-[#6A1414] transition-colors underline underline-offset-2">
                                Sign in here →
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

export default RegisterPage;