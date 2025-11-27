
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PortfolioView } from './components/PortfolioView';
import { Portfolio, Strategy, MetricRule } from './types';
import { portfolioApi, strategyApi, authApi, subscriptionApi, getAuthToken } from './services/realApi';
import { Auth } from './components/Auth';
import { StrategySettingsModal } from './components/StrategySettingsModal';
import { Modal } from './components/Modal';
import { ExclamationIcon } from './components/Icons';
import { SettingsPage } from './components/SettingsPage';
import { LandingPage } from './components/landing/LandingPage';

import { VerifyEmailPage } from './components/VerifyEmailPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(window.location.pathname === '/verify-email' || window.location.pathname === '/verify');
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(undefined);
  const [selectedIsPotentialLead, setSelectedIsPotentialLead] = useState(false);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStrategySettingsOpen, setIsStrategySettingsOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [strategyToDelete, setStrategyToDelete] = useState<Strategy | null>(null);
  const [isConfirmDeletePortfolioOpen, setIsConfirmDeletePortfolioOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mainView, setMainView] = useState<'dashboard' | 'settings'>('dashboard');
  const [settingsTab, setSettingsTab] = useState<'profile' | 'subscription'>('profile');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchedPortfolios = await portfolioApi.getPortfolios();
        setPortfolios(fetchedPortfolios);
        if (fetchedPortfolios.length > 0) {
          setSelectedPortfolio(fetchedPortfolios[0]);
        } else {
          setSelectedPortfolio(null);
        }
      } catch (error) {
        console.error('Failed to fetch portfolios:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedPortfolio && isAuthenticated) {
      const fetchStrategies = async () => {
        setIsLoading(true);
        try {
          const fetchedStrategies = await strategyApi.getStrategies(selectedPortfolio.id);
          setStrategies(fetchedStrategies);
        } catch (error) {
          console.error('Failed to fetch strategies:', error);
        }
        setIsLoading(false);
      };
      fetchStrategies();
    } else {
      setStrategies([]);
    }
  }, [selectedPortfolio, isAuthenticated]);

  const handleSelectPortfolio = (portfolioId: string) => {
    const portfolio = portfolios.find(p => p.id === portfolioId);
    setSelectedPortfolio(portfolio || null);
    setMainView('dashboard');
  };

  const handleCreatePortfolio = async (name: string) => {
    try {
      const newPortfolio = await portfolioApi.createPortfolio(name);
      setPortfolios([...portfolios, newPortfolio]);
      setSelectedPortfolio(newPortfolio);
      setMainView('dashboard');
    } catch (error: any) {
      console.error('Failed to create portfolio:', error);
      if (error.message && error.message.includes('Plan limit reached')) {
        setIsUpgradeModalOpen(true);
      }
    }
  };

  const handleFilesUploaded = async () => {
    if (selectedPortfolio) {
      setIsLoading(true);
      try {
        const fetchedStrategies = await strategyApi.getStrategies(selectedPortfolio.id);
        setStrategies(fetchedStrategies);
      } catch (error) {
        console.error('Failed to refresh strategies:', error);
      }
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const handleOpenAuthModal = (view: 'login' | 'signup', plan?: string, isPotentialLead: boolean = false) => {
    setAuthView(view);
    setSelectedPlan(plan);
    setSelectedIsPotentialLead(isPotentialLead);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    authApi.logout();
    setIsAuthenticated(false);
    setPortfolios([]);
    setSelectedPortfolio(null);
    setStrategies([]);
    setMainView('dashboard');
  };

  const handleDeleteStrategy = (strategyId: string) => {
    const toDelete = strategies.find(s => s.id === strategyId);
    if (toDelete) {
      setStrategyToDelete(toDelete);
      setIsConfirmDeleteOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!strategyToDelete) return;

    try {
      await strategyApi.deleteStrategy(strategyToDelete.id);
      setStrategies(currentStrategies => currentStrategies.filter(s => s.id !== strategyToDelete.id));
    } catch (error) {
      console.error('Failed to delete strategy:', error);
    }

    setIsConfirmDeleteOpen(false);
    setStrategyToDelete(null);
  };

  const handleEditStrategy = (strategy: Strategy) => {
    setEditingStrategy(strategy);
    setIsStrategySettingsOpen(true);
  };

  const handleSavePortfolioSettings = async (portfolioId: string, settings: { name: string, metricRules: MetricRule[] }) => {
    try {
      await portfolioApi.updatePortfolio(portfolioId, settings);

      setPortfolios(portfolios.map(p =>
        p.id === portfolioId ? { ...p, ...settings } : p
      ));

      if (selectedPortfolio && selectedPortfolio.id === portfolioId) {
        setSelectedPortfolio(prev => prev ? { ...prev, ...settings } : null);
        // Reload strategies to recalculate statuses based on new rules
        const fetchedStrategies = await strategyApi.getStrategies(portfolioId);
        setStrategies(fetchedStrategies);
      }
    } catch (error) {
      console.error('Failed to update portfolio:', error);
    }
  };

  const handleDeletePortfolio = (portfolioId: string) => {
    const toDelete = portfolios.find(p => p.id === portfolioId);
    if (toDelete) {
      setPortfolioToDelete(toDelete);
      setIsConfirmDeletePortfolioOpen(true);
    }
  };

  const handleConfirmDeletePortfolio = async () => {
    if (!portfolioToDelete) return;

    try {
      await portfolioApi.deletePortfolio(portfolioToDelete.id);

      const remainingPortfolios = portfolios.filter(p => p.id !== portfolioToDelete.id);
      setPortfolios(remainingPortfolios);

      if (selectedPortfolio && selectedPortfolio.id === portfolioToDelete.id) {
        setSelectedPortfolio(remainingPortfolios.length > 0 ? remainingPortfolios[0] : null);
      }
    } catch (error) {
      console.error('Failed to delete portfolio:', error);
    }

    setIsConfirmDeletePortfolioOpen(false);
    setPortfolioToDelete(null);
  };

  const handleSaveStrategySettings = async (strategyId: string, settings: Partial<Strategy>) => {
    try {
      await strategyApi.updateStrategy(strategyId, settings);
      setStrategies(strategies.map(s =>
        s.id === strategyId ? { ...s, ...settings } : s
      ));
      setIsStrategySettingsOpen(false);
      setEditingStrategy(null);
      console.log('Strategy settings saved!');
    } catch (error) {
      console.error('Failed to update strategy:', error);
    }
  };

  const handleGoToPricing = () => {
    setIsAuthModalOpen(false);
    setTimeout(() => {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (isVerifyingEmail) {
    return (
      <VerifyEmailPage
        onVerificationComplete={() => {
          setIsVerifyingEmail(false);
          setAuthView('login');
          setIsAuthModalOpen(true);
          window.history.pushState({}, '', '/');
        }}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage onAuthClick={handleOpenAuthModal} />
        <Modal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          title=""
          hideTitle={true}
        >
          <Auth
            onAuthSuccess={handleAuthSuccess}
            initialView={authView}
            selectedPlan={selectedPlan}
            isPotentialLead={selectedIsPotentialLead}
            onGoToPricing={handleGoToPricing}
          />
        </Modal>
      </>
    )
  }

  return (
    <>
      <StrategySettingsModal
        isOpen={isStrategySettingsOpen}
        onClose={() => {
          setIsStrategySettingsOpen(false);
          setEditingStrategy(null);
        }}
        strategy={editingStrategy}
        onSave={handleSaveStrategySettings}
      />
      <Modal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        title="Upgrade Plan"
      >
        <div className="text-gray-300">
          <p className="mb-4">You have reached the maximum number of portfolios for your current plan.</p>
          <p className="mb-6">Upgrade to <span className="text-primary-400 font-semibold">Premium</span> to create more portfolios and unlock advanced features.</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsUpgradeModalOpen(false)}
              className="px-4 py-2 text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-500 text-white"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  await subscriptionApi.recordUpgradeAttempt();
                } catch (e) {
                  console.error('Failed to record lead', e);
                }
                setIsUpgradeModalOpen(false);
                setIsComingSoonModalOpen(true);
              }}
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary-600 hover:bg-primary-700 text-white"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isConfirmDeleteOpen}
        onClose={() => {
          setIsConfirmDeleteOpen(false);
          setStrategyToDelete(null);
        }}
        title="Confirm Strategy Deletion"
      >
        <div className="text-gray-300">
          <p>Are you sure you want to permanently delete this strategy?</p>
          {strategyToDelete && (
            <div className="my-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <p><span className="font-semibold text-white">Magic Number:</span> {strategyToDelete.magicNumber}</p>
              <p><span className="font-semibold text-white">Name:</span> {strategyToDelete.name}</p>
              <p><span className="font-semibold text-white">Symbol:</span> {strategyToDelete.symbol}</p>
            </div>
          )}
          <p className="text-sm text-yellow-400 flex items-center">
            <ExclamationIcon className="h-5 w-5 mr-2 flex-shrink-0" />
            This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                setIsConfirmDeleteOpen(false);
                setStrategyToDelete(null);
              }}
              className="px-4 py-2 text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-500 text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isConfirmDeletePortfolioOpen}
        onClose={() => {
          setIsConfirmDeletePortfolioOpen(false);
          setPortfolioToDelete(null);
        }}
        title="Confirm Portfolio Deletion"
      >
        <div className="text-gray-300">
          <p>Are you sure you want to permanently delete this portfolio and all its associated strategies?</p>
          {portfolioToDelete && (
            <div className="my-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <p><span className="font-semibold text-white">Portfolio Name:</span> {portfolioToDelete.name}</p>
            </div>
          )}
          <p className="text-sm text-yellow-400 flex items-center">
            <ExclamationIcon className="h-5 w-5 mr-2 flex-shrink-0" />
            This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                setIsConfirmDeletePortfolioOpen(false);
                setPortfolioToDelete(null);
              }}
              className="px-4 py-2 text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-500 text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDeletePortfolio}
              className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
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
      <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
        {isSidebarOpen && (
          <Sidebar
            portfolios={portfolios}
            selectedPortfolioId={selectedPortfolio?.id || ''}
            onSelectPortfolio={handleSelectPortfolio}
            onCreatePortfolio={handleCreatePortfolio}
            onLogout={handleLogout}
            onClose={() => setIsSidebarOpen(false)}
            onSelectSettings={() => {
              setMainView('settings');
              setSettingsTab('profile');
            }}
            mainView={mainView}
          />
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            portfolioName={mainView === 'settings' ? 'Settings' : selectedPortfolio?.name}
            isSidebarOpen={isSidebarOpen}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onBack={mainView === 'settings' ? () => setMainView('dashboard') : undefined}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4 sm:p-6 lg:p-8">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : mainView === 'settings' ? (
              <SettingsPage initialTab={settingsTab} />
            ) : selectedPortfolio ? (
              <PortfolioView
                portfolio={selectedPortfolio}
                strategies={strategies}
                onFilesUploaded={handleFilesUploaded}
                onDeleteStrategy={handleDeleteStrategy}
                onEditStrategy={handleEditStrategy}
                onSavePortfolio={handleSavePortfolioSettings}
                onDeletePortfolio={handleDeletePortfolio}
                onUpgradeNeeded={() => setIsUpgradeModalOpen(true)}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome to AlgoGuardian</h2>
                  <p className="text-gray-400">Please create or select a portfolio to get started.</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default App;