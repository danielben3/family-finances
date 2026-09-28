import React, { useState } from 'react';
import { FinancialRecord } from '../types';
import { TrendingUp, TrendingDown, Eye, EyeOff, Plus, Flame, Target, Download, Calculator, Building2, RefreshCw } from 'lucide-react';

interface AppleCardHeroProps {
  currentRecord: FinancialRecord;
  previousRecord?: FinancialRecord;
  onQuickLog: () => void;
  onOpenFire: () => void;
  onScrollToGoals?: () => void;
  onExportExcel?: () => void;
  onOpenCostBasis?: () => void;
  onEditAsset?: (assetType: 'checking' | 'excellence' | 'onezero' | 'altshuler' | 'moneyMarket') => void;
}

export const AppleCardHero: React.FC<AppleCardHeroProps> = ({
  currentRecord,
  previousRecord,
  onQuickLog,
  onOpenFire,
  onScrollToGoals,
  onExportExcel,
  onOpenCostBasis,
  onEditAsset,
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
      {/* Minimalist Luxury Editorial Hero Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 md:p-8 border border-[#EAE6DF] card-diffused-shadow relative overflow-hidden transition-all">
        
        {/* Top Eyebrow & Mode Toggles */}
        <div className="flex items-center justify-between flex-wrap gap-2.5 pb-4 border-b border-[#EAE6DF]">
          <div className="flex items-center gap-2">
            <span className="poker-chip bg-emerald-500 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#737373]">
              סך שווי נכסים כולל // NET WORTH
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-[11px] sm:text-xs text-[#737373] font-medium">{currentRecord.label}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Gross / Net Toggle */}
            <div className="inline-flex rounded-full bg-[#FAF8F5] p-0.5 text-xs font-medium border border-[#EAE6DF]">
              <button
                type="button"
                onClick={() => setIsNetMode(false)}
                className={`px-3 py-1 rounded-full transition ${!isNetMode ? 'bg-[#1A1A1A] text-white shadow-xs font-semibold' : 'text-[#737373] hover:text-[#1A1A1A]'}`}
              >
                ברוטו
              </button>
              <button
                type="button"
                onClick={() => setIsNetMode(true)}
                className={`px-3 py-1 rounded-full transition ${isNetMode ? 'bg-[#1A1A1A] text-white shadow-xs font-semibold' : 'text-[#737373] hover:text-[#1A1A1A]'}`}
              >
                נטו
              </button>
            </div>

            {onOpenCostBasis && (
              <button
                onClick={onOpenCostBasis}
                className="flex items-center gap-1 text-[#737373] hover:text-[#1A1A1A] transition text-xs font-medium bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#EAE6DF] active:scale-95"
                title="הגדרת קרן וחישוב נטו"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{costBasis > 0 ? 'ערוך קרן' : 'הזן קרן'}</span>
              </button>
            )}

            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className="flex items-center gap-1 text-[#737373] hover:text-[#1A1A1A] transition text-xs font-medium bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#EAE6DF] active:scale-95"
              title={isPrivate ? 'הצג סכומים' : 'הסתר סכומים (מצב פרטיות)'}
            >
              {isPrivate ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPrivate ? 'הצג' : 'פרטיות'}</span>
            </button>
          </div>
        </div>

        {/* Grand Bold Net Worth Metric */}
        <div className="pt-5 sm:pt-6 space-y-3">
          <div className="flex flex-wrap items-baseline gap-3 sm:gap-5">
            <h1 className="text-4xl sm:text-6xl font-serif-luxury font-bold text-[#1A1A1A] tracking-tight">
              {formatILS(displayTotal)}
            </h1>

            {/* Performance Pill */}
            {previousRecord && (
              <div
                className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold font-num shadow-2xs ${
                  isPositive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                    : 'bg-rose-50 text-rose-800 border border-rose-200/60'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                )}
                <span>
                  {isPositive ? '+' : ''}
                  {diffPct.toFixed(1)}%
                </span>
                <span className="text-[11px] font-normal text-stone-500">
                  ({isPositive ? '+' : ''}{isPrivate ? '••••' : formatILS(diff)} בשנה החולפת)
                </span>
              </div>
            )}
          </div>

          {costBasis > 0 && isNetMode && (
            <p className="text-xs font-medium text-emerald-700 flex items-center gap-1.5 pt-1">
              <span>הופחת מס רווחי הון 25% מאקסלנס: -{formatILS(estimatedTax)}</span>
              <span className="text-stone-400 font-normal">(רווח צבור: +{formatILS(capitalGain)})</span>
            </p>
          )}

          {/* Large Action Buttons in stark Black vs Outline hierarchy */}
          <div className="flex flex-wrap items-center gap-2.5 pt-4">
            <button
              onClick={onQuickLog}
              className="flex-1 sm:flex-none px-6 py-3 rounded-full bg-[#1A1A1A] text-white text-xs sm:text-sm font-semibold hover:bg-stone-800 active:scale-95 transition shadow-sm flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>+ הזנה חודשית</span>
            </button>

            {onEditAsset && (
              <button
                onClick={() => onEditAsset('checking')}
                className="flex-1 sm:flex-none px-5 py-3 rounded-full bg-white border border-[#EAE6DF] text-[#1A1A1A] text-xs sm:text-sm font-semibold hover:border-stone-800 active:scale-95 transition shadow-2xs flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4 text-stone-600" />
                <span>סנכרון ועדכון מהיר</span>
              </button>
            )}

            {onOpenFire && (
              <button
                onClick={onOpenFire}
                className="px-4 py-3 rounded-full bg-[#FAF8F5] border border-[#EAE6DF] text-stone-700 text-xs sm:text-sm font-medium hover:border-stone-400 active:scale-95 transition flex items-center gap-1.5"
              >
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="hidden xs:inline">מחשבון FIRE</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Micro Indicators with Poker-Chip Monograms */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-6 mt-6 border-t border-[#EAE6DF]">
          
          {/* פנסיה וגמל */}
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE6DF] flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs text-[#737373] font-medium mb-1">
              <span className="poker-chip bg-amber-500" />
              <span className="truncate">פנסיה וגמל</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-[#1A1A1A] font-num">
              {formatILS(currentRecord.altshuler || 0)}
            </span>
          </div>

          {/* תיק השקעות */}
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE6DF] flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs text-[#737373] font-medium mb-1">
              <span className="poker-chip bg-emerald-500" />
              <span className="truncate">תיק השקעות</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-[#1A1A1A] font-num">
              {formatILS(currentRecord.excellence || 0)}
            </span>
          </div>

          {/* קרן כספית */}
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE6DF] flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs text-[#737373] font-medium mb-1">
              <span className="poker-chip bg-blue-600" />
              <span className="truncate">קרן כספית</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-[#1A1A1A] font-num">
              {formatILS(currentRecord.money_market || 0)}
            </span>
          </div>

          {/* עו״ש ונזילות */}
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE6DF] flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs text-[#737373] font-medium mb-1">
              <span className="poker-chip bg-stone-900" />
              <span className="truncate">עו״ש ונזילות</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-[#1A1A1A] font-num">
              {formatILS(currentRecord.checking || 0)}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};