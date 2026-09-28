import React, { useState, useEffect } from 'react';
import { Holding, Currency, AssetType } from '../types/portfolio';
import { X, Plus, Edit2, Check } from 'lucide-react';

interface AddEditHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  holdingToEdit?: Holding | null;
  onSaveHolding: (holding: Holding) => Promise<void>;
}

export const AddEditHoldingModal: React.FC<AddEditHoldingModalProps> = ({
  isOpen,
  onClose,
  holdingToEdit,
  onSaveHolding,
}) => {
  if (!isOpen) return null;

  const isEdit = !!holdingToEdit;

  const [portfolioName, setPortfolioName] = useState<string>(holdingToEdit?.portfolio_name || 'אקסלנס');
  const [symbol, setSymbol] = useState<string>(holdingToEdit?.symbol || '');
  const [name, setName] = useState<string>(holdingToEdit?.name || '');
  const [assetType, setAssetType] = useState<AssetType>(holdingToEdit?.asset_type || 'etf');
  const [shares, setShares] = useState<string>(holdingToEdit ? String(holdingToEdit.shares) : '');
  const [avgBuyPrice, setAvgBuyPrice] = useState<string>(holdingToEdit ? String(holdingToEdit.avg_buy_price) : '');
  const [currentPrice, setCurrentPrice] = useState<string>(holdingToEdit ? String(holdingToEdit.current_price) : '');
  const [currency, setCurrency] = useState<Currency>(holdingToEdit?.currency || 'USD');
  const [exchangeRate, setExchangeRate] = useState<string>(holdingToEdit ? String(holdingToEdit.exchange_rate_to_ils) : '3.65');
  const [notes, setNotes] = useState<string>(holdingToEdit?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (currency === 'ILS') {
      setExchangeRate('1');
    } else if (currency === 'USD' && exchangeRate === '1') {
      setExchangeRate('3.65');
    }
  }, [currency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim() || !shares || !currentPrice) return;

    setIsSubmitting(true);
    try {
      const numShares = parseFloat(shares) || 0;
      const numAvgBuy = parseFloat(avgBuyPrice) || parseFloat(currentPrice) || 0;
      const numCurrent = parseFloat(currentPrice) || 0;
      const numRate = currency === 'ILS' ? 1 : parseFloat(exchangeRate) || 3.65;

      const updated: Holding = {
        id: holdingToEdit?.id || `holding-${Date.now()}`,
        portfolio_name: portfolioName.trim() || 'אקסלנס',
        symbol: symbol.trim().toUpperCase(),
        name: name.trim() || symbol.trim().toUpperCase(),
        asset_type: assetType,
        shares: numShares,
        avg_buy_price: numAvgBuy,
        current_price: numCurrent,
        currency,
        exchange_rate_to_ils: numRate,
        notes: notes.trim() || undefined,
        updated_at: new Date().toISOString(),
      };

      await onSaveHolding(updated);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-black/[0.08] text-stone-900 text-xs font-semibold outline-none focus:bg-white focus:border-stone-900 transition-all font-serif';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-white border border-black/10 rounded-2xl p-5 sm:p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-xl bg-[#FAF8F5] hover:bg-stone-100 text-stone-400 hover:text-stone-800 border border-black/[0.06] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center mb-5">
          <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center mx-auto mb-2 shadow-2xs">
            {isEdit ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </div>
          <h3 className="text-base sm:text-lg font-bold font-serif text-stone-900">
            {isEdit ? 'עריכת נייר ערך' : 'הוספת נייר ערך חדש'}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5 font-sans">
            הזן את נתוני הנייר, כמות המניות ושערי הקנייה והשוק
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Portfolio & Asset Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-stone-700 block mb-1">שם התיק / ברוקר</label>
              <input
                type="text"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                placeholder="למשל: אקסלנס"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-stone-700 block mb-1">סוג נכס</label>
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as AssetType)}
                className={inputClass}
              >
                <option value="etf">קרן סל / מדד (ETF)</option>
                <option value="stock">מניה בודדת (Stock)</option>
                <option value="mutual_fund">קרן נאמנות</option>
                <option value="bond">אג״ח (Bond)</option>
                <option value="other">אחר</option>
              </select>
            </div>
          </div>

          {/* Symbol & Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-stone-700 block mb-1">סימול נייר (Ticker)</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="VOO / CSPX / AAPL"
                required
                className={`${inputClass} font-mono`}
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-stone-700 block mb-1">שם מלא של הנייר</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vanguard S&P 500"
                className={inputClass}
              />
            </div>
          </div>

          {/* Currency & Exchange rate */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-stone-700 block mb-1">מטבע נקוב</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className={inputClass}
              >
                <option value="USD">דולר ($ USD)</option>
                <option value="ILS">שקל (₪ ILS)</option>
                <option value="EUR">אירו (€ EUR)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-stone-700 block mb-1">שער המרה לשקל (₪)</label>
              <input
                type="number"
                step="any"
                value={exchangeRate}
                disabled={currency === 'ILS'}
                onChange={(e) => setExchangeRate(e.target.value)}
                className={`${inputClass} disabled:opacity-50 text-left`}
              />
            </div>
          </div>

          {/* Shares, Avg Buy, Current Price */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="text-[11px] font-semibold text-stone-700 block mb-1">כמות יחידות</label>
              <input
                type="number"
                step="any"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                placeholder="0"
                required
                className={`${inputClass} text-left`}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-stone-700 block mb-1">שער קנייה</label>
              <input
                type="number"
                step="any"
                value={avgBuyPrice}
                onChange={(e) => setAvgBuyPrice(e.target.value)}
                placeholder="0"
                className={`${inputClass} text-left`}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-stone-700 block mb-1">מחיר שוק עדכני</label>
              <input
                type="number"
                step="any"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder="0"
                required
                className={`${inputClass} text-left`}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[11px] font-semibold text-stone-700 block mb-1">הערות / אסטרטגיה</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="למשל: נרכש כחלק מחיסכון חודשי..."
              className={inputClass}
            />
          </div>

          {/* Submit & Cancel */}
          <div className="flex items-center gap-2 pt-3 border-t border-black/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl border border-[#E5E0D8] bg-white text-stone-700 hover:bg-stone-50 font-medium text-xs transition btn-press shadow-2xs"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 py-2.5 rounded-xl bg-[#1A1A1A] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs hover:opacity-90 active:scale-95 transition disabled:opacity-60 btn-press"
            >
              {isSubmitting ? 'שומר...' : isEdit ? 'שמור שינויים בנייר' : 'הוסף נייר לתיק'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
