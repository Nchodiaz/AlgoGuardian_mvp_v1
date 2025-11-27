import React, { useState, useEffect } from 'react';

import { authApi } from '../services/realApi';

interface AuthProps {
    onAuthSuccess: () => void;
    initialView: 'login' | 'signup';
    selectedPlan?: string;
    isPotentialLead?: boolean;
    onGoToPricing?: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess, initialView, selectedPlan, isPotentialLead, onGoToPricing }) => {
    const [isSignUp, setIsSignUp] = useState(initialView === 'signup');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setIsSignUp(initialView === 'signup');
    }, [initialView]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        // Basic validation
        if (!email || !password || (isSignUp && !fullName)) {
            setError('Please fill in all fields.');
            setIsLoading(false);
            return;
        }

        try {
            if (isSignUp) {
                const response = await authApi.register(email, password, selectedPlan, isPotentialLead);
                setSuccessMessage(response.message || 'Account created! Please check your email to verify.');
                setIsLoading(false); // Stop loading, stay on form to show message
            } else {
                await authApi.login(email, password);
                onAuthSuccess();
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="sm:mx-auto sm:w-full sm:max-w-md pt-12">
                <div className="flex justify-center items-center gap-1.5">
                    <img src="/logo.svg" alt="AlgoGuardian" className="h-14 w-14" />
                    <h1 className="text-3xl font-bold text-white">AlgoGuardian</h1>
                </div>
                <h2 className="mt-6 text-center text-2xl font-bold text-gray-300">
                    {isSignUp ? 'Create your account' : 'Sign in to your account'}
                </h2>

            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="py-10 px-6 sm:px-12 bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {isSignUp && (
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                                    Full Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-700 text-white transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-700 text-white transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete={isSignUp ? "new-password" : "current-password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-700 text-white transition-colors"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        {successMessage && (
                            <div className="rounded-md bg-green-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800">
                                            {successMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                            >
                                {isLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-gray-800 text-gray-400 rounded-full">
                                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={() => {
                                    if (!isSignUp && onGoToPricing) {
                                        onGoToPricing();
                                    } else {
                                        setIsSignUp(!isSignUp);
                                        setError('');
                                    }
                                }}
                                className="w-full flex justify-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none transition-all transform hover:scale-[1.02]"
                            >
                                {isSignUp ? 'Sign In' : 'Create a new account'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};