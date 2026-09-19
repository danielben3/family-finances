import React from 'react';
import { FinancialRecord } from '../types';
import { TrendingUp, TrendingDown, Vault, PieChart } from 'lucide-react';

interface NetWorthHeroProps {
  currentRecord: FinancialRecord;
  previousRecord?: FinancialRecord;
}

export const NetWorthHero: React.FC<NetWorthHeroProps> = ({
  currentRecord,
  previousRecord,
}) => {
  const total = currentRecord.total_wealth || 0;
  const prevTotal = previousRecord?.total_wealth || total;
  const diff = total - prevTotal;
  const diffPct = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0;
  const isPositive = diff >= 0;

  const checking = currentRecord.checking || 0;
  const altshuler = currentRecord.altshuler || 0;
  const excellence = currentRecord.excellence || 0;
  const moneyMarket = currentRecord.money_market || 0;
  const investments = currentRecord.investments_total || (altshuler + excellence + moneyMarket);

  const checkingPct = total > 0 ? Math.max(1, (checking / total) * 100) : 0;
  const altshulerPct = total > 0 ? Math.max(1, (altshuler / total) * 100) : 0;
  const excellencePct = total > 0 ? Math.max(1, (excellence / total) * 100) : 0;
  const moneyMarketPct = total > 0 ? (moneyMarket > 0 ? Math.max(1, (moneyMarket / total) * 100) : 0) : 0;

  const formatILS = (val: number) =>
    '₪' + Math.round(val).toLocaleString('he-IL');

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-7 card-diffused-shadow border border-slate-200/80 relative overflow-hidden">
      
      {/* Subtle ambient light gradient in background */}
      <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top Header Row */}
        <div className="flex justify-between items-start mb-3">
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-medium">
              <Vault className="w-4 h-4 text-blue-600" />
              <span>סך ההון המשפחתי (נכסים נטו)</span>
              <span className="text-slate-400 font-normal">| {currentRecord.label}</span>
            </div>
            
            <div className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-num tracking-tight mt-1">
              {formatILS(total)}
            </div>
          </div>

          {/* Growth Pill Badge */}
          {previousRecord && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold font-num shadow-sm ${
                isPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/80'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-600" />
              )}
              <span>
                {isPositive ? '+' : ''}
                {diffPct.toFixed(1)}% ({formatILS(diff)})
              </span>
            </div>
          )}
        </div>

        {/* Segmented Allocation Bar */}
        <div className="mt-6 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-0.5">
            <span className="flex items-center gap-1">
              <PieChart className="w-3.5 h-3.5 text-slate-400" />
              <span>חלוקת נכסים ותיקים</span>
            </span>
            <span className="text-slate-400 font-num">100% מוקצה</span>
          </div>

          {/* Progress Bar with crisp hairline gaps */}
          <div className="h-3.5 w-full rounded-full bg-slate-100 flex overflow-hidden p-0.5 gap-0.5 border border-slate-200/60 shadow-inner">
            {/* Excellence: Green */}
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${excellencePct}%` }}
              title={`אקסלנס מניות: ${formatILS(excellence)}`}
            />
            {/* Altshuler: Cobalt Blue */}
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${altshulerPct}%` }}
              title={`אלטשולר שחם: ${formatILS(altshuler)}`}
            />
            {/* Money Market: Purple/Indigo */}
            {moneyMarket > 0 && (
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${moneyMarketPct}%` }}
                title={`קרן כספית: ${formatILS(moneyMarket)}`}
              />
            )}
            {/* Checking: Sky Blue */}
            <div
              className="h-full rounded-full bg-sky-400 transition-all duration-500"
              style={{ width: `${checkingPct}%` }}
              title={`עו"ש ונזילות: ${formatILS(checking)}`}
            />
          </div>

          {/* 4 Asset Cards (2x2 Grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            
            {/* 1. אקסלנס */}
            <div className="flex flex-col justify-between p-2.5 sm:p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:bg-slate-50 transition">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">אקסלנס (מניות)</span>
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-900 font-num">
                {formatILS(excellence)}
              </span>
            </div>

            {/* 2. אלטשולר */}
            <div className="flex flex-col justify-between p-2.5 sm:p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:bg-slate-50 transition">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                <span className="truncate">אלטשולר (גמל)</span>
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-900 font-num">
                {formatILS(altshuler)}
              </span>
            </div>

            {/* 3. קרן כספית */}
            <div className="flex flex-col justify-between p-2.5 sm:p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:bg-slate-50 transition">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                <span className="truncate">קרן כספית</span>
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-900 font-num">
                {moneyMarket > 0 ? formatILS(moneyMarket) : '₪0'}
              </span>
            </div>

            {/* 4. עו"ש */}
            <div className="flex flex-col justify-between p-2.5 sm:p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:bg-slate-50 transition">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                <span className="truncate">עו"ש ונזילות</span>
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-900 font-num">
                {formatILS(checking)}
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
