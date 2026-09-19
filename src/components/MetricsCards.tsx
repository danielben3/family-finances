import React from 'react';
import { FinancialRecord } from '../types';
import { ArrowDownLeft, ArrowUpRight, PiggyBank, Percent } from 'lucide-react';

interface MetricsCardsProps {
  currentRecord?: FinancialRecord;
  record?: FinancialRecord;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ currentRecord, record }) => {
  const active = currentRecord || record;
  if (!active) return null;

  const income = active.income_net || 0;
  const expenses = active.expenses || 0;
  const savings = active.savings || (income > 0 ? income - expenses : 0);
  const savingsRate = active.savings_rate || (income > 0 ? (savings / income) * 100 : 0);

  const formatILS = (val: number) =>
    '₪' + Math.round(val).toLocaleString('he-IL');

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs sm:text-sm font-bold text-slate-800">תזרים חודשי שוטף</h2>
        <span className="text-xs text-slate-500 font-medium">{active.label}</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. Net Income */}
        <div className="bg-white rounded-2xl p-4 card-diffused-shadow border border-slate-200/80 flex flex-col justify-between hover:border-emerald-200 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">הכנסות נטו</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-num">
              {income > 0 ? formatILS(income) : '₪0'}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">משכורות שהופקדו</span>
          </div>
        </div>

        {/* 2. Expenses */}
        <div className="bg-white rounded-2xl p-4 card-diffused-shadow border border-slate-200/80 flex flex-col justify-between hover:border-rose-200 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">הוצאות שוטפות</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-rose-600 font-num">
              {expenses > 0 ? formatILS(expenses) : '₪0'}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">אשראי, שכירות וחשבונות</span>
          </div>
        </div>

        {/* 3. Monthly Savings */}
        <div className="bg-white rounded-2xl p-4 card-diffused-shadow border border-slate-200/80 flex flex-col justify-between hover:border-blue-200 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">חיסכון חודשי</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className={`text-xl sm:text-2xl font-extrabold font-num ${savings >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
              {formatILS(savings)}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">הכנסות פחות הוצאות</span>
          </div>
        </div>

        {/* 4. Savings Rate */}
        <div className="bg-white rounded-2xl p-4 card-diffused-shadow border border-slate-200/80 flex flex-col justify-between hover:border-purple-200 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">שיעור חיסכון</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-purple-600 font-num">
              {savingsRate > 0 ? `${savingsRate.toFixed(1)}%` : '0%'}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">מההכנסה נותב לצמיחה</span>
          </div>
        </div>

      </div>
    </div>
  );
};
