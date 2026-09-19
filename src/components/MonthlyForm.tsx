import React, { useState, useEffect } from 'react';
import { FinancialRecord } from '../types';
import { Save, Sparkles, Check, AlertCircle } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="glass-card p-4 sm:p-6 bg-slate-900/80 border border-white/10">
      
      {/* Title & Live Status */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>טופס הזנה חודשי – {record.label}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            הזן את המספרים לחודש זה. ניתן להקליד גם תרגילי חיבור (למשל 1200+350).
          </p>
        </div>

        <div className="text-left">
          <span className="text-[11px] text-slate-400 block">סה״כ שווי מחושב:</span>
          <span className="text-base sm:text-lg font-num font-bold text-amber-400">
            {formatILS(calcTotalWealth)}
          </span>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* 1. Income Net */}
        <div>
          <label className="block text-xs font-semibold text-emerald-400 mb-1.5">
            הכנסות נטו (משכורות שוטפות)
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.income_net}
              onChange={e => setFormData({ ...formData, income_net: e.target.value })}
              placeholder="0"
              className="w-full bg-slate-950/80 border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-white font-num text-sm focus:outline-none focus:border-emerald-400 transition text-left"
              dir="ltr"
            />
            <span className="absolute right-3 top-2.5 text-slate-500 text-xs font-semibold pointer-events-none">₪</span>
          </div>
        </div>

        {/* 2. Expenses */}
        <div>
          <label className="block text-xs font-semibold text-rose-400 mb-1.5">
            הוצאות (אשראי + שכירות + חשבונות)
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.expenses}
              onChange={e => setFormData({ ...formData, expenses: e.target.value })}
              placeholder="0"
              className="w-full bg-slate-950/80 border border-rose-500/30 rounded-xl px-3.5 py-2.5 text-white font-num text-sm focus:outline-none focus:border-rose-400 transition text-left"
              dir="ltr"
            />
            <span className="absolute right-3 top-2.5 text-slate-500 text-xs font-semibold pointer-events-none">₪</span>
          </div>
        </div>

        {/* 3. Checking Balance */}
        <div>
          <label className="block text-xs font-semibold text-cyan-400 mb-1.5">
            יתרת עו״ש ונזילות מיידית
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.checking}
              onChange={e => setFormData({ ...formData, checking: e.target.value })}
              placeholder="0"
              className="w-full bg-slate-950/80 border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-white font-num text-sm focus:outline-none focus:border-cyan-400 transition text-left"
              dir="ltr"
            />
            <span className="absolute right-3 top-2.5 text-slate-500 text-xs font-semibold pointer-events-none">₪</span>
          </div>
        </div>

        {/* 4. Altshuler Gemel */}
        <div>
          <label className="block text-xs font-semibold text-purple-400 mb-1.5">
            אלטשולר שחם (גמל להשקעה)
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.altshuler}
              onChange={e => setFormData({ ...formData, altshuler: e.target.value })}
              placeholder="0"
              className="w-full bg-slate-950/80 border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white font-num text-sm focus:outline-none focus:border-purple-400 transition text-left"
              dir="ltr"
            />
            <span className="absolute right-3 top-2.5 text-slate-500 text-xs font-semibold pointer-events-none">₪</span>
          </div>
        </div>

        {/* 5. Excellence */}
        <div>
          <label className="block text-xs font-semibold text-blue-400 mb-1.5">
            אקסלנס (תיק מניות ומסחר)
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.excellence}
              onChange={e => setFormData({ ...formData, excellence: e.target.value })}
              placeholder="0"
              className="w-full bg-slate-950/80 border border-blue-500/30 rounded-xl px-3.5 py-2.5 text-white font-num text-sm focus:outline-none focus:border-blue-400 transition text-left"
              dir="ltr"
            />
            <span className="absolute right-3 top-2.5 text-slate-500 text-xs font-semibold pointer-events-none">₪</span>
          </div>
        </div>

        {/* 6. Money Market */}
        <div>
          <label className="block text-xs font-semibold text-emerald-400 mb-1.5">
            קרן כספית שקלית
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.money_market}
              onChange={e => setFormData({ ...formData, money_market: e.target.value })}
              placeholder="0"
              className="w-full bg-slate-950/80 border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-white font-num text-sm focus:outline-none focus:border-emerald-400 transition text-left"
              dir="ltr"
            />
            <span className="absolute right-3 top-2.5 text-slate-500 text-xs font-semibold pointer-events-none">₪</span>
          </div>
        </div>

      </div>

      {/* Live Computed Telemetry Ribbon */}
      <div className="mt-5 p-3.5 rounded-xl bg-slate-950/90 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span className="text-slate-400">חישובים אוטומטיים בזמן אמת:</span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 font-num font-semibold">
          <div>
            <span className="text-slate-400 text-[11px] block">חיסכון:</span>
            <span className={calcSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{formatILS(calcSavings)}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">אחוז חיסכון:</span>
            <span className="text-amber-400">{calcSavingsRate.toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">סה״כ השקעות:</span>
            <span className="text-purple-400">{formatILS(calcInvestments)}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">סה״כ הון:</span>
            <span className="text-amber-300 font-bold">{formatILS(calcTotalWealth)}</span>
          </div>
        </div>
      </div>

      {/* Notes Field */}
      <div className="mt-4">
        <label className="block text-xs font-medium text-slate-400 mb-1">
          הערות לחודש זה (טקסט חופשי / אירועים מיוחדים)
        </label>
        <input
          type="text"
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
          placeholder="למשל: בונוס שנתי, טיפולי שיניים, הוצאות חופשה..."
          className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-sky-400 transition"
        />
      </div>

      {/* Save Button */}
      <div className="mt-5 flex items-center justify-end gap-3">
        {savedSuccess && (
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-fade-in">
            <Check className="w-4 h-4" />
            <span>נשמר בענן בהצלחה!</span>
          </span>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>שומר בענן...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>שמור נתונים בענן</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
};
