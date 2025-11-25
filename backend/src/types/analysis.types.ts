// Types for analysis service
export interface TradeData {
    profit: number;
    closeTime: Date;
}

export interface CalculatedMetrics {
    netProfit: number;
    numTrades: number;
    winRate: number;
    avgTrade: number;
    profitFactor: number;
    maxDrawdownValue: number;
    maxDrawdownPercent: number;
    returnToDD: number;
    stagnationDays: number;
    pnlData: { equity: number; date: Date }[];
}

export interface Metric {
    id: string;
    name: string;
    category: string;
    unit: string;
    backtestValue: string;
    realtimeValue: string;
    backtestValueAlt?: string;  // Alternative value (e.g., percentage when main is absolute)
    realtimeValueAlt?: string;  // Alternative value (e.g., percentage when main is absolute)
    pValue: number;
}

export interface PnlPoint {
    trade: number;
    date: string;
    Backtest?: number;
    'Real Time'?: number;
}
