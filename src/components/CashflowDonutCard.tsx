import React from 'react';
import { FinancialRecord } from '../types';
import { ArrowDownLeft, ArrowUpRight, PiggyBank, ReceiptText } from 'lucide-react';

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
    <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 titanium-edge space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            יעילות תזרים חודשי
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            תמונת מצב הכנסות מול הוצאות
          </h3>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
          {savingsPct}% נותבו לחיסכון
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 pt-1">
        {/* Donut SVG Ring */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* Background ring */}
            <path
              className="text-slate-100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            {/* Expenses Stroke */}
            <path
              className="text-rose-400"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${expensesPct}, 100`}
              strokeWidth="3.5"
            />
            {/* Savings Stroke */}
            <path
              className="text-blue-600"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${savingsPct}, 100`}
              strokeDashoffset={`-${expensesPct}`}
              strokeLinecap="round"
              strokeWidth="4"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-base font-extrabold text-slate-900 font-num">
              {savingsPct}%
            </span>
            <span className="text-[10px] font-bold text-blue-600">חיסכון</span>
          </div>
        </div>

        {/* Breakdown Items List */}
        <div className="flex-1 w-full space-y-2 text-xs">
          {/* Inflow */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ArrowDownLeft className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-slate-700">סך הכנסות נטו (משכורות)</span>
            </div>
            <span className="font-extrabold text-slate-900 font-num text-xs sm:text-sm">
              {formatILS(income)}
            </span>
          </div>

          {/* Outflow */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <ReceiptText className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-slate-700">סך הוצאות שוטפות</span>
            </div>
            <span className="font-bold text-slate-700 font-num text-xs sm:text-sm">
              {formatILS(expenses)}
            </span>
          </div>

          {/* Invested Net */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/80">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <PiggyBank className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-blue-900">סך חיסכון והשקעה חודשי</span>
            </div>
            <span className="font-extrabold text-blue-700 font-num text-xs sm:text-sm">
              +{formatILS(savings)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};