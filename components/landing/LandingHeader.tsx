import React from 'react';


interface LandingHeaderProps {
  onAuthClick: (view: 'login' | 'signup') => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ onAuthClick }) => {
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

  return (
    <header className="sticky top-0 left-0 right-0 z-30 py-4 px-4 sm:px-6 lg:px-8 bg-gray-900/80 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center">
        <a href="#" onClick={handleGoToTop} className="flex items-center gap-1">
          <img src="/logo.svg" alt="AlgoGuardian" className="h-11 w-11" />
          <span className="text-xl font-bold text-white leading-none pt-0.5">AlgoGuardian</span>
        </a>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#pricing" onClick={(e) => handleScroll(e, 'pricing')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Pricing</a>
          <a href="#faq" onClick={(e) => handleScroll(e, 'faq')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center space-x-4">
          <button onClick={() => onAuthClick('login')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Log In
          </button>
          <button onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById('pricing');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }} className="px-4 py-2 text-sm font-medium rounded-md bg-primary-600 hover:bg-primary-700 text-white transition-colors shadow-lg shadow-primary-500/20">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};