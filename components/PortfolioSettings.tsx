import React, { useState, useEffect } from 'react';
import { Portfolio, MetricRule } from '../types';
import { TrashIcon, PlusIcon, InformationCircleIcon } from './Icons';
import { DASHBOARD_AVAILABLE_METRICS } from '../services/api';

interface PortfolioSettingsProps {
  portfolio: Portfolio;
  onSave: (portfolioId: string, settings: { name: string, metricRules: MetricRule[], initialBalance?: number }) => void;
  onDelete: (portfolioId: string) => void;
}

const inputStyles = "appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-700 text-white";

export const PortfolioSettings: React.FC<PortfolioSettingsProps> = ({ portfolio, onSave, onDelete }) => {
  const [name, setName] = useState('');
  const [initialBalance, setInitialBalance] = useState<string>('10000');
  const [rules, setRules] = useState<MetricRule[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const [prevPortfolioId, setPrevPortfolioId] = useState<string | null>(null);

  useEffect(() => {
    if (portfolio && portfolio.id !== prevPortfolioId) {
      setName(portfolio.name);
      setInitialBalance(portfolio.initialBalance?.toString() || '10000');
      setRules(portfolio.metricRules || []);
      setIsDirty(false);
      setPrevPortfolioId(portfolio.id);
    }
  }, [portfolio, prevPortfolioId]);

  useEffect(() => {
    if (portfolio) {
      const nameChanged = name !== portfolio.name;
      const balanceChanged = parseFloat(initialBalance) !== (portfolio.initialBalance || 10000);
      const rulesChanged = JSON.stringify(rules) !== JSON.stringify(portfolio.metricRules || []);
      setIsDirty(nameChanged || rulesChanged || balanceChanged);
    }
  }, [name, rules, initialBalance, portfolio]);

  const handleSave = () => {
    onSave(portfolio.id, { name, metricRules: rules, initialBalance: parseFloat(initialBalance) });
    setIsDirty(false);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const handleDelete = () => {
    onDelete(portfolio.id);
  };

  const handleRuleChange = (index: number, field: keyof MetricRule, value: any) => {
    const newRules = [...rules];
    // Handle NaN for numeric fields
    if ((field === 'alertThreshold' || field === 'deactivationThreshold') && isNaN(value)) {
      (newRules[index] as any)[field] = 0;
    } else {
      (newRules[index] as any)[field] = value;
    }
    setRules(newRules);
  };

  const handleAddRule = (metricId: string) => {
    if (metricId && !rules.find(r => r.metricId === metricId)) {
      const metric = DASHBOARD_AVAILABLE_METRICS.find(m => m.id === metricId);
      if (metric) {
        setRules([...rules, {
          metricId: metric.id,
          name: metric.name,
          alertThreshold: 20,
          deactivationThreshold: 40,
          isAlerting: true,
        }]);
      }
    }
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const availableMetricsToAdd = DASHBOARD_AVAILABLE_METRICS.filter(
    (m) => !rules.some((r) => r.metricId === m.id)
  );


  return (
    <div className="bg-gray-800/50 rounded-lg p-6 ring-1 ring-white/10 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-white">Portfolio Settings</h3>
        {showSavedMessage && <p className="text-sm text-green-400 animate-fade-out">Changes saved!</p>}
      </div>
      <div className="space-y-8">
        <div>
          <label htmlFor="portfolioName" className="block text-sm font-medium text-gray-300 mb-1">
            Portfolio Name
          </label>
          <input
            id="portfolioName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${inputStyles} max-w-sm`}
          />
        </div>
        <div>
          <label htmlFor="initialBalance" className="block text-sm font-medium text-gray-300 mb-1">
            Initial Account Size ($)
          </label>
          <input
            id="initialBalance"
            type="number"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
            className={`${inputStyles} max-w-sm`}
            placeholder="10000"
          />
          <p className="text-xs text-gray-500 mt-1">This value will be used as the starting balance for all portfolio visualizations.</p>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h4 className="text-md font-semibold text-gray-100">Metric Alert Rules</h4>
          <p className="text-sm text-gray-400 mt-1">
            Define deviation thresholds for individual metrics. Deviations are calculated as the absolute percentage change from Backtest to Real-Time values.
          </p>

          <div className="mt-4 space-y-3">
            {rules.map((rule, index) => (
              <div key={rule.metricId} className="grid grid-cols-12 gap-x-4 items-center p-3 bg-gray-700/30 rounded-md">
                <div className="col-span-3">
                  <p className="font-semibold text-white">{rule.name}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-400">Alert (%)</label>
                  <input type="number" value={rule.alertThreshold} onChange={e => handleRuleChange(index, 'alertThreshold', parseFloat(e.target.value))} className={`${inputStyles} text-center`} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-400">Deactivate (%)</label>
                  <input type="number" value={rule.deactivationThreshold} onChange={e => handleRuleChange(index, 'deactivationThreshold', parseFloat(e.target.value))} className={`${inputStyles} text-center`} />
                </div>
                <div className="col-span-3 flex items-center justify-center">
                  <label htmlFor={`isAlerting-${index}`} className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" id={`isAlerting-${index}`} className="sr-only" checked={rule.isAlerting} onChange={e => handleRuleChange(index, 'isAlerting', e.target.checked)} />
                      <div className={`block w-10 h-6 rounded-full ${rule.isAlerting ? 'bg-primary-600' : 'bg-gray-600'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${rule.isAlerting ? 'transform translate-x-full' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-sm text-gray-300">Trigger Alert</div>
                  </label>
                </div>
                <div className="col-span-2 flex justify-end">
                  <button onClick={() => handleRemoveRule(index)} className="p-2 text-gray-400 hover:text-red-400 rounded-md hover:bg-red-500/10">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {availableMetricsToAdd.length > 0 && (
            <div className="mt-4 flex items-center gap-4">
              <select onChange={(e) => { handleAddRule(e.target.value); e.target.value = ''; }} className={`${inputStyles} max-w-xs`}>
                <option value="">Add metric rule...</option>
                {availableMetricsToAdd.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          )}
        </div>

        {isDirty && (
          <div className="flex justify-end border-t border-gray-700 pt-6">
            <button onClick={handleSave} className="px-4 py-2 text-sm font-medium rounded-md bg-primary-600 hover:bg-primary-700 text-white">
              Save Changes
            </button>
          </div>
        )}

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
      <style>{`
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          .animate-fade-out {
            animation: fadeOut 3s ease-out forwards;
          }
        `}</style>
    </div>
  );
};