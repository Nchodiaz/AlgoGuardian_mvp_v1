import { Portfolio, Strategy } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Auth token management
let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string | null) => {
    authToken = token;
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.removeItem('authToken');
    }
};

export const getAuthToken = () => authToken;

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const headers: HeadersInit = {
        ...options.headers,
    };

    if (authToken && !options.headers?.hasOwnProperty('Authorization')) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
};

// Auth API
export const authApi = {
    register: async (email: string, password: string, plan?: string, isPotentialLead?: boolean): Promise<{ token: string; user: { id: string; email: string } }> => {
        const data = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, plan, isPotentialLead }),
        });
        setAuthToken(data.token);
        return data;
    },

    login: async (email: string, password: string): Promise<{ token: string; user: { id: string; email: string } }> => {
        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        setAuthToken(data.token);
        return data;
    },

    logout: () => {
        setAuthToken(null);
    },

    getMe: async (): Promise<{ id: string; email: string; plan: string }> => {
        return apiCall('/auth/me');
    },

    updateProfile: async (data: { email: string }): Promise<{ id: string; email: string; plan: string }> => {
        return apiCall('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    updatePassword: async (data: { currentPassword: string; newPassword: string }): Promise<{ success: boolean }> => {
        return apiCall('/auth/password', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
};

// Subscription API
export const subscriptionApi = {
    updatePlan: async (plan: string): Promise<{ id: string; email: string; plan: string }> => {
        return apiCall('/subscription/plan', {
            method: 'PUT',
            body: JSON.stringify({ plan }),
        });
    },

    updatePaymentMethod: async (data: { cardNumber: string; cvc: string; expiry: string }): Promise<{ id: string; cardLast4: string; cardBrand: string }> => {
        return apiCall('/subscription/payment-method', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    getInvoices: async (): Promise<any[]> => {
        return apiCall('/subscription/invoices');
    },

    recordUpgradeAttempt: async (): Promise<{ message: string }> => {
        return apiCall('/subscription/upgrade-attempt', {
            method: 'POST',
        });
    },
};

// Portfolio API
export const portfolioApi = {
    getPortfolios: (): Promise<Portfolio[]> => {
        return apiCall('/portfolios');
    },

    createPortfolio: (name: string): Promise<Portfolio> => {
        return apiCall('/portfolios', {
            method: 'POST',
            body: JSON.stringify({ name }),
        });
    },

    updatePortfolio: (id: string, data: Partial<Portfolio>): Promise<Portfolio> => {
        return apiCall(`/portfolios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deletePortfolio: (id: string): Promise<{ success: boolean }> => {
        return apiCall(`/portfolios/${id}`, {
            method: 'DELETE',
        });
    },
};

// Strategy API
export const strategyApi = {
    getStrategies: (portfolioId: string): Promise<Strategy[]> => {
        return apiCall(`/strategies/portfolio/${portfolioId}`);
    },

    getStrategyById: (id: string): Promise<Strategy> => {
        return apiCall(`/strategies/${id}`);
    },

    uploadStrategy: async (
        portfolioId: string,
        backtestFile: File,
        realtimeFile: File,
        metadata: {
            name?: string;
            symbol?: string;
            timeframe?: string;
            typology?: string;
            extractionType?: string;
        }
    ): Promise<{ success: boolean; strategy: Strategy; message: string }> => {
        const formData = new FormData();
        formData.append('backtest', backtestFile);
        formData.append('realtime', realtimeFile);

        if (metadata.name) formData.append('name', metadata.name);
        if (metadata.symbol) formData.append('symbol', metadata.symbol);
        if (metadata.timeframe) formData.append('timeframe', metadata.timeframe);
        if (metadata.typology) formData.append('typology', metadata.typology);
        if (metadata.extractionType) formData.append('extractionType', metadata.extractionType);

        return apiCall(`/strategies/portfolio/${portfolioId}/upload`, {
            method: 'POST',
            body: formData,
        });
    },

    updateStrategy: (id: string, data: Partial<Strategy>): Promise<Strategy> => {
        return apiCall(`/strategies/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteStrategy: (id: string): Promise<{ success: boolean }> => {
        return apiCall(`/strategies/${id}`, {
            method: 'DELETE',
        });
    },
};

// Export constants that are still needed
export const AVAILABLE_METRICS = [
    { id: 'profit_factor', name: 'Profit Factor' },
    { id: 'ret_dd_ratio', name: 'Ret/DD' },
    { id: 'avg_trade', name: 'Avg. Trade' },
    { id: 'max_drawdown', name: 'Max DD' },
    { id: 'stagnation_days', name: 'Stagnation' },
    { id: 'win_rate', name: 'Winrate' },
    { id: 'net_profit', name: 'Net Profit' },
    { id: 'num_trades', name: 'Nº Trades' },
];

export const DASHBOARD_METRIC_IDS = [
    'net_profit',
    'num_trades',
    'profit_factor',
    'ret_dd_ratio',
    'avg_trade',
    'max_drawdown',
    'win_rate',
    'stagnation_days',
];

export const DASHBOARD_AVAILABLE_METRICS = AVAILABLE_METRICS.filter(m => DASHBOARD_METRIC_IDS.includes(m.id));
