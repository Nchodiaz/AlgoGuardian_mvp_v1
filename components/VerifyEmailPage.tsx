import React, { useEffect, useState } from 'react';
import { authApi } from '../services/realApi';

interface VerifyEmailPageProps {
    onVerificationComplete: () => void;
}

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ onVerificationComplete }) => {
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const verify = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link. No token provided.');
                return;
            }

            try {
                await authApi.verifyEmail(token);
                setStatus('success');
                setMessage('Email verified successfully! Logging you in...');

                // Auto-login successful (token set in authApi.verifyEmail)
                setTimeout(() => {
                    // Redirect to dashboard
                    window.location.href = '/dashboard';
                }, 1500);
            } catch (error: any) {
                setStatus('error');
                setMessage(error.message || 'Failed to verify email. The link may be expired or invalid.');
            }
        };

        verify();
    }, [onVerificationComplete]);

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <img src="/logo.svg" alt="AlgoGuardian" className="h-16 w-16" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Email Verification
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-700">
                    <div className="text-center">
                        {status === 'verifying' && (
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
                                <p className="text-gray-300">{message}</p>
                            </div>
                        )}
                        {status === 'success' && (
                            <div className="flex flex-col items-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-green-400 font-medium text-lg mb-2">Verified!</p>
                                <p className="text-gray-300">{message}</p>
                                <p className="text-gray-500 text-sm mt-4">Redirecting to login...</p>
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="flex flex-col items-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <p className="text-red-400 font-medium text-lg mb-2">Verification Failed</p>
                                <p className="text-gray-300">{message}</p>
                                <button
                                    onClick={onVerificationComplete}
                                    className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                                >
                                    Go to Login
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
