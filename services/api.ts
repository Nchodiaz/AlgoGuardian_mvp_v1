import { Portfolio, Strategy, Metric, StrategyStatus, MetricCategory, DeactivationRule, StrategyTypology, ExtractionType, MetricRule } from '../types';

// Mock Data
const MOCK_METRICS: Omit<Metric, 'backtestValue' | 'realtimeValue' | 'pValue'>[] = [
    // Core metrics for dashboard and chart
    { id: 'profit_factor', name: 'Profit Factor', category: MetricCategory.Robustness, unit: '' },
    { id: 'ret_dd_ratio', name: 'Ret/DD', category: MetricCategory.Risk, unit: '' },
    { id: 'avg_trade', name: 'Avg. Trade', category: MetricCategory.Performance, unit: '$' },
    { id: 'max_drawdown', name: 'Max DD', category: MetricCategory.Risk, unit: '%' },
    { id: 'stagnation_days', name: 'Stagnation', category: MetricCategory.Stagnation, unit: 'days' },
    { id: 'win_rate', name: 'Winrate', category: MetricCategory.Effectiveness, unit: '%' },
    { id: 'net_profit', name: 'Net Profit', category: MetricCategory.Performance, unit: '$' },
    { id: 'num_trades', name: 'Nº Trades', category: MetricCategory.Effectiveness, unit: ''},

    // Additional metrics for completeness of data
    { id: 'cagr', name: 'CAGR', category: MetricCategory.Performance, unit: '%' },
    { id: 'calmar_ratio', name: 'Calmar Ratio', category: MetricCategory.Risk, unit: '' },
    { id: 'sharpe_ratio', name: 'Sharpe Ratio', category: MetricCategory.Robustness, unit: '' },
];

export const AVAILABLE_METRICS = MOCK_METRICS.map(({ id, name }) => ({ id, name }));

export const DASHBOARD_METRIC_IDS = [
  'net_profit',
  'num_trades',
  'profit_factor',
  'ret_dd_ratio',
  'avg_trade',
  'max_drawdown',
  'win_rate',
  'stagnation_days',
];

export const DASHBOARD_AVAILABLE_METRICS = AVAILABLE_METRICS.filter(m => DASHBOARD_METRIC_IDS.includes(m.id));


const generateRandomMetrics = (hasDrift: boolean): Metric[] => {
    return MOCK_METRICS.map(m => {
        let backtestValue;
        // Assign realistic base values for different metrics
        if (m.unit === '%') backtestValue = 20 + Math.random() * 40; // 20-60%
        else if (m.id === 'net_profit') backtestValue = 5000 + Math.random() * 10000;
        else if (m.unit === '$') backtestValue = 10 + Math.random() * 40; // $10-$50
        else if (m.unit === 'days') backtestValue = 15 + Math.random() * 45; // 15-60 days
        else if (m.id === 'num_trades') backtestValue = 100 + Math.random() * 200; // 100-300 trades
        else backtestValue = 1 + Math.random() * 2; // Ratios like 1-3

        let realtimeValue;
        let pValue;

        if (hasDrift && ['max_drawdown', 'stagnation_days'].includes(m.id)) {
            realtimeValue = backtestValue * (1.5 + Math.random()); // Significant drift
            pValue = Math.random() * 0.04; // p-value < 0.05
        } else if (!hasDrift && ['profit_factor', 'win_rate'].includes(m.id)) {
             realtimeValue = backtestValue * (0.95 + Math.random() * 0.1); // No drift
             pValue = 0.5 + Math.random() * 0.4;
        } else {
            realtimeValue = backtestValue * (0.8 + Math.random() * 0.4); // Random variation
            pValue = Math.random();
        }

        const isInt = ['num_trades', 'stagnation_days'].includes(m.id);

        return {
            ...m,
            backtestValue: isInt ? `${Math.round(backtestValue)}` : backtestValue.toFixed(2),
            realtimeValue: isInt ? `${Math.round(realtimeValue)}` : realtimeValue.toFixed(2),
            pValue: parseFloat(pValue.toFixed(4)),
        };
    });
};

