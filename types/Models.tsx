// Type definitions
export interface Trade {
  id: string
  strategy: string
  date: string
  holdingTime?: number
  pair: string
  lot: number
  type: 'Long' | 'Short'
  entry: number
  entryLogic: 'Manual' | 'Limit'
  timeFrame?: string
  stopLoss: number
  exit: number
  exitLogic: 'Manual' | 'SL' | 'TP' | 'BR' | 'SP'
  profitLoss: number
  takeProfit: number
  notes?: string
  roi?: string
  rMultiple?: number
  risk?: 'FULL' | 'HALF'
  rules?: 'Yes' | 'No'
}

//strategy interface

export interface Strategy {
  id?: string
  name: string // e.g., "London Breakout", "Moving Average Crossover"
  description?: string // free text description
  type: 'Trend' | 'Range' | 'Breakout' | 'Reversal' | 'Scalping' | 'Swing' | 'Other'

  // Market Context
  instruments: string[] // e.g., ['EUR/USD', 'XAU/USD']
  timeframes?: string[] // e.g., ['M15', 'H1', 'Daily']
  session: 'All' | 'NewYork' | 'Asian' | 'London'

  // Rules & Conditions
  indicators?: string[] // e.g., ['RSI', 'MACD', 'EMA50']
  entryRules?: string[] // text field describing conditions
  exitRules?: string[] // text field describing conditions
  stopLossRules?: string[]
  takeProfitRules?: string[]
  riskManagement?: string // e.g., "Risk 1R per trade, max 2% equity"

  // Meta
  tags?: string[] // e.g., ['momentum', 'pullback', 'price action']
}

// Statistics interface
export interface Statistics {
  totalTrades: number
  wins: number
  losses: number
  winRate: number
  avgRMultiple: number
  profitFactor: number
  avgHoldingTime: number
  maxDrawdown: number
  netProfit: number
}