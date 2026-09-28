import React from 'react';
import { FinancialRecord } from '../types';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface CashflowDonutCardProps {
  currentRecord: FinancialRecord;
}

export const CashflowDonutCard: React.FC<CashflowDonutCardProps> = ({
  currentRecord,
}) => {
  const formatILS = (val: number) =>
    '₪' + Math.round(val).toLocaleString('he-IL');

  const income = currentRecord.income_net || 1;
  const expenses = currentRecord.expenses || 0;
  const savings = currentRecord.savings || Math.max(0, income - expenses);

  const savingsPct = Math.min(100, Math.max(0, Math.round((savings / income) * 100)));
  const expensesPct = 100 - savingsPct;

  return (
    <section className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.06] shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] tracking-[0.14em] font-semibold text-stone-400 uppercase block mb-0.5">
            // CASHFLOW EFFICIENCY
          </span>
          <h3 className="text-base font-bold font-serif text-stone-900">
            תמונת מצב הכנסות מול הוצאות
          </h3>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-500/20">
          {savingsPct}% נותבו לחיסכון
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 pt-1">
        {/* Donut SVG Ring */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* Background ring */}
            <path
              className="text-stone-100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
            />
            {/* Expenses Stroke */}
            <path
              className="text-stone-300"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${expensesPct}, 100`}
              strokeWidth="3.2"
            />
            {/* Savings Stroke */}
            <path
              className="text-emerald-500"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${savingsPct}, 100`}
              strokeDashoffset={`-${expensesPct}`}
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold font-serif text-stone-900 leading-none">
              {savingsPct}%
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5">חיסכון נטו</span>
          </div>
        </div>

        {/* Legend stats */}
        <div className="flex-1 w-full space-y-2">
          {/* Income */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-black/[0.04]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-900" />
              <span className="text-xs text-stone-600 font-medium">הכנסות נטו</span>
            </div>
            <span className="text-xs font-bold font-serif text-stone-900">
              {formatILS(income)}
            </span>
          </div>

          {/* Expenses */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-black/[0.04]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
              <span className="text-xs text-stone-600 font-medium">הוצאות החודש</span>
            </div>
            <span className="text-xs font-bold font-serif text-stone-900">
              {formatILS(expenses)}
            </span>
          </div>

          {/* Net Savings */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-500/15">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-emerald-900 font-medium">חיסכון צבור</span>
            </div>
            <span className="text-xs font-bold font-serif text-emerald-800">
              +{formatILS(savings)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};