const generatePnlCurve = (numTrades: number, hasDrift: boolean) => {
    const curve: { trade: number; date: string; Backtest?: number; 'Real Time'?: number }[] = [];
    let equity = 10000;
    const numBt = Math.floor(numTrades * 0.7);
    let currentDate = new Date(2025, 0, 1); // Start date

    for (let i = 1; i <= numBt; i++) {
        equity += (Math.random() - 0.48) * 200; // Small positive bias
        currentDate.setDate(currentDate.getDate() + Math.floor(Math.random() * 3) + 1);
        curve.push({ trade: i, date: currentDate.toISOString().split('T')[0], Backtest: parseFloat(equity.toFixed(2)) });
    }
    
    for (let i = 1; i <= (numTrades - numBt); i++) {
        const volatility = hasDrift ? 400 : 200;
        const bias = hasDrift ? 0.52 : 0.48;
        equity += (Math.random() - bias) * volatility;
        currentDate.setDate(currentDate.getDate() + Math.floor(Math.random() * 3) + 1);
        curve.push({ trade: numBt + i, date: currentDate.toISOString().split('T')[0], 'Real Time': parseFloat(equity.toFixed(2)) });
    }
    return curve;
};

let MOCK_STRATEGIES: Strategy[] = [
    {
        id: 'strat_1',
        portfolioId: 'port_1',
        magicNumber: 1005,
        name: 'EURUSD_H1_BT.csv',
        symbol: 'EURUSD',
        timeframe: 'H1',
        typology: StrategyTypology.MeanReversion,
        extractionType: ExtractionType.DataDriven,
        status: StrategyStatus.Ok,
        metrics: generateRandomMetrics(false),
        pnlCurve: generatePnlCurve(250, false),
    },
    {
        id: 'strat_2',
        portfolioId: 'port_1',
        magicNumber: 1002,
        name: 'GBPUSD_M15_BT.csv',
        symbol: 'GBPUSD',
        timeframe: 'M15',
        typology: StrategyTypology.Breakout,
        extractionType: ExtractionType.IdeaDriven,
        status: StrategyStatus.Alert,
        metrics: generateRandomMetrics(true),
        pnlCurve: generatePnlCurve(180, true),
    },
     {
        id: 'strat_4',
        portfolioId: 'port_1',
        magicNumber: 2509088,
        name: 'XAUUSD_M30_RT.csv',
        symbol: 'XAUUSD',
        timeframe: 'M30',
        typology: StrategyTypology.Stationary,
        extractionType: ExtractionType.IdeaDriven,
        status: StrategyStatus.Ok,
        metrics: generateRandomMetrics(false),
        pnlCurve: generatePnlCurve(220, false),
    },
    {
        id: 'strat_3',
        portfolioId: 'port_2',
        magicNumber: 1003,
        name: 'USDJPY_H4_BT.csv',
        symbol: 'USDJPY',
        timeframe: 'H4',
        typology: StrategyTypology.Stationary,
        extractionType: ExtractionType.DataDriven,
        status: StrategyStatus.Deactivated,
        metrics: generateRandomMetrics(true),
        pnlCurve: generatePnlCurve(300, true),
    },
];

let MOCK_PORTFOLIOS: Portfolio[] = [
    { 
        id: 'port_1', 
        name: 'Aggressive FX', 
        ownerId: 'user_1',
        metricRules: [
            { metricId: 'max_drawdown', name: 'Max DD', alertThreshold: 10, deactivationThreshold: 20, isAlerting: true },
            { metricId: 'profit_factor', name: 'Profit Factor', alertThreshold: 25, deactivationThreshold: 50, isAlerting: true },
            { metricId: 'stagnation_days', name: 'Stagnation', alertThreshold: 15, deactivationThreshold: 30, isAlerting: false },
        ]
    },
    { id: 'port_2', name: 'Conservative Indices', ownerId: 'user_1', metricRules: [] },
];

interface TradeData {
    profit: number;
    closeTime: Date;
}

interface CalculatedMetrics {
    netProfit: number;
    numTrades: number;
    winRate: number;
    avgTrade: number;
    profitFactor: number;
    maxDrawdownValue: number;
    maxDrawdownPercent: number;
    returnToDD: number;
    stagnationDays: number;
    pnlData: { equity: number, date: Date }[];
}

