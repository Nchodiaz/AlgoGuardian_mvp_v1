import React, { useMemo } from 'react';
import { Strategy, Metric, StrategyStatus, Portfolio, MetricRule } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { ArrowLeftIcon, ExclamationIcon, CheckCircleIcon, BanIcon, InformationCircleIcon } from './Icons';
import { DASHBOARD_METRIC_IDS } from '../services/api';

interface StrategyDetailProps {
  portfolio: Portfolio;
  strategy: Strategy;
  onBack: () => void;
}

const statusInfo = {
  [StrategyStatus.Ok]: {
    icon: <CheckCircleIcon className="h-6 w-6 text-green-400" />,
    title: 'OK',
    text: 'Performing as expected',
    color: 'text-green-400',
  },
  [StrategyStatus.Alert]: {
    icon: <ExclamationIcon className="h-6 w-6 text-yellow-400" />,
    title: 'Alert',
    text: 'Drift detected, review recommended',
    color: 'text-yellow-400',
  },
  [StrategyStatus.Deactivated]: {
    icon: <BanIcon className="h-6 w-6 text-red-400" />,
    title: 'Deactivated',
    text: 'Deactivated due to critical deviation',
    color: 'text-red-400',
  },
  [StrategyStatus.NoTrigger]: {
    icon: <InformationCircleIcon className="h-6 w-6 text-gray-400" />,
    title: 'No Trigger',
    text: 'No alert rules configured',
    color: 'text-gray-400',
  },
};



const MetricCard: React.FC<{ metric: Metric, rules: MetricRule[] }> = ({ metric, rules }) => {
  const bt = parseFloat(metric.backtestValue as string);
  const rt = parseFloat(metric.realtimeValue as string);

  const percentageChange = (!isNaN(bt) && !isNaN(rt) && bt !== 0) ? ((rt - bt) / Math.abs(bt)) * 100 : 0;

  let deviation = 0;
  if (isLowerBetter) {
    // For "lower is better" (e.g. DD), only count if value increased (worsened)
    if (percentageChange > 0) {
      deviation = percentageChange;
    }
  } else {
    // For "higher is better" (e.g. Profit), only count if value decreased (worsened)
    if (percentageChange < 0) {
      deviation = Math.abs(percentageChange);
    }
  }

  let ringClasses = 'ring-1 ring-white/10';
  if (rule && rule.isAlerting) {
    if (deviation >= rule.deactivationThreshold) {
      ringClasses = 'ring-2 ring-red-500';
    } else if (deviation >= rule.alertThreshold) {
      ringClasses = 'ring-2 ring-yellow-400';
    }
  }

  const renderValue = (valStr: string | number, unit: string) => {
    if (unit === '$') return `${valStr}$`;
    if (unit === 'days') return `${valStr}days`;
    return valStr;
  };

  return (
    <div className={`bg-gray-800 p-4 rounded-lg flex flex-col justify-between h-32 ${ringClasses}`}>
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-gray-200 text-base">{metric.name}</h4>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">{renderValue(metric.realtimeValue, metric.unit)}</p>
          {metric.realtimeValueAlt && (
            <p className="text-sm text-gray-400 mt-1">{metric.realtimeValueAlt}%</p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-end mt-auto">
        <div className="flex items-center space-x-2">
          {/* Drift label removed */}
        </div>
        <div className="flex items-baseline space-x-2 text-right">
          <div className="text-right">
            <p className="text-xs text-gray-400" title={`Backtest Value: ${renderValue(metric.backtestValue, metric.unit)}`}>
              BT: {renderValue(metric.backtestValue, metric.unit)}
            </p>
            {metric.backtestValueAlt && (
              <p className="text-xs text-gray-500">{metric.backtestValueAlt}%</p>
            )}
          </div>
          <p className={`text-sm font-semibold ${diffColor}`}>
            {diff >= 0 ? '▲' : '▼'} {Math.abs(diff).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};


export const StrategyDetail: React.FC<StrategyDetailProps> = ({ portfolio, strategy: rawStrategy, onBack }) => {
  const strategy = useMemo(() => {
    let metrics = rawStrategy.metrics;
    if (typeof metrics === 'string') {
      try { metrics = JSON.parse(metrics); } catch (e) { metrics = []; }
    }
    if (!Array.isArray(metrics)) metrics = [];

    let pnlCurve = rawStrategy.pnlCurve;
    if (typeof pnlCurve === 'string') {
      try { pnlCurve = JSON.parse(pnlCurve); } catch (e) { pnlCurve = []; }
    }
    if (!Array.isArray(pnlCurve)) pnlCurve = [];

    return { ...rawStrategy, metrics, pnlCurve };
  }, [rawStrategy]);

  const dashboardMetrics = DASHBOARD_METRIC_IDS.map(id => strategy.metrics.find(m => m.id === id)).filter(Boolean) as Metric[];
  const rules = portfolio.metricRules || [];



  const pnlCurveData = useMemo(() => {
    if (!strategy.pnlCurve) return [];
    return [...strategy.pnlCurve].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [strategy.pnlCurve]);

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center text-sm text-primary-400 hover:text-primary-300 font-medium">
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Portfolio
      </button>

      {/* Header */}
      <div className="bg-gray-800 p-6 rounded-lg flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex-1 space-y-3">
          {/* First Row: Magic Number and Name */}
          <div className="flex items-baseline gap-4 flex-wrap">
            <h2 className="text-2xl font-bold text-white">Magic Number: {strategy.magicNumber}</h2>
            {strategy.name && (
              <p className="text-lg text-gray-300">
                <span className="text-gray-500">Name:</span> {strategy.name}
              </p>
            )}
          </div>

          {/* Second Row: Symbol/Timeframe and Badges */}
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-gray-400">{strategy.symbol} / {strategy.timeframe}</p>
            {strategy.typology && (
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                {strategy.typology}
              </span>
            )}
            {strategy.extractionType && (
              <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">
                {strategy.extractionType}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg">
          {statusInfo[strategy.status].icon}
          <div >
            <p className={`font-semibold ${statusInfo[strategy.status].color}`}>{statusInfo[strategy.status].title}</p>
            <p className="text-sm text-gray-400">{statusInfo[strategy.status].text}</p>
          </div>
        </div>
      </div>

      {/* PNL Curve Chart */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">PNL Curve: Backtest vs. Real-Time</h3>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <AreaChart data={pnlCurveData} margin={{ top: 5, right: 20, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorBT" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRT" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#FBBF24" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ dy: 10 }}
                tickFormatter={(dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                label={{ value: 'Date', position: 'insideBottom', offset: -10, fill: '#9CA3AF', fontSize: 12 }}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} domain={['dataMin - 1000', 'dataMax + 1000']} tickFormatter={(tick) => `$${Math.round(tick / 1000)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                formatter={(value: number, name: string) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, name]}
                // FIX: The `recharts` library types the `label` parameter as `any` or `unknown`.
                // Explicitly typing it as `any` aligns with the library and resolves the error.
                labelFormatter={(label: any) => new Date(label).toLocaleDateString()}
                labelStyle={{ color: '#D1D5DB' }}
              />
              <Legend wrapperStyle={{ fontSize: "14px" }} />
              <Area type="monotone" dataKey="Backtest" stroke="#60A5FA" strokeWidth={2} fillOpacity={1} fill="url(#colorBT)" />
              <Area type="monotone" dataKey="Real Time" stroke="#FBBF24" strokeWidth={2} fillOpacity={1} fill="url(#colorRT)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>



      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dashboardMetrics.map(metric => <MetricCard key={metric.id} metric={metric} rules={rules} />)}
      </div>
    </div>
  );
};