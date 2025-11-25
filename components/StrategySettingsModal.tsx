
import React, { useState, useEffect } from 'react';
import { Strategy, StrategyTypology, ExtractionType } from '../types';
import { Modal } from './Modal';

interface StrategySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: Strategy | null;
  onSave: (strategyId: string, settings: Partial<Strategy>) => void;
}

const selectStyles = "appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-700 text-white";
const inputStyles = "appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-700 text-white";


export const StrategySettingsModal: React.FC<StrategySettingsModalProps> = ({ isOpen, onClose, strategy, onSave }) => {
  const [magicNumber, setMagicNumber] = useState(0);
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [typology, setTypology] = useState<StrategyTypology | ''>('');
  const [extractionType, setExtractionType] = useState<ExtractionType | ''>('');

  useEffect(() => {
    if (strategy) {
      setMagicNumber(strategy.magicNumber || 0);
      setName(strategy.name || '');
      setSymbol(strategy.symbol || '');
      setTimeframe(strategy.timeframe || '');
      setTypology(strategy.typology || '');
      setExtractionType(strategy.extractionType || '');
    }
  }, [strategy]);

  const handleSave = () => {
    if (strategy) {
      onSave(strategy.id, { 
          magicNumber,
          name,
          symbol,
          timeframe,
          typology: typology || undefined,
          extractionType: extractionType || undefined,
      });
    }
  };

  if (!strategy) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Settings for Strategy ${strategy.magicNumber}`}>
      <div className="space-y-4">
        <div className="border-t border-gray-700 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                 <label htmlFor="magicNumber" className="block text-sm font-medium text-gray-300 mb-2">
                    Magic Number
                </label>
                <input
                    id="magicNumber"
                    type="number"
                    value={magicNumber}
                    onChange={(e) => setMagicNumber(parseInt(e.target.value, 10) || 0)}
                    className={inputStyles}
                    placeholder="e.g., 1001"
                />
            </div>
            <div>
                 <label htmlFor="strategyName" className="block text-sm font-medium text-gray-300 mb-2">
                    Strategy Name
                </label>
                <input
                    id="strategyName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputStyles}
                    placeholder="e.g., EURUSD Aggressive"
                />
            </div>
            <div>
                 <label htmlFor="symbol" className="block text-sm font-medium text-gray-300 mb-2">
                    Symbol
                </label>
                <input
                    id="symbol"
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className={inputStyles}
                    placeholder="e.g., EURUSD"
                />
            </div>
            <div>
                 <label htmlFor="timeframe" className="block text-sm font-medium text-gray-300 mb-2">
                    Timeframe
                </label>
                <input
                    id="timeframe"
                    type="text"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className={inputStyles}
                    placeholder="e.g., H1, M15, D1"
                />
            </div>
             <div>
                <label htmlFor="typology" className="block text-sm font-medium text-gray-300 mb-2">
                    Typology
                </label>
                <select id="typology" value={typology} onChange={(e) => setTypology(e.target.value as StrategyTypology)} className={selectStyles}>
                    <option value="">Select...</option>
                    {Object.values(StrategyTypology).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="extractionType" className="block text-sm font-medium text-gray-300 mb-2">
                    Extraction Type
                </label>
                <select id="extractionType" value={extractionType} onChange={(e) => setExtractionType(e.target.value as ExtractionType)} className={selectStyles}>
                    <option value="">Select...</option>
                    {Object.values(ExtractionType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
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