const cleanHeader = (h: string): string => {
    return h.replace(/"/g, '').trim().toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '');
};

const getDelimiter = (lines: string[]): string => {
    if (lines.length === 0) return ',';
    if (lines[0].toLowerCase().startsWith('sep=')) {
        const sep = lines[0].substring(4).trim();
        if (sep === '\\t') return '\t';
        return sep || '\t'; // Default to tab if sep= is empty
    }
    
    const headerKeywords = [
        'profit', 'resultado', 'p/l', 'net profit', 'beneficio neto', 'ganancia neta',
        'time', 'close time', 'fecha', 'close date', 'fecha de cierre', 'hora de cierre', 'type', 'action', 'tipo'
    ];
    const headerLine = lines.find(line => headerKeywords.some(keyword => line.toLowerCase().includes(keyword))) || lines[0];

    const delimiters = [',', ';', '\t'];
    return [...delimiters].sort((a, b) => headerLine.split(b).length - headerLine.split(a).length)[0];
};

const parseStrategyTesterTxtReport = (lines: string[]): TradeData[] => {
    const dealsSectionIndex = lines.findIndex(line => /Deals/i.test(line));
    if (dealsSectionIndex === -1) {
        throw new Error('Could not find the "Deals" section in the Strategy Tester Report.');
    }
    const dealLines = lines.slice(dealsSectionIndex + 2);

    let currentDate = '';
    const reconstructedLines: string[] = [];
    let currentLineData = '';
    
    for (const line of dealLines) {
        const trimmed = line.trim();
        if (!trimmed || /^\s*Time\s/.test(trimmed)) continue;

        const isDateLine = /^\d{4}\.\d{2}\.\d{2}/.test(trimmed);
        const isTimeLine = /^\d{2}:\d{2}:\d{2}/.test(trimmed);

        if (isDateLine) {
            if (currentLineData) {
                reconstructedLines.push(currentLineData);
            }
            currentLineData = trimmed;
            currentDate = trimmed.split(/\s+/)[0];
        } else if (isTimeLine) {
            if (currentLineData) {
                 reconstructedLines.push(currentLineData);
            }
            currentLineData = `${currentDate} ${trimmed}`;
        } else {
            currentLineData += ` ${trimmed}`;
        }
    }
    if (currentLineData) {
        reconstructedLines.push(currentLineData);
    }

    const trades: TradeData[] = reconstructedLines
        .map(line => {
            if (!line.includes(' out ')) return null;

            const timeMatch = line.match(/^\d{4}\.\d{2}\.\d{2}\s\d{2}:\d{2}:\d{2}/);
            if (!timeMatch) return null;
            
            const closeTime = new Date(timeMatch[0].replace(/\./g, '/'));
            
            const profitMatch = line.match(/(-?[\d\s.,]+)\s+([\d\s.,]+)\s+(sl|tp|so|#|from|deal|buy|sell|in|out|stop|limit|balance|credit)/);

            if (!profitMatch) return null;
            
            try {
                const profitStr = profitMatch[1].replace(/\s/g, '').replace(',', '.');
                const profit = parseFloat(profitStr);
                
                if (isNaN(profit) || isNaN(closeTime.getTime())) return null;

                return { profit, closeTime };
            } catch(e) {
                console.error("Could not parse profit from line: ", line);
                return null;
            }
        })
        .filter((t): t is TradeData => t !== null);
    
    return [...trades].sort((a, b) => a.closeTime.getTime() - b.closeTime.getTime());
};


const parseStrategyTesterCsvReport = (lines: string[]): TradeData[] => {
    const dealsHeaderIndex = lines.findIndex(line => line.toLowerCase().startsWith('"time","deal","symbol"'));
    if (dealsHeaderIndex === -1) {
        throw new Error('Could not find the "Deals" header row in the Strategy Tester Report CSV.');
    }
    const header = lines[dealsHeaderIndex].split(',').map(h => cleanHeader(h));
    
    const profitIdx = header.findIndex(h => h === 'profit');
    const timeIdx = header.findIndex(h => h === 'time');
    const directionIdx = header.findIndex(h => h === 'direction');

    if (profitIdx === -1 || timeIdx === -1 || directionIdx === -1) {
        throw new Error('Could not find required columns (Time, Direction, Profit) in Deals section.');
    }

    const dealLines = lines.slice(dealsHeaderIndex + 1);

    const trades = dealLines.map(line => {
        // Use a more robust CSV parsing method to handle commas within quoted fields
        const rowData = (line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || []).map(val => val.replace(/"/g, '').trim());
        if (rowData.length < header.length) return null;

        const direction = rowData[directionIdx];
        if (direction !== 'out') return null;

        try {
            const profitStr = rowData[profitIdx].replace(/\s/g, '');
            const profit = parseFloat(profitStr);
            
            const dateStr = rowData[timeIdx].trim();
            const closeTime = new Date(dateStr.replace(/\./g, '/'));

            if (isNaN(profit) || isNaN(closeTime.getTime())) return null;

            return { profit, closeTime };
        } catch (e) {
            console.error("Error parsing Strategy Tester CSV row:", line, e);
            return null;
        }
    }).filter((t): t is TradeData => t !== null);

    return [...trades].sort((a, b) => a.closeTime.getTime() - b.closeTime.getTime());
};

const parseGenericSeparatedValueFile = (lines: string[]): TradeData[] => {
    const delimiter = getDelimiter(lines);
    const headerLineIndex = lines[0].toLowerCase().startsWith('sep=') ? 1 : 0;
    
    const headerLine = lines[headerLineIndex];
    if (!headerLine) throw new Error("Could not find header line.");

    let header = headerLine.split(delimiter).map(cleanHeader);
    const dataRows = lines.slice(headerLineIndex + 1);
    
    const findColumnIndex = (aliases: string[]): number => {
        for (const alias of aliases) {
            const index = header.findIndex(h => h === alias);
            if (index !== -1) return index;
        }
        return -1;
    };

    const profitIdx = findColumnIndex(['profit', 'resultado', 'p/l', 'net profit', 'beneficio neto', 'ganancia neta']);
    const timeIdx = findColumnIndex(['close time', 'close date', 'closetime', 'time', 'fecha de cierre', 'hora de cierre']);
    const typeIdx = findColumnIndex(['type', 'deal type', 'action', 'tipo', 'acción']);
    
    if (profitIdx === -1) {
         throw new Error(`Missing required profit column. Looked for: profit, resultado, p/l, net profit, beneficio neto, ganancia neta. Found headers: [${header.join(', ')}]`);
    }
    if (timeIdx === -1) {
        throw new Error(`Missing required close time column. Looked for: close time, close date, closetime, time, fecha de cierre, hora de cierre. Found headers: [${header.join(', ')}]`);
    }
    
    const trades: TradeData[] = dataRows.map(row => {
        const rowData = row.split(delimiter);
        if (rowData.length <= Math.max(profitIdx, timeIdx)) return null;

        if (typeIdx !== -1) {
            const typeValue = (rowData[typeIdx] || '').trim().toLowerCase();
            if (['pending order', 'deposit', 'balance', 'credit'].some(t => typeValue.startsWith(t))) {
                return null;
            }
        }

        const profitStr = (rowData[profitIdx] || '').replace(/[^\d.,-]/g, '').replace(',', '.');
        const profit = parseFloat(profitStr);
        if (isNaN(profit)) return null; 
        
        const dateStr = (rowData[timeIdx] || '').trim();
        const closeTime = new Date(dateStr.replace(/\./g, '/'));
        if (isNaN(closeTime.getTime())) return null;

        return { profit, closeTime };
    }).filter((t): t is TradeData => t !== null);

    return [...trades].sort((a, b) => a.closeTime.getTime() - b.closeTime.getTime());
};


const calculateMetrics = (fileContent: string): CalculatedMetrics => {
    // BOM and null characters can be present in files from different OS/editors.
    const cleanedContent = fileContent.replace(/[\uFEFF\0]/g, '');
    // Trim each line first, then filter out empty lines. This is crucial for parsing.
    const lines = cleanedContent.split(/\r?\n/).map(l => l.trim()).filter(line => line !== '');
    
    if (lines.length < 1) throw new Error("File is empty or invalid.");

    let trades: TradeData[];
    
    // More robust file type detection
    const isMtReport = /strategy tester report/i.test(lines[0]);
    
    if (isMtReport) {
        if (lines.some(l => l.toLowerCase().startsWith('"time","deal","symbol"'))) {
            trades = parseStrategyTesterCsvReport(lines);
        } else {
            trades = parseStrategyTesterTxtReport(lines);
        }
    } else {
        trades = parseGenericSeparatedValueFile(lines);
    }


    if (trades.length === 0) throw new Error(`No valid trades found. Please check file format and content. Ensure it contains trade history.`);

    const numTrades = trades.length;
    const netProfit = trades.reduce((sum, trade) => sum + trade.profit, 0);
    const winningTrades = trades.filter(t => t.profit > 0);
    const losingTrades = trades.filter(t => t.profit < 0);
    const winRate = numTrades > 0 ? (winningTrades.length / numTrades) * 100 : 0;
    const avgTrade = numTrades > 0 ? netProfit / numTrades : 0;
    const grossProfit = winningTrades.reduce((sum, t) => sum + t.profit, 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.profit, 0));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : (grossProfit > 0 ? 999 : 1);

    let equity = 10000;
    let peakEquity = equity;
    let peakDate = trades.length > 0 ? trades[0].closeTime : new Date();
    let maxDrawdownValue = 0;
    let maxStagnation = 0;
    const pnlData: { equity: number, date: Date }[] = [];

    trades.forEach(trade => {
        equity += trade.profit;
        pnlData.push({ equity, date: trade.closeTime });

        if (equity > peakEquity) {
            const stagnationDuration = (trade.closeTime.getTime() - peakDate.getTime()) / (1000 * 3600 * 24);
            if (stagnationDuration > maxStagnation) maxStagnation = stagnationDuration;
            peakEquity = equity;
            peakDate = trade.closeTime;
        } else {
            const drawdown = peakEquity - equity;
            if (drawdown > maxDrawdownValue) maxDrawdownValue = drawdown;
        }
    });
    
    const finalStagnation = trades.length > 1 ? (trades[trades.length - 1].closeTime.getTime() - peakDate.getTime()) / (1000 * 3600 * 24) : 0;
    if(finalStagnation > maxStagnation) maxStagnation = finalStagnation;

    const maxDrawdownPercent = peakEquity > 10000 ? (maxDrawdownValue / peakEquity) * 100 : 0;
    const returnToDD = maxDrawdownValue > 0 ? netProfit / maxDrawdownValue : (netProfit > 0 ? 999 : 0);

    return {
        netProfit, numTrades, winRate, avgTrade, profitFactor, maxDrawdownValue,
        maxDrawdownPercent, returnToDD, stagnationDays: Math.floor(maxStagnation), pnlData,
    };
};

const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file, 'UTF-8'); // Specify UTF-8 encoding
    });
};

