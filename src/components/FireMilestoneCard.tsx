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
    <section className="bg-gradient-to-br from-white via-slate-50 to-blue-50/40 rounded-3xl p-5 sm:p-6 border border-slate-200/80 titanium-edge space-y-4 shadow-xs">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>יעד עצמאות כלכלית (FIRE Milestone)</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            המסע לעבר {formatILS(targetAmount)}
          </h3>
        </div>

        <div className="text-left">
          <span className="text-xl sm:text-2xl font-extrabold text-blue-600 font-num">
            {progressPct.toFixed(0)}%
          </span>
          <p className="text-[10px] font-bold text-slate-400">הושלמו</p>
        </div>
      </div>

      {/* Progress Bar with Dual Gradient */}
      <div className="space-y-1.5">
        <div className="w-full h-3.5 rounded-full bg-slate-200/80 p-0.5 overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-l from-emerald-500 to-blue-600 transition-all duration-700 shadow-sm"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-slate-500 font-num">
          <span>נצבר: {formatILS(total)}</span>
          <span className="font-semibold text-slate-700">נותר: {formatILS(remaining)}</span>
        </div>
      </div>

      {/* Footer Insight & Button */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Hourglass className="w-4 h-4 text-amber-600" />
          <span>
            צפי הגעה: עוד כ-<strong className="text-slate-900 font-bold">{estimatedMonths} חודשים</strong> בקצב הנוכחי
          </span>
        </div>

        <button
          onClick={onOpenCalculator}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition shrink-0 bg-blue-50/80 px-3 py-1.5 rounded-xl border border-blue-200/60 active:scale-95"
        >
          <span>סימולטור FIRE</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};