
import React, { useState } from 'react';
import { Portfolio } from '../types';
import { PlusIcon, FolderIcon, CogIcon, UserCircleIcon, LogoutIcon, ArrowLeftIcon } from './Icons';

interface SidebarProps {
  portfolios: Portfolio[];
  selectedPortfolioId: string;
  onSelectPortfolio: (id: string) => void;
  onCreatePortfolio: (name: string) => void;
  onLogout: () => void;
  onClose: () => void;
  onSelectSettings: () => void;
  mainView: 'dashboard' | 'settings';
}

export const Sidebar: React.FC<SidebarProps> = ({ portfolios, selectedPortfolioId, onSelectPortfolio, onCreatePortfolio, onLogout, onClose, onSelectSettings, mainView }) => {
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    if (newPortfolioName.trim()) {
      onCreatePortfolio(newPortfolioName.trim());
      setNewPortfolioName('');
      setIsCreating(false);
    }
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 border-r border-gray-700 flex flex-col animate-slide-in">
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center">
          <img src="/logo.svg" alt="AlgoGuardian" className="h-11 w-11" />
          <h1 className="text-xl font-bold ml-2 text-white">AlgoGuardian</h1>
        </div>
        <button onClick={onClose} title="Hide Menu" className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <h2 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Portfolios</h2>
        {portfolios.map(p => (
          <a
            key={p.id}
            href="#"
            onClick={(e) => { e.preventDefault(); onSelectPortfolio(p.id); }}
            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md group ${mainView === 'dashboard' && selectedPortfolioId === p.id ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
          >
            <FolderIcon className={`mr-3 h-6 w-6 ${mainView === 'dashboard' && selectedPortfolioId === p.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`} />
            {p.name}
          </a>
        ))}
        {isCreating ? (
          <div className="p-2">
            <input
              type="text"
              value={newPortfolioName}
              onChange={(e) => setNewPortfolioName(e.target.value)}
              placeholder="New portfolio name"
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded-md text-sm text-white focus:ring-primary-500 focus:border-primary-500"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button onClick={() => setIsCreating(false)} className="px-2 py-1 text-xs rounded bg-gray-600 hover:bg-gray-500">Cancel</button>
              <button onClick={handleCreate} className="px-2 py-1 text-xs rounded bg-primary-600 hover:bg-primary-700 text-white">Create</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center w-full mt-2 px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white group"
          >
            <PlusIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
            New Portfolio
          </button>
        )}
      </nav>
      <div className="px-2 py-4 mt-auto border-t border-gray-700">
        <button onClick={onSelectSettings} className={`flex items-center w-full px-2 py-2 text-sm font-medium rounded-md group ${mainView === 'settings' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
          <CogIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
          Settings
        </button>
        <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white group">
          <LogoutIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
          Log Out
        </a>
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in { animation: slideIn 0.2s ease-out forwards; }
      `}</style>
    </aside>
  );
};
