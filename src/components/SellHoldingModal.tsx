import React, { useState } from 'react';
import { Holding, PortfolioTransaction } from '../types/portfolio';
import { X, ArrowDownRight, DollarSign, ShieldCheck, Check, AlertCircle } from 'lucide-react';

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
    '₪' + Math.round(val).toLocaleString('he-IL');

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
          : null; // Entire holding sold

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto mb-2 shadow-xs">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            מכירת נייר ערך ומימוש לתיק
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {holding.name} ({holding.symbol}) · תיק {holding.portfolio_name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Holding Balance Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">כמות קיימת בתיק</span>
              <span className="font-extrabold text-slate-800 font-num text-sm">
                {holding.shares} יחידות
              </span>
            </div>
            <div className="text-left">
              <span className="text-slate-400 block text-[11px]">שער קנייה ממוצע</span>
              <span className="font-bold text-slate-700 font-num">
                {currencySymbol}{holding.avg_buy_price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Shares to sell input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                כמות יחידות למכירה:
              </label>
              {/* Quick % buttons */}
              <div className="flex gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickShares(0.25)}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold"
                >
                  25%
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickShares(0.5)}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold"
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickShares(1)}
                  className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold"
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
              className="w-full text-left px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-slate-900 font-num font-bold text-sm outline-none transition"
            />
          </div>

          {/* Sell Price input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>שער מכירה ליחידה ({holding.currency}):</span>
              <span className="text-[11px] text-slate-400 font-normal">מחיר שוק עדכני</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0.01"
                value={sellPrice}
                onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
                className="w-full text-left pl-3 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-slate-900 font-num font-bold text-sm outline-none transition"
              />
              <span className="absolute right-3 top-2.5 text-slate-400 font-bold text-sm">
                {currencySymbol}
              </span>
            </div>
          </div>

          {/* Live Calculation Preview */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/50 via-white to-amber-50/40 border border-rose-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">פדיון ברוטו:</span>
              <span className="font-bold text-slate-900 font-num">
                {currencySymbol}{grossOriginal.toLocaleString('he-IL', { maximumFractionDigits: 2 })} ({formatILS(grossILS)})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">רווח הון חייב במס:</span>
              <span className={`font-bold font-num ${capitalGainILS > 0 ? 'text-emerald-700' : 'text-slate-500'}`}>
                {capitalGainILS > 0 ? `+${formatILS(capitalGainILS)}` : 'אין רווח חייב'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">ניכוי מס רווחי הון 25%:</span>
              <span className="font-bold text-rose-600 font-num">
                -{formatILS(taxDeductedILS)}
              </span>
            </div>

            <div className="pt-2 border-t border-rose-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">סך פדיון נטו שיתקבל:</span>
                <span className="text-[10px] text-slate-500">תמורת מכירה לאחר ניכוי מס</span>
              </div>
              <span className="text-lg font-black text-emerald-700 font-num">
                {formatILS(netProceedsILS)}
              </span>
            </div>
          </div>

          {/* Transfer to Checking Account Checkbox */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
            <label className="flex items-start gap-2.5 text-xs text-blue-900 cursor-pointer">
              <input
                type="checkbox"
                checked={transferToChecking}
                onChange={(e) => setTransferToChecking(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <div className="space-y-0.5">
                <span className="font-bold block">העבר פדיון זה ישירות לחשבון העובר ושב (עו״ש)</span>
                <span className="text-[11px] text-blue-700 block">
                  סכום הנטו ({formatILS(netProceedsILS)}) יתווסף אוטומטית ליתרת העו״ש החודשית
                </span>
              </div>
            </label>

            {transferToChecking && (
              <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-xs">
                <span className="text-blue-800 font-medium">לאיזה חודש להעביר בעו״ש?</span>
                <select
                  value={targetPeriod}
                  onChange={(e) => setTargetPeriod(e.target.value)}
                  className="bg-white border border-blue-300 rounded-lg px-2.5 py-1 text-xs font-bold text-blue-900 outline-none"
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
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-md shadow-rose-600/20 active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'מבצע מכירה ומעביר כספים...' : `אשר מכירה והעבר ${formatILS(netProceedsILS)}`}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
