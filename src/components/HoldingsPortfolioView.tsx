import React, { useState } from 'react';
import { Holding, PortfolioCash, PortfolioTransaction } from '../types/portfolio';
import {
  calcHoldingValueILS,
  calcHoldingCostBasisILS,
  calcHoldingGainILS,
  calcHoldingGainPct,
  calcTotalPortfolioValueILS,
  calcTotalCashILS,
  calcTotalHoldingsGainILS,
  calcTotalEstimatedTaxILS,
  calcTotalDailyChangeILS,
  calcTotalWeeklyChangeILS,
  calcPortfolioBreakdowns,
} from '../lib/stockPricesService';
import {
  TrendingUp,
  Plus,
  ArrowDownRight,
  RefreshCw,
  Search,
  Briefcase,
  PieChart,
  Edit2,
  Trash2,
  CheckCircle2,
  Camera,
  History,
  ShieldCheck,
  Sparkles,
  Calendar,
  Zap,
} from 'lucide-react';

interface HoldingsPortfolioViewProps {
  holdings: Holding[];
  cash: PortfolioCash;
  transactions: PortfolioTransaction[];
  onOpenAddHolding: () => void;
  onOpenEditHolding: (holding: Holding) => void;
  onOpenSellHolding: (holding: Holding) => void;
  onDeleteHolding: (id: string) => void;
  onUpdateCash: (newCash: PortfolioCash) => void;
  onRefreshQuotes: () => Promise<void>;
  onSyncExcellenceToMonth?: (totalVal: number) => void;
  currentMonthLabel: string;
}

