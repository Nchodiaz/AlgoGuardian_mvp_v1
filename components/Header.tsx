
import React from 'react';
import { BellIcon, CogIcon, MenuIcon, ArrowLeftIcon } from './Icons';

interface HeaderProps {
    portfolioName?: string;
    isSidebarOpen: boolean;
    onOpenSidebar: () => void;
    onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ portfolioName, isSidebarOpen, onOpenSidebar, onBack }) => {
  return (
    <header className="h-16 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0">
      <div className="flex items-center space-x-3">
        {!isSidebarOpen && (
            <button onClick={onOpenSidebar} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none">
                <MenuIcon className="h-6 w-6" />
            </button>
        )}
        {onBack && (
           <button onClick={onBack} title="Back" className="p-2 -ml-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white">
                <ArrowLeftIcon className="h-6 w-6" />
            </button>
        )}
        <div>
            <h1 className="text-xl font-semibold text-white">{portfolioName || 'Overview'}</h1>
            <p className="text-sm text-gray-400">Welcome back, Trader</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};
