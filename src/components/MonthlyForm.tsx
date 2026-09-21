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
    // Split checking fields
    checking_onezero: record.checking_onezero ? String(record.checking_onezero) : '',
    checking_pepper: record.checking_pepper ? String(record.checking_pepper) : '',
    checking_otsar: record.checking_otsar ? String(record.checking_otsar) : '',
    paybox: record.paybox ? String(record.paybox) : '',
    bit: record.bit ? String(record.bit) : '',
    // Investment fields
    altshuler: record.altshuler ? String(record.altshuler) : '',
    excellence: record.excellence ? String(record.excellence) : '',
    excellence_cost_basis: record.excellence_cost_basis ? String(record.excellence_cost_basis) : '',
    money_market: record.money_market ? String(record.money_market) : '',
    notes: record.notes || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync form when selected record changes
  useEffect(() => {
    setFormData({
      income_net: record.income_net ? String(record.income_net) : '',
      expenses: record.expenses ? String(record.expenses) : '',
      checking_onezero: record.checking_onezero ? String(record.checking_onezero) : '',
      checking_pepper: record.checking_pepper ? String(record.checking_pepper) : '',
      checking_otsar: record.checking_otsar ? String(record.checking_otsar) : '',
      paybox: record.paybox ? String(record.paybox) : '',
      bit: record.bit ? String(record.bit) : '',
      altshuler: record.altshuler ? String(record.altshuler) : '',
      excellence: record.excellence ? String(record.excellence) : '',
      excellence_cost_basis: record.excellence_cost_basis ? String(record.excellence_cost_basis) : '',
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
    // Remove thousands commas (e.g. 18,000 + 500)
    clean = clean.replace(/,/g, '');
    // Support Hebrew keyboard dashes and Unicode minus (־, –, —, −)
    clean = clean.replace(/[\u2212\u2013\u2014\u05BE]/g, '-');
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

  // Excel-like: on blur or Enter, evaluate any formula and replace field text with the result
  const evalField = (field: keyof typeof formData) => {
    const raw = formData[field];
    if (raw && /[+\-*/=־–—−]/.test(raw)) {
      const computed = parseVal(raw);
      setFormData(prev => ({ ...prev, [field]: String(computed) }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: keyof typeof formData) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      evalField(field);
      e.currentTarget.blur();
    }
  };

  // Live Calculated Values
  const numIncome = parseVal(formData.income_net);
  const numExpenses = parseVal(formData.expenses);
  const numOneZero = parseVal(formData.checking_onezero);
  const numPepper = parseVal(formData.checking_pepper);
  const numOtsar = parseVal(formData.checking_otsar);
  const numPaybox = parseVal(formData.paybox);
  const numBit = parseVal(formData.bit);
  const numAltshuler = parseVal(formData.altshuler);
  const numExcellence = parseVal(formData.excellence);
  const numCostBasis = parseVal(formData.excellence_cost_basis);
  const numMoneyMarket = parseVal(formData.money_market);

  const calcBanksTotal = numOneZero + numPepper + numOtsar;
  const calcWalletsTotal = numPaybox + numBit;
  const calcChecking = calcBanksTotal + calcWalletsTotal;
  const calcSavings = numIncome > 0 || numExpenses > 0 ? numIncome - numExpenses : 0;
  const calcSavingsRate = numIncome > 0 ? (calcSavings / numIncome) * 100 : 0;
  const calcInvestments = numAltshuler + numExcellence + numMoneyMarket;
  const calcTotalWealth = calcChecking + calcInvestments;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure all input fields reflect their evaluated numeric values
    setFormData(prev => ({
      ...prev,
      income_net: numIncome ? String(numIncome) : '',
      expenses: numExpenses ? String(numExpenses) : '',
      checking_onezero: numOneZero ? String(numOneZero) : '',
      checking_pepper: numPepper ? String(numPepper) : '',
      checking_otsar: numOtsar ? String(numOtsar) : '',
      paybox: numPaybox ? String(numPaybox) : '',
      bit: numBit ? String(numBit) : '',
      altshuler: numAltshuler ? String(numAltshuler) : '',
      excellence: numExcellence ? String(numExcellence) : '',
      money_market: numMoneyMarket ? String(numMoneyMarket) : '',
    }));

    const updated: FinancialRecord = {
      ...record,
      income_net: numIncome,
      expenses: numExpenses,
      savings: calcSavings,
      savings_rate: Math.round(calcSavingsRate * 100) / 100,
      checking: calcChecking,
      checking_onezero: numOneZero,
      checking_pepper: numPepper,
      checking_otsar: numOtsar,
      paybox: numPaybox,
      bit: numBit,
      altshuler: numAltshuler,
      excellence: numExcellence,
      excellence_cost_basis: numCostBasis > 0 ? numCostBasis : undefined,
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

  const inputBase = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-num text-sm focus:bg-white focus:outline-none transition text-left';

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

      {/* ─────────────── Section 1: Cashflow ─────────────── */}
      <div className="mb-5">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">הכנסות והוצאות</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          {/* Income */}
          <div>
            <label className="block text-xs font-semibold text-emerald-700 mb-1">
              הכנסות נטו (משכורות)
            </label>
            <div className="relative">
              <input type="text" value={formData.income_net}
                onChange={e => setFormData({ ...formData, income_net: e.target.value })}
                onBlur={() => evalField('income_net')}
                onKeyDown={e => handleKeyDown(e, 'income_net')}
                placeholder="0" dir="ltr"
                className={`${inputBase} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100`}
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
            </div>
          </div>

          {/* Expenses */}
          <div>
            <label className="block text-xs font-semibold text-rose-700 mb-1">
              הוצאות (אשראי ושכירות)
            </label>
            <div className="relative">
              <input type="text" value={formData.expenses}
                onChange={e => setFormData({ ...formData, expenses: e.target.value })}
                onBlur={() => evalField('expenses')}
                onKeyDown={e => handleKeyDown(e, 'expenses')}
                placeholder="0" dir="ltr"
                className={`${inputBase} focus:border-rose-500 focus:ring-2 focus:ring-rose-100`}
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────── Section 2: Checking Accounts ─────────────── */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">עו״ש — חשבונות בנק</p>
          <span className="text-xs font-num font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
            סה״כ בנקים: {formatILS(calcBanksTotal)}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">

          {/* ONE ZERO */}
          <div>
            <label className="block text-[11px] font-bold text-blue-700 mb-1 flex items-center gap-1">
              <span className="text-base leading-none">🏦</span> ONE ZERO
              <span className="text-[10px] text-slate-400 font-normal">2150</span>
            </label>
            <div className="relative">
              <input type="text" value={formData.checking_onezero}
                onChange={e => setFormData({ ...formData, checking_onezero: e.target.value })}
                onBlur={() => evalField('checking_onezero')}
                onKeyDown={e => handleKeyDown(e, 'checking_onezero')}
                placeholder="0" dir="ltr"
                className={`${inputBase} focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
              />
              <span className="absolute right-2 top-2.5 text-slate-400 text-[11px] font-semibold pointer-events-none">₪</span>
            </div>
          </div>

          {/* Pepper */}
          <div>
            <label className="block text-[11px] font-bold text-red-600 mb-1 flex items-center gap-1">
              <span className="text-base leading-none">🌶️</span> Pepper
              <span className="text-[10px] text-slate-400 font-normal">3302</span>
            </label>
            <div className="relative">
              <input type="text" value={formData.checking_pepper}
                onChange={e => setFormData({ ...formData, checking_pepper: e.target.value })}
                onBlur={() => evalField('checking_pepper')}
                onKeyDown={e => handleKeyDown(e, 'checking_pepper')}
                placeholder="0" dir="ltr"
                className={`${inputBase} focus:border-red-400 focus:ring-2 focus:ring-red-100`}
              />
              <span className="absolute right-2 top-2.5 text-slate-400 text-[11px] font-semibold pointer-events-none">₪</span>
            </div>
          </div>

          {/* Otzar HaHayal */}
          <div>
            <label className="block text-[11px] font-bold text-purple-700 mb-1 flex items-center gap-1">
              <span className="text-base leading-none">🎖️</span> אוצר
              <span className="text-[10px] text-slate-400 font-normal">6775</span>
            </label>
            <div className="relative">
              <input type="text" value={formData.checking_otsar}
                onChange={e => setFormData({ ...formData, checking_otsar: e.target.value })}
                onBlur={() => evalField('checking_otsar')}
                onKeyDown={e => handleKeyDown(e, 'checking_otsar')}
                placeholder="0" dir="ltr"
                className={`${inputBase} focus:border-purple-500 focus:ring-2 focus:ring-purple-100`}
              />
              <span className="absolute right-2 top-2.5 text-slate-400 text-[11px] font-semibold pointer-events-none">₪</span>
            </div>
          </div>
        </div>

        {/* Digital Wallets Row */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">ארנקים דיגיטליים</p>
            <span className="text-xs font-num font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-200">
              סה״כ ארנקים: {formatILS(calcWalletsTotal)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">

            {/* PayBox */}
            <div>
              <label className="block text-[11px] font-bold text-orange-600 mb-1 flex items-center gap-1">
                <span className="text-base leading-none">👛</span> PayBox
              </label>
              <div className="relative">
                <input type="text" value={formData.paybox}
                  onChange={e => setFormData({ ...formData, paybox: e.target.value })}
                  onBlur={() => evalField('paybox')}
                  onKeyDown={e => handleKeyDown(e, 'paybox')}
                  placeholder="0" dir="ltr"
                  className={`${inputBase} focus:border-orange-400 focus:ring-2 focus:ring-orange-100`}
                />
                <span className="absolute right-2 top-2.5 text-slate-400 text-[11px] font-semibold pointer-events-none">₪</span>
              </div>
            </div>

            {/* Bit */}
            <div>
              <label className="block text-[11px] font-bold text-teal-600 mb-1 flex items-center gap-1">
                <span className="text-base leading-none">💳</span> Bit
              </label>
              <div className="relative">
                <input type="text" value={formData.bit}
                  onChange={e => setFormData({ ...formData, bit: e.target.value })}
                  onBlur={() => evalField('bit')}
                  onKeyDown={e => handleKeyDown(e, 'bit')}
                  placeholder="0" dir="ltr"
                  className={`${inputBase} focus:border-teal-400 focus:ring-2 focus:ring-teal-100`}
                />
                <span className="absolute right-2 top-2.5 text-slate-400 text-[11px] font-semibold pointer-events-none">₪</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Checking Summary Strip */}
        <div className="mt-3 flex items-center justify-between bg-sky-50 border border-sky-200 rounded-xl px-4 py-2.5">
          <div className="text-xs text-sky-700 font-semibold flex items-center gap-1.5">
            <span>💰</span>
            <span>סה״כ נזילות מיידית:</span>
          </div>
          <span className="text-sm font-num font-extrabold text-sky-800">{formatILS(calcChecking)}</span>
        </div>
      </div>

      {/* ─────────────── Section 3: Investments ─────────────── */}
      <div className="mb-5">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">השקעות ותיקים</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">

          {/* Altshuler Gemel */}
          <div>
            <label className="block text-xs font-semibold text-blue-700 mb-1">
              אלטשולר שחם (גמל)
            </label>
            <div className="relative">
              <input type="text" value={formData.altshuler}
                onChange={e => setFormData({ ...formData, altshuler: e.target.value })}
                onBlur={() => evalField('altshuler')}
                onKeyDown={e => handleKeyDown(e, 'altshuler')}
                placeholder="0" dir="ltr"
                className={`${inputBase} focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
            </div>
          </div>

          {/* Excellence Market Value */}
          <div>
            <label className="block text-xs font-semibold text-emerald-700 mb-1">
              אקסלנס (תיק מניות) – שווי שוק
            </label>
            <div className="relative">
              <input type="text" value={formData.excellence}
                onChange={e => setFormData({ ...formData, excellence: e.target.value })}
                onBlur={() => evalField('excellence')}
                onKeyDown={e => handleKeyDown(e, 'excellence')}
                placeholder="0" dir="ltr"
                className={`${inputBase} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100`}
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
            </div>
          </div>

          {/* Excellence Cost Basis */}
          <div>
            <label className="block text-xs font-semibold text-teal-700 mb-1 flex items-center justify-between">
              <span>קרן שהופקדה באקסלנס (בסיס)</span>
              <span className="text-[10px] text-slate-400 font-normal">לחישוב נטו</span>
            </label>
            <div className="relative">
              <input type="text" value={formData.excellence_cost_basis}
                onChange={e => setFormData({ ...formData, excellence_cost_basis: e.target.value })}
                onBlur={() => evalField('excellence_cost_basis')}
                onKeyDown={e => handleKeyDown(e, 'excellence_cost_basis')}
                placeholder="למשל: 400000" dir="ltr"
                className={`${inputBase} focus:border-teal-500 focus:ring-2 focus:ring-teal-100`}
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
            </div>
            {numCostBasis > 0 && numExcellence > 0 && (
              <p className="text-[11px] text-teal-700 font-medium mt-1 leading-tight">
                רווח: +{formatILS(Math.max(0, numExcellence - numCostBasis))} | מס 25%: -{formatILS(Math.round(Math.max(0, numExcellence - numCostBasis) * 0.25))} | <strong className="text-emerald-800">נטו ביד: {formatILS(numExcellence - Math.round(Math.max(0, numExcellence - numCostBasis) * 0.25))}</strong>
              </p>
            )}
          </div>

          {/* Money Market */}
          <div>
            <label className="block text-xs font-semibold text-indigo-700 mb-1">
              קרן כספית שקלית
            </label>
            <div className="relative">
              <input type="text" value={formData.money_market}
                onChange={e => setFormData({ ...formData, money_market: e.target.value })}
                onBlur={() => evalField('money_market')}
                onKeyDown={e => handleKeyDown(e, 'money_market')}
                placeholder="0" dir="ltr"
                className={`${inputBase} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100`}
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
            </div>
          </div>
        </div>
      </div>


      {/* Live Computed Summary Ribbon */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
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

      {/* Notes */}
      <div className="mt-4">
        <label className="block text-xs font-semibold text-slate-500 mb-1">הערות חופשיות (אופציונלי)</label>
        <textarea
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
          placeholder="הערות לחודש זה..."
          rows={2}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-700 text-xs focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition resize-none"
        />
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
