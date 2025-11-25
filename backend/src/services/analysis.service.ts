import { TradeData, CalculatedMetrics, Metric, PnlPoint } from '../types/analysis.types';

// Metric templates
const METRIC_TEMPLATES = [
    { id: 'profit_factor', name: 'Profit Factor', category: 'Robustness', unit: '' },
    { id: 'ret_dd_ratio', name: 'Ret/DD', category: 'Risk', unit: '' },
    { id: 'avg_trade', name: 'Avg. Trade', category: 'Performance', unit: '$' },
    { id: 'max_drawdown', name: 'Max DD', category: 'Risk', unit: '$' },
    { id: 'stagnation_days', name: 'Stagnation', category: 'Stagnation', unit: 'days' },
    { id: 'win_rate', name: 'Winrate', category: 'Effectiveness', unit: '%' },
    { id: 'net_profit', name: 'Net Profit', category: 'Performance', unit: '$' },
    { id: 'num_trades', name: 'Nº Trades', category: 'Effectiveness', unit: '' },
];

const cleanHeader = (h: string): string => {
    return h.replace(/"/g, '').trim().toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '');
};

const getDelimiter = (lines: string[]): string => {
    if (lines.length === 0) return ',';
    if (lines[0].toLowerCase().startsWith('sep=')) {
        const sep = lines[0].substring(4).trim();
        if (sep === '\\t') return '\t';
        return sep || '\t';
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
            } catch (e) {
                console.error("Could not parse profit from line: ", line);
                return null;
            }
        })
        .filter((t): t is TradeData => t !== null);

    return [...trades].sort((a, b) => a.closeTime.getTime() - b.closeTime.getTime());
};

