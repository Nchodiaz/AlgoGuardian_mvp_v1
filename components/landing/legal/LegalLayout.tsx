import React from 'react';

interface LegalLayoutProps {
    children: React.ReactNode;
    activePage: string;
    onNavigate: (page: string) => void;
    onBackToHome: () => void;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({ children, activePage, onNavigate, onBackToHome }) => {
    const menuItems = [
        { id: 'privacy-policy', label: 'Privacy Policy' },
        { id: 'terms-of-use', label: 'Terms of Use' },
        { id: 'disclaimer', label: 'Disclaimer' },
        { id: 'cookie-policy', label: 'Cookie Policy' },
        { id: 'affiliate-program', label: 'Affiliate Program' },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-300 font-sans">
            {/* Header */}
            <header className="sticky top-0 left-0 right-0 z-30 py-4 px-4 sm:px-6 lg:px-8 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
                <div className="container mx-auto flex justify-between items-center">
                    <a href="#" onClick={(e) => { e.preventDefault(); onBackToHome(); }} className="flex items-center space-x-2">
                        <img src="/logo.svg" alt="AlgoGuardian" className="h-8 w-8" />
                        <span className="text-xl font-bold text-white">AlgoGuardian</span>
                    </a>
                    <button onClick={onBackToHome} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        Back to Home
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <nav className="sticky top-24 space-y-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${activePage === item.id
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content */}
                <main className="flex-1 min-w-0">
                    <div className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/50">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
