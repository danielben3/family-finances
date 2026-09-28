import React from 'react';
import { FinancialRecord } from '../types';
import { Sparkles, TrendingUp, PiggyBank, ArrowUpRight, Flame } from 'lucide-react';

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

  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[10px] tracking-[0.14em] font-semibold text-stone-400 uppercase block mb-0.5">
            // WEALTH INTELLIGENCE
          </span>
          <h2 className="text-base font-bold font-serif text-stone-900">
            תובנות ואינטליגנציה פיננסית
          </h2>
        </div>
        <span className="text-[11px] text-stone-400 font-medium">גלילה ⬅️</span>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 snap-x snap-mandatory">
        
        {/* Card 1: Savings Rate & Surplus */}
        <div className="snap-start shrink-0 w-[85%] sm:w-[320px] rounded-2xl p-4 bg-white border border-black/[0.06] shadow-sm flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-500/20 text-emerald-800 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{savingsRate}% שיעור חיסכון</span>
              </span>
              <span className="text-xs font-bold font-serif text-emerald-800">
                +{formatILS(actualSavings)} נטו
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold font-serif text-stone-900 leading-snug">
              {savingsRate >= 30 ? 'קצב צבירת הון גבוה במיוחד החודש' : 'מעקב עקבי אחר תזרים המזומנים'}
            </h3>
            <p className="text-[11px] text-stone-600 leading-relaxed font-sans">
              המשפחה חסכה והשקיעה החודש <strong className="text-stone-900 font-semibold">{formatILS(actualSavings)}</strong>. יציבות התזרים עומדת בסטנדרטים הגבוהים של עצמאות כלכלית.
            </p>
          </div>
          <div className="pt-2.5 border-t border-black/[0.04] flex items-center justify-between text-[11px]">
            <span className="text-stone-400">מהירות צבירה</span>
            <span className="text-stone-800 font-semibold">
              מצוין ביחס ליעד
            </span>
          </div>
        </div>

        {/* Card 2: Cumulative Portfolio Growth */}
        <div className="snap-start shrink-0 w-[85%] sm:w-[320px] rounded-2xl p-4 bg-white border border-black/[0.06] shadow-sm flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-black/[0.06] text-stone-800 text-[11px] font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>צמיחת תיק השקעות</span>
              </span>
              <span className="text-xs font-bold font-serif text-emerald-800">
                +{formatILS(investmentGrowth)}
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold font-serif text-stone-900 leading-snug">
              אפקט הריבית דריבית עובד במלוא המרץ
            </h3>
            <p className="text-[11px] text-stone-600 leading-relaxed font-sans">
              תיק ההשקעות הכולל (אקסלנס מניות + אלטשולר שחם + כספית) צמח ב-<strong className="text-stone-900 font-semibold">{formatILS(investmentGrowth)}</strong> מאז תחילת המעקב.
            </p>
          </div>
          <div className="pt-2.5 border-t border-black/[0.04] flex items-center justify-between text-[11px]">
            <span className="text-stone-400">נכסים מניבים</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
              צמיחה יציבה <ArrowUpRight className="w-3 h-3 text-emerald-600" />
            </span>
          </div>
        </div>

        {/* Card 3: 4% Rule Monthly Passive Income */}
        <div className="snap-start shrink-0 w-[85%] sm:w-[320px] rounded-2xl p-4 bg-white border border-black/[0.06] shadow-sm flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-500/20 text-amber-900 text-[11px] font-semibold">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>הכנסה פסיבית (כלל 4%)</span>
              </span>
              <span className="text-xs font-bold font-serif text-amber-900">
                {formatILS(passiveMonthlyIncome)}/חודש
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold font-serif text-stone-900 leading-snug">
              ההון מייצר הכנסה חודשית שוטפת
            </h3>
            <p className="text-[11px] text-stone-600 leading-relaxed font-sans">
              לפי כלל ה-4% המקובל בעולם הפרישה המוקדמת, ההון הקיים מסוגל לספק משיכה בטוחה של <strong className="text-stone-900 font-semibold">{formatILS(passiveMonthlyIncome)} בכל חודש</strong> ללא שחיקת הקרן.
            </p>
          </div>
          {onOpenFire && (
            <div className="pt-2.5 border-t border-black/[0.04] flex items-center justify-between text-[11px]">
              <span className="text-stone-400">עצמאות כלכלית</span>
              <button
                onClick={onOpenFire}
                className="text-stone-900 font-semibold hover:underline flex items-center gap-0.5"
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