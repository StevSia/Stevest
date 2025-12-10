export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW'
}

export interface Account {
  id: string;
  name: string;
  broker: string;
  currency: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  stockCode?: string; // symbol
  date: string;
  quantity?: number; // For Buy/Sell
  price?: number; // Price per share for Buy/Sell
  amount: number; // Total value (cash impact)
  fees: number;
  notes?: string;
}

// Derived state for a specific stock holding
export interface StockHolding {
  symbol: string;
  quantity: number;
  averageCost: number; // Average buy price
  currentPrice: number; // Mocked or fetched
  totalValue: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
  realizedPL: number; // Accumulated realized P/L for this stock
}

export interface PortfolioSummary {
  totalEquity: number;
  cashBalance: number;
  holdingsValue: number;
  totalRealizedPL: number;
  totalUnrealizedPL: number;
}

export interface DividendInfo {
  symbol: string;
  companyName: string;
  yield: string;
  payDate: string;
  exDate: string;
  amountPerShare: string;
}
