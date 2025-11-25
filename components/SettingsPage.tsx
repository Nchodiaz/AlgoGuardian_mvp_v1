import React, { useState, useEffect } from 'react';
import { UserCircleIcon, IdentificationIcon, LockClosedIcon, CreditCardIcon } from './Icons';
import { authApi, subscriptionApi } from '../services/realApi';
import { Modal } from './Modal';

export const SettingsPage: React.FC<{ initialTab?: 'profile' | 'subscription' }> = ({ initialTab = 'profile' }) => {
    const inputStyles = "appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-700 text-white";

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<{ email: string; plan: string; cardLast4?: string; cardBrand?: string } | null>(null);
    const [email, setEmail] = useState('');
    const [activeTab, setActiveTab] = useState<'profile' | 'subscription'>(initialTab);

    // Profile State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Subscription State
    const [invoices, setInvoices] = useState<any[]>([]);
    const [showCardForm, setShowCardForm] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');
    const [subMessage, setSubMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await authApi.getMe();
                setUser(userData as any);
                setEmail(userData.email);

                if (activeTab === 'subscription') {
                    const invs = await subscriptionApi.getInvoices();
                    setInvoices(invs);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [activeTab]);

    const handleUpdateProfile = async () => {
        setProfileMessage(null);
        try {
            await authApi.updateProfile({ email });
            setProfileMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (error: any) {
            setProfileMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        }
    };

    const handleUpdatePassword = async () => {
        setPasswordMessage(null);
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        try {
            await authApi.updatePassword({ currentPassword, newPassword });
            setPasswordMessage({ type: 'success', text: 'Password updated successfully' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setPasswordMessage({ type: 'error', text: error.message || 'Failed to update password' });
        }
    };

    const handleUpdatePlan = async (newPlan: string) => {
        setSubMessage(null);
        try {
            const updatedUser = await subscriptionApi.updatePlan(newPlan);
            setUser(updatedUser as any);
            setSubMessage({ type: 'success', text: `Successfully switched to ${newPlan} plan` });
        } catch (error: any) {
            setSubMessage({ type: 'error', text: error.message || 'Failed to update plan' });
        }
    };

    const handleSaveCard = async () => {
        setSubMessage(null);
        try {
            const updatedUser = await subscriptionApi.updatePaymentMethod({ cardNumber, expiry: cardExpiry, cvc: cardCvc });
            setUser(updatedUser as any);
            setShowCardForm(false);
            setCardNumber('');
            setCardExpiry('');
            setCardCvc('');
            setSubMessage({ type: 'success', text: 'Payment method updated successfully' });
        } catch (error: any) {
            setSubMessage({ type: 'error', text: error.message || 'Failed to update payment method' });
        }
    };

    if (isLoading) {
        return <div className="text-center py-12 text-gray-400">Loading settings...</div>;
    }

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="border-b border-gray-700 mb-8">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`whitespace-nowrap flex items-center py-3 px-4 border-b-2 font-medium text-sm ${activeTab === 'profile'
                            ? 'border-primary-500 text-primary-400 bg-gray-800/50 rounded-t-lg'
                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                            }`}
                    >
                        <UserCircleIcon className="-ml-0.5 mr-2 h-5 w-5" />
                        <span>Profile</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('subscription')}
                        className={`whitespace-nowrap flex items-center py-3 px-4 border-b-2 font-medium text-sm ${activeTab === 'subscription'
                            ? 'border-primary-500 text-primary-400 bg-gray-800/50 rounded-t-lg'
                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                            }`}
                    >
                        <CreditCardIcon className="-ml-0.5 mr-2 h-5 w-5" />
                        <span>Subscription</span>
                    </button>
                </nav>
            </div>

            {activeTab === 'profile' ? (
                <div className="space-y-12">
                    <div className="bg-gray-800/50 p-6 sm:p-8 rounded-lg ring-1 ring-white/10">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center"><IdentificationIcon className="h-6 w-6 mr-3 text-primary-400" />User Profile</h3>
                            <p className="text-sm text-gray-400 mt-1">Manage your personal information.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Plan</label>
                                <div className="mt-1 px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-400 capitalize">
                                    {user?.plan || 'Free'}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className={`${inputStyles} mt-1`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        {profileMessage && (
                            <div className={`mt-4 text-sm ${profileMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {profileMessage.text}
                            </div>
                        )}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleUpdateProfile}
                                className="px-4 py-2 text-sm font-medium rounded-md bg-primary-600 hover:bg-primary-700 text-white"
                            >
                                Save Profile
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 p-6 sm:p-8 rounded-lg ring-1 ring-white/10">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center"><LockClosedIcon className="h-6 w-6 mr-3 text-primary-400" />Change Password</h3>
                            <p className="text-sm text-gray-400 mt-1">Update your password for enhanced security.</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">Current Password</label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    className={`${inputStyles} mt-1`}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">New Password</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        className={`${inputStyles} mt-1`}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirm New Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        className={`${inputStyles} mt-1`}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        {passwordMessage && (
                            <div className={`mt-4 text-sm ${passwordMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {passwordMessage.text}
                            </div>
                        )}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleUpdatePassword}
                                className="px-4 py-2 text-sm font-medium rounded-md bg-primary-600 hover:bg-primary-700 text-white"
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Plan Management */}
                    <div className="bg-gray-800/50 p-6 sm:p-8 rounded-lg ring-1 ring-white/10">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center"><IdentificationIcon className="h-6 w-6 mr-3 text-primary-400" />Current Plan</h3>
                            <p className="text-sm text-gray-400 mt-1">Manage your subscription tier.</p>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                            <div>
                                <div className="text-lg font-medium text-white capitalize">{user?.plan || 'Free'} Plan</div>
                                <div className="text-sm text-gray-400">
                                    {user?.plan === 'free' ? 'Basic features' : user?.plan === 'premium' ? 'Advanced features' : 'All features unlocked'}
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                {user?.plan !== 'free' && (
                                    <button
                                        onClick={() => handleUpdatePlan('free')}
                                        className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white border border-gray-600 rounded hover:bg-gray-700"
                                    >
                                        Downgrade to Free
                                    </button>
                                )}
                                {user?.plan !== 'premium' && (
                                    <button
                                        onClick={async () => {
                                            if (user?.plan === 'pro') {
                                                handleUpdatePlan('premium');
                                            } else {
                                                try {
                                                    await subscriptionApi.recordUpgradeAttempt();
                                                } catch (e) {
                                                    console.error('Failed to record lead', e);
                                                }
                                                setIsComingSoonModalOpen(true);
                                            }
                                        }}
                                        className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 rounded hover:bg-primary-700"
                                    >
                                        {user?.plan === 'pro' ? 'Downgrade to Premium' : 'Upgrade to Premium'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-gray-800/50 p-6 sm:p-8 rounded-lg ring-1 ring-white/10">
                        <div className="mb-6 flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-white flex items-center"><CreditCardIcon className="h-6 w-6 mr-3 text-primary-400" />Payment Method</h3>
                                <p className="text-sm text-gray-400 mt-1">Manage your billing details.</p>
                            </div>
                            {!showCardForm && (
                                <button
                                    onClick={() => setShowCardForm(true)}
                                    className="text-sm text-primary-400 hover:text-primary-300"
                                >
                                    {user?.cardLast4 ? 'Update Card' : 'Add Card'}
                                </button>
                            )}
                        </div>

                        {showCardForm ? (
                            <div className="space-y-4 bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Card Number</label>
                                    <input
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        className={`${inputStyles} mt-1`}
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">Expiry</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            className={`${inputStyles} mt-1`}
                                            value={cardExpiry}
                                            onChange={(e) => setCardExpiry(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">CVC</label>
                                        <input
                                            type="text"
                                            placeholder="123"
                                            className={`${inputStyles} mt-1`}
                                            value={cardCvc}
                                            onChange={(e) => setCardCvc(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 mt-4">
                                    <button
                                        onClick={() => setShowCardForm(false)}
                                        className="px-3 py-1.5 text-sm text-gray-400 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveCard}
                                        className="px-4 py-1.5 text-sm font-medium text-white bg-primary-600 rounded hover:bg-primary-700"
                                    >
                                        Save Card
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                                <div className="h-10 w-16 bg-gray-600 rounded flex items-center justify-center text-xs text-gray-400 mr-4">
                                    {user?.cardBrand || 'CARD'}
                                </div>
                                <div>
                                    {user?.cardLast4 ? (
                                        <>
                                            <div className="text-white font-medium">•••• •••• •••• {user.cardLast4}</div>
                                            <div className="text-xs text-gray-400">Expires 12/25</div>
                                        </>
                                    ) : (
                                        <div className="text-gray-400 italic">No payment method added</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Invoices */}
                    <div className="bg-gray-800/50 p-6 sm:p-8 rounded-lg ring-1 ring-white/10">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center">Billing History</h3>
                        </div>
                        <div className="overflow-hidden rounded-lg border border-gray-700">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Plan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {invoices.length > 0 ? (
                                        invoices.map((inv) => (
                                            <tr key={inv.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {new Date(inv.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{inv.plan}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    ${(inv.amount / 100).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {inv.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                                No invoices found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {subMessage && (
                        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-lg shadow-lg ${subMessage.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                            }`}>
                            {subMessage.text}
                        </div>
                    )}
                    <Modal
                        isOpen={isComingSoonModalOpen}
                        onClose={() => setIsComingSoonModalOpen(false)}
                        title="Coming Soon"
                    >
                        <div className="text-gray-300">
                            <p className="mb-4">
                                The Premium plan is currently open to <span className="text-primary-400 font-semibold">internal beta testers only</span>.
                            </p>
                            <p className="mb-4">
                                We have added you to our <span className="text-white font-semibold">priority waiting list</span>.
                                You will be notified as soon as we open new spots!
                            </p>
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setIsComingSoonModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium rounded-md bg-primary-600 hover:bg-primary-700 text-white"
                                >
                                    Got it
                                </button>
                            </div>
                        </div>
                    </Modal>
                </div>
            )}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};
