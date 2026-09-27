import React, { useState, useEffect } from 'react';
import { FinancialRecord } from '../types';
import {
  X,
  Check,
  Building2,
  Globe,
  Layers,
  ShieldCheck,
  Coins,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Calculator,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export type AssetEditType = 'checking' | 'excellence' | 'onezero' | 'altshuler' | 'moneyMarket';

interface QuickAssetEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAssetType: AssetEditType;
  currentRecord: FinancialRecord;
  previousRecord?: FinancialRecord;
  onSaveRecord: (updatedRecord: FinancialRecord) => Promise<void>;
  onOpenCostBasis?: () => void;
}

export const QuickAssetEditModal: React.FC<QuickAssetEditModalProps> = ({
  isOpen,
  onClose,
  initialAssetType,
  currentRecord,
  previousRecord,
  onSaveRecord,
  onOpenCostBasis,
}) => {
  const [activeTab, setActiveTab] = useState<AssetEditType>(initialAssetType);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form states for Checking accounts
  const [checkingOneZero, setCheckingOneZero] = useState<string>('');
  const [checkingPepper, setCheckingPepper] = useState<string>('');
  const [checkingOtsar, setCheckingOtsar] = useState<string>('');
  const [paybox, setPaybox] = useState<string>('');
  const [bit, setBit] = useState<string>('');
  const [directChecking, setDirectChecking] = useState<string>('');
  const [isDirectCheckingMode, setIsDirectCheckingMode] = useState<boolean>(false);

  // Form states for other investment portfolios
  const [excellenceVal, setExcellenceVal] = useState<string>('');
  const [costBasisVal, setCostBasisVal] = useState<string>('');
  const [oneZeroVal, setOneZeroVal] = useState<string>('');
  const [altshulerVal, setAltshulerVal] = useState<string>('');
  const [moneyMarketVal, setMoneyMarketVal] = useState<string>('');

  // Sync tab whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialAssetType);
    }
  }, [isOpen, initialAssetType]);

  // Sync form inputs with current record
  useEffect(() => {
    if (!currentRecord) return;
    const rf = currentRecord.raw_formulas || {};

    const oz = currentRecord.checking_onezero ?? rf.checking_onezero ?? (currentRecord.period === '2026-09' ? 59418 : (currentRecord.period === '2026-08' ? 42370 : ''));
    setCheckingOneZero(oz !== undefined && oz !== null && oz !== '' ? String(oz) : '');

    const pep = currentRecord.checking_pepper ?? rf.checking_pepper ?? (currentRecord.period === '2026-09' ? 7662 : (currentRecord.period === '2026-08' ? 7667 : ''));
    setCheckingPepper(pep !== undefined && pep !== null && pep !== '' ? String(pep) : '');

    const ots = currentRecord.checking_otsar ?? rf.checking_otsar ?? (currentRecord.period === '2026-09' ? -10870 : (currentRecord.period === '2026-08' ? -8091 : ''));
    setCheckingOtsar(ots !== undefined && ots !== null && ots !== '' ? String(ots) : '');

    const pb = currentRecord.paybox ?? rf.paybox ?? (currentRecord.period === '2026-09' ? 781 : '');
    setPaybox(pb !== undefined && pb !== null && pb !== '' ? String(pb) : '');

    const bt = currentRecord.bit ?? rf.bit ?? (currentRecord.period === '2026-09' ? 600 : '');
    setBit(bt !== undefined && bt !== null && bt !== '' ? String(bt) : '');

    setDirectChecking(currentRecord.checking ? String(currentRecord.checking) : '');

    setExcellenceVal(currentRecord.excellence ? String(currentRecord.excellence) : '');
    setCostBasisVal(currentRecord.excellence_cost_basis ? String(currentRecord.excellence_cost_basis) : '');
    setOneZeroVal(
      currentRecord.onezero_portfolio
        ? String(currentRecord.onezero_portfolio)
        : rf.onezero_portfolio
        ? String(rf.onezero_portfolio)
        : currentRecord.period >= '2026-07'
        ? '207785'
        : ''
    );
    setAltshulerVal(currentRecord.altshuler ? String(currentRecord.altshuler) : '');
    setMoneyMarketVal(currentRecord.money_market ? String(currentRecord.money_market) : '');
  }, [currentRecord, isOpen]);

  if (!isOpen) return null;

  // Safe formula parsing (support math like "=1000+250", subtraction, negative numbers)
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

  const formatILS = (val: number) => {
    const isNeg = val < 0;
    const formatted = Math.abs(Math.round(val)).toLocaleString('he-IL');
    return isNeg ? `-₪${formatted}` : `₪${formatted}`;
  };

  // Calculations for checking
  const numOz = parseVal(checkingOneZero);
  const numPep = parseVal(checkingPepper);
  const numOts = parseVal(checkingOtsar);
  const numPb = parseVal(paybox);
  const numBt = parseVal(bit);
  const calcBanks = numOz + numPep + numOts;
  const calcWallets = numPb + numBt;
  const calcCheckingFromBreakdown = calcBanks + calcWallets;
  const calcActiveChecking = isDirectCheckingMode ? parseVal(directChecking) : calcCheckingFromBreakdown;

  // Calculations for investments
  const calcExcellence = parseVal(excellenceVal);
  const calcCostBasis = parseVal(costBasisVal);
  const calcOneZero = parseVal(oneZeroVal);
  const calcAltshuler = parseVal(altshulerVal);
  const calcMoneyMarket = parseVal(moneyMarketVal);

  const calcInvestments = calcAltshuler + calcExcellence + calcMoneyMarket;
  const calcTotalWealth = calcActiveChecking + calcInvestments;

  const prevTotal = previousRecord?.total_wealth || currentRecord.total_wealth || 1;
  const diffFromPrev = calcTotalWealth - prevTotal;
  const diffPct = prevTotal > 0 ? ((diffFromPrev / prevTotal) * 100).toFixed(1) : '0.0';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated: FinancialRecord = {
        ...currentRecord,
        checking: calcActiveChecking,
        checking_onezero: numOz,
        checking_pepper: numPep,
        checking_otsar: numOts,
        paybox: numPb,
        bit: numBt,
        excellence: calcExcellence,
        excellence_cost_basis: calcCostBasis > 0 ? calcCostBasis : undefined,
        onezero_portfolio: calcOneZero,
        altshuler: calcAltshuler,
        money_market: calcMoneyMarket,
        investments_total: calcInvestments,
        total_wealth: calcTotalWealth,
        raw_formulas: {
          ...(currentRecord.raw_formulas || {}),
          checking_onezero: numOz,
          checking_pepper: numPep,
          checking_otsar: numOts,
          paybox: numPb,
          bit: numBt,
          total_banks: calcBanks,
          total_wallets: calcWallets,
          total_checking: calcActiveChecking,
          excellence: calcExcellence,
          excellence_cost_basis: calcCostBasis > 0 ? calcCostBasis : undefined,
          onezero_portfolio: calcOneZero,
          altshuler: calcAltshuler,
          money_market: calcMoneyMarket,
          investments_total: calcInvestments,
          total_wealth: calcTotalWealth,
        },
        updated_at: new Date().toISOString(),
      };

      await onSaveRecord(updated);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: { id: AssetEditType; label: string; icon: any; color: string; badge: string }[] = [
    {
      id: 'checking',
      label: 'עו״ש וארנקים',
      icon: Building2,
      color: 'text-slate-700 bg-slate-100 border-slate-300',
      badge: formatILS(calcActiveChecking),
    },
    {
      id: 'excellence',
      label: 'אקסלנס (מניות)',
      icon: Globe,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-300',
      badge: formatILS(calcExcellence),
    },
    {
      id: 'onezero',
      label: 'תיק One Zero',
      icon: Layers,
      color: 'text-teal-700 bg-teal-50 border-teal-300',
      badge: formatILS(calcOneZero),
    },
    {
      id: 'altshuler',
      label: 'אלטשולר שחם',
      icon: ShieldCheck,
      color: 'text-blue-700 bg-blue-50 border-blue-300',
      badge: formatILS(calcAltshuler),
    },
    {
      id: 'moneyMarket',
      label: 'קרן כספית',
      icon: Coins,
      color: 'text-amber-700 bg-amber-50 border-amber-300',
      badge: formatILS(calcMoneyMarket),
    },
  ];

  const inputBase =
    'w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-8 py-2.5 text-slate-900 font-num text-sm focus:bg-white focus:outline-none transition text-left font-bold';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      dir="rtl"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden animate-scale-in">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                עדכון מהיר — נכסים ועו״ש
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              חודש <span className="font-bold text-slate-700">{currentRecord.label}</span> • נגיעה לעדכון וסנכרון מיידי
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition active:scale-95"
            title="סגור"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Asset Switcher Tabs (Scrollable Bar) */}
        <div className="flex items-center gap-1.5 p-2 bg-slate-100/70 border-b border-slate-200/80 overflow-x-auto no-scrollbar shrink-0">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold ring-2 ring-emerald-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* TAB 1: CHECKING & WALLETS */}
          {activeTab === 'checking' && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-bold text-slate-800">פירוט יתרות עו״ש וארנקים נזילים</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDirectCheckingMode(!isDirectCheckingMode)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 underline transition"
                >
                  {isDirectCheckingMode ? 'חזור לפירוט חשבונות' : 'הזן סכום כולל ישירות'}
                </button>
              </div>

              {!isDirectCheckingMode ? (
                <div className="space-y-2.5">
                  {/* ONE ZERO */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">🏦</span>
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-800 block leading-tight">ONE ZERO</span>
                        <span className="text-[10px] text-slate-400">חשבון ראשי 2150</span>
                      </div>
                    </div>
                    <div className="relative w-36 sm:w-44 shrink-0">
                      <input
                        type="text"
                        value={checkingOneZero}
                        onChange={e => setCheckingOneZero(e.target.value)}
                        placeholder="0"
                        dir="ltr"
                        className={`${inputBase} focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                      />
                      <span className="absolute right-2.5 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
                    </div>
                  </div>

                  {/* Pepper */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">🌶️</span>
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-800 block leading-tight">Pepper (לאומי)</span>
                        <span className="text-[10px] text-slate-400">חשבון 3302</span>
                      </div>
                    </div>
                    <div className="relative w-36 sm:w-44 shrink-0">
                      <input
                        type="text"
                        value={checkingPepper}
                        onChange={e => setCheckingPepper(e.target.value)}
                        placeholder="0"
                        dir="ltr"
                        className={`${inputBase} focus:border-red-400 focus:ring-2 focus:ring-red-100`}
                      />
                      <span className="absolute right-2.5 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
                    </div>
                  </div>

                  {/* Otsar HaHayal (with negative overdraft support) */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">🎖️</span>
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 leading-tight">
                          <span>אוצר החייל</span>
                          {numOts < 0 && (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                              חובה
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-slate-400">חשבון 6775 (תומך במינוס)</span>
                      </div>
                    </div>
                    <div className="relative w-36 sm:w-44 shrink-0">
                      <input
                        type="text"
                        value={checkingOtsar}
                        onChange={e => setCheckingOtsar(e.target.value)}
                        placeholder="לדוגמה -10870"
                        dir="ltr"
                        className={`${inputBase} ${
                          numOts < 0
                            ? 'text-rose-600 font-extrabold focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                            : 'focus:border-purple-500 focus:ring-2 focus:ring-purple-100'
                        }`}
                      />
                      <span className="absolute right-2.5 top-2.5 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
                    </div>
                  </div>

                  {/* PayBox & Bit Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <span>👛</span> PayBox
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={paybox}
                          onChange={e => setPaybox(e.target.value)}
                          placeholder="0"
                          dir="ltr"
                          className={`${inputBase} focus:border-amber-500 focus:ring-2 focus:ring-amber-100 text-xs py-2`}
                        />
                        <span className="absolute right-2 top-2 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <span>⚡</span> Bit
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={bit}
                          onChange={e => setBit(e.target.value)}
                          placeholder="0"
                          dir="ltr"
                          className={`${inputBase} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs py-2`}
                        />
                        <span className="absolute right-2 top-2 text-slate-400 text-xs font-semibold pointer-events-none">₪</span>
                      </div>
                    </div>
                  </div>

                  {/* Live Checking Subtotal Card */}
                  <div className="mt-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-emerald-800 block font-medium">סה״כ עו״ש ונזילות מחושב:</span>
                      <span className="text-xs text-slate-500 font-num">
                        בנקים: {formatILS(calcBanks)} • ארנקים: {formatILS(calcWallets)}
                      </span>
                    </div>
                    <div className="text-lg font-extrabold text-emerald-950 font-num">
                      {formatILS(calcCheckingFromBreakdown)}
                    </div>
                  </div>
                </div>
              ) : (
                /* Direct checking entry mode */
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-800">
                    הזנת סכום עו״ש כולל ישיר (ללא חלוקה לבנקים)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={directChecking}
                      onChange={e => setDirectChecking(e.target.value)}
                      placeholder="0"
                      dir="ltr"
                      className={`${inputBase} text-base focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 font-bold`}
                    />
                    <span className="absolute right-3 top-3 text-slate-400 text-sm font-semibold pointer-events-none">₪</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    💡 ניתן להזין נוסחאות מתמטיות, למשל: <code>=45000+12598</code>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXCELLENCE TRADE */}
          {activeTab === 'excellence' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-800">תיק השקעות אקסלנס טרייד</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200">
                  מניות חו״ל וקרנות סל
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  שווי תיק נוכחי (ברוטו בש״ח)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={excellenceVal}
                    onChange={e => setExcellenceVal(e.target.value)}
                    placeholder="0"
                    dir="ltr"
                    className={`${inputBase} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-base`}
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-semibold pointer-events-none">₪</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    קרן מושקעת (עלות בסיס למס)
                  </label>
                  {onOpenCostBasis && (
                    <button
                      type="button"
                      onClick={onOpenCostBasis}
                      className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                    >
                      <Calculator className="w-3 h-3" />
                      <span>מחשבון מס מפורט</span>
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={costBasisVal}
                    onChange={e => setCostBasisVal(e.target.value)}
                    placeholder="הזן קרן לחישוב נטו לאחר מס"
                    dir="ltr"
                    className={`${inputBase} focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-semibold pointer-events-none">₪</span>
                </div>
              </div>

              {/* Net Tax Calculation Preview */}
              {calcCostBasis > 0 && calcExcellence > calcCostBasis && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>רווח הון צבור:</span>
                    <span className="font-semibold text-emerald-700 font-num">
                      +{formatILS(calcExcellence - calcCostBasis)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>מס משוער (25% על הרווח):</span>
                    <span className="font-semibold text-rose-600 font-num">
                      -{formatILS(Math.round((calcExcellence - calcCostBasis) * 0.25))}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                    <span>שווי נטו לאחר מס:</span>
                    <span className="text-emerald-800 font-num text-sm">
                      {formatILS(calcExcellence - Math.round((calcExcellence - calcCostBasis) * 0.25))}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ONE ZERO PORTFOLIO */}
          {activeTab === 'onezero' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-700" />
                  <span className="text-xs font-bold text-slate-800">תיק ניירות ערך וכספית ONE ZERO</span>
                </div>
                <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  מסחר עצמאי
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  שווי תיק ניירות ערך וכספית בבנק ONE ZERO
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={oneZeroVal}
                    onChange={e => setOneZeroVal(e.target.value)}
                    placeholder="0"
                    dir="ltr"
                    className={`${inputBase} focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-base`}
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-semibold pointer-events-none">₪</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  כולל מניות ישראליות/אמריקאיות ב-ONE ZERO ופיקדון/כספית ייעודיים.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: ALTSHULER SHAHAM */}
          {activeTab === 'altshuler' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span className="text-xs font-bold text-slate-800">אלטשולר שחם (השתלמות / גמל)</span>
                </div>
                <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  פטור ממס
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  שווי מצטבר בקרן השתלמות וקופות גמל
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={altshulerVal}
                    onChange={e => setAltshulerVal(e.target.value)}
                    placeholder="0"
                    dir="ltr"
                    className={`${inputBase} focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base`}
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-semibold pointer-events-none">₪</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  ניתן להזין נוסחה כגון <code>=196638+9690+18065</code> לחיבור קופות שונות.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: MONEY MARKET */}
          {activeTab === 'moneyMarket' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold text-slate-800">קרן כספית שקלית</span>
                </div>
                <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  מגן אינפלציה / סולידי
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  שווי כולל בקרנות כספיות שקליות
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={moneyMarketVal}
                    onChange={e => setMoneyMarketVal(e.target.value)}
                    placeholder="0"
                    dir="ltr"
                    className={`${inputBase} focus:border-amber-500 focus:ring-2 focus:ring-amber-100 text-base`}
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-semibold pointer-events-none">₪</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  קרנות כספיות נזילות יומיות (תשואה צפויה ~4.5% שנתית).
                </p>
              </div>
            </div>
          )}

          {/* Realtime Impact Summary Ribbon */}
          <div className="pt-3 border-t border-slate-100">
            <div className="p-3 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                  סך שווי הון מעודכן
                </span>
                <span className="text-base sm:text-lg font-black font-num">
                  {formatILS(calcTotalWealth)}
                </span>
              </div>
              <div className="text-left font-num">
                <span className={`text-xs font-bold flex items-center gap-1 ${diffFromPrev >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {diffFromPrev >= 0 ? '+' : ''}{diffPct}%
                </span>
                <span className="text-[10px] text-slate-400">
                  {diffFromPrev >= 0 ? '+' : ''}{formatILS(diffFromPrev)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="w-2/3 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 transition disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>שומר ומסנכרן...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>שמור וסנכרן עכשיו</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