// Mock API
export const mockApi = {
    getPortfolios: (): Promise<Portfolio[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_PORTFOLIOS]), 500));
    },
    getStrategies: (portfolioId: string): Promise<Strategy[]> => {
        console.log(`Fetching strategies for ${portfolioId}`);
        const portfolioStrategies = MOCK_STRATEGIES.filter(s => s.portfolioId === portfolioId);
        return new Promise(resolve => setTimeout(() => resolve(portfolioStrategies), 800));
    },
    getStrategyById: (strategyId: string): Promise<Strategy | undefined> => {
        const strategy = MOCK_STRATEGIES.find(s => s.id === strategyId);
        return new Promise(resolve => setTimeout(() => resolve(strategy), 300));
    },
    createPortfolio: (name: string): Promise<Portfolio> => {
        const newPortfolio: Portfolio = {
            id: `port_${Date.now()}`,
            name,
            ownerId: 'user_1',
            metricRules: [],
        };
        MOCK_PORTFOLIOS = [...MOCK_PORTFOLIOS, newPortfolio];
        return new Promise(resolve => setTimeout(() => resolve(newPortfolio), 500));
    },
    uploadFiles: async (portfolioId: string, backtestFile: File, realtimeFile: File, name: string): Promise<{ success: boolean; message: string }> => {
        try {
            const backtestContent = await readFileAsText(backtestFile);
            const realtimeContent = await readFileAsText(realtimeFile);

            const backtestMetrics = calculateMetrics(backtestContent);
            const realtimeMetrics = calculateMetrics(realtimeContent);
            
            const extractMagicNumber = (content: string): number => {
                const match = content.match(/MagicNumber=(\d+)/i);
                return match && match[1] ? parseInt(match[1], 10) : Date.now() % 1000000;
            };

            const magicNumber = extractMagicNumber(backtestContent);

            const calculatePValue = (bt: number, rt: number): number => {
                if (bt === 0 && rt === 0) return 1.0;
                const diff = Math.abs(bt - rt);
                const avg = (Math.abs(bt) + Math.abs(rt)) / 2;
                if (avg === 0) return 0.0;
                const relativeDiff = diff / avg;
                const pValue = Math.exp(-relativeDiff * 5); 
                return parseFloat(pValue.toFixed(4));
            };

            const metricsMap: { [key: string]: { bt: number, rt: number } } = {
                'net_profit': { bt: backtestMetrics.netProfit, rt: realtimeMetrics.netProfit },
                'num_trades': { bt: backtestMetrics.numTrades, rt: realtimeMetrics.numTrades },
                'win_rate': { bt: backtestMetrics.winRate, rt: realtimeMetrics.winRate },
                'avg_trade': { bt: backtestMetrics.avgTrade, rt: realtimeMetrics.avgTrade },
                'profit_factor': { bt: backtestMetrics.profitFactor, rt: realtimeMetrics.profitFactor },
                'max_drawdown': { bt: backtestMetrics.maxDrawdownPercent, rt: realtimeMetrics.maxDrawdownPercent },
                'ret_dd_ratio': { bt: backtestMetrics.returnToDD, rt: realtimeMetrics.returnToDD },
                'stagnation_days': { bt: backtestMetrics.stagnationDays, rt: realtimeMetrics.stagnationDays },
            };

            const finalMetrics: Metric[] = MOCK_METRICS
                .filter(m => metricsMap[m.id])
                .map(metricTemplate => {
                    const values = metricsMap[metricTemplate.id];
                    const isInt = ['num_trades', 'stagnation_days'].includes(metricTemplate.id);
                    return {
                        ...metricTemplate,
                        backtestValue: isInt ? values.bt.toFixed(0) : values.bt.toFixed(2),
                        realtimeValue: isInt ? values.rt.toFixed(0) : values.rt.toFixed(2),
                        pValue: calculatePValue(values.bt, values.rt),
                    }
                });
            
            const pnlCurve: { trade: number; date: string; Backtest?: number; 'Real Time'?: number }[] = [];
            let cumulativeBTPnl = 10000;
            backtestMetrics.pnlData.forEach((pnlPoint, i) => {
                pnlCurve.push({ 
                    trade: i + 1, 
                    date: pnlPoint.date.toISOString().split('T')[0],
                    Backtest: parseFloat(pnlPoint.equity.toFixed(2)) 
                });
                cumulativeBTPnl = pnlPoint.equity;
            });

            realtimeMetrics.pnlData.forEach((pnlPoint, i) => {
                 pnlCurve.push({ 
                    trade: backtestMetrics.numTrades + i + 1,
                    date: pnlPoint.date.toISOString().split('T')[0],
                    'Real Time': parseFloat((cumulativeBTPnl - 10000 + pnlPoint.equity).toFixed(2)) 
                });
            });

            const newStrategy: Strategy = {
                id: `strat_${Date.now()}`,
                portfolioId: portfolioId,
                magicNumber: magicNumber,
                name: name,
                symbol: 'MULTI',
                timeframe: 'VARIOUS',
                status: StrategyStatus.Ok,
                metrics: finalMetrics,
                pnlCurve: pnlCurve,
                typology: Math.random() > 0.5 ? StrategyTypology.MeanReversion : StrategyTypology.Breakout,
                extractionType: Math.random() > 0.5 ? ExtractionType.DataDriven : ExtractionType.IdeaDriven,
            };

            MOCK_STRATEGIES = [...MOCK_STRATEGIES, newStrategy];
            return { success: true, message: `Analyzed ${backtestMetrics.numTrades} BT and ${realtimeMetrics.numTrades} RT trades.` };
        } catch (error: any) {
            console.error("Error processing files:", error);
            return { success: false, message: error.message || 'An unexpected error occurred.' };
        }
    },
    deleteStrategy: (strategyId: string): Promise<{ success: boolean }> => {
        return new Promise(resolve => {
            const initialLength = MOCK_STRATEGIES.length;
            MOCK_STRATEGIES = MOCK_STRATEGIES.filter(s => s.id !== strategyId);
            setTimeout(() => resolve({ success: MOCK_STRATEGIES.length < initialLength }), 300);
        });
    },
    updateStrategySettings: (strategyId: string, settings: Partial<Strategy>): Promise<{ success: boolean }> => {
        return new Promise(resolve => {
            MOCK_STRATEGIES = MOCK_STRATEGIES.map(s => 
                s.id === strategyId ? { ...s, ...settings } : s
            );
            resolve({ success: true });
        });
    },
    updatePortfolio: (portfolioId: string, settings: Partial<Portfolio>): Promise<{ success: boolean }> => {
        return new Promise(resolve => {
             MOCK_PORTFOLIOS = MOCK_PORTFOLIOS.map(p => 
                p.id === portfolioId ? { ...p, ...settings } : p
            );
            resolve({ success: true });
        });
    },
    deletePortfolio: (portfolioId: string): Promise<{ success: boolean }> => {
        return new Promise(resolve => {
            const initialPortfolioLength = MOCK_PORTFOLIOS.length;
            MOCK_STRATEGIES = MOCK_STRATEGIES.filter(s => s.portfolioId !== portfolioId);
            MOCK_PORTFOLIOS = MOCK_PORTFOLIOS.filter(p => p.id !== portfolioId);
            setTimeout(() => resolve({ success: MOCK_PORTFOLIOS.length < initialPortfolioLength }), 300);
        });
    },
};