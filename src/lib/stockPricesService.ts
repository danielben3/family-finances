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
    "id": "h-1-aapl",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "asset_type": "stock",
    "shares": 15,
    "avg_buy_price": 123.41,
    "current_price": 336.13,
    "currency": "USD",
    "exchange_rate_to_ils": 3.028,
    "day_change_pct": 0,
    "notes": "מניית אפל - ארה\"ב",
    "updated_at": "2026-09-20T12:17:58.539Z"
  },
  {
    "id": "h-2-amzn",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "AMZN",
    "name": "Amazon.com Inc.",
    "asset_type": "stock",
    "shares": 20,
    "avg_buy_price": 172.36,
    "current_price": 253.71,
    "currency": "USD",
    "exchange_rate_to_ils": 3.028,
    "day_change_pct": 0,
    "notes": "מניית אמזון - ארה\"ב",
    "updated_at": "2026-09-20T12:17:58.620Z"
  },
  {
    "id": "h-3-qcom",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "QCOM",
    "name": "Qualcomm Inc.",
    "asset_type": "stock",
    "shares": 8,
    "avg_buy_price": 145.38,
    "current_price": 177.72,
    "currency": "USD",
    "exchange_rate_to_ils": 3.028,
    "day_change_pct": 0,
    "notes": "מניית קוואלקום - ארה\"ב",
    "updated_at": "2026-09-20T12:17:58.767Z"
  },
  {
    "id": "h-4-nvda",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "NVDA",
    "name": "Nvidia Corp.",
    "asset_type": "stock",
    "shares": 6,
    "avg_buy_price": 132.13,
    "current_price": 222.27,
    "currency": "USD",
    "exchange_rate_to_ils": 3.028,
    "day_change_pct": 0,
    "notes": "מניית אנבידיה - ארה\"ב",
    "updated_at": "2026-09-20T12:17:58.883Z"
  },
  {
    "id": "h-5-shop",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "SHOP",
    "name": "Shopify Inc.",
    "asset_type": "stock",
    "shares": 65,
    "avg_buy_price": 70.08,
    "current_price": 128.5,
    "currency": "USD",
    "exchange_rate_to_ils": 3.028,
    "day_change_pct": 0,
    "notes": "מניית שופיפיי - ארה\"ב",
    "updated_at": "2026-09-20T12:17:59.000Z"
  },
  {
    "id": "h-6-sedg",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "SEDG",
    "name": "SolarEdge Technologies",
    "asset_type": "stock",
    "shares": 100,
    "avg_buy_price": 60.66,
    "current_price": 34.68,
    "currency": "USD",
    "exchange_rate_to_ils": 3.028,
    "day_change_pct": 0,
    "notes": "סולאראדג טכנולוגיות - ארה\"ב",
    "updated_at": "2026-09-20T12:17:59.112Z"
  },
  {
    "id": "h-7-spg",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "SPG",
    "name": "Simon Property Group",
    "asset_type": "stock",
    "shares": 10,
    "avg_buy_price": 95.06,
    "current_price": 205.32,
    "currency": "USD",
    "exchange_rate_to_ils": 3.028,
    "day_change_pct": 0,
    "notes": "סיימון פרופרטי גרופ - ריט ארה\"ב",
    "updated_at": "2026-09-20T12:17:59.258Z"
  },
  {
    "id": "h-8-crm",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "CRM",
    "name": "Salesforce Inc.",
    "asset_type": "stock",
    "shares": 5,
    "avg_buy_price": 227.74,
    "current_price": 237.92,
    "currency": "USD",
    "exchange_rate_to_ils": 3.028,
    "day_change_pct": 0,
    "notes": "סיילספורס - ארה\"ב",
    "updated_at": "2026-09-20T12:17:59.390Z"
  },
  {
    "id": "h-9-drs",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "DRS",
    "name": "Leonardo DRS Inc.",
    "asset_type": "stock",
    "shares": 103,
    "avg_buy_price": 23.03,
    "current_price": 37.19,
    "currency": "USD",
    "exchange_rate_to_ils": 3.028,
    "day_change_pct": 0,
    "notes": "לאונרדו די.אר.אס - ארה\"ב",
    "updated_at": "2026-09-20T12:17:59.515Z"
  },
  {
    "id": "h-10-vti",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "VTI",
    "name": "Vanguard Total Stock Market ETF",
    "asset_type": "etf",
    "shares": 4,
    "avg_buy_price": 250.5,
    "current_price": 375.43,
    "currency": "USD",
    "exchange_rate_to_ils": 3.028,
    "day_change_pct": 0,
    "notes": "קרן סל ואנגארד כלל שוק ארה\"ב",
    "updated_at": "2026-09-20T12:17:59.624Z"
  },
  {
    "id": "h-11-vug",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "VUG",
    "name": "Vanguard Growth ETF",
    "asset_type": "etf",
    "shares": 48,
    "avg_buy_price": 48.4,
    "current_price": 88.75,
    "currency": "USD",
    "exchange_rate_to_ils": 3.028,
    "day_change_pct": 0,
    "notes": "קרן סל ואנגארד צמיחה - ארה\"ב",
    "updated_at": "2026-09-20T12:17:59.751Z"
  },
  {
    "id": "h-12-qltu-ta",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "QLTU.TA",
    "name": "קווליטאו",
    "asset_type": "stock",
    "shares": 200,
    "avg_buy_price": 71.62,
    "current_price": 350,
    "currency": "ILS",
    "exchange_rate_to_ils": 1,
    "day_change_pct": 0,
    "notes": "מספר נייר 1083955 - בורסת ת\"א",
    "updated_at": "2026-09-20T12:17:59.890Z"
  },
  {
    "id": "h-13-ibi-ta",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "IBI.TA",
    "name": "איביאי בית השקעות",
    "asset_type": "stock",
    "shares": 37,
    "avg_buy_price": 54.74,
    "current_price": 457.5,
    "currency": "ILS",
    "exchange_rate_to_ils": 1,
    "day_change_pct": 0,
    "notes": "מספר נייר 175018 - בורסת ת\"א",
    "updated_at": "2026-09-20T12:18:00.038Z"
  },
  {
    "id": "h-14-bkry-ta",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "BKRY.TA",
    "name": "בכורי שדה",
    "asset_type": "stock",
    "shares": 2687,
    "avg_buy_price": 2.95,
    "current_price": 4.12,
    "currency": "ILS",
    "exchange_rate_to_ils": 1,
    "day_change_pct": 0,
    "notes": "מספר נייר 1172618 - בורסת ת\"א",
    "updated_at": "2026-09-20T12:18:00.153Z"
  },
  {
    "id": "h-15-hipr-ta",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "HIPR.TA",
    "name": "הייפר גלובל",
    "asset_type": "stock",
    "shares": 287,
    "avg_buy_price": 24.02,
    "current_price": 31.12,
    "currency": "ILS",
    "exchange_rate_to_ils": 1,
    "day_change_pct": 0,
    "notes": "מספר נייר 1184985 - בורסת ת\"א",
    "updated_at": "2026-09-20T12:18:00.281Z"
  },
  {
    "id": "h-16-ntml-ta",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "NTML.TA",
    "name": "נטו מלינדה",
    "asset_type": "stock",
    "shares": 32,
    "avg_buy_price": 172.15,
    "current_price": 121.1,
    "currency": "ILS",
    "exchange_rate_to_ils": 1,
    "day_change_pct": 0,
    "notes": "מספר נייר 1105097 - בורסת ת\"א",
    "updated_at": "2026-09-20T12:18:00.408Z"
  },
  {
    "id": "h-17-dimri-ta",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "DIMRI.TA",
    "name": "דמרי",
    "asset_type": "stock",
    "shares": 10,
    "avg_buy_price": 313.6,
    "current_price": 370.9,
    "currency": "ILS",
    "exchange_rate_to_ils": 1,
    "day_change_pct": 0,
    "notes": "מספר נייר 1090315 - בורסת ת\"א",
    "updated_at": "2026-09-20T12:18:00.598Z"
  },
  {
    "id": "h-18-5113345",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "5113345",
    "name": "קסם ת\"א 125",
    "asset_type": "mutual_fund",
    "shares": 51004,
    "avg_buy_price": 2.6176,
    "current_price": 4.1286,
    "currency": "ILS",
    "exchange_rate_to_ils": 1,
    "day_change_pct": 0,
    "notes": "קרן מחקה מדד ת\"א 125",
    "updated_at": "2026-09-20T12:18:00.598Z"
  },
  {
    "id": "h-19-1186063",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "1186063",
    "name": "אינבסקו נאסד\"ק חוץ (QQQ שקלי)",
    "asset_type": "etf",
    "shares": 686,
    "avg_buy_price": 242.76,
    "current_price": 277.6,
    "currency": "ILS",
    "exchange_rate_to_ils": 1,
    "day_change_pct": 0,
    "notes": "קרן חוץ נסחרת על מדד נאסד\"ק 100 בשקלים",
    "updated_at": "2026-09-20T12:18:00.598Z"
  },
  {
    "id": "h-20-1159250",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "1159250",
    "name": "איישרס S&P 500 שקלי",
    "asset_type": "etf",
    "shares": 46,
    "avg_buy_price": 1862.7,
    "current_price": 2491.6,
    "currency": "ILS",
    "exchange_rate_to_ils": 1,
    "day_change_pct": 0,
    "notes": "קרן חוץ נסחרת על מדד S&P 500 בשקלים",
    "updated_at": "2026-09-20T12:18:00.598Z"
  },
  {
    "id": "h-21-5124490",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "5124490",
    "name": "קסם ת\"א 35",
    "asset_type": "mutual_fund",
    "shares": 33264,
    "avg_buy_price": 1.6612,
    "current_price": 2.9964,
    "currency": "ILS",
    "exchange_rate_to_ils": 1,
    "day_change_pct": 0,
    "notes": "קרן מחקה מדד ת\"א 35",
    "updated_at": "2026-09-20T12:18:00.598Z"
  },
  {
    "id": "h-22-1146331",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "1146331",
    "name": "קסם ת\"א 90",
    "asset_type": "etf",
    "shares": 169,
    "avg_buy_price": 330.84,
    "current_price": 334,
    "currency": "ILS",
    "exchange_rate_to_ils": 1,
    "day_change_pct": 0,
    "notes": "קרן סל על מדד ת\"א 90",
    "updated_at": "2026-09-20T12:18:00.598Z"
  },
  {
    "id": "h-23-5131966",
    "portfolio_name": "אקסלנס טרייד (120633)",
    "symbol": "5131966",
    "name": "מור אנ בנק שווה",
    "asset_type": "mutual_fund",
    "shares": 4771,
    "avg_buy_price": 2.3332,
    "current_price": 4.7662,
    "currency": "ILS",
    "exchange_rate_to_ils": 1,
    "day_change_pct": 0,
    "notes": "קרן מחקה מדד בנקים משקל שווה",
    "updated_at": "2026-09-20T12:18:00.598Z"
  },
  {
    "id": "h-26-5136694",
    "portfolio_name": "וואן זירו (ONE ZERO)",
    "symbol": "5136694",
    "name": "י.ל. כספית כשרה (ילין לפידות)",
    "asset_type": "mutual_fund",
    "shares": 183881,
    "avg_buy_price": 1.0227,
    "current_price": 1.0321,
    "currency": "ILS",
    "exchange_rate_to_ils": 1,
    "day_change_pct": 0,
    "notes": "קרן כספית שקלית מניבה ריבית",
    "updated_at": "2026-09-20T12:18:00.598Z"
  },
  {
    "id": "h-27-5135688",
    "portfolio_name": "וואן זירו (ONE ZERO)",
    "symbol": "5135688",
    "name": "מור מחקה (4A) ת\"א 125",
    "asset_type": "mutual_fund",
    "shares": 2351,
    "avg_buy_price": 4.1936,
    "current_price": 4.2375,
    "currency": "ILS",
    "exchange_rate_to_ils": 1,
    "day_change_pct": 0,
    "notes": "קרן מחקה מדד ת\"א 125",
    "updated_at": "2026-09-20T12:18:00.598Z"
  },
  {
    "id": "h-28-vtv",
    "portfolio_name": "וואן זירו (ONE ZERO)",
    "symbol": "VTV",
    "name": "Vanguard Value ETF",
    "asset_type": "etf",
    "shares": 12,
    "avg_buy_price": 222.64,
    "current_price": 221.25,
    "currency": "USD",
    "exchange_rate_to_ils": 3.028,
    "day_change_pct": 0,
    "notes": "קרן סל ערך אמריקאית",
    "updated_at": "2026-09-20T12:18:00.732Z"
  },
  {
    "id": "h-29-5139258",
    "portfolio_name": "בנק אוצר החייל",
    "symbol": "5139258",
    "name": "ילין לפידות (00) כספית ניהול נזילות",
    "asset_type": "mutual_fund",
    "shares": 29747,
    "avg_buy_price": 1.0777,
    "current_price": 1.0777,
    "currency": "ILS",
    "exchange_rate_to_ils": 1,
    "day_change_pct": 0,
    "notes": "קרן כספית שקלית נזילה באוצר החייל (מספר נייר 5139258)",
    "updated_at": "2026-09-20T16:00:52.000Z"
  }
];

export const INITIAL_PORTFOLIO_CASH: PortfolioCash = {
  "ils": 18012.87,
  "usd": 2664.55,
  "usd_rate": 3.028
};
