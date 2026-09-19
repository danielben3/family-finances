import React from 'react';
import { FinancialRecord } from '../types';
import { ShieldCheck, Coins, AlertCircle } from 'lucide-react';

interface LiquidityRunwayCardProps {
  currentRecord: FinancialRecord;
}

export const LiquidityRunwayCard: React.FC<LiquidityRunwayCardProps> = ({
  currentRecord,
}) => {
  const formatILS = (val: number) =>
    '₪' + Math.round(val).toLocaleString('he-IL');

  const checking = currentRecord.checking || 0;
  const moneyMarket = currentRecord.money_market || 0;
  const liquidCash = checking + moneyMarket;
  const monthlyExpenses = currentRecord.expenses || 1;

  const runwayMonths = Math.min(12, Math.max(0, liquidCash / monthlyExpenses));
  const fullSegments = Math.floor(Math.min(6, (runwayMonths / 6) * 6));
  const partialPct = Math.round(((runwayMonths / 6) * 6 - fullSegments) * 100);

  const isSafe = runwayMonths >= 3;

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 titanium-edge space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            מדד נזילות וכרית ביטחון
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-num">
              {runwayMonths.toFixed(1)} חודשי נזילות
            </h3>
            <span className="text-xs text-slate-400">עו"ש + כספית</span>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
            isSafe
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {isSafe ? 'כרית ביטחון גבוהה (דרג 1)' : 'מומלץ להגדיל נזילות'}
        </span>
      </div>

      {/* Segmented Runway Gauge (6 segments up to 6 months target) */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-6 gap-1.5">
          {[0, 1, 2, 3, 4, 5].map((index) => {
            if (index < fullSegments) {
              return (
                <div
                  key={index}
                  className="h-2.5 rounded-full bg-emerald-500 shadow-xs"
                />
              );
            } else if (index === fullSegments && partialPct > 0) {
              return (
                <div
                  key={index}
                  className="h-2.5 rounded-full bg-slate-100 overflow-hidden relative"
                >
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${partialPct}%` }}
                  />
                </div>
              );
            } else {
              return (
                <div
                  key={index}
                  className="h-2.5 rounded-full bg-slate-100 border border-slate-200/40"
                />
              );
            }
          })}
        </div>

        <div className="flex justify-between text-[11px] text-slate-400 font-num">
          <span>0 חודשים</span>
          <span className="font-semibold text-slate-600">יעד מומלץ: 3-6 חודשים</span>
          <span>6+ חודשים</span>
        </div>
      </div>

      {/* Metric Breakdown Footer */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
        <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500">
            מזומן ונזיל מיידי
          </span>
          <p className="text-sm sm:text-base font-extrabold text-slate-900 font-num mt-0.5">
            {formatILS(liquidCash)}
          </p>
        </div>

        <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500">
            הוצאות מחיה שוטפות
          </span>
          <p className="text-sm sm:text-base font-extrabold text-slate-900 font-num mt-0.5">
            {formatILS(monthlyExpenses)}
            <span className="text-xs text-slate-400 font-normal">/חודש</span>
          </p>
        </div>
      </div>
    </section>
  );
};