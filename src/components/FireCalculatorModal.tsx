import React, { useState } from 'react';
import { X, Flame, Sparkles, TrendingUp, Calendar, Coins } from 'lucide-react';

interface FireCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWealth: number;
  defaultMonthlySavings?: number;
}

export const FireCalculatorModal: React.FC<FireCalculatorModalProps> = ({
  isOpen,
  onClose,
  currentWealth,
  defaultMonthlySavings = 12000,
}) => {
  const [monthlySavings, setMonthlySavings] = useState<number>(defaultMonthlySavings > 0 ? defaultMonthlySavings : 12000);
  const [annualReturnPct, setAnnualReturnPct] = useState<number>(7);

  if (!isOpen) return null;

  const formatILS = (val: number) =>
    '₪' + Math.round(val).toLocaleString('he-IL');

  // Compound interest simulation helper
  const calculateMonthsToTarget = (target: number) => {
    if (currentWealth >= target) return 0;
    const monthlyRate = annualReturnPct / 100 / 12;
    let balance = currentWealth;
    let months = 0;
    const maxMonths = 360; // 30 years cap

    while (balance < target && months < maxMonths) {
      balance = balance * (1 + monthlyRate) + monthlySavings;
      months++;
    }
    return months;
  };

  const getTargetDate = (months: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    return d.toLocaleDateString('he-IL', { year: 'numeric', month: 'long' });
  };

  const targets = [
    { label: 'יעד ראשון: 2,000,000 ₪', target: 2000000 },
    { label: 'יעד שני: 2,500,000 ₪', target: 2500000 },
    { label: 'יעד פרישה מלא: 3,000,000 ₪', target: 3000000 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            סימולטור עצמאות כלכלית (FIRE)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            חישוב תחזית הגעה ליעדי הון בריבית דריבית
          </p>
        </div>

        {/* Sliders Controls */}
        <div className="space-y-5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-6">
          
          {/* Monthly Savings Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">חיסכון והשקעה חודשי:</span>
              <span className="font-extrabold text-blue-600 font-num text-sm">
                {formatILS(monthlySavings)}
              </span>
            </div>
            <input
              type="range"
              min={2000}
              max={30000}
              step={500}
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-num">
              <span>₪2,000</span>
              <span>₪15,000</span>
              <span>₪30,000</span>
            </div>
          </div>

          {/* Expected Annual Return Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">תשואה שנתית צפויה של התיק:</span>
              <span className="font-extrabold text-emerald-600 font-num text-sm">
                {annualReturnPct}% בשנה
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={12}
              step={0.5}
              value={annualReturnPct}
              onChange={(e) => setAnnualReturnPct(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-num">
              <span>3% (שמרני מאוד)</span>
              <span>7% (ממוצע S&P 500)</span>
              <span>12% (אגרסיבי)</span>
            </div>
          </div>

        </div>

        {/* Milestone Results List */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold text-slate-700">
            תחזית הגעה ליעדים:
          </h4>

          {targets.map((item, idx) => {
            const months = calculateMonthsToTarget(item.target);
            const targetDate = getTargetDate(months);
            const passiveIncome = Math.round((item.target * 0.04) / 12);
            const isAlreadyAchieved = currentWealth >= item.target;

            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">
                      {item.label}
                    </span>
                    {isAlreadyAchieved && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                        הושלם!
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>
                      {isAlreadyAchieved ? 'כבר הושג' : `צפי: ${targetDate} (עוד כ-${months} חודשים)`}
                    </span>
                  </div>
                </div>

                <div className="text-left bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">הכנסה חודשית (4%)</span>
                  <span className="text-xs font-extrabold text-blue-700 font-num">
                    {formatILS(passiveIncome)}/חודש
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-500/20"
        >
          סגור סימולטור
        </button>
      </div>
    </div>
  );
};