import React, { useState } from 'react';
import { Holding, PortfolioTransaction } from '../types/portfolio';
import { X, ArrowDownRight, Check } from 'lucide-react';

interface SellHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  holding: Holding | null;
  periods: { period: string; label: string }[];
  currentPeriod: string;
  onConfirmSale: (transaction: PortfolioTransaction, updatedHolding: Holding | null) => Promise<void>;
}

export const SellHoldingModal: React.FC<SellHoldingModalProps> = ({
  isOpen,
  onClose,
  holding,
  periods,
  currentPeriod,
  onConfirmSale,
}) => {
  if (!isOpen || !holding) return null;

  const [sharesToSell, setSharesToSell] = useState<number>(holding.shares);
  const [sellPrice, setSellPrice] = useState<number>(holding.current_price);
  const [transferToChecking, setTransferToChecking] = useState<boolean>(true);
  const [targetPeriod, setTargetPeriod] = useState<string>(currentPeriod);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const rate = holding.currency === 'ILS' ? 1 : holding.exchange_rate_to_ils || 3.65;
  const currencySymbol = holding.currency === 'USD' ? '$' : holding.currency === 'EUR' ? '€' : '₪';

  // Calculations
  const validShares = Math.min(Math.max(0, sharesToSell), holding.shares);
  const grossOriginal = validShares * sellPrice;
  const grossILS = grossOriginal * rate;

  const costBasisSoldILS = validShares * holding.avg_buy_price * rate;
  const capitalGainILS = Math.max(0, grossILS - costBasisSoldILS);
  const taxDeductedILS = Math.round(capitalGainILS * 0.25);
  const netProceedsILS = Math.round(grossILS - taxDeductedILS);

  const formatILS = (val: number) =>
    '₪ ' + Math.round(val).toLocaleString('he-IL');

  const handleQuickShares = (pct: number) => {
    const qty = Math.round((holding.shares * pct) * 1000) / 1000;
    setSharesToSell(qty);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validShares <= 0) return;

    setIsSubmitting(true);
    try {
      const remainingShares = Math.round((holding.shares - validShares) * 1000) / 1000;
      const updatedHolding: Holding | null =
        remainingShares > 0
          ? {
              ...holding,
              shares: remainingShares,
              updated_at: new Date().toISOString(),
            }
          : null;

      const transaction: PortfolioTransaction = {
        id: `tx-${Date.now()}`,
        holding_id: holding.id,
        symbol: holding.symbol,
        name: holding.name,
        shares_sold: validShares,
        sell_price: sellPrice,
        currency: holding.currency,
        gross_proceeds_ils: Math.round(grossILS),
        capital_gain_ils: Math.round(capitalGainILS),
        tax_deducted_ils: taxDeductedILS,
        net_proceeds_ils: netProceedsILS,
        transferred_to_checking: transferToChecking,
        target_period: targetPeriod,
        date: new Date().toISOString(),
        notes: `מכירת ${validShares} יחידות ב-${currencySymbol}${sellPrice}`,
      };

      await onConfirmSale(transaction, updatedHolding);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full text-left px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-black/[0.08] focus:bg-white focus:border-stone-900 text-stone-900 font-serif font-bold text-sm outline-none transition';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-white border border-black/10 rounded-2xl p-5 sm:p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-xl bg-[#FAF8F5] hover:bg-stone-100 text-stone-400 hover:text-stone-800 border border-black/[0.06] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center mx-auto mb-2 shadow-2xs">
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
          </div>
          <h3 className="text-base sm:text-lg font-bold font-serif text-stone-900">
            מכירת נייר ערך ומימוש לתיק
          </h3>
          <p className="text-xs text-stone-500 mt-0.5 font-sans">
            {holding.name} ({holding.symbol}) · תיק {holding.portfolio_name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Holding Balance Summary */}
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-black/[0.04] flex items-center justify-between text-xs">
            <div>
              <span className="text-stone-400 block text-[10px]">כמות קיימת בתיק</span>
              <span className="font-bold text-stone-900 font-serif text-sm">
                {holding.shares.toLocaleString()} יחידות
              </span>
            </div>
            <div className="text-left">
              <span className="text-stone-400 block text-[10px]">שער קנייה ממוצע</span>
              <span className="font-serif text-stone-700">
                {currencySymbol}{holding.avg_buy_price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Shares to sell input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-700">
                כמות יחידות למכירה:
              </label>
              <div className="flex gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickShares(0.25)}
                  className="px-2.5 py-0.5 rounded-lg bg-[#FAF8F5] hover:bg-stone-100 text-stone-700 border border-black/[0.06] font-medium"
                >
                  25%
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickShares(0.5)}
                  className="px-2.5 py-0.5 rounded-lg bg-[#FAF8F5] hover:bg-stone-100 text-stone-700 border border-black/[0.06] font-medium"
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickShares(1)}
                  className="px-2.5 py-0.5 rounded-lg bg-[#1A1A1A] text-white font-medium"
                >
                  הכל (100%)
                </button>
              </div>
            </div>

            <input
              type="number"
              step="any"
              max={holding.shares}
              min="0.001"
              value={sharesToSell}
              onChange={(e) => setSharesToSell(parseFloat(e.target.value) || 0)}
              className={inputClass}
            />
          </div>

          {/* Sell Price input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
              <span>שער מכירה ליחידה ({holding.currency}):</span>
              <span className="text-[10px] text-stone-400">מחיר שוק</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0.01"
                value={sellPrice}
                onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
                className={`${inputClass} pl-3 pr-8`}
              />
              <span className="absolute right-3 top-2.5 text-stone-400 font-serif text-sm">
                {currencySymbol}
              </span>
            </div>
          </div>

          {/* Live Calculation Preview */}
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-black/[0.06] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-600 font-sans">פדיון ברוטו:</span>
              <span className="font-bold text-stone-900 font-serif">
                {currencySymbol}{grossOriginal.toLocaleString('he-IL', { maximumFractionDigits: 2 })} ({formatILS(grossILS)})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-stone-600 font-sans">רווח הון חייב במס:</span>
              <span className={`font-bold font-serif ${capitalGainILS > 0 ? 'text-emerald-800' : 'text-stone-500'}`}>
                {capitalGainILS > 0 ? `+${formatILS(capitalGainILS)}` : 'אין רווח חייב'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-stone-600 font-sans">ניכוי מס רווחי הון 25%:</span>
              <span className="font-bold text-rose-700 font-serif">
                -{formatILS(taxDeductedILS)}
              </span>
            </div>

            <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-900 block font-serif">סך פדיון נטו שיתקבל:</span>
                <span className="text-[10px] text-stone-400 font-sans">לאחר ניכוי מס</span>
              </div>
              <span className="text-base font-bold text-emerald-800 font-serif">
                {formatILS(netProceedsILS)}
              </span>
            </div>
          </div>

          {/* Transfer to Checking Account Checkbox */}
          <div className="p-3.5 rounded-xl bg-white border border-black/[0.06] shadow-2xs space-y-2">
            <label className="flex items-start gap-2.5 text-xs text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={transferToChecking}
                onChange={(e) => setTransferToChecking(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-stone-900 focus:ring-stone-900 accent-stone-900"
              />
              <div className="space-y-0.5">
                <span className="font-bold block">העבר פדיון זה ישירות לחשבון העובר ושב (עו״ש)</span>
                <span className="text-[11px] text-stone-500 block">
                  סכום הנטו ({formatILS(netProceedsILS)}) יתווסף אוטומטית לעו״ש בחודש הנבחר
                </span>
              </div>
            </label>

            {transferToChecking && (
              <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-xs">
                <span className="text-stone-600">לאיזה חודש להעביר בעו״ש?</span>
                <select
                  value={targetPeriod}
                  onChange={(e) => setTargetPeriod(e.target.value)}
                  className="bg-[#FAF8F5] border border-black/[0.08] rounded-lg px-2.5 py-1 text-xs font-semibold text-stone-900 outline-none"
                >
                  {periods.map(p => (
                    <option key={p.period} value={p.period}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || validShares <= 0}
              className="w-full py-3 rounded-xl bg-[#1A1A1A] text-white text-xs font-semibold hover:opacity-90 active:scale-95 transition flex items-center justify-center gap-1.5 btn-press shadow-2xs disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'מבצע מכירה...' : `אשר מכירה והעבר ${formatILS(netProceedsILS)}`}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
