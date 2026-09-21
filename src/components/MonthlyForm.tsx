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
  const getInitSalaryDan = (r: FinancialRecord) => {
    if (r.salary_daniel !== undefined && r.salary_daniel !== null) return String(r.salary_daniel);
    if (r.period === '2026-09') return '16260';
    return '';
  };
  const getInitNonWorkDan = (r: FinancialRecord) => {
    if (r.non_work_daniel !== undefined && r.non_work_daniel !== null) return String(r.non_work_daniel);
    return '';
  };
  const getInitSalaryShov = (r: FinancialRecord) => {
    if (r.salary_shoval !== undefined && r.salary_shoval !== null) return String(r.salary_shoval);
    if (r.period === '2026-09') return '7800';
    return '';
  };
  const getInitNonWorkShov = (r: FinancialRecord) => {
    if (r.non_work_shoval !== undefined && r.non_work_shoval !== null) return String(r.non_work_shoval);
    return '';
  };
  const getInitOtherInc = (r: FinancialRecord) => {
    if (r.other_income !== undefined && r.other_income !== null) return String(r.other_income);
    if (r.period === '2026-09') return '1310';
    return '';
  };

  const [formData, setFormData] = useState({
    // Split income fields
    salary_daniel: getInitSalaryDan(record),
    non_work_daniel: getInitNonWorkDan(record),
    salary_shoval: getInitSalaryShov(record),
    non_work_shoval: getInitNonWorkShov(record),
    other_income: getInitOtherInc(record),
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
      salary_daniel: getInitSalaryDan(record),
      non_work_daniel: getInitNonWorkDan(record),
      salary_shoval: getInitSalaryShov(record),
      non_work_shoval: getInitNonWorkShov(record),
      other_income: getInitOtherInc(record),
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
  const numSalDan = parseVal(formData.salary_daniel);
  const numNonWorkDan = parseVal(formData.non_work_daniel);
  const numSalShov = parseVal(formData.salary_shoval);
  const numNonWorkShov = parseVal(formData.non_work_shoval);
  const numOtherIncome = parseVal(formData.other_income);
  const numExpenses = parseVal(formData.expenses);

  const calcTotalDan = numSalDan + numNonWorkDan;
  const calcTotalShov = numSalShov + numNonWorkShov;
  const calcTotalWorkSalary = numSalDan + numSalShov;
  const calcTotalNonWork = numNonWorkDan + numNonWorkShov + numOtherIncome;
  const calcTotalIncome = calcTotalDan + calcTotalShov + numOtherIncome;

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
  const calcSavings = calcTotalIncome > 0 || numExpenses > 0 ? calcTotalIncome - numExpenses : 0;
  const calcSavingsRate = calcTotalIncome > 0 ? (calcSavings / calcTotalIncome) * 100 : 0;
  const calcInvestments = numAltshuler + numExcellence + numMoneyMarket;
  const calcTotalWealth = calcChecking + calcInvestments;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure all input fields reflect their evaluated numeric values
    setFormData(prev => ({
      ...prev,
      salary_daniel: numSalDan ? String(numSalDan) : '',
      non_work_daniel: numNonWorkDan ? String(numNonWorkDan) : '',
      salary_shoval: numSalShov ? String(numSalShov) : '',
      non_work_shoval: numNonWorkShov ? String(numNonWorkShov) : '',
      other_income: numOtherIncome ? String(numOtherIncome) : '',
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
      income_net: calcTotalIncome,
      salary_daniel: numSalDan,
      non_work_daniel: numNonWorkDan,
      salary_shoval: numSalShov,
      non_work_shoval: numNonWorkShov,
      other_income: numOtherIncome,
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

  const inputBase = 'w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-num text-sm focus:bg-white focus:outline-none transition text-left';

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 card-diffused-shadow border border-slate-200/80">
      
      {/* Title & Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 border-b border-slate-100 gap-2.5">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            טופס הזנה ועריכה – {record.label}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            ניתן להזין תרגיל (למשל: 16260+1500) – יחושב אוטומטית ביציאה או בלחיצה על Enter.
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 bg-blue-50/80 sm:bg-transparent px-3 py-1.5 sm:p-0 rounded-xl sm:rounded-none">
          <span className="text-[11px] text-slate-500 sm:text-slate-400 block">שווי כולל מחושב:</span>
          <span className="text-base sm:text-lg font-num font-extrabold text-blue-600">
            {formatILS(calcTotalWealth)}
          </span>
        </div>
      </div>

      {/* ─────────────── Section 1: Income & Cashflow (Split Daniel & Shoval) ─────────────── */}
      <div className="mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1.5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            הכנסות משק הבית — שכר עבודה ושלא מעבודה
          </p>
          <div className="self-start sm:self-auto">
            <span className="text-xs font-num font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              סה״כ הכנסות נטו: {formatILS(calcTotalIncome)}
            </span>
          </div>
        </div>

        {/* Daniel & Shoval Split Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          
          {/* Card: Daniel */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50/60 to-slate-50/90 border border-blue-100 space-y-2.5">
            <div className="flex items-center justify-between border-b border-blue-100/70 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                <span className="text-base">👨‍💻</span>
                <span>דניאל</span>
                <span className="text-[10px] text-blue-600 font-normal">(אוניברסיטת אריאל)</span>
              </div>
              <span className="text-[11px] font-num font-extrabold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-lg">
                סה״כ: {formatILS(calcTotalDan)}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  💼 שכר עבודה נטו
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.salary_daniel}
                    onChange={e => setFormData({ ...formData, salary_daniel: e.target.value })}
                    onBlur={() => evalField('salary_daniel')}
                    onKeyDown={e => handleKeyDown(e, 'salary_daniel')}
                    placeholder="0"
                    dir="ltr"
                    className={`${inputBase} focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  🛡️ שלא מעבודה (מילואים / ביטוח לאומי)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.non_work_daniel}
                    onChange={e => setFormData({ ...formData, non_work_daniel: e.target.value })}
                    onBlur={() => evalField('non_work_daniel')}
                    onKeyDown={e => handleKeyDown(e, 'non_work_daniel')}
                    placeholder="0"
                    dir="ltr"
                    className={`${inputBase} focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Shoval */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50/60 to-slate-50/90 border border-purple-100 space-y-2.5">
            <div className="flex items-center justify-between border-b border-purple-100/70 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                <span className="text-base">👩‍⚕️</span>
                <span>שובל</span>
                <span className="text-[10px] text-purple-600 font-normal">(עזר מציון / עיריית פ״ת)</span>
              </div>
              <span className="text-[11px] font-num font-extrabold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-lg">
                סה״כ: {formatILS(calcTotalShov)}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  💼 שכר עבודה נטו
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.salary_shoval}
                    onChange={e => setFormData({ ...formData, salary_shoval: e.target.value })}
                    onBlur={() => evalField('salary_shoval')}
                    onKeyDown={e => handleKeyDown(e, 'salary_shoval')}
                    placeholder="0"
                    dir="ltr"
                    className={`${inputBase} focus:border-purple-500 focus:ring-2 focus:ring-purple-100`}
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  👶 שלא מעבודה (דמי לידה / ביטוח לאומי)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.non_work_shoval}
                    onChange={e => setFormData({ ...formData, non_work_shoval: e.target.value })}
                    onBlur={() => evalField('non_work_shoval')}
                    onKeyDown={e => handleKeyDown(e, 'non_work_shoval')}
                    placeholder="0"
                    dir="ltr"
                    className={`${inputBase} focus:border-purple-500 focus:ring-2 focus:ring-purple-100`}
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other household income & Expenses row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-teal-800 mb-1">
              🏛️ קצבאות ילדים והכנסות נוספות
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.other_income}
                onChange={e => setFormData({ ...formData, other_income: e.target.value })}
                onBlur={() => evalField('other_income')}
                onKeyDown={e => handleKeyDown(e, 'other_income')}
                placeholder="0"
                dir="ltr"
                className={`${inputBase} focus:border-teal-500 focus:ring-2 focus:ring-teal-100`}
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-700 mb-1">
              💳 הוצאות שוטפות (אשראי, שכירות, חשבונות)
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.expenses}
                onChange={e => setFormData({ ...formData, expenses: e.target.value })}
                onBlur={() => evalField('expenses')}
                onKeyDown={e => handleKeyDown(e, 'expenses')}
                placeholder="0"
                dir="ltr"
                className={`${inputBase} focus:border-rose-500 focus:ring-2 focus:ring-rose-100`}
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
            </div>
          </div>
        </div>

        {/* Live Income Subtotal Ribbon: 2x2 grid on mobile, row on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] font-num font-semibold">
          <div className="bg-white p-2 rounded-lg border border-slate-100 text-center">
            <span className="text-slate-400 block text-[10px]">דניאל</span>
            <span className="text-blue-700 font-bold">{formatILS(calcTotalDan)}</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-100 text-center">
            <span className="text-slate-400 block text-[10px]">שובל</span>
            <span className="text-purple-700 font-bold">{formatILS(calcTotalShov)}</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-100 text-center">
            <span className="text-slate-400 block text-[10px]">מעבודה</span>
            <span className="text-slate-800 font-bold">{formatILS(calcTotalWorkSalary)}</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-100 text-center">
            <span className="text-slate-400 block text-[10px]">שלא מעבודה</span>
            <span className="text-teal-700 font-bold">{formatILS(calcTotalNonWork)}</span>
          </div>
        </div>
      </div>

      {/* ─────────────── Section 2: Checking Accounts & Wallets ─────────────── */}
      <div className="mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1.5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            עו״ש — חשבונות בנק וארנקים
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-num font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              בנקים: {formatILS(calcBanksTotal)}
            </span>
            <span className="text-xs font-num font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-200">
              ארנקים: {formatILS(calcWalletsTotal)}
            </span>
          </div>
        </div>

        {/* Bank Accounts List: Clean Card Rows */}
        <div className="space-y-2 mb-3">
          {/* ONE ZERO */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center text-sm shrink-0">
                🏦
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-slate-800 block leading-tight">ONE ZERO</span>
                <span className="text-[10px] text-slate-400 font-normal">חשבון ראשי 2150</span>
              </div>
            </div>
            <div className="relative w-36 sm:w-44 shrink-0">
              <input
                type="text"
                value={formData.checking_onezero}
                onChange={e => setFormData({ ...formData, checking_onezero: e.target.value })}
                onBlur={() => evalField('checking_onezero')}
                onKeyDown={e => handleKeyDown(e, 'checking_onezero')}
                placeholder="0"
                dir="ltr"
                className={`${inputBase} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-bold`}
              />
              <span className="absolute right-2.5 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
            </div>
          </div>

          {/* Pepper */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-red-100/70 text-red-700 flex items-center justify-center text-sm shrink-0">
                🌶️
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-slate-800 block leading-tight">Pepper (לאומי)</span>
                <span className="text-[10px] text-slate-400 font-normal">חשבון 3302</span>
              </div>
            </div>
            <div className="relative w-36 sm:w-44 shrink-0">
              <input
                type="text"
                value={formData.checking_pepper}
                onChange={e => setFormData({ ...formData, checking_pepper: e.target.value })}
                onBlur={() => evalField('checking_pepper')}
                onKeyDown={e => handleKeyDown(e, 'checking_pepper')}
                placeholder="0"
                dir="ltr"
                className={`${inputBase} focus:border-red-400 focus:ring-2 focus:ring-red-100 font-bold`}
              />
              <span className="absolute right-2.5 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
            </div>
          </div>

          {/* Otzar HaHayal */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-purple-100/70 text-purple-700 flex items-center justify-center text-sm shrink-0">
                🎖️
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-slate-800 block leading-tight">אוצר החייל</span>
                <span className="text-[10px] text-slate-400 font-normal">חשבון 6775</span>
              </div>
            </div>
            <div className="relative w-36 sm:w-44 shrink-0">
              <input
                type="text"
                value={formData.checking_otsar}
                onChange={e => setFormData({ ...formData, checking_otsar: e.target.value })}
                onBlur={() => evalField('checking_otsar')}
                onKeyDown={e => handleKeyDown(e, 'checking_otsar')}
                placeholder="0"
                dir="ltr"
                className={`${inputBase} focus:border-purple-500 focus:ring-2 focus:ring-purple-100 font-bold`}
              />
              <span className="absolute right-2.5 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
            </div>
          </div>

          {/* Digital Wallets: PayBox & Bit Side-by-Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {/* PayBox */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base">👛</span>
                <span className="text-xs font-bold text-slate-800">PayBox</span>
              </div>
              <div className="relative w-32 sm:w-36 shrink-0">
                <input
                  type="text"
                  value={formData.paybox}
                  onChange={e => setFormData({ ...formData, paybox: e.target.value })}
                  onBlur={() => evalField('paybox')}
                  onKeyDown={e => handleKeyDown(e, 'paybox')}
                  placeholder="0"
                  dir="ltr"
                  className={`${inputBase} focus:border-orange-400 focus:ring-2 focus:ring-orange-100 font-bold`}
                />
                <span className="absolute right-2.5 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
              </div>
            </div>

            {/* Bit */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base">💳</span>
                <span className="text-xs font-bold text-slate-800">Bit</span>
              </div>
              <div className="relative w-32 sm:w-36 shrink-0">
                <input
                  type="text"
                  value={formData.bit}
                  onChange={e => setFormData({ ...formData, bit: e.target.value })}
                  onBlur={() => evalField('bit')}
                  onKeyDown={e => handleKeyDown(e, 'bit')}
                  placeholder="0"
                  dir="ltr"
                  className={`${inputBase} focus:border-teal-400 focus:ring-2 focus:ring-teal-100 font-bold`}
                />
                <span className="absolute right-2.5 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Checking Summary Strip */}
        <div className="flex items-center justify-between bg-sky-50/90 border border-sky-200 rounded-xl px-3.5 py-2">
          <div className="text-xs text-sky-800 font-semibold flex items-center gap-1.5">
            <span>💰</span>
            <span>סה״כ נזילות מיידית:</span>
          </div>
          <span className="text-sm font-num font-extrabold text-sky-900">{formatILS(calcChecking)}</span>
        </div>
      </div>

      {/* ─────────────── Section 3: Investments ─────────────── */}
      <div className="mb-5">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">השקעות ותיקים</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

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
            <label className="block text-xs font-semibold text-teal-700 mb-1">
              קרן שהופקדה באקסלנס (בסיס)
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
              <div className="text-[11px] text-teal-800 bg-teal-50/60 border border-teal-200/60 rounded-lg p-1.5 mt-1.5 font-num flex flex-wrap items-center justify-between gap-1">
                <span>רווח: +{formatILS(Math.max(0, numExcellence - numCostBasis))}</span>
                <span>מס 25%: -{formatILS(Math.round(Math.max(0, numExcellence - numCostBasis) * 0.25))}</span>
                <span className="font-bold text-emerald-800">נטו: {formatILS(numExcellence - Math.round(Math.max(0, numExcellence - numCostBasis) * 0.25))}</span>
              </div>
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
      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-3 gap-2 text-center text-xs mb-4">
        <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-slate-400 text-[10px] block">חיסכון חודשי</span>
          <span className={`font-num font-extrabold text-xs sm:text-sm ${calcSavings >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {formatILS(calcSavings)}
          </span>
        </div>
        <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-slate-400 text-[10px] block">אחוז חיסכון</span>
          <span className="font-num font-extrabold text-xs sm:text-sm text-blue-600">
            {calcSavingsRate.toFixed(1)}%
          </span>
        </div>
        <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-slate-400 text-[10px] block">סה״כ השקעות</span>
          <span className="font-num font-extrabold text-xs sm:text-sm text-slate-900">
            {formatILS(calcInvestments)}
          </span>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">הערות חופשיות (אופציונלי)</label>
        <textarea
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
          placeholder="הערות לחודש זה..."
          rows={2}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-700 text-xs focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition resize-none"
        />
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-slate-100 gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 active:scale-95 transition disabled:opacity-50"
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
