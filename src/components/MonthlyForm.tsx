import React, { useState, useEffect } from 'react';
import { FinancialRecord } from '../types';
import { Save, Sparkles, Check, Wallet, Landmark, DollarSign, ArrowUpRight, TrendingUp } from 'lucide-react';

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
    const val = r.salary_daniel ?? r.raw_formulas?.salary_daniel;
    if (val !== undefined && val !== null && Number(val) > 0) return String(val);
    return '';
  };
  const getInitNonWorkDan = (r: FinancialRecord) => {
    const val = r.non_work_daniel ?? r.raw_formulas?.non_work_daniel;
    if (val !== undefined && val !== null && Number(val) > 0) return String(val);
    return '';
  };
  const getInitSalaryShov = (r: FinancialRecord) => {
    const val = r.salary_shoval ?? r.raw_formulas?.salary_shoval;
    if (val !== undefined && val !== null && Number(val) > 0) return String(val);
    return '';
  };
  const getInitNonWorkShov = (r: FinancialRecord) => {
    const val = r.non_work_shoval ?? r.raw_formulas?.non_work_shoval;
    if (val !== undefined && val !== null && Number(val) > 0) return String(val);
    return '';
  };
  const getInitOtherInc = (r: FinancialRecord) => {
    const val = r.other_income ?? r.raw_formulas?.other_income;
    if (val !== undefined && val !== null && Number(val) > 0) return String(val);
    return '';
  };
  const getInitCheckingOneZero = (r: FinancialRecord) => {
    const rf = typeof r.raw_formulas === 'string' ? (() => { try { return JSON.parse(r.raw_formulas); } catch { return {}; } })() : (r.raw_formulas || {});
    const val = r.checking_onezero ?? rf.checking_onezero;
    if (val !== undefined && val !== null && val !== '') return String(val);
    if (r.period === '2026-09') return '59418';
    if (r.period === '2026-08') return '42370';
    return '';
  };
  const getInitCheckingPepper = (r: FinancialRecord) => {
    const rf = typeof r.raw_formulas === 'string' ? (() => { try { return JSON.parse(r.raw_formulas); } catch { return {}; } })() : (r.raw_formulas || {});
    const val = r.checking_pepper ?? rf.checking_pepper;
    if (val !== undefined && val !== null && val !== '') return String(val);
    if (r.period === '2026-09') return '7662';
    if (r.period === '2026-08') return '7667';
    return '';
  };
  const getInitCheckingOtsar = (r: FinancialRecord) => {
    const rf = typeof r.raw_formulas === 'string' ? (() => { try { return JSON.parse(r.raw_formulas); } catch { return {}; } })() : (r.raw_formulas || {});
    const val = r.checking_otsar ?? rf.checking_otsar;
    if (val !== undefined && val !== null && val !== '') return String(val);
    if (r.period === '2026-09') return '-10870';
    if (r.period === '2026-08') return '-8091';
    return '';
  };
  const getInitPaybox = (r: FinancialRecord) => {
    const rf = typeof r.raw_formulas === 'string' ? (() => { try { return JSON.parse(r.raw_formulas); } catch { return {}; } })() : (r.raw_formulas || {});
    const val = r.paybox ?? rf.paybox;
    if (val !== undefined && val !== null && val !== '') return String(val);
    if (r.period === '2026-09') return '781';
    return '';
  };
  const getInitBit = (r: FinancialRecord) => {
    const rf = typeof r.raw_formulas === 'string' ? (() => { try { return JSON.parse(r.raw_formulas); } catch { return {}; } })() : (r.raw_formulas || {});
    const val = r.bit ?? rf.bit;
    if (val !== undefined && val !== null && val !== '') return String(val);
    if (r.period === '2026-09') return '600';
    return '';
  };

  const [formData, setFormData] = useState({
    salary_daniel: getInitSalaryDan(record),
    non_work_daniel: getInitNonWorkDan(record),
    salary_shoval: getInitSalaryShov(record),
    non_work_shoval: getInitNonWorkShov(record),
    other_income: getInitOtherInc(record),
    expenses: record.expenses ? String(record.expenses) : '',
    checking_onezero: getInitCheckingOneZero(record),
    checking_pepper: getInitCheckingPepper(record),
    checking_otsar: getInitCheckingOtsar(record),
    paybox: getInitPaybox(record),
    bit: getInitBit(record),
    altshuler: record.altshuler ? String(record.altshuler) : '',
    excellence: record.excellence ? String(record.excellence) : '',
    excellence_cost_basis: record.excellence_cost_basis ? String(record.excellence_cost_basis) : '',
    money_market: record.money_market ? String(record.money_market) : '',
    notes: record.notes || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData({
      salary_daniel: getInitSalaryDan(record),
      non_work_daniel: getInitNonWorkDan(record),
      salary_shoval: getInitSalaryShov(record),
      non_work_shoval: getInitNonWorkShov(record),
      other_income: getInitOtherInc(record),
      expenses: record.expenses ? String(record.expenses) : '',
      checking_onezero: getInitCheckingOneZero(record),
      checking_pepper: getInitCheckingPepper(record),
      checking_otsar: getInitCheckingOtsar(record),
      paybox: getInitPaybox(record),
      bit: getInitBit(record),
      altshuler: record.altshuler ? String(record.altshuler) : '',
      excellence: record.excellence ? String(record.excellence) : '',
      excellence_cost_basis: record.excellence_cost_basis ? String(record.excellence_cost_basis) : '',
      money_market: record.money_market ? String(record.money_market) : '',
      notes: record.notes || '',
    });
    setSavedSuccess(false);
  }, [record.period, record.updated_at]);

  const parseVal = (str: string): number => {
    if (!str) return 0;
    let clean = String(str).trim();
    if (clean.startsWith('=')) clean = clean.substring(1).trim();
    clean = clean.replace(/,/g, '');
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

  // Live calculations
  const numSalDan = parseVal(formData.salary_daniel);
  const numNonWorkDan = parseVal(formData.non_work_daniel);
  const numSalShov = parseVal(formData.salary_shoval);
  const numNonWorkShov = parseVal(formData.non_work_shoval);
  const numOtherIncome = parseVal(formData.other_income);
  const numExpenses = parseVal(formData.expenses);

  const calcTotalDan = numSalDan + numNonWorkDan;
  const calcTotalShov = numSalShov + numNonWorkShov;
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

  const calcChecking = numOneZero + numPepper + numOtsar + numPaybox + numBit;
  const calcSavings = calcTotalIncome > 0 || numExpenses > 0 ? calcTotalIncome - numExpenses : 0;
  const calcSavingsRate = calcTotalIncome > 0 ? (calcSavings / calcTotalIncome) * 100 : 0;
  const calcInvestments = numAltshuler + numExcellence + numMoneyMarket;
  const calcTotalWealth = calcChecking + calcInvestments;

  const formatILS = (val: number) => '₪ ' + Math.round(val).toLocaleString('he-IL');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormData(prev => ({
      ...prev,
      salary_daniel: numSalDan ? String(numSalDan) : '',
      non_work_daniel: numNonWorkDan ? String(numNonWorkDan) : '',
      salary_shoval: numSalShov ? String(numSalShov) : '',
      non_work_shoval: numNonWorkShov ? String(numNonWorkShov) : '',
      other_income: numOtherIncome ? String(numOtherIncome) : '',
      expenses: numExpenses ? String(numExpenses) : '',
      checking_onezero: formData.checking_onezero !== '' ? String(numOneZero) : '',
      checking_pepper: formData.checking_pepper !== '' ? String(numPepper) : '',
      checking_otsar: formData.checking_otsar !== '' ? String(numOtsar) : '',
      paybox: formData.paybox !== '' ? String(numPaybox) : '',
      bit: formData.bit !== '' ? String(numBit) : '',
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
      raw_formulas: {
        ...(record.raw_formulas || {}),
        salary_daniel: numSalDan,
        non_work_daniel: numNonWorkDan,
        salary_shoval: numSalShov,
        non_work_shoval: numNonWorkShov,
        other_income: numOtherIncome,
        checking_onezero: numOneZero,
        checking_pepper: numPepper,
        checking_otsar: numOtsar,
        paybox: numPaybox,
        bit: numBit,
        altshuler: numAltshuler,
        excellence: numExcellence,
        excellence_cost_basis: numCostBasis,
        money_market: numMoneyMarket,
      },
      updated_at: new Date().toISOString(),
    };

    await onSave(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const inputClass =
    'w-28 sm:w-36 text-left pl-3 pr-7 py-2 text-xs font-semibold text-stone-900 bg-[#FAF8F5] border border-black/[0.08] rounded-xl focus:outline-none focus:border-stone-900 focus:bg-white transition-all font-serif';

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in" dir="rtl">
      
      {/* 1. Page Title & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div>
          <span className="text-[10px] tracking-[0.16em] uppercase text-stone-400 font-semibold block mb-0.5">
            MONTHLY DATA LEDGER // ספר נתונים חודשי
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-stone-900">
            הזנה ועדכון חודשי
          </h1>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white font-semibold text-xs shadow-2xs hover:opacity-90 active:scale-95 transition disabled:opacity-50 btn-press"
        >
          {isSaving ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : savedSuccess ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>{savedSuccess ? 'נשמר בהצלחה!' : isSaving ? 'שומר...' : 'שמור נתוני חודש'}</span>
        </button>
      </div>

      {/* 2. Calculated Summary Floating Card (Minimalist Luxury) */}
      <section className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">
            חיסכון נטו מחושב החודש // CALCULATED NET SAVINGS
          </span>
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{calcSavingsRate.toFixed(1)}% שיעור חיסכון</span>
          </span>
        </div>

        {/* Hero Monetary Metric */}
        <div className="flex items-baseline gap-2 mb-2.5">
          <span className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-stone-900">
            {formatILS(calcSavings)}
          </span>
          <span className="text-xs text-stone-500 font-normal">נצבר להון</span>
        </div>

        {/* Progress Bar Indicator */}
        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mb-3.5">
          <div
            className="bg-[#1A1A1A] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, calcSavingsRate))}%` }}
          />
        </div>

        {/* Micro-stats Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-black/[0.06]">
          <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-black/[0.04]">
            <span className="text-[10px] text-stone-400 block mb-0.5">סך הכנסות חודשיות</span>
            <span className="text-xs font-bold font-serif text-stone-900">{formatILS(calcTotalIncome)}</span>
          </div>
          <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-black/[0.04]">
            <span className="text-[10px] text-stone-400 block mb-0.5">הוצאות החודש</span>
            <span className="text-xs font-bold font-serif text-stone-900">{formatILS(numExpenses)}</span>
          </div>
          <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-black/[0.04]">
            <span className="text-[10px] text-stone-400 block mb-0.5">סך הון מעודכן</span>
            <span className="text-xs font-bold font-serif text-stone-900">{formatILS(calcTotalWealth)}</span>
          </div>
        </div>
      </section>

      {/* 3. Section: יתרות עו״ש ונזילות (Liquid Cash) with Poker Chips */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-stone-900" />
            <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-stone-800 font-serif">
              1. יתרות עו״ש ונזילות (Liquid Cash)
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-stone-900 font-serif">
            סה״כ: {formatILS(calcChecking)}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm divide-y divide-black/[0.04] overflow-hidden">
          
          {/* אוצר החייל */}
          <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-stone-800 shadow-2xs font-mono">
                או
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-900 truncate">בנק אוצר החייל</p>
                <p className="text-[10px] text-stone-400 truncate">עו״ש ראשי למשק בית</p>
              </div>
            </div>
            <div className="relative flex items-center shrink-0">
              <span className="absolute right-3 text-xs text-stone-400 font-serif pointer-events-none">₪</span>
              <input
                type="text"
                value={formData.checking_otsar}
                onChange={e => setFormData({ ...formData, checking_otsar: e.target.value })}
                onBlur={() => evalField('checking_otsar')}
                onKeyDown={e => handleKeyDown(e, 'checking_otsar')}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          {/* One Zero */}
          <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-900 font-bold text-[11px] flex items-center justify-center shrink-0 border border-stone-300 shadow-2xs font-mono">
                OZ
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-900 truncate">וואן זירו One Zero</p>
                <p className="text-[10px] text-stone-400 truncate">קרן ביטחון ונזילות</p>
              </div>
            </div>
            <div className="relative flex items-center shrink-0">
              <span className="absolute right-3 text-xs text-stone-400 font-serif pointer-events-none">₪</span>
              <input
                type="text"
                value={formData.checking_onezero}
                onChange={e => setFormData({ ...formData, checking_onezero: e.target.value })}
                onBlur={() => evalField('checking_onezero')}
                onKeyDown={e => handleKeyDown(e, 'checking_onezero')}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          {/* Pepper */}
          <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-900 font-bold text-[10px] flex items-center justify-center shrink-0 border border-emerald-500/30 shadow-2xs font-mono">
                PEP
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-900 truncate">פפר Pepper</p>
                <p className="text-[10px] text-stone-400 truncate">שוטף וכרטיסים</p>
              </div>
            </div>
            <div className="relative flex items-center shrink-0">
              <span className="absolute right-3 text-xs text-stone-400 font-serif pointer-events-none">₪</span>
              <input
                type="text"
                value={formData.checking_pepper}
                onChange={e => setFormData({ ...formData, checking_pepper: e.target.value })}
                onBlur={() => evalField('checking_pepper')}
                onKeyDown={e => handleKeyDown(e, 'checking_pepper')}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          {/* PayBox */}
          <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-500/30 shadow-2xs font-mono">
                PB
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-900 truncate">יתרת PayBox</p>
                <p className="text-[10px] text-stone-400 truncate">ארנק תשלומים</p>
              </div>
            </div>
            <div className="relative flex items-center shrink-0">
              <span className="absolute right-3 text-xs text-stone-400 font-serif pointer-events-none">₪</span>
              <input
                type="text"
                value={formData.paybox}
                onChange={e => setFormData({ ...formData, paybox: e.target.value })}
                onBlur={() => evalField('paybox')}
                onKeyDown={e => handleKeyDown(e, 'paybox')}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          {/* Bit */}
          <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-800 font-bold text-xs flex items-center justify-center shrink-0 border border-stone-300 shadow-2xs font-mono">
                BIT
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-900 truncate">יתרת Bit</p>
                <p className="text-[10px] text-stone-400 truncate">העברות מיידיות</p>
              </div>
            </div>
            <div className="relative flex items-center shrink-0">
              <span className="absolute right-3 text-xs text-stone-400 font-serif pointer-events-none">₪</span>
              <input
                type="text"
                value={formData.bit}
                onChange={e => setFormData({ ...formData, bit: e.target.value })}
                onBlur={() => evalField('bit')}
                onKeyDown={e => handleKeyDown(e, 'bit')}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

        </div>
      </section>

      {/* 4. Section: הכנסות חודשיות נטו (Income Inflow) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-stone-800 font-serif">
              2. הכנסות חודשיות נטו (Monthly Net Inflow)
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 font-serif">
            סה״כ: {formatILS(calcTotalIncome)}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm divide-y divide-black/[0.04] overflow-hidden">
          
          {/* Daniel Salary */}
          <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs font-serif">
                ד
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-900 truncate">דניאל — שכר עבודה נטו</p>
                <p className="text-[10px] text-stone-400 truncate">אוניברסיטת אריאל</p>
              </div>
            </div>
            <div className="relative flex items-center shrink-0">
              <span className="absolute right-3 text-xs text-stone-400 font-serif pointer-events-none">₪</span>
              <input
                type="text"
                value={formData.salary_daniel}
                onChange={e => setFormData({ ...formData, salary_daniel: e.target.value })}
                onBlur={() => evalField('salary_daniel')}
                onKeyDown={e => handleKeyDown(e, 'salary_daniel')}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          {/* Daniel Non-Work */}
          <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center shrink-0 border border-stone-300 font-serif">
                ד+
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-900 truncate">דניאל — שלא מעבודה</p>
                <p className="text-[10px] text-stone-400 truncate">מילואים / תגמולים</p>
              </div>
            </div>
            <div className="relative flex items-center shrink-0">
              <span className="absolute right-3 text-xs text-stone-400 font-serif pointer-events-none">₪</span>
              <input
                type="text"
                value={formData.non_work_daniel}
                onChange={e => setFormData({ ...formData, non_work_daniel: e.target.value })}
                onBlur={() => evalField('non_work_daniel')}
                onKeyDown={e => handleKeyDown(e, 'non_work_daniel')}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          {/* Shoval Salary */}
          <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs font-serif">
                ש
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-900 truncate">שובל — שכר עבודה נטו</p>
                <p className="text-[10px] text-stone-400 truncate">עזר מציון / עיריית פ״ת</p>
              </div>
            </div>
            <div className="relative flex items-center shrink-0">
              <span className="absolute right-3 text-xs text-stone-400 font-serif pointer-events-none">₪</span>
              <input
                type="text"
                value={formData.salary_shoval}
                onChange={e => setFormData({ ...formData, salary_shoval: e.target.value })}
                onBlur={() => evalField('salary_shoval')}
                onKeyDown={e => handleKeyDown(e, 'salary_shoval')}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          {/* Shoval Non-Work */}
          <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center shrink-0 border border-stone-300 font-serif">
                ש+
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-900 truncate">שובל — שלא מעבודה</p>
                <p className="text-[10px] text-stone-400 truncate">דמי לידה / ביטוח לאומי</p>
              </div>
            </div>
            <div className="relative flex items-center shrink-0">
              <span className="absolute right-3 text-xs text-stone-400 font-serif pointer-events-none">₪</span>
              <input
                type="text"
                value={formData.non_work_shoval}
                onChange={e => setFormData({ ...formData, non_work_shoval: e.target.value })}
                onBlur={() => evalField('non_work_shoval')}
                onKeyDown={e => handleKeyDown(e, 'non_work_shoval')}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          {/* Other Income / Child allowances */}
          <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/20">
                🏛️
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-900 truncate">קצבאות ילדים והכנסות נוספות</p>
                <p className="text-[10px] text-stone-400 truncate">ביטוח לאומי / מענקים</p>
              </div>
            </div>
            <div className="relative flex items-center shrink-0">
              <span className="absolute right-3 text-xs text-stone-400 font-serif pointer-events-none">₪</span>
              <input
                type="text"
                value={formData.other_income}
                onChange={e => setFormData({ ...formData, other_income: e.target.value })}
                onBlur={() => evalField('other_income')}
                onKeyDown={e => handleKeyDown(e, 'other_income')}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

        </div>
      </section>

      {/* 5. Section: הוצאות החודש (Expenses Outflow) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-stone-400" />
            <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-stone-800 font-serif">
              3. הוצאות החודש הכוללות (Monthly Outflow)
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-stone-900 font-serif">
            {formatILS(numExpenses)}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-stone-900">סך הוצאות מחיה, כרטיסי אשראי והתחייבויות</p>
            <p className="text-[10px] text-stone-400 mt-0.5">ניתן להזין ביטוי חיבור ישיר (למשל: 14200+3100)</p>
          </div>
          <div className="relative flex items-center shrink-0">
            <span className="absolute right-3 text-xs text-stone-400 font-serif pointer-events-none">₪</span>
            <input
              type="text"
              value={formData.expenses}
              onChange={e => setFormData({ ...formData, expenses: e.target.value })}
              onBlur={() => evalField('expenses')}
              onKeyDown={e => handleKeyDown(e, 'expenses')}
              placeholder="0"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* 6. Section: אפיקי השקעה והון (Investments & Portfolios) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-stone-800 font-serif">
              4. אפיקי השקעה והון (Investments Portfolio)
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 font-serif">
            סה״כ: {formatILS(calcInvestments)}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm divide-y divide-black/[0.04] overflow-hidden">
          
          {/* Excellence */}
          <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-900 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/30 shadow-2xs font-serif">
                EX
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-900 truncate">אקסלנס נשואה — מניות</p>
                <p className="text-[10px] text-stone-400 truncate">תיק מנוהל ומניות עצמאיות</p>
              </div>
            </div>
            <div className="relative flex items-center shrink-0">
              <span className="absolute right-3 text-xs text-stone-400 font-serif pointer-events-none">₪</span>
              <input
                type="text"
                value={formData.excellence}
                onChange={e => setFormData({ ...formData, excellence: e.target.value })}
                onBlur={() => evalField('excellence')}
                onKeyDown={e => handleKeyDown(e, 'excellence')}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          {/* Excellence Cost Basis */}
          <div className="p-3.5 flex items-center justify-between gap-3 bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-700 font-bold text-[11px] flex items-center justify-center shrink-0 border border-stone-300 font-serif">
                CB
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-900 truncate">עלות בסיס (אקסלנס)</p>
                <p className="text-[10px] text-stone-400 truncate">לחישוב מס רווח הון נטו</p>
              </div>
            </div>
            <div className="relative flex items-center shrink-0">
              <span className="absolute right-3 text-xs text-stone-400 font-serif pointer-events-none">₪</span>
              <input
                type="text"
                value={formData.excellence_cost_basis}
                onChange={e => setFormData({ ...formData, excellence_cost_basis: e.target.value })}
                onBlur={() => evalField('excellence_cost_basis')}
                onKeyDown={e => handleKeyDown(e, 'excellence_cost_basis')}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          {/* Altshuler */}
          <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-500/30 shadow-2xs font-serif">
                AL
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-900 truncate">אלטשולר שחם — גמל והשתלמות</p>
                <p className="text-[10px] text-stone-400 truncate">מסלול S&P 500 ומניות</p>
              </div>
            </div>
            <div className="relative flex items-center shrink-0">
              <span className="absolute right-3 text-xs text-stone-400 font-serif pointer-events-none">₪</span>
              <input
                type="text"
                value={formData.altshuler}
                onChange={e => setFormData({ ...formData, altshuler: e.target.value })}
                onBlur={() => evalField('altshuler')}
                onKeyDown={e => handleKeyDown(e, 'altshuler')}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          {/* Money Market */}
          <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-900 font-bold text-xs flex items-center justify-center shrink-0 border border-stone-300 shadow-2xs font-serif">
                MM
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-900 truncate">קרן כספית שקלית</p>
                <p className="text-[10px] text-stone-400 truncate">תשואה צמודת ריבית בנק ישראל</p>
              </div>
            </div>
            <div className="relative flex items-center shrink-0">
              <span className="absolute right-3 text-xs text-stone-400 font-serif pointer-events-none">₪</span>
              <input
                type="text"
                value={formData.money_market}
                onChange={e => setFormData({ ...formData, money_market: e.target.value })}
                onBlur={() => evalField('money_market')}
                onKeyDown={e => handleKeyDown(e, 'money_market')}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

        </div>
      </section>

      {/* 7. Notes Textarea */}
      <section className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-4 space-y-2">
        <label className="block text-xs font-bold font-serif text-stone-900">
          הערות ומאורעות חודשיים מיוחדים
        </label>
        <textarea
          rows={2}
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
          placeholder="לדוגמה: בוצע פדיון, קיבלנו מענק לידה, שילמנו ביטוח שנתי..."
          className="w-full bg-[#FAF8F5] border border-black/[0.08] rounded-xl p-3 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:bg-white transition-all resize-none"
        />
      </section>

      {/* 8. Bottom Sticky / Floating Save Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3.5 px-6 rounded-xl bg-[#1A1A1A] text-white font-semibold text-xs sm:text-sm shadow-sm hover:opacity-95 active:scale-95 transition flex items-center justify-center gap-2 btn-press"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : savedSuccess ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{savedSuccess ? 'הנתונים נשמרו בהצלחה!' : isSaving ? 'שומר שינויים בענן...' : 'שמור נתונים חודשיים'}</span>
        </button>
      </div>

      {/* Floating Quick Save Pill (Always in thumb zone, above bottom nav) */}
      <div className="fixed bottom-20 inset-x-0 z-30 flex justify-center px-4 pointer-events-none animate-fade-in">
        <button
          type="submit"
          disabled={isSaving}
          className="pointer-events-auto bg-[#1A1A1A] text-white px-6 py-3 rounded-full shadow-xl hover:shadow-2xl active:scale-95 transition-all flex items-center gap-2 border border-white/10 text-xs font-semibold font-serif tracking-wide"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : savedSuccess ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Save className="w-4 h-4 text-stone-300" />
          )}
          <span>{savedSuccess ? 'נשמר בהצלחה ✓' : isSaving ? 'שומר בענן...' : 'שמור חודש'}</span>
        </button>
      </div>

    </form>
  );
};
