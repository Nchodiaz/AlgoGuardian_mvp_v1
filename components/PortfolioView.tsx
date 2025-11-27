import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Portfolio, Strategy, StrategyStatus, MetricRule } from '../types';
import { StrategyDetail } from './StrategyDetail';
import { UploadIcon, StatusOnlineIcon, ExclamationIcon, BanIcon, ChevronRightIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon, ChartPieIcon, CollectionIcon, InformationCircleIcon } from './Icons';
import { strategyApi } from '../services/realApi';
import { PortfolioSettings } from './PortfolioSettings';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';


interface PortfolioViewProps {
    portfolio: Portfolio;
    strategies: Strategy[];
    // FIX: Corrected the type definition for the onFilesUploaded function.
    onFilesUploaded: () => void;
    onDeleteStrategy: (strategyId: string) => void;
    onEditStrategy: (strategy: Strategy) => void;
    onSavePortfolio: (portfolioId: string, settings: { name: string; metricRules: MetricRule[] }) => void;
    onDeletePortfolio: (portfolioId: string) => void;
    onUpgradeNeeded: () => void;
}

const statusStyles = {
    [StrategyStatus.Ok]: {
        icon: <StatusOnlineIcon className="h-5 w-5 text-green-400" />,
        bgColor: 'bg-green-500/10',
        textColor: 'text-green-400',
        ringColor: 'ring-green-500/20',
    },
    [StrategyStatus.Alert]: {
        icon: <ExclamationIcon className="h-5 w-5 text-yellow-400" />,
        bgColor: 'bg-yellow-500/10',
        textColor: 'text-yellow-400',
        ringColor: 'ring-yellow-500/20',
    },
    [StrategyStatus.Deactivated]: {
        icon: <BanIcon className="h-5 w-5 text-red-400" />,
        bgColor: 'bg-red-500/10',
        textColor: 'text-red-400',
        ringColor: 'ring-red-500/20',
    },
    [StrategyStatus.NoTrigger]: {
        icon: <InformationCircleIcon className="h-5 w-5 text-gray-400" />,
        bgColor: 'bg-gray-500/10',
        textColor: 'text-gray-400',
        ringColor: 'ring-gray-500/20',
    },
};

const FileUploader: React.FC<{ portfolio: Portfolio; onUpload: () => void; onUpgradeNeeded: () => void }> = ({ portfolio, onUpload, onUpgradeNeeded }) => {
    const [backtestFile, setBacktestFile] = useState<File | null>(null);
    const [realtimeFile, setRealtimeFile] = useState<File | null>(null);
    const [strategyName, setStrategyName] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');

    const handleUpload = async () => {
        if (!backtestFile || !realtimeFile || !strategyName.trim()) {
            setUploadMessage('Please select both files and enter a Strategy Name.');
            return;
        }
        setIsUploading(true);
        setUploadMessage('Processing files...');
        try {
            const result = await strategyApi.uploadStrategy(portfolio.id, backtestFile, realtimeFile, { name: strategyName.trim() });
            setUploadMessage(result.message);
            if (result.success) {
                setBacktestFile(null);
                setRealtimeFile(null);
                setStrategyName('');
                onUpload();
            }
        } catch (error: any) {
            setUploadMessage(error.message || 'Upload failed. Please try again.');
            if (error.message && error.message.includes('Plan limit reached')) {
                onUpgradeNeeded();
            }
        } finally {
            setIsUploading(false);
        }
        setTimeout(() => setUploadMessage(''), 5000);
    };

    return (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-dashed border-gray-600 max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Upload New Strategy Data</h3>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-md border border-gray-600">
                    <label htmlFor="backtest-upload" className="cursor-pointer text-center">
                        <UploadIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="font-medium text-primary-400">Upload BackTest file</p>
                        <p className="text-xs text-gray-500">CSV,.txt format</p>
                    </label>
                    <input id="backtest-upload" type="file" className="hidden" accept=".csv,.txt" onChange={e => setBacktestFile(e.target.files?.[0] || null)} />
                    {backtestFile && <p className="text-xs text-gray-300 mt-2 truncate">{backtestFile.name}</p>}
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-md border border-gray-600">
                    <label htmlFor="realtime-upload" className="cursor-pointer text-center">
                        <UploadIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="font-medium text-primary-400">Upload RealTime file</p>
                        <p className="text-xs text-gray-500">CSV,.txt format</p>
                    </label>
                    <input id="realtime-upload" type="file" className="hidden" accept=".csv,.txt" onChange={e => setRealtimeFile(e.target.files?.[0] || null)} />
                    {realtimeFile && <p className="text-xs text-gray-300 mt-2 truncate">{realtimeFile.name}</p>}
                </div>
            </div>
            <div className="mt-6">
                <label htmlFor="strategyName" className="block text-sm font-medium text-gray-300 mb-2 text-center">
                    Strategy Name <span className="text-red-400">*</span>
                </label>
                <input
                    id="strategyName"
                    type="text"
                    value={strategyName}
                    onChange={(e) => setStrategyName(e.target.value)}
                    className="mx-auto block w-full max-w-xs px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-700 text-white text-center"
                    placeholder="e.g. EURUSD Aggressive"
                    required
                />
            </div>
            <div className="mt-6 text-center">
                <button
                    onClick={handleUpload}
                    disabled={!backtestFile || !realtimeFile || !strategyName.trim() || isUploading}
                    className="px-6 py-2 bg-primary-600 text-white rounded-md font-semibold hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                    {isUploading ? 'Analyzing...' : 'Analyze Strategy'}
                </button>
                {uploadMessage && <p className="text-sm text-gray-400 mt-2">{uploadMessage}</p>}
            </div>
        </div>
    );
};

