import React, { useState } from 'react';
import { FinancialRecord } from '../types';
import { TrendingUp, TrendingDown, Eye, EyeOff, Plus, Flame, Target, Download, Wifi, ShieldCheck, Sparkles } from 'lucide-react';

interface AppleCardHeroProps {
  currentRecord: FinancialRecord;
  previousRecord?: FinancialRecord;
  onQuickLog: () => void;
  onOpenFire: () => void;
  onScrollToGoals?: () => void;
  onExportExcel?: () => void;
}

export const AppleCardHero: React.FC<AppleCardHeroProps> = ({
  currentRecord,
  previousRecord,
  onQuickLog,
  onOpenFire,
  onScrollToGoals,
  onExportExcel,
}) => {
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  const total = currentRecord.total_wealth || 0;
  const prevTotal = previousRecord?.total_wealth || total;
  const diff = total - prevTotal;
  const diffPct = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0;
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
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                סך ההון המשפחתי (נכסים נטו)
              </span>
              <button
                onClick={() => setIsPrivate(!isPrivate)}
                className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition text-[11px] font-semibold bg-white/70 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-200/60 active:scale-95 shadow-xs"
                title={isPrivate ? 'הצג סכומים' : 'הסתר סכומים (מצב פרטיות)'}
              >
                {isPrivate ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isPrivate ? 'הצג' : 'פרטיות'}</span>
              </button>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-num tracking-tight">
                {formatILS(total)}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-400">
                {currentRecord.label}
              </span>
            </div>
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