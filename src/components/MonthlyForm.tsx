import React, { useState, useEffect } from 'react';
import { FinancialRecord } from '../types';
import { Save, Sparkles, Check } from 'lucide-react';

interface MonthlyFormProps {
  record: FinancialRecord;
  onSave: (updatedRecord: FinancialRecord) => Promise<void>;
  isSaving: boolean;
}

export const MonthlyForm: React.FC<MonthlyFormProps> = ({
  record,
  onSave,
  isSaving,
}) => {
  const [formData, setFormData] = useState({
    income_net: record.income_net ? String(record.income_net) : '',
    expenses: record.expenses ? String(record.expenses) : '',
    checking: record.checking ? String(record.checking) : '',
    altshuler: record.altshuler ? String(record.altshuler) : '',
    excellence: record.excellence ? String(record.excellence) : '',
    money_market: record.money_market ? String(record.money_market) : '',
    notes: record.notes || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync form when selected record changes
  useEffect(() => {
    setFormData({
      income_net: record.income_net ? String(record.income_net) : '',
      expenses: record.expenses ? String(record.expenses) : '',
      checking: record.checking ? String(record.checking) : '',
      altshuler: record.altshuler ? String(record.altshuler) : '',
      excellence: record.excellence ? String(record.excellence) : '',
      money_market: record.money_market ? String(record.money_market) : '',
      notes: record.notes || '',
    });
    setSavedSuccess(false);
  }, [record.period]);

  // Evaluate math formulas safely (e.g. "=1200+350" or "24000+4044")
  const parseVal = (str: string): number => {
    if (!str) return 0;
    let clean = String(str).trim();
    if (clean.startsWith('=')) clean = clean.substring(1).trim();
    if (!clean) return 0;
    if (/^-?\d+(\.\d+)?$/.test(clean)) return parseFloat(clean);
    if (!/^[\d\s+\-*/.()]+$/.test(clean)) return 0;
    try {
      const res = Function(`'use strict'; return (${clean})`)();
      return typeof res === 'number' && isFinite(res) ? Math.round(res * 100) / 100 : 0;
    } catch {
      return 0;
    }
  };

  // Instant Live Calculated Values
  const numIncome = parseVal(formData.income_net);
  const numExpenses = parseVal(formData.expenses);
  const numChecking = parseVal(formData.checking);
  const numAltshuler = parseVal(formData.altshuler);
  const numExcellence = parseVal(formData.excellence);
  const numMoneyMarket = parseVal(formData.money_market);

  const calcSavings = numIncome > 0 || numExpenses > 0 ? numIncome - numExpenses : 0;
  const calcSavingsRate = numIncome > 0 ? (calcSavings / numIncome) * 100 : 0;
  const calcInvestments = numAltshuler + numExcellence + numMoneyMarket;
  const calcTotalWealth = numChecking + calcInvestments;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updated: FinancialRecord = {
      ...record,
      income_net: numIncome,
      expenses: numExpenses,
      savings: calcSavings,
      savings_rate: Math.round(calcSavingsRate * 100) / 100,
      checking: numChecking,
      altshuler: numAltshuler,
      excellence: numExcellence,
      money_market: numMoneyMarket,
      investments_total: calcInvestments,
      total_wealth: calcTotalWealth,
      notes: formData.notes.trim() || null,
      updated_at: new Date().toISOString(),
    };

    await onSave(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const formatILS = (val: number) =>
    '₪' + Math.round(val).toLocaleString('he-IL');

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 sm:p-6 card-diffused-shadow border border-slate-200/80">
      
      {/* Title & Live Status */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <span>טופס הזנה ועריכה – {record.label}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            הזן מספרים או תרגילי חיבור (למשל: 1200+350). הכל מחושב בזמן אמת.
          </p>
        </div>

        <div className="text-left">
          <span className="text-[11px] text-slate-400 block">שווי כולל מחושב:</span>
          <span className="text-base sm:text-lg font-num font-extrabold text-blue-600">
            {formatILS(calcTotalWealth)}
          </span>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        
        {/* 1. Income Net */}
        <div>
          <label className="block text-xs font-semibold text-emerald-700 mb-1">
            הכנסות נטו (משכורות)
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.income_net}
              onChange={e => setFormData({ ...formData, income_net: e.target.value })}
              placeholder="0"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-num text-sm focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition text-left"
              dir="ltr"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
          </div>
        </div>

        {/* 2. Expenses */}
        <div>
          <label className="block text-xs font-semibold text-rose-700 mb-1">
            הוצאות (אשראי ושכירות)
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.expenses}
              onChange={e => setFormData({ ...formData, expenses: e.target.value })}
              placeholder="0"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-num text-sm focus:bg-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition text-left"
              dir="ltr"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
          </div>
        </div>

        {/* 3. Checking Balance */}
        <div>
          <label className="block text-xs font-semibold text-sky-700 mb-1">
            עו״ש ונזילות מיידית
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.checking}
              onChange={e => setFormData({ ...formData, checking: e.target.value })}
              placeholder="0"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-num text-sm focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition text-left"
              dir="ltr"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
          </div>
        </div>

        {/* 4. Altshuler Gemel */}
        <div>
          <label className="block text-xs font-semibold text-blue-700 mb-1">
            אלטשולר שחם (גמל)
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.altshuler}
              onChange={e => setFormData({ ...formData, altshuler: e.target.value })}
              placeholder="0"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-num text-sm focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-left"
              dir="ltr"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
          </div>
        </div>

        {/* 5. Excellence */}
        <div>
          <label className="block text-xs font-semibold text-emerald-700 mb-1">
            אקסלנס (תיק מניות)
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.excellence}
              onChange={e => setFormData({ ...formData, excellence: e.target.value })}
              placeholder="0"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-num text-sm focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition text-left"
              dir="ltr"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
          </div>
        </div>

        {/* 6. Money Market */}
        <div>
          <label className="block text-xs font-semibold text-indigo-700 mb-1">
            קרן כספית שקלית
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.money_market}
              onChange={e => setFormData({ ...formData, money_market: e.target.value })}
              placeholder="0"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-num text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition text-left"
              dir="ltr"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
          </div>
        </div>

      </div>

      {/* Live Computed Summary Ribbon */}
      <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>חישוב חי אוטומטי:</span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 font-num font-semibold">
          <div>
            <span className="text-slate-400 text-[11px] block">חיסכון:</span>
            <span className={calcSavings >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
              {formatILS(calcSavings)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">אחוז חיסכון:</span>
            <span className="text-blue-600">{calcSavingsRate.toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">סה״כ השקעות:</span>
            <span className="text-slate-900">{formatILS(calcInvestments)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/25 active:scale-95 transition disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : savedSuccess ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{savedSuccess ? 'נשמר בהצלחה!' : isSaving ? 'שומר...' : 'שמור חודש זה בענן'}</span>
        </button>

        {savedSuccess && (
          <span className="text-xs text-emerald-600 font-medium animate-fade-in flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>מסונכרן ל-Supabase</span>
          </span>
        )}
      </div>

    </form>
  );
};
