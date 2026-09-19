import React from 'react';
import { FinancialRecord } from '../types';
import { Sparkles, TrendingUp, PiggyBank, ShieldCheck, ArrowUpRight, Flame } from 'lucide-react';

interface WealthInsightsCarouselProps {
  records: FinancialRecord[];
  currentRecord: FinancialRecord;
  onOpenFire?: () => void;
}

export const WealthInsightsCarousel: React.FC<WealthInsightsCarouselProps> = ({
  records,
  currentRecord,
  onOpenFire,
}) => {
  const formatILS = (val: number) =>
    '₪' + Math.round(val).toLocaleString('he-IL');

  // 1. Savings rate calculation
  const savingsRate = Math.round(currentRecord.savings_rate || 0);
  const actualSavings = currentRecord.savings || 0;

  // 2. Cumulative investment growth since start
  const firstRecord = records[0] || currentRecord;
  const initialInvestments = firstRecord.investments_total || 0;
  const currentInvestments = currentRecord.investments_total || 0;
  const investmentGrowth = currentInvestments - initialInvestments;

  // 3. 4% Rule Monthly Passive Income
  const passiveMonthlyIncome = Math.round(((currentRecord.total_wealth || 0) * 0.04) / 12);

  // 4. Average 6-month expenses vs current
  const sorted = [...records].sort((a, b) => a.period.localeCompare(b.period));
  const recent6 = sorted.slice(-6);
  const avgExpenses = recent6.length > 0
    ? Math.round(recent6.reduce((acc, r) => acc + (r.expenses || 0), 0) / recent6.length)
    : (currentRecord.expenses || 0);
  const expenseDiff = (currentRecord.expenses || 0) - avgExpenses;

  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            תובנות ואינטליגנציה פיננסית
          </h2>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">גלילה אופקית ⬅️</span>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-3.5 overflow-x-auto no-scrollbar pb-1 snap-x snap-mandatory">
        
        {/* Card 1: Savings Rate & Surplus */}
        <div className="snap-start shrink-0 w-[85%] sm:w-[320px] rounded-2xl p-4 bg-white border border-slate-200/80 titanium-edge flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold">
                <PiggyBank className="w-3.5 h-3.5" />
                <span>{savingsRate}% שיעור חיסכון</span>
              </span>
              <span className="text-xs font-bold text-emerald-600 font-num">
                +{formatILS(actualSavings)} נטו
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              {savingsRate >= 30 ? 'קצב צבירת הון גבוה במיוחד החודש' : 'מעקב עקבי אחר תזרים המזומנים'}
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              המשפחה חסכה והשקיעה החודש <strong className="text-slate-800 font-semibold">{formatILS(actualSavings)}</strong>. יציבות התזרים עומדת בסטנדרטים הגבוהים ביותר של עצמאות כלכלית.
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">מהירות צבירה</span>
            <span className="text-blue-600 font-semibold flex items-center gap-0.5">
              מצוין ביחס ליעד
            </span>
          </div>
        </div>

        {/* Card 2: Cumulative Portfolio Growth */}
        <div className="snap-start shrink-0 w-[85%] sm:w-[320px] rounded-2xl p-4 bg-white border border-slate-200/80 titanium-edge flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>צמיחת תיק השקעות</span>
              </span>
              <span className="text-xs font-bold text-emerald-600 font-num">
                +{formatILS(investmentGrowth)}
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              אפקט הריבית דריבית עובד במלוא המרץ
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              תיק ההשקעות הכולל (אקסלנס מניות + אלטשולר שחם + כספית) צמח ב-<strong className="text-slate-800 font-semibold">{formatILS(investmentGrowth)}</strong> מאז אוגוסט 2024.
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">נכסים מניבים</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
              צמיחה יציבה <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 3: 4% Rule Monthly Passive Income */}
        <div className="snap-start shrink-0 w-[85%] sm:w-[320px] rounded-2xl p-4 bg-white border border-slate-200/80 titanium-edge flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>הכנסה פסיבית (כלל 4%)</span>
              </span>
              <span className="text-xs font-bold text-amber-700 font-num">
                {formatILS(passiveMonthlyIncome)}/חודש
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              ההון שלכם מייצר כסף גם בזמן שאתם ישנים
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              לפי כלל ה-4% המקובל בעולם הפרישה המוקדמת, ההון הקיים מסוגל לספק משיכה בטוחה של <strong className="text-slate-800 font-semibold">{formatILS(passiveMonthlyIncome)} בכל חודש</strong> ללא שחיקת הקרן.
            </p>
          </div>
          {onOpenFire && (
            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">עצמאות כלכלית</span>
              <button
                onClick={onOpenFire}
                className="text-blue-600 font-bold hover:underline flex items-center gap-0.5"
              >
                <span>פתח סימולטור מלא</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};