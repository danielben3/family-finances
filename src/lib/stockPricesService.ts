import { Holding, PortfolioCash } from '../types/portfolio';

// Fetch live USD/ILS exchange rate with safe fallback
export const fetchUsdToIlsRate = async (): Promise<number> => {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates && data.rates.ILS) {
        return Number(data.rates.ILS.toFixed(4));
      }
    }
  } catch (e) {
    console.warn('Could not fetch USD/ILS rate online, using fallback 3.65', e);
  }
  return 3.65;
};

// Calculate holding total market value in ILS
export const calcHoldingValueILS = (h: Holding): number => {
  const rate = h.currency === 'ILS' ? 1 : h.exchange_rate_to_ils || 3.65;
  return h.shares * h.current_price * rate;
};

// Calculate holding cost basis in ILS
export const calcHoldingCostBasisILS = (h: Holding): number => {
  const rate = h.currency === 'ILS' ? 1 : h.exchange_rate_to_ils || 3.65;
  return h.shares * h.avg_buy_price * rate;
};

// Calculate unrealized gain in ILS
export const calcHoldingGainILS = (h: Holding): number => {
  return calcHoldingValueILS(h) - calcHoldingCostBasisILS(h);
};

// Calculate gain percentage
export const calcHoldingGainPct = (h: Holding): number => {
  const cost = calcHoldingCostBasisILS(h);
  if (cost <= 0) return 0;
  return (calcHoldingGainILS(h) / cost) * 100;
};

// Calculate total cash in ILS
export const calcTotalCashILS = (cash: PortfolioCash): number => {
  const usdInIls = (cash.usd || 0) * (cash.usd_rate || 3.65);
  return (cash.ils || 0) + usdInIls;
};

// Calculate total portfolio value including cash
export const calcTotalPortfolioValueILS = (
  holdings: Holding[],
  cash: PortfolioCash
): number => {
  const holdingsTotal = holdings.reduce(
    (sum, h) => sum + calcHoldingValueILS(h),
    0
  );
  return holdingsTotal + calcTotalCashILS(cash);
};

// Calculate total unrealized capital gain in ILS
export const calcTotalHoldingsGainILS = (holdings: Holding[]): number => {
  return holdings.reduce((sum, h) => sum + Math.max(0, calcHoldingGainILS(h)), 0);
};

// Calculate estimated 25% capital gains tax
export const calcTotalEstimatedTaxILS = (
  holdings: Holding[],
  taxRate = 0.25
): number => {
  const totalGain = calcTotalHoldingsGainILS(holdings);
  return Math.round(totalGain * taxRate);
};

// Initial sample holdings placeholder (Excellence & Global ETFs)
export const INITIAL_HOLDINGS_SEED: Holding[] = [
  {
    id: 'holding-cspx',
    portfolio_name: 'אקסלנס (מניות חו״ל)',
    symbol: 'CSPX.L',
    name: 'iShares Core S&P 500 UCITS ETF (צבירה דולרית)',
    asset_type: 'etf',
    shares: 162.5,
    avg_buy_price: 520.4,
    current_price: 598.2,
    currency: 'USD',
    exchange_rate_to_ils: 3.65,
    day_change_pct: 0.85,
    notes: 'קרן אירית צוברת S&P 500',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'holding-nvda',
    portfolio_name: 'אקסלנס (מניות חו״ל)',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    asset_type: 'stock',
    shares: 80,
    avg_buy_price: 110.0,
    current_price: 128.5,
    currency: 'USD',
    exchange_rate_to_ils: 3.65,
    day_change_pct: 1.9,
    notes: 'ענקית השבבים וה-AI',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'holding-ta125',
    portfolio_name: 'אקסלנס (ישראל)',
    symbol: '1159250',
    name: 'קסם KSM מדד ת״א 125 סל',
    asset_type: 'etf',
    shares: 1500,
    avg_buy_price: 28.5,
    current_price: 31.2,
    currency: 'ILS',
    exchange_rate_to_ils: 1.0,
    day_change_pct: 0.35,
    notes: 'חשיפה למניות מובילות בישראל',
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_PORTFOLIO_CASH: PortfolioCash = {
  ils: 15200,
  usd: 2100,
  usd_rate: 3.65,
};
