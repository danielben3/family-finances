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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      
      {/* 1. Net Income */}
      <div className="glass-card p-4 sm:p-5 relative overflow-hidden bg-slate-900/60 border-t-2 border-t-emerald-500">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
          <span className="flex items-center gap-1.5">
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
            <span>הכנסות נטו</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">משכורות</span>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-num mt-1">
          {income > 0 ? formatILS(income) : '₪0'}
        </div>
        <div className="text-[11px] text-slate-400 mt-1">משכורות שוטפות נטו</div>
      </div>

      {/* 2. Expenses */}
      <div className="glass-card p-4 sm:p-5 relative overflow-hidden bg-slate-900/60 border-t-2 border-t-rose-500">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
          <span className="flex items-center gap-1.5">
            <ArrowUpRight className="w-4 h-4 text-rose-400" />
            <span>הוצאות שוטפות</span>
          </span>
          <span className="text-[10px] text-rose-400 font-mono">חודשי</span>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-rose-400 font-num mt-1">
          {expenses > 0 ? formatILS(expenses) : '₪0'}
        </div>
        <div className="text-[11px] text-slate-400 mt-1">אשראי, שכירות, חשבונות</div>
      </div>

      {/* 3. Monthly Savings */}
      <div className="glass-card p-4 sm:p-5 relative overflow-hidden bg-slate-900/60 border-t-2 border-t-sky-500">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
          <span className="flex items-center gap-1.5">
            <PiggyBank className="w-4 h-4 text-sky-400" />
            <span>חיסכון חודשי</span>
          </span>
          <span className="text-[10px] text-sky-400 font-mono">תזרים</span>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-sky-400 font-num mt-1">
          {savings !== 0 ? formatILS(savings) : '₪0'}
        </div>
        <div className="text-[11px] text-slate-400 mt-1">עודף חודשי מהכנסות</div>
      </div>

      {/* 4. Savings Rate % */}
      <div className="glass-card p-4 sm:p-5 relative overflow-hidden bg-slate-900/60 border-t-2 border-t-amber-500">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
          <span className="flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-amber-400" />
            <span>שיעור חיסכון</span>
          </span>
          <span className="text-[10px] text-amber-400 font-mono">יעד: 50%+</span>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-num mt-1">
          {savingsRate.toFixed(1)}%
        </div>
        <div className="text-[11px] text-slate-400 mt-1">אחוז חיסכון מסך ההכנסה</div>
      </div>

    </div>
  );
};
