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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto mb-2 shadow-xs">
            {isEdit ? <Edit2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {isEdit ? 'עריכת נייר ערך' : 'הוספת נייר ערך חדש'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            הזן את נתוני הנייר, כמות המניות ושערי הקנייה והשוק
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Portfolio & Asset Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">שם התיק / ברוקר</label>
              <input
                type="text"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                placeholder="למשל: אקסלנס"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold outline-none focus:bg-white focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">סוג נכס</label>
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as AssetType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold outline-none focus:bg-white focus:border-blue-500"
              >
                <option value="etf">קרן סל / מחקת מדד (ETF)</option>
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
              <label className="text-xs font-bold text-slate-700 block mb-1">סימול נייר (Ticker / מספר)</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="CSPX.L / VOO / 1159250"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold font-mono outline-none focus:bg-white focus:border-blue-500"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">שם מלא של הנייר</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="iShares S&P 500"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold outline-none focus:bg-white focus:border-blue-500"
              />
            </div>
          </div>

          {/* Currency & Exchange rate */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">מטבע נקוב</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold outline-none focus:bg-white focus:border-blue-500"
              >
                <option value="USD">דולר ($ USD)</option>
                <option value="ILS">שקל (₪ ILS)</option>
                <option value="EUR">אירו (€ EUR)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">שער המרה לשקל (₪)</label>
              <input
                type="number"
                step="any"
                value={exchangeRate}
                disabled={currency === 'ILS'}
                onChange={(e) => setExchangeRate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-num font-bold outline-none focus:bg-white focus:border-blue-500 disabled:opacity-60 text-left"
              />
            </div>
          </div>

          {/* Shares, Avg Buy Price, Current Price */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">כמות יחידות</label>
              <input
                type="number"
                step="any"
                min="0.0001"
                required
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                placeholder="100"
                className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-num font-bold outline-none focus:bg-white focus:border-blue-500 text-left"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">שער קנייה ממוצע</label>
              <input
                type="number"
                step="any"
                min="0.001"
                value={avgBuyPrice}
                onChange={(e) => setAvgBuyPrice(e.target.value)}
                placeholder="500"
                className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-num font-bold outline-none focus:bg-white focus:border-blue-500 text-left"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-emerald-700 block mb-1">מחיר שוק עדכני</label>
              <input
                type="number"
                step="any"
                min="0.001"
                required
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder="550"
                className="w-full px-2.5 py-2 rounded-xl bg-emerald-50/70 border border-emerald-300 text-emerald-900 text-xs font-num font-bold outline-none focus:bg-white focus:border-emerald-500 text-left"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">הערות נוספות</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="למשל: נרכש דרך הוראת קבע חודשית"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-normal outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'שומר נייר...' : isEdit ? 'שמור שינויים' : 'הוסף נייר לתיק'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