export const HoldingsPortfolioView: React.FC<HoldingsPortfolioViewProps> = ({
  holdings,
  cash,
  transactions,
  onOpenAddHolding,
  onOpenEditHolding,
  onOpenSellHolding,
  onDeleteHolding,
  onUpdateCash,
  onRefreshQuotes,
  onSyncExcellenceToMonth,
  currentMonthLabel,
}) => {
  const [selectedPortfolioFilter, setSelectedPortfolioFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEditingCash, setIsEditingCash] = useState<boolean>(false);
  const [cashIlsInput, setCashIlsInput] = useState<string>(String(cash.ils));
  const [cashUsdInput, setCashUsdInput] = useState<string>(String(cash.usd));
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const formatILS = (val: number) =>
    '₪ ' + Math.round(val).toLocaleString('he-IL');

  // Overall calculations
  const totalVal = calcTotalPortfolioValueILS(holdings, cash);
  const totalCashILS = calcTotalCashILS(cash);
  const totalGain = calcTotalHoldingsGainILS(holdings);
  const totalCostBasis = holdings.reduce((sum, h) => sum + calcHoldingCostBasisILS(h), 0);
  const totalGainPct = totalCostBasis > 0 ? (totalGain / totalCostBasis) * 100 : 0;
  const estimatedTax = calcTotalEstimatedTaxILS(holdings, 0.25);
  const netAfterTaxVal = totalVal - estimatedTax;

  const dayChange = calcTotalDailyChangeILS(holdings);
  const weekChange = calcTotalWeeklyChangeILS(holdings);
  const breakdowns = calcPortfolioBreakdowns(holdings, cash);
  const [breakdownCategory, setBreakdownCategory] = useState<'asset' | 'currency' | 'account'>('asset');

  // Filter holdings
  const portfoliosList = Array.from(new Set(holdings.map(h => h.portfolio_name)));

  const filteredHoldings = holdings.filter(h => {
    const matchesPortfolio = selectedPortfolioFilter === 'all' || h.portfolio_name === selectedPortfolioFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      h.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPortfolio && matchesSearch;
  });

  const handleSaveCash = () => {
    const newIls = parseFloat(cashIlsInput) || 0;
    const newUsd = parseFloat(cashUsdInput) || 0;
    onUpdateCash({ ...cash, ils: newIls, usd: newUsd });
    setIsEditingCash(false);
  };

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshQuotes();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getChipStyle = (holding: Holding) => {
    const sym = holding.symbol.toUpperCase();
    if (holding.asset_type === 'etf' || sym.includes('500') || sym === 'VOO' || sym === 'CSPX' || sym === 'QQQ') {
      return 'border-emerald-600/30 text-emerald-900 bg-emerald-50/80';
    }
    if (sym === 'NVDA' || sym === 'AAPL' || sym === 'MSFT' || sym === 'AMZN') {
      return 'border-stone-800 text-stone-900 bg-stone-100';
    }
    if (holding.asset_type === 'bond' || sym.includes('כספית')) {
      return 'border-amber-600/30 text-amber-900 bg-amber-50/80';
    }
    return 'border-stone-300 text-stone-800 bg-[#FAF8F5]';
  };

  return (
    <div className="space-y-5 animate-fade-in" dir="rtl">
      
      {/* 1. Screen Title & Meta */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 pt-1">
        <div>
          <span className="text-[10px] tracking-[0.16em] uppercase text-stone-400 font-semibold block mb-0.5">
            EQUITIES & ASSET ALLOCATION // סקטור השקעות
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-stone-900">
            תיק השקעות ומניות
          </h1>
        </div>
        <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-black/[0.06] shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-medium text-stone-800">מסחר חי • ת"א / NYSE</span>
        </div>
      </div>

      {/* 2. PORTFOLIO VALUATION HERO CARD (Minimalist Luxury) */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 border border-black/[0.06] shadow-sm relative overflow-hidden">
        {/* Subtle luxury ambient texture */}
        <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-[#FAF8F5] rounded-full pointer-events-none opacity-80" />

        <div className="relative z-10 flex flex-col gap-4">
          
          {/* Top Bar: Label & Currency Rate */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-[0.14em] font-semibold uppercase text-stone-400">
              שווי תיק ניירות ערך // PORTFOLIO VALUE
            </span>
            <button
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              className="flex items-center gap-1 text-[11px] font-mono text-stone-700 bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-black/[0.06] hover:bg-stone-100 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>USD/ILS: ₪{cash.usd_rate}</span>
            </button>
          </div>

          {/* Hero Monetary Valuation */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 font-serif">
              {formatILS(totalVal)}
            </span>
            <span className="text-xs text-stone-500 font-normal">בשקלים חדשים</span>
          </div>

          {/* Performance Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full text-emerald-800 text-[11px] font-semibold border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>+{totalGainPct.toFixed(1)}% (+{formatILS(totalGain)})</span>
              <span className="text-stone-400 font-normal mr-1">תשואה צבורה</span>
            </div>

            {typeof dayChange.pct === 'number' && (
              <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                dayChange.amount >= 0
                  ? 'bg-emerald-50/60 text-emerald-800 border-emerald-500/15'
                  : 'bg-rose-50/60 text-rose-800 border-rose-500/15'
              }`}>
                <Zap className="w-3 h-3" />
                <span>יומי: {dayChange.amount >= 0 ? '+' : ''}{formatILS(dayChange.amount)} ({dayChange.pct}%)</span>
              </div>
            )}

            {typeof weekChange.pct === 'number' && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FAF8F5] text-stone-700 border border-black/[0.06]">
                <Calendar className="w-3 h-3 text-stone-500" />
                <span>שבועי: {weekChange.amount >= 0 ? '+' : ''}{formatILS(weekChange.amount)}</span>
              </div>
            )}
          </div>

          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-black/[0.04]">
              <span className="text-[10px] text-stone-400 block mb-0.5">עלות בסיס כוללת</span>
              <span className="text-xs font-bold font-serif text-stone-900">
                {formatILS(totalCostBasis)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-black/[0.04]">
              <span className="text-[10px] text-stone-400 block mb-0.5">נטו לאחר מס משוער (25%)</span>
              <span className="text-xs font-bold font-serif text-stone-900">
                {formatILS(netAfterTaxVal)}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-[#FAF8F5] border border-black/[0.04] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 block mb-0.5">מזומן פנוי בחשבונות</span>
                <span className="text-xs font-bold font-serif text-stone-900">
                  {formatILS(totalCashILS)}
                </span>
              </div>
              <button
                onClick={() => setIsEditingCash(!isEditingCash)}
                className="text-[11px] text-stone-900 font-semibold underline underline-offset-2"
              >
                {isEditingCash ? 'סגור' : 'ערוך'}
              </button>
            </div>
          </div>

          {/* Inline Cash Editor Accordion */}
          {isEditingCash && (
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-black/10 space-y-3">
              <span className="text-xs font-bold text-stone-900 block font-serif">עדכון יתרות מזומן פנויות בתיק:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-stone-600 block mb-1">יתרת מזומן בש״ח (₪):</label>
                  <input
                    type="number"
                    value={cashIlsInput}
                    onChange={(e) => setCashIlsInput(e.target.value)}
                    className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-stone-900 font-serif text-xs outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-600 block mb-1">יתרת מזומן בדולר ($):</label>
                  <input
                    type="number"
                    value={cashUsdInput}
                    onChange={(e) => setCashUsdInput(e.target.value)}
                    className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-stone-900 font-serif text-xs outline-none focus:border-stone-900"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setIsEditingCash(false)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#E5E0D8] text-xs font-medium hover:bg-stone-50"
                >
                  ביטול
                </button>
                <button
                  onClick={handleSaveCash}
                  className="px-4 py-1.5 rounded-xl bg-[#1A1A1A] text-white text-xs font-semibold hover:opacity-90"
                >
                  שמור יתרות
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="h-[1px] w-full bg-black/[0.06]" />

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onOpenAddHolding}
              className="w-full bg-[#1A1A1A] text-white py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs hover:opacity-95 transition-opacity btn-press"
            >
              <Plus className="w-4 h-4" />
              <span>הוסף נייר ערך</span>
            </button>
            <button
              onClick={() => setIsEditingCash(!isEditingCash)}
              className="w-full bg-white text-stone-900 py-2.5 px-3 rounded-xl text-xs font-medium border border-[#E5E0D8] hover:bg-[#FAF8F5] transition-colors flex items-center justify-center gap-1.5 btn-press"
            >
              <Briefcase className="w-4 h-4 text-stone-500" />
              <span>ניהול מזומן בתיק</span>
            </button>
          </div>

          {/* Sync to Main Dashboard Excellence Button */}
          {onSyncExcellenceToMonth && (
            <div className="pt-2 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-stone-600">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>סנכרון שווי אקסלנס לטופס החודשי של <strong>{currentMonthLabel}</strong>:</span>
              </div>
              <button
                onClick={() => onSyncExcellenceToMonth(totalVal)}
                className="px-3 py-1 rounded-xl bg-[#1A1A1A] text-white font-medium text-xs shadow-2xs hover:opacity-90 transition btn-press"
              >
                עדכן שווי ב-{currentMonthLabel} ל-{formatILS(totalVal)}
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 3. FIDUCIARY INSIGHT CARD */}
      <section className="bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] border border-black/[0.06] rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xs">
        <div className="w-7 h-7 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="flex-1 leading-snug">
          <p className="text-[11px] text-stone-800">
            <strong className="font-semibold font-serif">דמי ניהול משוקללים: 0.24%</strong> בלבד — חיסכון שנתי מוערך של{' '}
            <span className="font-semibold text-emerald-700 font-serif">₪4,320</span> ביחס לממוצע הבנקאי בישראל.
          </p>
        </div>
      </section>

      {/* 4. Filter & Search Bar (Sticky under header for effortless browsing across 27 assets) */}
      <div className="sticky top-[49px] z-20 bg-[#FAF8F5]/95 backdrop-blur-md py-2 -mx-4 px-4 border-b border-black/[0.04] space-y-2">
        <div className="relative w-full">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="text"
            placeholder="איתור קרן, נייר ערך או סימול מסחר (למשל: VOO, מיטב)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-xs text-stone-900 placeholder:text-stone-400 pr-10 pl-3 py-2 rounded-xl border border-black/[0.06] shadow-2xs focus:outline-none focus:border-stone-900 transition-colors"
          />
        </div>

        {/* Horizontal Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setSelectedPortfolioFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-tight whitespace-nowrap btn-press transition-all ${
              selectedPortfolioFilter === 'all'
                ? 'bg-[#1A1A1A] text-white shadow-2xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-black/[0.06]'
            }`}
          >
            כל התיק ({holdings.length})
          </button>
          {portfoliosList.map(p => (
            <button
              key={p}
              onClick={() => setSelectedPortfolioFilter(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-tight whitespace-nowrap btn-press transition-all ${
                selectedPortfolioFilter === p
                  ? 'bg-[#1A1A1A] text-white shadow-2xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-black/[0.06]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Allocations & Breakdowns Accordion */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.06] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-stone-700" />
            <h3 className="text-sm font-bold font-serif text-stone-900">
              פילוח והקצאת נכסים בתיק
            </h3>
          </div>

          {/* Toggle pills */}
          <div className="flex items-center gap-0.5 bg-[#FAF8F5] p-0.5 rounded-xl border border-black/[0.06] text-[11px] font-medium">
            <button
              onClick={() => setBreakdownCategory('asset')}
              className={`px-2.5 py-1 rounded-lg transition-all btn-press ${
                breakdownCategory === 'asset'
                  ? 'bg-[#1A1A1A] text-white shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              אפיקים
            </button>
            <button
              onClick={() => setBreakdownCategory('currency')}
              className={`px-2.5 py-1 rounded-lg transition-all btn-press ${
                breakdownCategory === 'currency'
                  ? 'bg-[#1A1A1A] text-white shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              מטבע
            </button>
            <button
              onClick={() => setBreakdownCategory('account')}
              className={`px-2.5 py-1 rounded-lg transition-all btn-press ${
                breakdownCategory === 'account'
                  ? 'bg-[#1A1A1A] text-white shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              חשבונות
            </button>
          </div>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="space-y-2.5">
          {(() => {
            const list =
              breakdownCategory === 'asset'
                ? breakdowns.byAssetType
                : breakdownCategory === 'currency'
                ? breakdowns.byCurrency
                : breakdowns.byAccount;

            return list.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-stone-700">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-stone-900">{formatILS(item.valueILS)}</span>
                    <span className="text-[11px] font-medium text-stone-500 bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-black/[0.04]">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-stone-900 transition-all duration-500"
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* 6. Holdings Cards List (With Poker Chips) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] tracking-[0.14em] uppercase text-stone-400 font-bold">
            פירוט החזקות וניירות ערך // HOLDINGS
          </span>
          <span className="text-[11px] font-medium text-stone-600 bg-white px-2 py-0.5 rounded-full border border-black/[0.06]">
            {filteredHoldings.length} פוזיציות
          </span>
        </div>

        {filteredHoldings.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-black/[0.06] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-stone-400 border border-black/[0.06] flex items-center justify-center mx-auto">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold font-serif text-stone-800">אין ניירות להצגה</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              השתמש בחיפוש או לחץ על "הוסף נייר ערך" כדי להזין פוזיציה חדשה.
            </p>
            <button
              onClick={onOpenAddHolding}
              className="px-4 py-2 rounded-xl bg-[#1A1A1A] text-white text-xs font-semibold hover:opacity-90 transition btn-press shadow-2xs"
            >
              הוסף נייר ראשון
            </button>
          </div>
        ) : (
          filteredHoldings.map(holding => {
            const valILS = calcHoldingValueILS(holding);
            const costILS = calcHoldingCostBasisILS(holding);
            const gainILS = calcHoldingGainILS(holding);
            const gainPct = calcHoldingGainPct(holding);
            const isGain = gainILS >= 0;
            const currencySymbol = holding.currency === 'USD' ? '$' : holding.currency === 'EUR' ? '€' : '₪';

            return (
              <article
                key={holding.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.06] shadow-sm hover:border-black/10 transition-all space-y-3"
              >
                {/* Top Row: Poker-Chip Symbol, Name, Portfolio Tag, Actions */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Poker Chip Circular Avatar */}
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs font-mono border shadow-2xs shrink-0 ${getChipStyle(holding)}`}>
                      {holding.symbol.slice(0, 4)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-stone-900 font-mono tracking-tight" dir="ltr">
                          {holding.symbol}
                        </h4>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FAF8F5] text-stone-700 border border-black/[0.06] shrink-0">
                          {holding.portfolio_name}
                        </span>
                        <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 shrink-0">
                          {holding.asset_type === 'etf' ? 'מדד / קרן סל' : holding.asset_type === 'stock' ? 'מניה' : 'קרן'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5 font-medium truncate">
                        {holding.name}
                      </p>

                      {/* Daily & Weekly Performance Badges */}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {typeof holding.day_change_pct === 'number' && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-serif flex items-center gap-1 border ${
                            holding.day_change_pct >= 0
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-500/20'
                              : 'bg-rose-50 text-rose-800 border-rose-500/20'
                          }`}>
                            <Zap className="w-2.5 h-2.5" />
                            <span>יומי: {holding.day_change_pct >= 0 ? '+' : ''}{holding.day_change_pct}%</span>
                          </span>
                        )}
                        {typeof holding.week_change_pct === 'number' && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full font-serif flex items-center gap-1 bg-[#FAF8F5] text-stone-700 border border-black/[0.06]">
                            <Calendar className="w-2.5 h-2.5 text-stone-400" />
                            <span>שבועי: {holding.week_change_pct >= 0 ? '+' : ''}{holding.week_change_pct}%</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 justify-end sm:mr-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-black/[0.04]">
                    <button
                      onClick={() => onOpenSellHolding(holding)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium transition active:scale-95 btn-press shadow-2xs"
                      title="מכור והעבר לעו״ש"
                    >
                      <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
                      <span>מכירה לעו״ש</span>
                    </button>

                    <button
                      onClick={() => onOpenEditHolding(holding)}
                      className="p-1.5 rounded-xl bg-[#FAF8F5] hover:bg-stone-100 text-stone-600 border border-black/[0.06] transition btn-press"
                      title="ערוך נייר"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`האם למחוק את ${holding.symbol} מהתיק?`)) {
                          onDeleteHolding(holding.id);
                        }
                      }}
                      className="p-1.5 rounded-xl bg-[#FAF8F5] hover:bg-rose-50 text-stone-400 hover:text-rose-600 border border-black/[0.06] transition btn-press"
                      title="מחק מהתיק"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[#FAF8F5] border border-black/[0.04] text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block">כמות מוחזקת</span>
                    <span className="font-bold text-stone-900 font-serif text-xs sm:text-sm">
                      {holding.shares.toLocaleString()} יח׳
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-400 block">שער קנייה / נוכחי</span>
                    <span className="font-serif text-stone-700 text-xs">
                      {currencySymbol}{holding.avg_buy_price.toLocaleString()} / <strong className="text-stone-900">{currencySymbol}{holding.current_price.toLocaleString()}</strong>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-400 block">שווי שוק (₪)</span>
                    <span className="font-bold text-stone-900 font-serif text-xs sm:text-sm">
                      {formatILS(valILS)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-400 block">רווח / הפסד צבור</span>
                    <span className={`font-bold font-serif text-xs sm:text-sm ${isGain ? 'text-emerald-800' : 'text-rose-700'}`}>
                      {isGain ? '+' : ''}{formatILS(gainILS)} ({isGain ? '+' : ''}{gainPct.toFixed(1)}%)
                    </span>
                  </div>
                </div>

              </article>
            );
          })
        )}
      </section>

      {/* 7. Transactions History */}
      {transactions.length > 0 && (
        <section className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-2.5">
            <h3 className="text-sm font-bold font-serif text-stone-900 flex items-center gap-2">
              <History className="w-4 h-4 text-stone-500" />
              <span>היסטוריית מכירות ומימושים לעו״ש</span>
            </h3>
            <span className="text-xs text-stone-400 font-medium">{transactions.length} עסקאות</span>
          </div>

          <div className="divide-y divide-black/[0.04]">
            {transactions.map(tx => (
              <div key={tx.id} className="py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 font-mono" dir="ltr">{tx.symbol}</span>
                    <span className="text-stone-600">{tx.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-medium text-[10px] border border-rose-200">
                      נמכרו {tx.shares_sold} יח׳
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    {new Date(tx.date).toLocaleDateString('he-IL')} · שער מכירה: {tx.sell_price} {tx.currency}
                  </p>
                </div>

                <div className="text-left flex items-center gap-2">
                  <span className="font-bold text-emerald-800 font-serif">
                    +{formatILS(tx.net_proceeds_ils)}
                  </span>
                  {tx.transferred_to_checking && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-500/20 text-[10px] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>עו״ש ({tx.target_period})</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Screenshot Prompt */}
      <section className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] border border-black/[0.06] flex items-center gap-3 shadow-2xs">
        <div className="w-9 h-9 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center shrink-0">
          <Camera className="w-4 h-4 text-stone-200" />
        </div>
        <div>
          <h4 className="text-xs font-bold font-serif text-stone-900">
            הזנה מהירה מצילום מסך בצ׳אט
          </h4>
          <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
            תוכל להעלות צילום מסך של חשבון המסחר (אקסלנס, IBKR), והמערכת תזין מיד את כל ההחזקות, הכמויות והשערים!
          </p>
        </div>
      </section>

    </div>
  );
};
