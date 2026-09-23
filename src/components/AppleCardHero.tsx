import React, { useState } from 'react';
import { FinancialRecord } from '../types';
import { TrendingUp, TrendingDown, Eye, EyeOff, Plus, Flame, Target, Download, Wifi, ShieldCheck, Sparkles, Calculator } from 'lucide-react';

interface AppleCardHeroProps {
  currentRecord: FinancialRecord;
  previousRecord?: FinancialRecord;
  onQuickLog: () => void;
  onOpenFire: () => void;
  onScrollToGoals?: () => void;
  onExportExcel?: () => void;
  onOpenCostBasis?: () => void;
}

export const AppleCardHero: React.FC<AppleCardHeroProps> = ({
  currentRecord,
  previousRecord,
  onQuickLog,
  onOpenFire,
  onScrollToGoals,
  onExportExcel,
  onOpenCostBasis,
}) => {
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [isNetMode, setIsNetMode] = useState<boolean>(false);

  const total = currentRecord.total_wealth || 0;
  const excellence = currentRecord.excellence || 0;
  const costBasis = currentRecord.excellence_cost_basis || 0;
  const capitalGain = costBasis > 0 && excellence > costBasis ? excellence - costBasis : 0;
  const estimatedTax = Math.round(capitalGain * 0.25);
  const netTotal = total - estimatedTax;

  const displayTotal = isNetMode ? netTotal : total;

  const prevTotal = previousRecord?.total_wealth || total;
  const prevExcellence = previousRecord?.excellence || 0;
  const prevCostBasis = previousRecord?.excellence_cost_basis || 0;
  const prevCapitalGain = prevCostBasis > 0 && prevExcellence > prevCostBasis ? prevExcellence - prevCostBasis : 0;
  const prevTax = Math.round(prevCapitalGain * 0.25);
  const prevDisplayTotal = isNetMode ? prevTotal - prevTax : prevTotal;

  const diff = displayTotal - prevDisplayTotal;
  const diffPct = prevDisplayTotal > 0 ? ((displayTotal - prevDisplayTotal) / prevDisplayTotal) * 100 : 0;
  const isPositive = diff >= 0;

  const formatILS = (val: number) => {
    if (isPrivate) return '₪ •••••••';
    return '₪' + Math.round(val).toLocaleString('he-IL');
  };

  return (
    <section className="space-y-4">
      {/* Quiet Wealth RTL Master Glass Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300">
        {/* Specular Ambient Gradient Orbs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Top Row: Header & Privacy / Net Toggle */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold uppercase tracking-wider text-slate-600 text-[11px]">
                סך שווי הון כולל נטו (NET WORTH)
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400 text-[11px] font-medium">מעודכן ל-{currentRecord.label}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Gross / Net Toggle */}
              <div className="inline-flex rounded-xl bg-slate-100/90 p-0.5 text-[11px] font-bold border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setIsNetMode(false)}
                  className={`px-2.5 py-1 rounded-lg transition ${!isNetMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  ברוטו
                </button>
                <button
                  type="button"
                  onClick={() => setIsNetMode(true)}
                  className={`px-2.5 py-1 rounded-lg transition ${isNetMode ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  נטו לאחר מס
                </button>
              </div>

              {onOpenCostBasis && (
                <button
                  onClick={onOpenCostBasis}
                  className="flex items-center gap-1 text-emerald-800 hover:text-emerald-950 transition text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-xl border border-emerald-300/80 active:scale-95 shadow-xs"
                  title="הגדרת קרן וחישוב נטו"
                >
                  <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">{costBasis > 0 ? 'ערוך קרן' : 'הזן קרן'}</span>
                </button>
              )}

              <button
                onClick={() => setIsPrivate(!isPrivate)}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition text-[11px] font-semibold bg-white px-2.5 py-1 rounded-xl border border-slate-200/80 active:scale-95 shadow-xs"
                title={isPrivate ? 'הצג סכומים' : 'הסתר סכומים (מצב פרטיות)'}
              >
                {isPrivate ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isPrivate ? 'הצג' : 'פרטיות'}</span>
              </button>
            </div>
          </div>

          {/* Big Metric Display */}
          <div className="mt-5 space-y-2">
            <div className="flex flex-wrap items-baseline gap-3 sm:gap-5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tabular-nums tracking-tight">
                {formatILS(displayTotal)}
              </h1>

              {/* Emerald Glow Pill */}
              {previousRecord && (
                <div
                  className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold tabular-nums shadow-sm transition ${
                    isPositive
                      ? 'emerald-glow-pill text-emerald-800 bg-emerald-500/10 border border-emerald-600/25'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-rose-600" />
                  )}
                  <span>
                    {isPositive ? '+' : ''}
                    {diffPct.toFixed(1)}%
                  </span>
                  <span className="text-[11px] font-normal text-slate-600">
                    ({isPositive ? '+' : ''}{isPrivate ? '••••' : formatILS(diff)} החודש)
                  </span>
                </div>
              )}
            </div>

            {costBasis > 0 && isNetMode && (
              <p className="text-[11px] font-medium text-emerald-700 pt-0.5 flex items-center gap-1">
                <span>הופחת מס רווחי הון 25% מאקסלנס: -{formatILS(estimatedTax)}</span>
                <span className="text-slate-400 font-normal">(רווח צבור: +{formatILS(capitalGain)})</span>
              </p>
            )}
          </div>

          {/* Inline Metadata Stats Ledger */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-slate-200/60 text-xs">
            <div className="p-2.5 rounded-2xl bg-white/70 border border-slate-100 flex flex-col justify-between">
              <span className="text-slate-400 text-[11px] block">נזילות מיידית (עו״ש + כספית):</span>
              <span className="font-bold text-slate-900 text-sm sm:text-base tabular-nums mt-0.5">
                {formatILS((currentRecord.checking || 0) + (currentRecord.money_market || 0))}
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/70 border border-slate-100 flex flex-col justify-between">
              <span className="text-slate-400 text-[11px] block">חיסכון חודשי מדווח:</span>
              <span className="font-bold text-slate-900 text-sm sm:text-base tabular-nums mt-0.5">
                {formatILS(currentRecord.savings || 0)}
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/70 border border-slate-100 col-span-2 sm:col-span-1 flex flex-col justify-between">
              <span className="text-slate-400 text-[11px] block">פרופיל סיכון והרכב:</span>
              <span className="font-semibold text-emerald-700 text-xs sm:text-sm mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>צמיחה מאוזנת (6.2/10)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Interactive Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {/* Quick Log Form */}
        <button
          onClick={onQuickLog}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md active:scale-95 transition"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>הזנת נתונים</span>
        </button>

        {/* FIRE Calculator */}
        <button
          onClick={onOpenFire}
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-slate-800 hover:bg-slate-50 font-semibold text-xs shadow-xs active:scale-95 transition"
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span>מחשבון יעדים ו-FIRE</span>
        </button>

        {/* Cost Basis & Tax Net */}
        {onOpenCostBasis && (
          <button
            onClick={onOpenCostBasis}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-semibold text-xs shadow-xs active:scale-95 transition"
          >
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>הזנת קרן וחישוב נטו</span>
          </button>
        )}

        {/* Independence Goals */}
        {onScrollToGoals && (
          <button
            onClick={onScrollToGoals}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-slate-800 hover:bg-slate-50 font-semibold text-xs shadow-xs active:scale-95 transition"
          >
            <Target className="w-4 h-4 text-blue-600" />
            <span>יעד 2M ₪</span>
          </button>
        )}

        {/* Export Report */}
        {onExportExcel && (
          <button
            onClick={onExportExcel}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-slate-800 hover:bg-slate-50 font-semibold text-xs shadow-xs active:scale-95 transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>ייצוא לאקסל</span>
          </button>
        )}
      </div>
    </section>
  );
};