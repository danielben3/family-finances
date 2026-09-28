import React, { useState, useEffect } from 'react';
import { X, Calculator, Check } from 'lucide-react';
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
    '₪ ' + Math.round(val).toLocaleString('he-IL');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-white border border-black/10 rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-xl bg-[#FAF8F5] hover:bg-stone-100 text-stone-400 hover:text-stone-800 border border-black/[0.06] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center mb-5">
          <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center mx-auto mb-2 shadow-2xs">
            <Calculator className="w-4 h-4 text-stone-200" />
          </div>
          <h3 className="text-base sm:text-lg font-bold font-serif text-stone-900">
            הזנת קרן וחישוב נטו (תיק אקסלנס)
          </h3>
          <p className="text-xs text-stone-500 mt-0.5 font-sans">
            הזן את סך ההפקדות שהפקדת, והמערכת תחשב את הרווח והנטו לאחר מס
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Current Market Value */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-black/[0.04]">
            <div>
              <span className="text-[10px] text-stone-400 block font-medium">שווי שוק נוכחי ({monthLabel})</span>
              <span className="text-base font-bold font-serif text-stone-900">
                {formatILS(marketValue)}
              </span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-stone-800 border border-black/[0.06]">
              ברוטו
            </span>
          </div>

          {/* Cost Basis Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
              <span>סך הקרן שהופקדה (עלות בסיס):</span>
              <span className="text-[10px] text-stone-400">בשקלים ₪</span>
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="למשל: 400000"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full text-left pl-3 pr-8 py-2.5 rounded-xl bg-[#FAF8F5] border border-black/[0.08] focus:bg-white focus:border-stone-900 text-stone-900 font-serif font-bold text-sm outline-none transition"
              />
              <span className="absolute right-3 top-2.5 text-stone-400 font-serif text-sm">₪</span>
            </div>
          </div>

          {/* Live Calculation Card */}
          {numBasis > 0 && (
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-black/[0.06] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600 font-sans">רווח הון צבור (לפני מס):</span>
                <span className="font-bold text-emerald-800 font-serif">
                  +{formatILS(result.unrealizedGain)} (+{result.gainPct.toFixed(1)}%)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600 font-sans">מס רווחי הון משוער (25%):</span>
                <span className="font-bold text-rose-700 font-serif">
                  -{formatILS(result.estimatedTax)}
                </span>
              </div>

              <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-900 block font-serif">שווי נטו שנשאר ביד:</span>
                  <span className="text-[10px] text-stone-400 font-sans">קרן + רווח לאחר מס</span>
                </div>
                <span className="text-lg font-bold text-emerald-800 font-serif">
                  {formatILS(result.netValue)}
                </span>
              </div>
            </div>
          )}

          {/* Apply to future months checkbox */}
          <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={applyToAll}
              onChange={(e) => setApplyToAll(e.target.checked)}
              className="w-4 h-4 rounded text-stone-900 focus:ring-stone-900 accent-stone-900"
            />
            <span>החל קרן זו גם על כל החודשים הבאים (שמירה אוטומטית)</span>
          </label>

          {/* Action Buttons */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#1A1A1A] text-white text-xs font-semibold hover:opacity-90 active:scale-95 transition flex items-center justify-center gap-1.5 btn-press shadow-2xs"
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