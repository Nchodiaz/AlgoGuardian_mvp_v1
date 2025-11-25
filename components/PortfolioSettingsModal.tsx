
import React, { useState, useEffect } from 'react';
import { Portfolio } from '../types';
import { Modal } from './Modal';
import { TrashIcon } from './Icons';

interface PortfolioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: Portfolio | null;
  onSave: (portfolioId: string, settings: { name: string, defaultDriftScoreThreshold: number }) => void;
  onDelete: (portfolioId: string) => void;
}

const inputStyles = "appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-700 text-white";

export const PortfolioSettingsModal: React.FC<PortfolioSettingsModalProps> = ({ isOpen, onClose, portfolio, onSave, onDelete }) => {
  const [name, setName] = useState('');
  // FIX: Renamed state variable for consistency with the Portfolio type and onSave prop.
  const [defaultDriftScoreThreshold, setDefaultDriftScoreThreshold] = useState(2.0);

  useEffect(() => {
    if (portfolio) {
      setName(portfolio.name);
      setDefaultDriftScoreThreshold(portfolio.defaultDriftScoreThreshold || 2.0);
    }
  }, [portfolio]);

  const handleSave = () => {
    if (portfolio) {
      onSave(portfolio.id, { name, defaultDriftScoreThreshold: defaultDriftScoreThreshold });
    }
  };
  
  const handleDelete = () => {
    if (portfolio) {
        onDelete(portfolio.id);
    }
  };

  if (!portfolio) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Settings for ${portfolio.name}`}>
      <div className="space-y-6">
        <div>
          <label htmlFor="portfolioName" className="block text-sm font-medium text-gray-300">
            Portfolio Name
          </label>
          <input
            id="portfolioName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${inputStyles} mt-1`}
          />
        </div>
        <div>
          <label htmlFor="defaultDriftThreshold" className="block text-sm font-medium text-gray-300">
            Default Drift Score Alert Threshold
          </label>
           <p className="text-xs text-gray-400 mb-2">
            This default threshold applies to all strategies in this portfolio.
          </p>
          <input
            id="defaultDriftThreshold"
            type="number"
            step="0.1"
            value={defaultDriftScoreThreshold}
            onChange={(e) => setDefaultDriftScoreThreshold(parseFloat(e.target.value) || 0)}
            className={inputStyles}
          />
        </div>

        <div className="border-t border-gray-700 pt-6">
           <h4 className="text-md font-semibold text-red-400">Danger Zone</h4>
           <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex justify-between items-center">
                <div>
                    <p className="font-semibold text-gray-200">Delete this portfolio</p>
                    <p className="text-sm text-gray-400">Once deleted, it cannot be recovered.</p>
                </div>
                <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center"
                >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete Portfolio
                </button>
           </div>
        </div>
      </div>
       <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-500 text-white">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium rounded-md bg-primary-600 hover:bg-primary-700 text-white">
            Save Changes
          </button>
        </div>
    </Modal>
  );
};
