export type AssetType = 'stock' | 'etf' | 'mutual_fund' | 'money_market' | 'bond' | 'other';
export type Currency = 'ILS' | 'USD' | 'EUR';

export interface Holding {
  id: string;
  portfolio_name: string;      // e.g., 'אקסלנס מסחר עצמאי', 'IBKR'
  symbol: string;              // e.g., 'CSPX.L', 'VOO', 'NVDA', '1159250'
  name: string;                // e.g., 'iShares Core S&P 500', 'Nvidia'
  asset_type: AssetType;
  shares: number;              // כמות יחידות
  avg_buy_price: number;       // שער קנייה ממוצע במטבע המקור
  current_price: number;       // מחיר נוכחי במטבע המקור
  currency: Currency;          // מטבע המקור
  exchange_rate_to_ils: number;// שער המרה לשקל (1 לש"ח, ~3.65 ל-$)
  day_change_pct?: number;     // שינוי יומי באחוזים
  week_change_pct?: number;    // שינוי שבועי באחוזים
  notes?: string;
  updated_at?: string;
}

export interface PortfolioCash {
  ils: number;                 // מזומן בש"ח
  usd: number;                 // מזומן בדולר
  usd_rate: number;            // שער דולר עדכני
}

export interface PortfolioTransaction {
  id: string;
  holding_id?: string;
  symbol: string;
  name: string;
  shares_sold: number;
  sell_price: number;
  currency: Currency;
  gross_proceeds_ils: number;
  capital_gain_ils: number;
  tax_deducted_ils: number;
  net_proceeds_ils: number;
  transferred_to_checking: boolean;
  target_period: string;       // e.g. '2026-07'
  date: string;
  notes?: string;
}
