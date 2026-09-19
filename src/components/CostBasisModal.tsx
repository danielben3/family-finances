import React, { useState, useEffect } from 'react';
import { X, Calculator, ShieldCheck, Check, Info, TrendingUp, Sparkles } from 'lucide-react';
import { calculatePortfolioNet } from '../lib/taxCalculations';

interface CostBasisModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketValue: number;
  currentCostBasis?: number;
  monthLabel: string;
  onSaveCostBasis: (newBasis: number, applyToAll: boolean) => Promise<void>;
}

export const CostBasisModal: React.FC<CostBasisModalProps> = ({
  isOpen,
  onClose,
  marketValue,
  currentCostBasis = 0,
  monthLabel,
  onSaveCostBasis,
}) => {
  const [inputVal, setInputVal] = useState<string>(currentCostBasis > 0 ? String(currentCostBasis) : '');
  const [applyToAll, setApplyToAll] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setInputVal(currentCostBasis > 0 ? String(currentCostBasis) : '');
  }, [currentCostBasis, isOpen]);

  if (!isOpen) return null;

  const numBasis = parseFloat(inputVal) || 0;
  const result = calculatePortfolioNet(marketValue, numBasis, 0.25);

  const formatILS = (val: number) =>
    '₪' + Math.round(val).toLocaleString('he-IL');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSaveCostBasis(numBasis, applyToAll);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Calculator className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            הזנת קרן וחישוב נטו (תיק אקסלנס)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            הזן את סך ההפקדות שהפקדת, והמערכת תחשב את הרווח והנטו לאחר מס
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Current Market Value */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">שווי שוק נוכחי ({monthLabel})</span>
              <span className="text-base font-extrabold text-slate-900 font-num">
                {formatILS(marketValue)}
              </span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              ברוטו
            </span>
          </div>

          {/* Cost Basis Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>סך הקרן שהופקדה (עלות בסיס):</span>
              <span className="text-[11px] text-slate-400 font-normal">בשקלים ₪</span>
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="למשל: 400000"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full text-left pl-3 pr-9 py-3 rounded-2xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-num font-bold text-base outline-none transition"
              />
              <span className="absolute right-3.5 top-3.5 text-slate-400 font-bold text-sm">₪</span>
            </div>
          </div>

          {/* Live Calculation Card */}
          {numBasis > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-blue-50/50 border border-emerald-200/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">רווח הון צבור (לפני מס):</span>
                <span className="font-extrabold text-emerald-700 font-num">
                  +{formatILS(result.unrealizedGain)} (+{result.gainPct.toFixed(1)}%)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">מס רווחי הון משוער (25%):</span>
                <span className="font-bold text-rose-600 font-num">
                  -{formatILS(result.estimatedTax)}
                </span>
              </div>

              <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">שווי נטו שנשאר ביד:</span>
                  <span className="text-[10px] text-slate-500">קרן + רווח לאחר מס</span>
                </div>
                <span className="text-lg font-black text-emerald-700 font-num">
                  {formatILS(result.netValue)}
                </span>
              </div>
            </div>
          )}

          {/* Apply to future months checkbox */}
          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={applyToAll}
              onChange={(e) => setApplyToAll(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span>החל קרן זו גם על כל החודשים הבאים (שמירה אוטומטית)</span>
          </label>

          {/* Action Buttons */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'שומר ומחשב...' : 'שמור קרן וחשב נטו'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};