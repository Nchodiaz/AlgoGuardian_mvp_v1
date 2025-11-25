import React from 'react';


interface LandingFooterProps {
    onLegalClick?: (page: string) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onLegalClick }) => {
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleGoToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleLegalLink = (e: React.MouseEvent<HTMLAnchorElement>, page: string) => {
        e.preventDefault();
        if (onLegalClick) {
            onLegalClick(page);
        }
    };

    return (
        <footer className="bg-gray-800/50 border-t border-gray-700">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <a href="#" onClick={handleGoToTop} className="flex items-center space-x-2">
                            <img src="/logo.svg" alt="AlgoGuardian" className="h-11 w-11" />
                            <span className="text-xl font-bold text-white">AlgoGuardian</span>
                        </a>
                        <p className="mt-4 text-sm text-gray-400">
                            Monitor your trading strategies with statistical confidence.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white tracking-wider uppercase">Product</h4>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#features" onClick={(e) => handleScroll(e, 'features')} className="text-sm text-gray-400 hover:text-white">Features</a></li>
                            <li><a href="#pricing" onClick={(e) => handleScroll(e, 'pricing')} className="text-sm text-gray-400 hover:text-white">Pricing</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white tracking-wider uppercase">Company</h4>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-sm text-gray-400 hover:text-white">About Us</a></li>
                            <li><a href="#" className="text-sm text-gray-400 hover:text-white">Blog</a></li>
                            <li><a href="#" className="text-sm text-gray-400 hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white tracking-wider uppercase">Legal</h4>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" onClick={(e) => handleLegalLink(e, 'privacy-policy')} className="text-sm text-gray-400 hover:text-white">Privacy Policy</a></li>
                            <li><a href="#" onClick={(e) => handleLegalLink(e, 'terms-of-use')} className="text-sm text-gray-400 hover:text-white">Terms of Use</a></li>
                            <li><a href="#" onClick={(e) => handleLegalLink(e, 'disclaimer')} className="text-sm text-gray-400 hover:text-white">Disclaimer</a></li>
                            <li><a href="#" onClick={(e) => handleLegalLink(e, 'cookie-policy')} className="text-sm text-gray-400 hover:text-white">Cookie Policy</a></li>
                            <li><a href="#" onClick={(e) => handleLegalLink(e, 'affiliate-program')} className="text-sm text-gray-400 hover:text-white">Affiliate Program</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} AlgoGuardian. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};