const parseStrategyTesterCsvReport = (lines: string[]): TradeData[] => {
    const dealsHeaderIndex = lines.findIndex(line => {
        const lower = line.trim().toLowerCase();
        return lower.startsWith('"time","deal","symbol"') || lower.startsWith('time,deal,symbol');
    });
    if (dealsHeaderIndex === -1) {
        throw new Error('Could not find the "Deals" header row in the Strategy Tester Report CSV.');
    }
    const header = lines[dealsHeaderIndex].split(',').map(h => cleanHeader(h));

    const profitIdx = header.findIndex(h => h === 'profit');
    const timeIdx = header.findIndex(h => h === 'time');
    const directionIdx = header.findIndex(h => h === 'direction');
    const swapIdx = header.findIndex(h => h === 'swap');
    const commissionIdx = header.findIndex(h => h === 'commission');
    const feeIdx = header.findIndex(h => h === 'fee'); // Some reports have Fee

    if (profitIdx === -1 || timeIdx === -1 || directionIdx === -1) {
        throw new Error('Could not find required columns (Time, Direction, Profit) in Deals section.');
    }

    const dealLines = lines.slice(dealsHeaderIndex + 1);

    const trades = dealLines.map(line => {
        const rowData = (line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || []).map(val => val.replace(/"/g, '').trim());
        if (rowData.length < header.length) return null;

        const direction = rowData[directionIdx];
        if (direction !== 'out') return null;

        try {
            const parseValue = (val: string) => {
                if (!val) return 0;
                return parseFloat(val.replace(/\s/g, ''));
            };

            let profit = parseValue(rowData[profitIdx]);

            if (swapIdx !== -1) {
                profit += parseValue(rowData[swapIdx]);
            }
            if (commissionIdx !== -1) {
                profit += parseValue(rowData[commissionIdx]);
            }
            if (feeIdx !== -1) {
                profit += parseValue(rowData[feeIdx]);
            }

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

export const calculateMetrics = (fileContent: string): CalculatedMetrics => {
    const cleanedContent = fileContent.replace(/[\uFEFF\0]/g, '');
    const lines = cleanedContent.split(/\r?\n/).map(l => l.trim()).filter(line => line !== '');

    if (lines.length < 1) throw new Error("File is empty or invalid.");

    let trades: TradeData[];

    const isMtReport = /strategy tester report/i.test(lines[0]);

    if (isMtReport) {
        // Check for CSV format (Deals section header)
        const hasCsvDeals = lines.some(l => {
            const lower = l.trim().toLowerCase();
            return lower.startsWith('"time","deal","symbol"') || lower.startsWith('time,deal,symbol');
        });

        if (hasCsvDeals) {
            console.log('Detected MT Strategy Tester CSV Report');
            trades = parseStrategyTesterCsvReport(lines);
        } else {
            console.log('Detected MT Strategy Tester TXT Report');
            trades = parseStrategyTesterTxtReport(lines);
        }
    } else {
        console.log('Detected Generic Separated Value File');
        trades = parseGenericSeparatedValueFile(lines);
    }

    if (trades.length === 0) throw new Error(`No valid trades found. Please check file format and content.`);

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
    const pnlData: { equity: number; date: Date }[] = [];

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
    if (finalStagnation > maxStagnation) maxStagnation = finalStagnation;

    const maxDrawdownPercent = peakEquity > 10000 ? (maxDrawdownValue / peakEquity) * 100 : 0;
    const returnToDD = maxDrawdownValue > 0 ? netProfit / maxDrawdownValue : (netProfit > 0 ? 999 : 0);

    return {
        netProfit, numTrades, winRate, avgTrade, profitFactor, maxDrawdownValue,
        maxDrawdownPercent, returnToDD, stagnationDays: Math.floor(maxStagnation), pnlData,
    };
};

const calculatePValue = (bt: number, rt: number): number => {
    if (bt === 0 && rt === 0) return 1.0;
    const diff = Math.abs(bt - rt);
    const avg = (Math.abs(bt) + Math.abs(rt)) / 2;
    if (avg === 0) return 0.0;
    const relativeDiff = diff / avg;
    const pValue = Math.exp(-relativeDiff * 5);
    return parseFloat(pValue.toFixed(4));
};

export const analyzeStrategy = (backtestContent: string, realtimeContent: string): {
    metrics: Metric[];
    pnlCurve: PnlPoint[];
    magicNumber: number;
} => {
    const backtestMetrics = calculateMetrics(backtestContent);
    const realtimeMetrics = calculateMetrics(realtimeContent);

    const extractMagicNumber = (content: string): number => {
        const match = content.match(/MagicNumber=(\d+)/i);
        return match && match[1] ? parseInt(match[1], 10) : Date.now() % 1000000;
    };

    const magicNumber = extractMagicNumber(backtestContent);

    const metricsMap: { [key: string]: { bt: number; rt: number; btAlt?: number; rtAlt?: number } } = {
        'net_profit': { bt: backtestMetrics.netProfit, rt: realtimeMetrics.netProfit },
        'num_trades': { bt: backtestMetrics.numTrades, rt: realtimeMetrics.numTrades },
        'win_rate': { bt: backtestMetrics.winRate, rt: realtimeMetrics.winRate },
        'avg_trade': { bt: backtestMetrics.avgTrade, rt: realtimeMetrics.avgTrade },
        'profit_factor': { bt: backtestMetrics.profitFactor, rt: realtimeMetrics.profitFactor },
        'max_drawdown': {
            bt: backtestMetrics.maxDrawdownValue,
            rt: realtimeMetrics.maxDrawdownValue,
            btAlt: backtestMetrics.maxDrawdownPercent,
            rtAlt: realtimeMetrics.maxDrawdownPercent
        },
        'ret_dd_ratio': { bt: backtestMetrics.returnToDD, rt: realtimeMetrics.returnToDD },
        'stagnation_days': { bt: backtestMetrics.stagnationDays, rt: realtimeMetrics.stagnationDays },
    };

    const finalMetrics: Metric[] = METRIC_TEMPLATES
        .filter(m => metricsMap[m.id])
        .map(metricTemplate => {
            const values = metricsMap[metricTemplate.id];
            const isInt = ['num_trades', 'stagnation_days'].includes(metricTemplate.id);
            const metric: Metric = {
                ...metricTemplate,
                backtestValue: isInt ? values.bt.toFixed(0) : values.bt.toFixed(2),
                realtimeValue: isInt ? values.rt.toFixed(0) : values.rt.toFixed(2),
                pValue: calculatePValue(values.bt, values.rt),
            };

            // Add alternative values if present (e.g., percentage for Max DD)
            if (values.btAlt !== undefined) {
                metric.backtestValueAlt = values.btAlt.toFixed(2);
            }
            if (values.rtAlt !== undefined) {
                metric.realtimeValueAlt = values.rtAlt.toFixed(2);
            }

            return metric;
        });

    const pnlCurve: PnlPoint[] = [];

    // Determine if there is overlap and filter Backtest data
    let filteredBacktestPnl = backtestMetrics.pnlData;
    let cumulativeBTPnl = 10000;
    let backtestTradeCount = backtestMetrics.numTrades;

    if (realtimeMetrics.pnlData.length > 0) {
        const realTimeStartDate = realtimeMetrics.pnlData[0].date;
        // Filter backtest points that are on or after the RealTime start date
        filteredBacktestPnl = backtestMetrics.pnlData.filter(p => p.date < realTimeStartDate);

        // Update cumulative PnL and trade count based on filtered data
        if (filteredBacktestPnl.length > 0) {
            cumulativeBTPnl = filteredBacktestPnl[filteredBacktestPnl.length - 1].equity;
            backtestTradeCount = filteredBacktestPnl.length;
        } else {
            // If all backtest data is filtered out (unlikely but possible), start from initial
            cumulativeBTPnl = 10000;
            backtestTradeCount = 0;
        }
    } else if (backtestMetrics.pnlData.length > 0) {
        cumulativeBTPnl = backtestMetrics.pnlData[backtestMetrics.pnlData.length - 1].equity;
    }

    // Add Backtest points to curve
    filteredBacktestPnl.forEach((pnlPoint, i) => {
        pnlCurve.push({
            trade: i + 1,
            date: pnlPoint.date.toISOString().split('T')[0],
            'Backtest': parseFloat(pnlPoint.equity.toFixed(2))
        });
    });

    // Add Real Time points to curve, connecting to the end of Backtest
    realtimeMetrics.pnlData.forEach((pnlPoint, i) => {
        pnlCurve.push({
            trade: backtestTradeCount + i + 1,
            date: pnlPoint.date.toISOString().split('T')[0],
            'Real Time': parseFloat((cumulativeBTPnl - 10000 + pnlPoint.equity).toFixed(2))
        });
    });

    return { metrics: finalMetrics, pnlCurve, magicNumber };
};
