export enum StrategyStatus {
  Ok = 'OK',
  Alert = 'Alert',
  Deactivated = 'Deactivated',
  NoTrigger = 'No Trigger',
}

export enum MetricCategory {
  Performance = 'Performance',
  Risk = 'Risk & Drawdown',
  Robustness = 'Robustness & Quality',
  Stagnation = 'Stagnation',
  Effectiveness = 'Effectiveness & Behavior',
}

export enum StrategyTypology {
  MeanReversion = 'Mean Reversion',
  Stationary = 'Stationary',
  Breakout = 'Breakout',
}

export enum ExtractionType {
  IdeaDriven = 'Idea Driven',
  DataDriven = 'Data Driven',
}

export interface MetricRule {
  metricId: string;
  name: string;
  alertThreshold: number;
  deactivationThreshold: number;
  isAlerting: boolean;
}

export interface Metric {
  id: string;
  name: string;
  category: MetricCategory;
  backtestValue: number | string;
  realtimeValue: number | string;
  backtestValueAlt?: string;  // Alternative value (e.g., percentage when main is absolute)
  realtimeValueAlt?: string;  // Alternative value (e.g., percentage when main is absolute)
  pValue: number;
  unit: string; // '%', '$', 'days', ''
}

export interface Strategy {
  id: string;
  portfolioId: string;
  magicNumber: number;
  name: string;
  symbol: string;
  timeframe: string;
  typology?: StrategyTypology;
  extractionType?: ExtractionType;
  status: StrategyStatus;
  metrics: Metric[];
  pnlCurve?: { trade: number; date: string; Backtest?: number; 'Real Time'?: number }[];
}

export interface Portfolio {
  id: string;
  name: string;
  ownerId: string;
  deactivationRules?: DeactivationRule[];
  metricRules?: MetricRule[];
  initialBalance?: number;
  // FIX: Add missing property to fix type error in PortfolioSettingsModal.
  defaultDriftScoreThreshold?: number;
}

export interface DeactivationRule {
  id: string;
  metricId: string;
  condition: 'greater_than' | 'less_than';
  threshold: number;
  isActive: boolean;
}

// FIX: Se agregaron los tipos faltantes para las recomendaciones de la IA para resolver errores de importación.
export interface SignificantMetric {
  name: string;
  bt: number;
  rt: number;
  p_value: number;
}

export interface AIRecommendation {
  status: 'ok' | 'drift';
  drift_score: number;
  significant_metrics: SignificantMetric[];
  explanation: string;
  recommended_action: 'hold' | 'pause' | 'stop';
}
