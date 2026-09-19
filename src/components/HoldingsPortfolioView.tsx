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
} from '../lib/stockPricesService';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowDownRight,
  RefreshCw,
  Coins,
  DollarSign,
  Briefcase,
  Layers,
  Edit2,
  Trash2,
  CheckCircle2,
  Camera,
  History,
  ShieldCheck,
  Sparkles,
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
    '₪' + Math.round(val).toLocaleString('he-IL');

  // Overall calculations
  const totalVal = calcTotalPortfolioValueILS(holdings, cash);
  const totalCashILS = calcTotalCashILS(cash);
  const totalGain = calcTotalHoldingsGainILS(holdings);
  const totalCostBasis = holdings.reduce((sum, h) => sum + calcHoldingCostBasisILS(h), 0);
  const totalGainPct = totalCostBasis > 0 ? (totalGain / totalCostBasis) * 100 : 0;
  const estimatedTax = calcTotalEstimatedTaxILS(holdings, 0.25);
  const netAfterTaxVal = totalVal - estimatedTax;

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

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      
      {/* 1. Header Banner & KPIs */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          
          {/* Top Row: Title & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-400 shadow-inner">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  מעקב תיק מניות והחזקות חיות
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  חישוב שווי שוק עדכני בזמן אמת, יתרות מזומן, ניהול מכירות והעברה לעו״ש
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefreshClick}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold transition active:scale-95 text-slate-200"
                title="רענן שער דולר ומחירים"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>שער דולר: ₪{cash.usd_rate}</span>
              </button>

              <button
                onClick={onOpenAddHolding}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold transition shadow-md shadow-emerald-500/30 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>הוסף נייר ערך</span>
              </button>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Portfolio ILS */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <span className="text-xs text-slate-400 font-medium block">
                סך שווי התיק הכולל (מניות + מזומן)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-num text-white">
                  {formatILS(totalVal)}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {holdings.length} ניירות מוחזקים
              </span>
            </div>

            {/* Total Unrealized Gain */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <span className="text-xs text-slate-400 font-medium block">
                רווח הון צבור (לפני מס)
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-num text-emerald-400">
                  +{formatILS(totalGain)}
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-300 mt-1 block font-num">
                +{totalGainPct.toFixed(1)}% תשואה כוללת
              </span>
            </div>

            {/* Estimated Tax & Net */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <span className="text-xs text-slate-400 font-medium block">
                נטו שנשאר בכיס (לאחר 25% מס)
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-num text-blue-300">
                  {formatILS(netAfterTaxVal)}
                </span>
              </div>
              <span className="text-[11px] text-rose-300 mt-1 block font-num">
                מס משוער: -{formatILS(estimatedTax)}
              </span>
            </div>

            {/* Cash in Account */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium block">
                    מזומן פנוי בתיק ההשקעות
                  </span>
                  <button
                    onClick={() => setIsEditingCash(!isEditingCash)}
                    className="text-[11px] text-blue-300 hover:text-white transition font-bold"
                  >
                    {isEditingCash ? 'ביטול' : 'ערוך מזומן'}
                  </button>
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold font-num text-amber-400">
                    {formatILS(totalCashILS)}
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-num">
                ₪{cash.ils.toLocaleString()} + ${cash.usd.toLocaleString()}
              </span>
            </div>

          </div>

          {/* Inline Cash Editor */}
          {isEditingCash && (
            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md space-y-3">
              <span className="text-xs font-bold text-amber-300 block">עדכון יתרות מזומן פנויות בתיק:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">יתרת מזומן בש״ח (₪):</label>
                  <input
                    type="number"
                    value={cashIlsInput}
                    onChange={(e) => setCashIlsInput(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded-xl px-3 py-2 text-white font-num text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">יתרת מזומן בדולר ($):</label>
                  <input
                    type="number"
                    value={cashUsdInput}
                    onChange={(e) => setCashUsdInput(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded-xl px-3 py-2 text-white font-num text-xs outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setIsEditingCash(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold hover:bg-white/20"
                >
                  ביטול
                </button>
                <button
                  onClick={handleSaveCash}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold"
                >
                  שמור יתרות מזומן
                </button>
              </div>
            </div>
          )}

          {/* Sync to Main Dashboard Excellence Button */}
          {onSyncExcellenceToMonth && (
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>רוצה לסנכרן שווי זה ישירות לטופס החודשי של <strong>{currentMonthLabel}</strong>?</span>
              </div>
              <button
                onClick={() => onSyncExcellenceToMonth(totalVal)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition active:scale-95"
              >
                עדכן שווי אקסלנס ב-{currentMonthLabel} ל-{formatILS(totalVal)}
              </button>
            </div>
          )}

        </div>
      </div>

      {/* 2. Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Portfolio Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedPortfolioFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedPortfolioFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            כל התיקים ({holdings.length})
          </button>
          {portfoliosList.map(p => (
            <button
              key={p}
              onClick={() => setSelectedPortfolioFilter(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedPortfolioFilter === p
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="חיפוש לפי סימול או שם..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-500"
          />
        </div>
      </div>

      {/* 3. Holdings Cards List */}
      <div className="space-y-3">
        {filteredHoldings.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800">אין ניירות להצגה</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              לחץ על "הוסף נייר ערך" או הדבק בצ׳אט צילום מסך של תיק ההשקעות שלך כדי להזין את כל הניירות.
            </p>
            <button
              onClick={onOpenAddHolding}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
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
              <div
                key={holding.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all space-y-3.5"
              >
                {/* Top Row: Symbol, Name, Portfolio Tag, Actions */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center font-bold text-xs font-mono shrink-0">
                      {holding.symbol.slice(0, 4)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900 font-mono tracking-tight" dir="ltr">
                          {holding.symbol}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
                          {holding.portfolio_name}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {holding.asset_type === 'etf' ? 'קרן סל / מדד' : holding.asset_type === 'stock' ? 'מניה' : 'קרן'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        {holding.name}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 mr-auto">
                    {/* Sell Button */}
                    <button
                      onClick={() => onOpenSellHolding(holding)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition active:scale-95 shadow-2xs"
                      title="מכור והעבר לעו״ש"
                    >
                      <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
                      <span>מכירה לעו״ש</span>
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => onOpenEditHolding(holding)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                      title="ערוך נייר"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        if (confirm(`האם למחוק את ${holding.symbol} מהתיק?`)) {
                          onDeleteHolding(holding.id);
                        }
                      }}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition"
                      title="מחק מהתיק"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
                  {/* Shares & Price */}
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">כמות מוחזקת</span>
                    <span className="font-extrabold text-slate-900 font-num text-sm">
                      {holding.shares.toLocaleString()} יח׳
                    </span>
                  </div>

                  {/* Avg Buy vs Current */}
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">שער קנייה / נוכחי</span>
                    <span className="font-bold text-slate-700 font-num">
                      {currencySymbol}{holding.avg_buy_price.toLocaleString()} / <strong className="text-slate-900">{currencySymbol}{holding.current_price.toLocaleString()}</strong>
                    </span>
                  </div>

                  {/* Total Market Value */}
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">שווי שוק כולל (₪)</span>
                    <span className="font-black text-slate-900 font-num text-sm">
                      {formatILS(valILS)}
                    </span>
                    {holding.currency !== 'ILS' && (
                      <span className="text-[10px] text-slate-400 block font-num">
                        {currencySymbol}{(holding.shares * holding.current_price).toLocaleString('he-IL', { maximumFractionDigits: 1 })}
                      </span>
                    )}
                  </div>

                  {/* Gain / Loss */}
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">רווח / הפסד צבור</span>
                    <span className={`font-black font-num text-sm ${isGain ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {isGain ? '+' : ''}{formatILS(gainILS)} ({isGain ? '+' : ''}{gainPct.toFixed(1)}%)
                    </span>
                    <span className="text-[10px] text-slate-400 block font-num">
                      עלות בסיס: {formatILS(costILS)}
                    </span>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* 4. Transactions History (Realized Sales) */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              <span>היסטוריית מכירות ומימושים לעו״ש</span>
            </h3>
            <span className="text-xs text-slate-500">{transactions.length} עסקאות בוצעו</span>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.map(tx => (
              <div key={tx.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 font-mono" dir="ltr">{tx.symbol}</span>
                    <span className="text-slate-500 font-medium">{tx.name}</span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold text-[10px]">
                      נמכרו {tx.shares_sold} יח׳
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(tx.date).toLocaleDateString('he-IL')} · שער מכירה: {tx.sell_price} {tx.currency}
                  </p>
                </div>

                <div className="text-left flex items-center gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block">פדיון נטו שהועבר:</span>
                    <span className="font-extrabold text-emerald-700 font-num text-sm">
                      +{formatILS(tx.net_proceeds_ils)}
                    </span>
                  </div>
                  {tx.transferred_to_checking && (
                    <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                      <span>הועבר לעו״ש ({tx.target_period})</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Screenshot Dropzone Notice */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              רוצה להזין אוטומטית את כל התיקים לפי צילום מסך?
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              הדבק כאן בצ׳אט צילומי מסך של חשבונות המסחר (אקסלנס, IBKR, בנק), והמערכת תזין מיד את כל ההחזקות, השערים והמזומן!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
