import React from 'react';
import { FinancialRecord } from '../types';
import { ShieldCheck, Coins } from 'lucide-react';

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
    <section className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.06] shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[10px] tracking-[0.14em] font-semibold text-stone-400 uppercase block mb-0.5">
            // LIQUIDITY & RUNWAY
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
              {runwayMonths.toFixed(1)} חודשי נזילות
            </h3>
            <span className="text-xs text-stone-400 font-sans">עו״ש + כספית</span>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
            isSafe
              ? 'bg-emerald-50 text-emerald-800 border-emerald-500/20'
              : 'bg-amber-50 text-amber-800 border-amber-500/20'
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
                  className="h-2 rounded-full bg-emerald-500 shadow-2xs"
                />
              );
            } else if (index === fullSegments && partialPct > 0) {
              return (
                <div
                  key={index}
                  className="h-2 rounded-full bg-stone-100 overflow-hidden relative"
                >
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${partialPct}%` }}
                  />
                </div>
              );
            }
            return (
              <div
                key={index}
                className="h-2 rounded-full bg-stone-100"
              />
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-stone-400 font-medium px-0.5">
          <span>0 חודשים</span>
          <span>יעד מינימלי: 3 חודשים</span>
          <span>יעד מלא: 6 חודשים</span>
        </div>
      </div>

      {/* Bottom Liquid Balance summary */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-black/[0.04]">
        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-black/[0.04]">
          <span className="text-[10px] text-stone-500 block mb-0.5">סך מזומן נזיל מיידי</span>
          <span className="text-xs font-bold font-serif text-stone-900">
            {formatILS(liquidCash)}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-black/[0.04]">
          <span className="text-[10px] text-stone-500 block mb-0.5">קצב הוצאות חודשי</span>
          <span className="text-xs font-bold font-serif text-stone-900">
            {formatILS(monthlyExpenses)}
          </span>
        </div>
      </div>
    </section>
  );
};