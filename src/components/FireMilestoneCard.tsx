import React from 'react';
import { FinancialRecord } from '../types';
import { Target, Hourglass, ArrowUpRight, Flame } from 'lucide-react';

interface FireMilestoneCardProps {
  currentRecord: FinancialRecord;
  targetAmount?: number;
  onOpenCalculator: () => void;
}

export const FireMilestoneCard: React.FC<FireMilestoneCardProps> = ({
  currentRecord,
  targetAmount = 2000000,
  onOpenCalculator,
}) => {
  const formatILS = (val: number) =>
    '₪' + Math.round(val).toLocaleString('he-IL');

  const total = currentRecord.total_wealth || 0;
  const progressPct = Math.min(100, Math.max(0, (total / targetAmount) * 100));
  const remaining = Math.max(0, targetAmount - total);

  // Velocity calculation: monthly savings or average
  const monthlySavings = currentRecord.savings || 12000;
  const estimatedMonths = monthlySavings > 0 ? Math.ceil(remaining / monthlySavings) : 24;

  return (
    <section className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.06] shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] tracking-[0.14em] font-semibold text-stone-400 uppercase block mb-0.5">
            // FINANCIAL INDEPENDENCE (FIRE)
          </span>
          <h3 className="text-base font-bold font-serif text-stone-900">
            המסע לעבר {formatILS(targetAmount)}
          </h3>
        </div>

        <div className="text-left">
          <span className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
            {progressPct.toFixed(0)}%
          </span>
          <p className="text-[10px] font-medium text-stone-400">הושלמו</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-2.5 rounded-full bg-stone-100 p-0.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-700 shadow-2xs"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-stone-500 font-num">
          <span>נצבר: <strong className="text-stone-800 font-serif">{formatILS(total)}</strong></span>
          <span>נותר: <strong className="text-stone-800 font-serif">{formatILS(remaining)}</strong></span>
        </div>
      </div>

      {/* Footer Insight & Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-black/[0.04] text-xs">
        <div className="flex items-center gap-1.5 text-stone-600">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>
            צפי הגעה: עוד כ-<strong className="text-stone-900 font-bold">{estimatedMonths} חודשים</strong> בקצב הנוכחי
          </span>
        </div>

        <button
          onClick={onOpenCalculator}
          className="text-xs font-semibold text-stone-900 hover:bg-[#FAF8F5] flex items-center gap-1 transition shrink-0 bg-white px-3 py-1.5 rounded-xl border border-[#E5E0D8] active:scale-95 btn-press shadow-2xs"
        >
          <span>סימולטור FIRE</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-stone-500" />
        </button>
      </div>
    </section>
  );
};