interface ActionsMenuProps {
    strategy: Strategy;
    onDelete: (id: string) => void;
    onEdit: (strategy: Strategy) => void;
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({ strategy, onDelete, onEdit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white">
                <EllipsisVerticalIcon className="h-5 w-5" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-700 rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        <button
                            onClick={() => { onEdit(strategy); setIsOpen(false); }}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                        >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit
                        </button>
                        <button
                            onClick={() => { onDelete(strategy.id); setIsOpen(false); }}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-600"
                        >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const OverviewStatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-gray-800 p-3 rounded-lg ring-1 ring-white/10 flex items-center">
        <div className="flex-shrink-0 bg-gray-700 rounded-md p-2 mr-3">
            {icon}
        </div>
        <div>
            <p className="text-xs font-medium text-gray-400 truncate" title={title}>{title}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const DistributionPieChart: React.FC<{ title: string; data: { name: string; value: number }[]; colors: string[] }> = ({ title, data, colors }) => (
    <div className="bg-gray-800/50 p-4 rounded-lg ring-1 ring-white/10 h-full flex flex-col">
        <h3 className="text-md font-semibold text-white mb-2">{title}</h3>
        <div className="flex-grow" style={{ width: '100%', minHeight: 150 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={30} outerRadius={50} fill="#8884d8" paddingAngle={5}>
                        {data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
);



type DataType = 'Real Time' | 'Backtest';

const calculateCorrelationMatrix = (strategies: Strategy[], dataType: DataType) => {
    const getDailyChanges = (pnlCurveInput: Strategy['pnlCurve']): Map<string, number> => {
        let pnlCurve = pnlCurveInput;
        if (typeof pnlCurve === 'string') {
            try { pnlCurve = JSON.parse(pnlCurve); } catch (e) { pnlCurve = []; }
        }
        if (!Array.isArray(pnlCurve)) pnlCurve = [];

        const dailyChanges: Map<string, number> = new Map();
        if (!pnlCurve || pnlCurve.length === 0) return dailyChanges;

        const points: { date: string; value: number }[] = [];
        pnlCurve.forEach(p => {
            if (p[dataType] !== undefined && p[dataType] !== null) {
                points.push({ date: p.date, value: p[dataType]! });
            }
        });

        if (points.length < 1) return dailyChanges;

        const equityByDate = new Map<string, number>();
        points.forEach(p => {
            equityByDate.set(p.date, p.value);
        });

        const sortedDates = Array.from(equityByDate.keys()).sort();

        if (sortedDates.length < 2) return dailyChanges;

        let lastEquity = equityByDate.get(sortedDates[0])!;
        for (let i = 1; i < sortedDates.length; i++) {
            const date = sortedDates[i];
            const equity = equityByDate.get(date)!;
            dailyChanges.set(date, equity - lastEquity);
            lastEquity = equity;
        }

        return dailyChanges;
    };

    const returnsByDate: Map<string, Map<string, number>> = new Map();
    const allDates = new Set<string>();

    strategies.forEach(strategy => {
        const dailyChanges = getDailyChanges(strategy.pnlCurve);
        dailyChanges.forEach((change, date) => {
            allDates.add(date);
            if (!returnsByDate.has(date)) {
                returnsByDate.set(date, new Map());
            }
            returnsByDate.get(date)!.set(strategy.id, change);
        });
    });

    const sortedDates = Array.from(allDates).sort();

    const series: Record<string, number[]> = {};
    strategies.forEach(strategy => {
        series[strategy.id] = sortedDates.map(date => returnsByDate.get(date)?.get(strategy.id) || 0);
    });

    const pearsonCorrelation = (x: number[], y: number[]): number => {
        const n = x.length;
        if (n === 0) return 0;

        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
        for (let i = 0; i < n; i++) {
            sumX += x[i];
            sumY += y[i];
            sumXY += x[i] * y[i];
            sumX2 += x[i] * x[i];
            sumY2 += y[i] * y[i];
        }

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

        if (denominator === 0) return 0;
        return numerator / denominator;
    }

    const matrix: number[][] = [];
    const labels = strategies.map(s => s.magicNumber.toString());

    for (let i = 0; i < strategies.length; i++) {
        matrix[i] = [];
        for (let j = 0; j < strategies.length; j++) {
            if (i === j) {
                matrix[i][j] = 1;
            } else {
                const seriesA = series[strategies[i].id];
                const seriesB = series[strategies[j].id];
                matrix[i][j] = pearsonCorrelation(seriesA, seriesB);
            }
        }
    }
    return { matrix, labels };
};

const CorrelationHeatmap: React.FC<{ strategies: Strategy[] }> = ({ strategies }) => {
    const [dataType, setDataType] = useState<DataType>('Real Time');
    const { matrix, labels } = useMemo(() => calculateCorrelationMatrix(strategies, dataType), [strategies, dataType]);

    if (strategies.length < 2) {
        return null; // Don't render if less than 2 strategies
    }

    const getColorForCorrelation = (value: number) => {
        if (value >= 0.7) return 'bg-red-600';
        if (value >= 0.4) return 'bg-orange-500';
        if (value >= 0.2) return 'bg-amber-500';
        if (value > -0.2) return 'bg-teal-600';
        return 'bg-emerald-500';
    };

    const buttonClass = (type: DataType) =>
        `px-3 py-1 text-xs font-medium rounded-md transition-colors ${dataType === type
            ? 'bg-primary-600 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
        }`;

    return (
        <div className="bg-gray-800/50 p-6 rounded-lg ring-1 ring-white/10 mt-6">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-lg font-semibold text-white">Strategy Correlation Matrix</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        Analyzes the daily returns of strategies to find correlations. High correlation (red) indicates similar risk exposure, while low correlation (green) suggests better diversification.
                    </p>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                    <button onClick={() => setDataType('Backtest')} className={buttonClass('Backtest')}>
                        Backtest
                    </button>
                    <button onClick={() => setDataType('Real Time')} className={buttonClass('Real Time')}>
                        Real Time
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-xs text-center border-separate border-spacing-1">
                    <thead>
                        <tr>
                            <th className="p-2 w-16"></th>
                            {labels.map(label => (
                                <th key={label} className="p-2 w-16 font-semibold text-gray-300 truncate" title={`Strategy ${label}`}>
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map((row, i) => (
                            <tr key={i}>
                                <th className="p-2 w-16 font-semibold text-gray-300 truncate" title={`Strategy ${labels[i]}`}>
                                    {labels[i]}
                                </th>
                                {row.map((value, j) => (
                                    <td key={j} className={`p-2 rounded-md ${getColorForCorrelation(value)}`}>
                                        <span className="font-semibold text-white text-shadow-sm">{value.toFixed(2)}</span>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-end space-x-4 mt-4 text-xs text-gray-400">
                <span>Legend:</span>
                <div className="flex items-center"><div className="w-3 h-3 rounded-sm bg-emerald-500 mr-1"></div>Negative</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-sm bg-teal-600 mr-1"></div>Low</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-sm bg-amber-500 mr-1"></div>Moderate</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-sm bg-orange-500 mr-1"></div>High</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-sm bg-red-600 mr-1"></div>Very High</div>
            </div>
            <style>{`.text-shadow-sm { text-shadow: 1px 1px 2px rgba(0,0,0,0.5); }`}</style>
        </div>
    );
};


const MonthlyAnalyticsChart: React.FC<{ strategies: Strategy[] }> = ({ strategies }) => {
    const monthlyData = useMemo(() => {
        // Sanitize strategies to ensure pnlCurve is an array
        const sanitizedStrategies = strategies.map(s => {
            let pnlCurve = s.pnlCurve;
            if (typeof pnlCurve === 'string') {
                try { pnlCurve = JSON.parse(pnlCurve); } catch (e) { pnlCurve = []; }
            }
            if (!Array.isArray(pnlCurve)) pnlCurve = [];
            return { ...s, pnlCurve };
        });

        const allRtPoints: { date: Date; value: number; }[] = [];
        sanitizedStrategies.forEach(s => {
            const rtPoints = s.pnlCurve
                .filter((p: any) => p['Real Time'] !== undefined)
                .map((p: any) => ({ date: new Date(p.date), value: p['Real Time']! }));
            allRtPoints.push(...rtPoints);
        });

        if (allRtPoints.length === 0) return [];

        allRtPoints.sort((a, b) => a.date.getTime() - b.date.getTime());

        const dailyPortfolioEquity: { date: Date; equity: number }[] = [];
        const lastEquityPerStrategy: { [strategyId: string]: number } = {};

        // Get all unique dates
        const uniqueDates = [...new Set(allRtPoints.map(p => p.date.toISOString().split('T')[0]))].sort();

        // Initialize with last backtest equity
        const initialPortfolioEquity = sanitizedStrategies.reduce((acc, s) => {
            const lastBtPoint = s.pnlCurve.slice().reverse().find((p: any) => p.Backtest !== undefined);
            const equity = lastBtPoint?.Backtest ?? 10000;
            lastEquityPerStrategy[s.id] = equity;
            return acc + equity;
        }, 0);

        uniqueDates.forEach(dateStr => {
            const date = new Date(dateStr);
            let totalEquity = 0;
            sanitizedStrategies.forEach(s => {
                const lastPointOnDate = s.pnlCurve
                    .filter((p: any) => p['Real Time'] !== undefined && new Date(p.date).toISOString().split('T')[0] <= dateStr)
                    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                [0];

                if (lastPointOnDate) {
                    lastEquityPerStrategy[s.id] = lastPointOnDate['Real Time']!;
                }
                totalEquity += lastEquityPerStrategy[s.id]
            });
            dailyPortfolioEquity.push({ date, equity: totalEquity });
        });


        if (dailyPortfolioEquity.length === 0) return [];

        const monthlyEquity: { [key: string]: { end: number } } = {};
        dailyPortfolioEquity.forEach(({ date, equity }) => {
            const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
            if (!monthlyEquity[monthKey]) {
                monthlyEquity[monthKey] = { end: equity };
            }
            monthlyEquity[monthKey].end = equity;
        });

        const sortedMonthKeys = Object.keys(monthlyEquity).sort();

        let lastMonthEndEquity = initialPortfolioEquity;

        return sortedMonthKeys.map(key => {
            const monthData = monthlyEquity[key];
            const gain = ((monthData.end - lastMonthEndEquity) / lastMonthEndEquity) * 100;
            lastMonthEndEquity = monthData.end;

            const [year, monthNum] = key.split('-');
            const monthName = new Date(parseInt(year), parseInt(monthNum)).toLocaleString('default', { month: 'short' }) + ` ${year}`;

            return { name: monthName, gain: parseFloat(gain.toFixed(2)) };
        });
    }, [strategies]);

    const CustomBarLabel = (props: any) => {
        const { x, y, width, value } = props;
        return (
            <text x={x + width / 2} y={y} dy={-4} fill="#D1D5DB" fontSize={12} textAnchor="middle">
                {`${value.toFixed(2)}%`}
            </text>
        );
    };

    const POSITIVE_COLOR = '#10B981';
    const NEGATIVE_COLOR = '#EF4444';

    return (
        <div className="bg-gray-800/50 p-6 rounded-lg ring-1 ring-white/10 mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Monthly Gain (Change) (RT)</h3>
                <span className="text-sm font-medium bg-gray-700/50 px-3 py-1 rounded-md">2025</span>
            </div>
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                    <BarChart data={monthlyData} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" vertical={false} />
                        <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(tick) => `${tick}%`} />
                        <Tooltip
                            cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}
                            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                            itemStyle={{ color: '#F3F4F6' }}
                            formatter={(value: number) => [`${value.toFixed(2)}%`, 'Gain']}
                            labelStyle={{ color: '#D1D5DB' }}
                        />
                        <Bar dataKey="gain" label={<CustomBarLabel />}>
                            {monthlyData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.gain >= 0 ? POSITIVE_COLOR : NEGATIVE_COLOR} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const PortfolioMetricCard: React.FC<{ title: string; realtimeValue: number; backtestValue: number; unit?: string; isLowerBetter?: boolean }> = ({ title, realtimeValue, backtestValue, unit = '', isLowerBetter = false }) => {
    const deviation = (!isNaN(backtestValue) && !isNaN(realtimeValue) && backtestValue !== 0) ? Math.abs((realtimeValue - backtestValue) / backtestValue) * 100 : 0;
    const diff = backtestValue !== 0 ? ((realtimeValue - backtestValue) / Math.abs(backtestValue)) * 100 : (realtimeValue > 0 ? 100 : (realtimeValue < 0 ? -100 : 0));

    let diffColor;
    if (isLowerBetter) {
        // Increase is bad (Red), Decrease is good (Green)
        diffColor = diff > 0 ? 'text-red-400' : 'text-green-400';
    } else {
        // Increase is good (Green), Decrease is bad (Red)
        diffColor = diff >= 0 ? 'text-green-400' : 'text-red-400';
    }

    const renderValue = (val: number) => {
        if (unit === '$') return `${val.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}$`;
        if (unit === '%') return `${val.toFixed(2)}%`;
        if (unit === 'days') return `${val.toFixed(0)}days`;
        return val.toLocaleString('de-DE', { maximumFractionDigits: 2 });
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg flex flex-col justify-between h-32 ring-1 ring-white/10">
            <div className="flex justify-between items-start">
                <h4 className="font-semibold text-gray-200 text-base">{title}</h4>
                <div className="text-right">
                    <p className="text-2xl font-bold text-white">{renderValue(realtimeValue)}</p>
                </div>
            </div>

            <div className="flex justify-between items-end mt-auto">
                <div className="flex items-center space-x-2">
                </div>
                <div className="flex items-baseline space-x-2 text-right">
                    <div className="text-right">
                        <p className="text-xs text-gray-400" title={`Backtest Value: ${renderValue(backtestValue)}`}>
                            BT: {renderValue(backtestValue)}
                        </p>
                    </div>
                    <p className={`text-sm font-semibold ${diffColor}`}>
                        {diff >= 0 ? '▲' : '▼'} {Math.abs(diff).toFixed(1)}%
                    </p>
                </div>
            </div>
        </div>
    );
};

const PortfolioOverview: React.FC<{ strategies: Strategy[] }> = ({ strategies }) => {
    const [showIndividualCurves, setShowIndividualCurves] = useState(false);

    if (strategies.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-800 rounded-lg ring-1 ring-white/10">
                <h3 className="text-xl font-semibold text-white">No Strategy Data</h3>
                <p className="text-gray-400 mt-2">Upload your first strategy to see an overview of your portfolio.</p>
            </div>
        )
    }

    const aggregatedMetrics = useMemo(() => {
        const initial = {
            netProfit: { rt: 0, bt: 0 },
            numTrades: { rt: 0, bt: 0 },
            profitFactor: { rt: 0, bt: 0, count: 0 },
            retDdRatio: { rt: 0, bt: 0, count: 0 },
            maxDrawdown: { rt: 0, bt: 0 },
            winrate: { rt: 0, bt: 0, weightedSumRt: 0, weightedSumBt: 0, totalTradesRt: 0, totalTradesBt: 0 },
            stagnation: { rt: 0, bt: 0 },
        };

        if (strategies.length === 0) return initial;

        // Helper to process curves
        const processCurve = (pnlCurve: any[], type: 'Backtest' | 'Real Time') => {
            if (!Array.isArray(pnlCurve)) return [];
            return pnlCurve
                .filter(p => p[type] !== undefined && p[type] !== null)
                .map(p => ({ date: p.date, value: p[type] }))
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        };

        // 1. Basic Aggregation & Weighted Averages
        strategies.forEach(s => {
            let metrics = s.metrics;
            if (typeof metrics === 'string') {
                try { metrics = JSON.parse(metrics); } catch (e) { metrics = []; }
            }
            if (!Array.isArray(metrics)) metrics = [];

            const getVal = (id: string, type: 'realtimeValue' | 'backtestValue') => {
                const m = metrics.find((m: any) => m.id === id);
                if (!m) return 0;
                const val = parseFloat(m[type] as string);
                return isNaN(val) ? 0 : val;
            };

            // Sums
            initial.netProfit.rt += getVal('net_profit', 'realtimeValue');
            initial.netProfit.bt += getVal('net_profit', 'backtestValue');

            const tradesRt = getVal('num_trades', 'realtimeValue');
            const tradesBt = getVal('num_trades', 'backtestValue');
            initial.numTrades.rt += tradesRt;
            initial.numTrades.bt += tradesBt;

            // Simple Averages (Sum for now, divide later)
            initial.profitFactor.rt += getVal('profit_factor', 'realtimeValue');
            initial.profitFactor.bt += getVal('profit_factor', 'backtestValue');
            initial.profitFactor.count++;

            // Weighted Averages for Winrate
            initial.winrate.weightedSumRt += getVal('win_rate', 'realtimeValue') * tradesRt;
            initial.winrate.totalTradesRt += tradesRt;
            initial.winrate.weightedSumBt += getVal('win_rate', 'backtestValue') * tradesBt;
            initial.winrate.totalTradesBt += tradesBt;
        });

        // 2. Combined Equity Curve Construction for Max DD & Stagnation
        const calculatePortfolioStats = (type: 'Backtest' | 'Real Time') => {
            const dailyPnl = new Map<string, number>();
            const allDates = new Set<string>();

            strategies.forEach(s => {
                let pnlCurve = s.pnlCurve;
                if (typeof pnlCurve === 'string') {
                    try { pnlCurve = JSON.parse(pnlCurve); } catch (e) { pnlCurve = []; }
                }
                const curve = processCurve(pnlCurve, type);

                if (curve.length < 2) return;

                // Calculate daily changes
                let lastEquity = curve[0].value;
                // Initialize first point PnL (assuming start from 0 relative change for aggregation)
                // Actually, we need the delta.
                // For the first point, we can't get a delta unless we assume a start.
                // Better approach: Interpolate equity to daily and sum equities? 
                // No, sum of equities is correct if they run in parallel.
                // If they don't overlap, we sum their contributions.
                // Let's use a map of Date -> Sum(Equity).
                // But strategies start at different times.
                // Correct approach for Portfolio Equity:
                // 1. Identify all unique dates across all strategies.
                // 2. For each date, sum the equity of all active strategies.
                // 3. If a strategy hasn't started, its equity is 0 (or initial deposit?). 
                //    Usually Portfolio Equity = Sum(Current Equity of each Strategy).
                //    If a strategy starts later, its equity is added.

                curve.forEach(p => {
                    const dateStr = new Date(p.date).toISOString().split('T')[0];
                    allDates.add(dateStr);
                });
            });

            const sortedDates = Array.from(allDates).sort();
            if (sortedDates.length === 0) return { maxDD: 0, stagnation: 0, retDD: 0 };

            const portfolioCurve: number[] = [];

            // We need to know the equity of each strategy at each date.
            // If a date is missing for a strategy, we use the last known equity.
            const lastKnownEquity: Record<string, number> = {};

            // Initialize lastKnownEquity with the first value of each strategy (or 0/10000)
            // Actually, before a strategy starts, does it contribute?
            // If we assume a portfolio starts with Capital X, and we allocate to strategies.
            // Here we are summing independent strategies.
            // So Portfolio Equity at Time T = Sum(Strategy S Equity at Time T).
            // If Strategy S hasn't started, its Equity is effectively 0 (or we assume it doesn't exist yet).
            // But if we sum 0, we get a huge drawdown when a strategy starts with 10k.
            // So we should track PnL changes (Delta) instead.
            // Portfolio PnL at Time T = Sum(Strategy S PnL Delta at Time T).
            // Then Cumulative PnL.

            const dailyDeltas = new Map<string, number>(); // Date -> Total PnL Delta

            strategies.forEach(s => {
                let pnlCurve = s.pnlCurve;
                if (typeof pnlCurve === 'string') {
                    try { pnlCurve = JSON.parse(pnlCurve); } catch (e) { pnlCurve = []; }
                }
                const curve = processCurve(pnlCurve, type);
                if (curve.length < 2) return;

                let prevVal = curve[0].value;
                // We skip the very first point's absolute value, we only care about changes after start.
                // Or we treat the first point as a delta from 0?
                // Let's assume the first point is the initial state.

                for (let i = 1; i < curve.length; i++) {
                    const p = curve[i];
                    const dateStr = new Date(p.date).toISOString().split('T')[0];
                    const delta = p.value - prevVal;
                    dailyDeltas.set(dateStr, (dailyDeltas.get(dateStr) || 0) + delta);
                    prevVal = p.value;
                }
            });

            let currentEquity = 0; // Cumulative PnL
            let peakEquity = -Infinity;
            let maxDD = 0;
            let peakDate = new Date(sortedDates[0]);
            let maxStagnation = 0;

            // We iterate sorted dates to build the curve
            sortedDates.forEach(dateStr => {
                const delta = dailyDeltas.get(dateStr) || 0;
                currentEquity += delta;

                const currentDate = new Date(dateStr);

                if (currentEquity > peakEquity) {
                    peakEquity = currentEquity;
                    const stagnation = (currentDate.getTime() - peakDate.getTime()) / (1000 * 3600 * 24);
                    if (stagnation > maxStagnation) maxStagnation = stagnation;
                    peakDate = currentDate;
                } else {
                    const dd = peakEquity - currentEquity;
                    if (dd > maxDD) maxDD = dd;
                }
            });

            // Check stagnation until today/end
            const lastDate = new Date(sortedDates[sortedDates.length - 1]);
            const finalStagnation = (lastDate.getTime() - peakDate.getTime()) / (1000 * 3600 * 24);
            if (finalStagnation > maxStagnation) maxStagnation = finalStagnation;

            // Ret/DD
            // Net Profit is currentEquity (assuming start from 0 PnL)
            const retDD = maxDD > 0 ? currentEquity / maxDD : (currentEquity > 0 ? 100 : 0);

            return { maxDD, stagnation: maxStagnation, retDD };
        };

        const btStats = calculatePortfolioStats('Backtest');
        const rtStats = calculatePortfolioStats('Real Time');

        initial.maxDrawdown.bt = btStats.maxDD;
        initial.maxDrawdown.rt = rtStats.maxDD;

        initial.stagnation.bt = btStats.stagnation;
        initial.stagnation.rt = rtStats.stagnation;

        // For Ret/DD, we can use the calculated one or average. 
        // The user asked for "metrics calculated based on all data".
        // Portfolio Ret/DD is Total Net Profit / Portfolio Max DD.
        // This is usually more accurate than averaging individual Ret/DDs.
        initial.retDdRatio.bt = btStats.retDD;
        initial.retDdRatio.rt = rtStats.retDD;
        // We set count to 1 so we don't divide it later
        initial.retDdRatio.count = 1;

        return initial;
    }, [strategies]);

    const count = strategies.length || 1;

    // Finalize values
    const finalMetrics = {
        netProfit: aggregatedMetrics.netProfit,
        numTrades: aggregatedMetrics.numTrades,
        profitFactor: {
            rt: aggregatedMetrics.profitFactor.rt / count,
            bt: aggregatedMetrics.profitFactor.bt / count
        },
        retDdRatio: {
            // Already calculated as portfolio total
            rt: aggregatedMetrics.retDdRatio.rt,
            bt: aggregatedMetrics.retDdRatio.bt
        },
        maxDrawdown: aggregatedMetrics.maxDrawdown,
        winrate: {
            rt: aggregatedMetrics.winrate.totalTradesRt > 0 ? aggregatedMetrics.winrate.weightedSumRt / aggregatedMetrics.winrate.totalTradesRt : 0,
            bt: aggregatedMetrics.winrate.totalTradesBt > 0 ? aggregatedMetrics.winrate.weightedSumBt / aggregatedMetrics.winrate.totalTradesBt : 0
        },
        stagnation: aggregatedMetrics.stagnation,
        avgTrade: {
            rt: aggregatedMetrics.numTrades.rt > 0 ? aggregatedMetrics.netProfit.rt / aggregatedMetrics.numTrades.rt : 0,
            bt: aggregatedMetrics.numTrades.bt > 0 ? aggregatedMetrics.netProfit.bt / aggregatedMetrics.numTrades.bt : 0
        }
    };

    const totalStrategies = strategies.length;
    const alertCount = strategies.filter(s => s.status === StrategyStatus.Alert).length;
    const deactivatedCount = strategies.filter(s => s.status === StrategyStatus.Deactivated).length;
    const noTriggerCount = strategies.filter(s => s.status === StrategyStatus.NoTrigger).length;

    const aggregateData = (key: 'typology' | 'extractionType' | 'symbol' | 'timeframe') => strategies.reduce((acc, s) => {
        const value = ((s as any)[key] as string) || 'N/A';
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const EQUITY_CURVE_COLORS = ['#3B82F6', '#14B8A6', '#8B5CF6', '#F59E0B', '#6366F1'];

    const { equityCurveData, strategyCurves } = useMemo(() => {
        const processPnlCurve = (pnlCurveInput: Strategy['pnlCurve']) => {
            let pnlCurve = pnlCurveInput;
            if (typeof pnlCurve === 'string') {
                try {
                    pnlCurve = JSON.parse(pnlCurve);
                } catch (e) {
                    console.error('Failed to parse pnlCurve', e);
                    pnlCurve = [];
                }
            }
            if (!Array.isArray(pnlCurve)) return [];

            return pnlCurve
                .filter(p => p['Real Time'] !== undefined && p['Real Time'] !== null)
                .map(p => ({
                    date: p.date,
                    value: p['Real Time']!
                }))
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        };

        const strategyCurves = strategies
            .map(s => ({ id: s.id, magicNumber: s.magicNumber, curve: processPnlCurve(s.pnlCurve) }))
            .filter(s => s.curve.length > 0);

        if (strategyCurves.length === 0) {
            const today = new Date().toISOString().split('T')[0];
            return { equityCurveData: [{ date: today, profit: 10000 }], strategyCurves: [] };
        }

        const allPoints = strategyCurves.flatMap(s => s.curve.map(p => ({ strategyId: s.id, date: new Date(p.date), value: p.value })));
        allPoints.sort((a, b) => a.date.getTime() - b.date.getTime());

        const uniqueDates = [...new Set(allPoints.map(p => p.date.toISOString().split('T')[0]))].sort();

        if (showIndividualCurves) {
            const lastKnownValues: { [key: string]: number } = {};
            strategies.forEach(s => {
                let pnlCurve = s.pnlCurve;
                if (typeof pnlCurve === 'string') {
                    try { pnlCurve = JSON.parse(pnlCurve); } catch (e) { pnlCurve = []; }
                }
                if (!Array.isArray(pnlCurve)) pnlCurve = [];
                const lastBtPoint = pnlCurve.filter((p: any) => p.Backtest !== undefined).slice(-1)[0];
                lastKnownValues[s.id] = lastBtPoint?.Backtest ?? 10000;
            });

            const combinedData = uniqueDates.map(dateStr => {
                const entry: { [key: string]: any } = { date: dateStr };
                strategyCurves.forEach(s => {
                    const lastPoint = s.curve.slice().reverse().find(p => p.date <= dateStr);
                    if (lastPoint) {
                        lastKnownValues[s.id] = lastPoint.value;
                    }
                    entry[s.magicNumber] = lastKnownValues[s.id];
                });
                return entry;
            });
            return { equityCurveData: combinedData, strategyCurves };
        } else { // Total Portfolio View (RT only)
            const totalProfitCurve: { date: string; profit: number }[] = [];

            const rtInitialEquityMap: Record<string, number> = {};
            let totalInitialEquity = 0;
            strategies.forEach(s => {
                let pnlCurve = s.pnlCurve;
                if (typeof pnlCurve === 'string') {
                    try { pnlCurve = JSON.parse(pnlCurve); } catch (e) { pnlCurve = []; }
                }
                if (!Array.isArray(pnlCurve)) pnlCurve = [];
                const lastBtPoint = pnlCurve.filter((p: any) => p.Backtest !== undefined).slice(-1)[0];
                const initialEq = lastBtPoint?.Backtest ?? 10000;
                rtInitialEquityMap[s.id] = initialEq;
                totalInitialEquity += initialEq;
            });

            const lastKnownEquity: Record<string, number> = { ...rtInitialEquityMap };

            uniqueDates.forEach(dateStr => {
                let portfolioPnl = 0;
                strategyCurves.forEach(s => {
                    const lastPoint = s.curve.slice().reverse().find(p => p.date <= dateStr);
                    if (lastPoint) {
                        lastKnownEquity[s.id] = lastPoint.value;
                    }
                    portfolioPnl += (lastKnownEquity[s.id] - (rtInitialEquityMap[s.id] || lastKnownEquity[s.id]));
                });

                const portfolioEquity = totalInitialEquity + portfolioPnl;
                totalProfitCurve.push({ date: dateStr, profit: parseFloat(portfolioEquity.toFixed(2)) });
            });

            if (totalProfitCurve.length === 0 && strategies.length > 0) {
                totalProfitCurve.push({ date: new Date().toISOString().split('T')[0], profit: totalInitialEquity });
            }
            return { equityCurveData: totalProfitCurve, strategyCurves };
        }
    }, [strategies, showIndividualCurves]);


    const typologyChartData = Object.entries(aggregateData('typology')).map(([name, value]) => ({ name, value }));
    const extractionTypeChartData = Object.entries(aggregateData('extractionType')).map(([name, value]) => ({ name, value }));
    const symbolChartData = Object.entries(aggregateData('symbol')).map(([name, value]) => ({ name, value }));
    const timeframeChartData = Object.entries(aggregateData('timeframe')).map(([name, value]) => ({ name, value }));

    const COLORS_TYPOLOGY = ['#3B82F6', '#14B8A6', '#8B5CF6'];
    const COLORS_EXTRACTION = ['#60A5FA', '#A78BFA'];
    const COLORS_SYMBOLS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#6366F1'];
    const COLORS_TIMEFRAMES = ['#8B5CF6', '#06B6D4', '#10B981', '#F97316'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <OverviewStatCard title="Total Strategies" value={totalStrategies} icon={<CollectionIcon className="h-5 w-5 text-primary-400" />} />
                <OverviewStatCard title="Strategies in Alert" value={alertCount} icon={<ExclamationIcon className="h-5 w-5 text-yellow-400" />} />
                <OverviewStatCard title="Deactivated" value={deactivatedCount} icon={<BanIcon className="h-5 w-5 text-red-400" />} />
                <OverviewStatCard title="No Trigger" value={noTriggerCount} icon={<InformationCircleIcon className="h-5 w-5 text-gray-400" />} />
                <OverviewStatCard title="Strategies OK" value={totalStrategies - alertCount - deactivatedCount - noTriggerCount} icon={<StatusOnlineIcon className="h-5 w-5 text-green-400" />} />

            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <PortfolioMetricCard title="Net Profit" realtimeValue={finalMetrics.netProfit.rt} backtestValue={finalMetrics.netProfit.bt} unit="$" />
                    <PortfolioMetricCard title="Nº Trades" realtimeValue={finalMetrics.numTrades.rt} backtestValue={finalMetrics.numTrades.bt} />
                    <PortfolioMetricCard title="Profit Factor" realtimeValue={finalMetrics.profitFactor.rt} backtestValue={finalMetrics.profitFactor.bt} />
                    <PortfolioMetricCard title="Ret/DD" realtimeValue={finalMetrics.retDdRatio.rt} backtestValue={finalMetrics.retDdRatio.bt} />
                    <PortfolioMetricCard title="Avg. Trade" realtimeValue={finalMetrics.avgTrade.rt} backtestValue={finalMetrics.avgTrade.bt} unit="$" />
                    <PortfolioMetricCard title="Max DD" realtimeValue={finalMetrics.maxDrawdown.rt} backtestValue={finalMetrics.maxDrawdown.bt} unit="$" isLowerBetter={true} />
                    <PortfolioMetricCard title="Winrate" realtimeValue={finalMetrics.winrate.rt} backtestValue={finalMetrics.winrate.bt} unit="%" />
                    <PortfolioMetricCard title="Stagnation" realtimeValue={finalMetrics.stagnation.rt} backtestValue={finalMetrics.stagnation.bt} unit="days" isLowerBetter={true} />
                </div>

                <div className="bg-gray-800/50 p-6 rounded-lg ring-1 ring-white/10">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white">Portfolio Equity Curve (RT)</h3>
                        <button
                            onClick={() => setShowIndividualCurves(!showIndividualCurves)}
                            className="px-3 py-1 text-xs font-medium rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                            title={showIndividualCurves ? "Show portfolio total" : "Show individual strategies"}
                        >
                            {showIndividualCurves ? 'View Total' : 'View by Strategy'}
                        </button>
                    </div>

                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <AreaChart data={equityCurveData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <defs>
                                    {showIndividualCurves ? (
                                        strategyCurves.map((s, i) => (
                                            <linearGradient key={s.magicNumber} id={`color-${s.magicNumber}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={EQUITY_CURVE_COLORS[i % EQUITY_CURVE_COLORS.length]} stopOpacity={0.4} />
                                                <stop offset="95%" stopColor={EQUITY_CURVE_COLORS[i % EQUITY_CURVE_COLORS.length]} stopOpacity={0} />
                                            </linearGradient>
                                        ))
                                    ) : (
                                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                                        </linearGradient>
                                    )}
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" vertical={false} />
                                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tick={{ dy: 10 }} tickFormatter={(dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                                <YAxis stroke="#9CA3AF" fontSize={12} domain={['dataMin - 1000', 'dataMax + 1000']} tickFormatter={(tick) => `$${Math.round(tick / 1000)}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                                    formatter={(value: number, name: string) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, showIndividualCurves ? `Strategy ${name}` : 'Equity']}
                                    // FIX: La biblioteca `recharts` puede proporcionar una etiqueta de tipo `unknown`. Se especifica explícitamente como 'string' para resolver el error de tipo.
                                    labelFormatter={(label: any) => new Date(label).toLocaleDateString()}
                                    labelStyle={{ color: '#D1D5DB' }}
                                />
                                <Legend wrapperStyle={{ fontSize: "12px" }} />

                                {showIndividualCurves ? (
                                    strategyCurves.map((s, i) => (
                                        <Area
                                            key={s.magicNumber}
                                            type="monotone"
                                            dataKey={s.magicNumber.toString()}
                                            name={`${s.magicNumber}`}
                                            stroke={EQUITY_CURVE_COLORS[i % EQUITY_CURVE_COLORS.length]}
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill={`url(#color-${s.magicNumber})`}
                                        />
                                    ))
                                ) : (
                                    <Area type="monotone" dataKey="profit" name="Total Portfolio" stroke="#14B8A6" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                                )}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <MonthlyAnalyticsChart strategies={strategies} />

            <CorrelationHeatmap strategies={strategies} />

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                <div className="xl:col-span-2 bg-gray-800/50 p-6 rounded-lg ring-1 ring-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Strategy Status Breakdown</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={[{ name: 'Status', OK: strategies.filter(s => s.status === StrategyStatus.Ok).length, Alert: alertCount, Deactivated: deactivatedCount, 'No Trigger': noTriggerCount }]} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" horizontal={false} />
                                <XAxis type="number" stroke="#9CA3AF" fontSize={12} allowDecimals={false} />
                                <YAxis type="category" dataKey="name" hide={true} />
                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }} />
                                <Legend wrapperStyle={{ fontSize: "14px" }} />
                                <Bar dataKey="OK" stackId="a" fill="#10B981" name="OK" />
                                <Bar dataKey="Alert" stackId="a" fill="#F59E0B" name="Alert" />
                                <Bar dataKey="Deactivated" stackId="a" fill="#EF4444" name="Deactivated" />
                                <Bar dataKey="No Trigger" stackId="a" fill="#6B7280" name="No Trigger" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <DistributionPieChart title="Typology Distribution" data={typologyChartData} colors={COLORS_TYPOLOGY} />
                    <DistributionPieChart title="Extraction Type" data={extractionTypeChartData} colors={COLORS_EXTRACTION} />
                    <DistributionPieChart title="Symbol Distribution" data={symbolChartData} colors={COLORS_SYMBOLS} />
                    <DistributionPieChart title="Timeframe Distribution" data={timeframeChartData} colors={COLORS_TIMEFRAMES} />
                </div>
            </div>
            ```
        </div>
    );
}


export const PortfolioView: React.FC<PortfolioViewProps> = ({ portfolio, strategies, onFilesUploaded, onDeleteStrategy, onEditStrategy, onSavePortfolio, onDeletePortfolio, onUpgradeNeeded }) => {
    const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
    const [activeView, setActiveView] = useState<'overview' | 'strategies' | 'upload' | 'settings'>('overview');

    useEffect(() => {
        setActiveView('overview');
        setSelectedStrategy(null);
    }, [portfolio]);

    const strategiesWithStatus = useMemo(() => {
        const rules = portfolio.metricRules || [];
        if (rules.length === 0) {
            return strategies.map(s => ({ ...s, status: StrategyStatus.NoTrigger }));
        }

        const alertingRules = rules.filter(r => r.isAlerting);
        if (alertingRules.length === 0) {
            return strategies.map(s => ({ ...s, status: StrategyStatus.NoTrigger }));
        }

        return strategies.map(strategy => {
            let metrics = strategy.metrics;
            if (typeof metrics === 'string') {
                try { metrics = JSON.parse(metrics); } catch (e) { metrics = []; }
            }
            if (!Array.isArray(metrics)) metrics = [];

            let hasDeactivation = false;
            let hasAlert = false;

            for (const rule of alertingRules) {
                const metric = metrics.find((m: any) => m.id === rule.metricId);
                if (!metric) continue;

                const bt = parseFloat(metric.backtestValue as string);
                const rt = parseFloat(metric.realtimeValue as string);

                if (isNaN(bt) || isNaN(rt) || bt === 0) continue;

                // Calculate the percentage change (can be positive or negative)
                const percentageChange = ((rt - bt) / Math.abs(bt)) * 100;

                // Determine if this metric is "lower is better"
                const isLowerBetter = ['max_drawdown', 'stagnation_days'].includes(rule.metricId);

                // Calculate deviation only if the metric worsened
                let deviation = 0;
                if (isLowerBetter) {
                    // For "lower is better" metrics, only count if value increased (worsened)
                    if (percentageChange > 0) {
                        deviation = percentageChange;
                    }
                } else {
                    // For "higher is better" metrics, only count if value decreased (worsened)
                    if (percentageChange < 0) {
                        deviation = Math.abs(percentageChange);
                    }
                }

                if (deviation >= rule.deactivationThreshold) {
                    hasDeactivation = true;
                    break;
                }
                if (deviation >= rule.alertThreshold) {
                    hasAlert = true;
                }
            }

            let status = StrategyStatus.Ok;
            if (hasDeactivation) {
                status = StrategyStatus.Deactivated;
            } else if (hasAlert) {
                status = StrategyStatus.Alert;
            }

            return { ...strategy, status };
        });
    }, [strategies, portfolio.metricRules]);


    if (selectedStrategy) {
        return <StrategyDetail portfolio={portfolio} strategy={selectedStrategy} onBack={() => setSelectedStrategy(null)} />;
    }

    const renderView = () => {
        switch (activeView) {
            case 'overview':
                return <PortfolioOverview strategies={strategiesWithStatus} />;
            case 'strategies':
                return (
                    <div className="bg-gray-800/50 rounded-lg shadow-lg ring-1 ring-white/10">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-white">Strategies Overview</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider group relative">
                                            <div className="flex items-center gap-1 cursor-help">
                                                Magic Number
                                                <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <div className="absolute top-full left-0 mt-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-gray-700">
                                                Unique identifier for the strategy.
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider group relative">
                                            <div className="flex items-center gap-1 cursor-help">
                                                Name
                                                <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <div className="absolute top-full left-0 mt-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-gray-700">
                                                Strategy name.
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider group relative">
                                            <div className="flex items-center gap-1 cursor-help">
                                                Symbol
                                                <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <div className="absolute top-full left-0 mt-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-gray-700">
                                                Trading pair or asset.
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider group relative">
                                            <div className="flex items-center gap-1 cursor-help">
                                                Timeframe
                                                <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <div className="absolute top-full left-0 mt-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-gray-700">
                                                Chart timeframe used.
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider group relative">
                                            <div className="flex items-center gap-1 cursor-help">
                                                Typology
                                                <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <div className="absolute top-full left-0 mt-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-gray-700">
                                                Strategy type (e.g., Trend, Mean Reversion).
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider group relative">
                                            <div className="flex items-center gap-1 cursor-help">
                                                Extraction Type
                                                <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <div className="absolute top-full left-0 mt-2 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-gray-700">
                                                Method used to identify the strategy: 'Data Driven' (mining historical data) or 'Idea Driven' (based on fundamental economic logic).
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider group relative">
                                            <div className="flex items-center gap-1 cursor-help">
                                                Status
                                                <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <div className="absolute top-full left-0 mt-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-gray-700">
                                                Current monitoring status based on metric rules.
                                            </div>
                                        </th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {strategiesWithStatus.map((strategy) => (
                                        <tr key={strategy.id} className="hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{strategy.magicNumber}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white truncate max-w-xs">{strategy.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{strategy.symbol}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{strategy.timeframe}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{strategy.typology || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{strategy.extractionType || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium ${statusStyles[strategy.status].bgColor} ${statusStyles[strategy.status].textColor} ring-1 ring-inset ${statusStyles[strategy.status].ringColor}`}>
                                                    {statusStyles[strategy.status].icon}
                                                    {strategy.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => setSelectedStrategy(strategy)} className="text-primary-400 hover:text-primary-300 flex items-center">
                                                    Details <ChevronRightIcon className="h-4 w-4 ml-1" />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <ActionsMenu strategy={strategy} onDelete={onDeleteStrategy} onEdit={onEditStrategy} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'upload':
                return <FileUploader portfolio={portfolio} onUpload={onFilesUploaded} onUpgradeNeeded={onUpgradeNeeded} />;
            case 'settings':
                return <PortfolioSettings portfolio={portfolio} onSave={onSavePortfolio} onDelete={onDeletePortfolio} />;
            default:
                return null;
        }
    };

    const navLinkClasses = (viewName: typeof activeView) => `whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeView === viewName
        ? 'border-primary-500 text-primary-400'
        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
        }`;

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveView('overview')} className={navLinkClasses('overview')}>Overview</button>
                    <button onClick={() => setActiveView('strategies')} className={navLinkClasses('strategies')}>Strategies</button>
                    <button onClick={() => setActiveView('upload')} className={navLinkClasses('upload')}>Upload Strategy</button>
                    <button onClick={() => setActiveView('settings')} className={navLinkClasses('settings')}>Portfolio Settings</button>
                </nav>
            </div>

            <div className="animate-fade-in">
                {renderView()}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};