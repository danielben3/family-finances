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
      {/* 1. Physical Titanium Virtual Card */}
      <div className="relative w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-slate-100 to-slate-200/90 border border-white/90 titanium-card-bevel overflow-hidden transition-all">
        {/* Specular Sheen Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent pointer-events-none opacity-80" />
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Top Row: Cardholder Branding & Chip */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500 deboss-text">
                  BEN SOVEREIGN WEALTH
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                תיק הון משפחתי רב-נכסי
              </p>
            </div>

            {/* Chip and Contactless Wave */}
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-slate-400 rotate-90" />
              {/* Microchip */}
              <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-300 to-yellow-500 border border-amber-400/90 p-1 flex flex-col justify-between shadow-xs">
                <div className="w-full h-px bg-amber-600/60" />
                <div className="flex justify-between h-3">
                  <div className="w-2.5 border-r border-amber-600/60" />
                  <div className="w-2.5 border-l border-amber-600/60" />
                </div>
                <div className="w-full h-px bg-amber-600/60" />
              </div>
            </div>
          </div>

          {/* Center: Total Net Worth Display */}
          <div className="mt-8 space-y-1.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  סך ההון המשפחתי
                </span>
                {/* Gross / Net Toggle */}
                <div className="inline-flex rounded-lg bg-slate-200/70 p-0.5 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setIsNetMode(false)}
                    className={`px-2 py-0.5 rounded-md transition ${!isNetMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    ברוטו
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNetMode(true)}
                    className={`px-2 py-0.5 rounded-md transition ${isNetMode ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    נטו לאחר מס
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {onOpenCostBasis && (
                  <button
                    onClick={onOpenCostBasis}
                    className="flex items-center gap-1 text-emerald-800 hover:text-emerald-950 transition text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300/80 active:scale-95 shadow-xs"
                    title="הגדרת קרן וחישוב נטו"
                  >
                    <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{costBasis > 0 ? 'ערוך קרן' : 'הזן קרן'}</span>
                  </button>
                )}
                <button
                  onClick={() => setIsPrivate(!isPrivate)}
                  className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition text-[11px] font-semibold bg-white/70 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-200/60 active:scale-95 shadow-xs"
                  title={isPrivate ? 'הצג סכומים' : 'הסתר סכומים (מצב פרטיות)'}
                >
                  {isPrivate ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isPrivate ? 'הצג' : 'פרטיות'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-num tracking-tight">
                {formatILS(displayTotal)}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-400">
                {currentRecord.label}
              </span>
            </div>

            {costBasis > 0 && isNetMode && (
              <p className="text-[11px] font-medium text-emerald-700 pt-0.5 flex items-center gap-1">
                <span>הופחת מס רווחי הון 25% מאקסלנס: -{formatILS(estimatedTax)}</span>
                <span className="text-slate-400 font-normal">(רווח צבור: +{formatILS(capitalGain)})</span>
              </p>
            )}
          </div>

          {/* Bottom Row: Performance Pill & Masked Security Tag */}
          <div className="mt-7 pt-4 border-t border-slate-300/50 flex items-center justify-between">
            {previousRecord ? (
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-num shadow-xs ${
                  isPositive
                    ? 'bg-emerald-500/10 text-emerald-800 border border-emerald-600/20'
                    : 'bg-rose-500/10 text-rose-800 border border-rose-600/20'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                )}
                <span>
                  {isPositive ? '+' : ''}
                  {isPrivate ? '••••' : formatILS(diff)} ({isPositive ? '+' : ''}{diffPct.toFixed(1)}%)
                </span>
                <span className="text-[10px] text-slate-500 font-normal">החודש</span>
              </div>
            ) : (
              <div className="text-xs text-slate-400">חודש בסיס</div>
            )}

            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SOV-2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Action Interactive Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {/* Quick Log Form */}
        <button
          onClick={onQuickLog}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>הזנה מהירה</span>
        </button>

        {/* FIRE Calculator */}
        <button
          onClick={onOpenFire}
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-slate-800 hover:bg-slate-50 font-semibold text-xs shadow-sm active:scale-95 transition"
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span>מחשבון FIRE ועצמאות</span>
        </button>

        {/* Cost Basis & Tax Net */}
        {onOpenCostBasis && (
          <button
            onClick={onOpenCostBasis}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-semibold text-xs shadow-sm active:scale-95 transition"
          >
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>הזנת קרן וחישוב נטו</span>
          </button>
        )}

        {/* Independence Goals */}
        {onScrollToGoals && (
          <button
            onClick={onScrollToGoals}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-slate-800 hover:bg-slate-50 font-semibold text-xs shadow-sm active:scale-95 transition"
          >
            <Target className="w-4 h-4 text-blue-600" />
            <span>יעד 2M ₪</span>
          </button>
        )}

        {/* Export Report */}
        {onExportExcel && (
          <button
            onClick={onExportExcel}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-slate-800 hover:bg-slate-50 font-semibold text-xs shadow-sm active:scale-95 transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>ייצוא לאקסל</span>
          </button>
        )}
      </div>
    </section>
  );
};