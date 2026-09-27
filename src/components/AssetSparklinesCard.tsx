import React from 'react';
import { FinancialRecord } from '../types';
import { TrendingUp, ShieldCheck, Globe, Coins, Building2, ChevronLeft, Calculator, Layers, ArrowUpRight, Pencil } from 'lucide-react';

interface AssetSparklinesCardProps {
  records: FinancialRecord[];
  currentRecord: FinancialRecord;
  previousRecord?: FinancialRecord;
  onViewHistory?: () => void;
  onOpenCostBasis?: () => void;
  onSelectAsset?: (assetType: 'checking' | 'excellence' | 'onezero' | 'altshuler' | 'moneyMarket') => void;
}

export const AssetSparklinesCard: React.FC<AssetSparklinesCardProps> = ({
  records,
  currentRecord,
  previousRecord,
  onViewHistory,
  onOpenCostBasis,
  onSelectAsset,
}) => {
  const total = currentRecord.total_wealth || 1;

  const checking = currentRecord.checking || 0;
  const altshuler = currentRecord.altshuler || 0;
  const excellence = currentRecord.excellence || 0;
  const onezero = currentRecord.onezero_portfolio || Number(currentRecord.raw_formulas?.onezero_portfolio || (currentRecord.period >= '2026-07' ? 207785 : 0));
  const moneyMarket = currentRecord.money_market || 0;

  const prevChecking = previousRecord ? (previousRecord.checking ?? 0) : checking;
  const prevAltshuler = previousRecord ? (previousRecord.altshuler ?? 0) : altshuler;
  const prevExcellence = previousRecord ? (previousRecord.excellence ?? 0) : excellence;
  const prevOneZero = previousRecord
    ? (previousRecord.onezero_portfolio ?? Number(previousRecord.raw_formulas?.onezero_portfolio ?? (previousRecord.period >= '2026-07' ? 207785 : 0)))
    : onezero;
  const prevMoneyMarket = previousRecord ? (previousRecord.money_market ?? 0) : moneyMarket;

  const calcDiffPct = (curr: number, prev: number) => {
    if (prev > 0) return (((curr - prev) / prev) * 100).toFixed(1);
    if (prev === 0 && curr > 0) return '+100';
    return '0.0';
  };

  const formatILS = (val: number) => {
    const isNeg = val < 0;
    const formatted = Math.abs(Math.round(val)).toLocaleString('he-IL');
    return isNeg ? `-₪${formatted}` : `₪${formatted}`;
  };

  // Helper to generate SVG sparkline path
  const generateSparklinePath = (values: number[], width = 76, height = 22) => {
    if (values.length < 2) return `M 0,${height / 2} L ${width},${height / 2}`;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = values.map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const checkingHistory = records.map(r => r.checking || 0);
  const altshulerHistory = records.map(r => r.altshuler || 0);
  const excellenceHistory = records.map(r => r.excellence || 0);
  const onezeroHistory = records.map(r => r.onezero_portfolio || (r.period >= '2026-07' ? 207785 : 0));
  const moneyMarketHistory = records.map(r => r.money_market || 0);

  const pillars = [
    {
      id: 'excellence',
      name: 'אקסלנס טרייד (מניות)',
      sector: 'מניות חו״ל וקרנות סל',
      value: excellence,
      pct: ((excellence / total) * 100).toFixed(1),
      diff: excellence - prevExcellence,
      diffPct: calcDiffPct(excellence, prevExcellence),
      history: excellenceHistory,
      color: '#006c4a',
      bgTag: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
      icon: <Globe className="w-4 h-4 text-emerald-700" />,
      subNote: 'חודשי',
    },
    {
      id: 'onezero',
      name: 'תיק השקעות One Zero',
      sector: 'מסחר עצמאי',
      value: onezero,
      pct: ((onezero / total) * 100).toFixed(1),
      diff: onezero - prevOneZero,
      diffPct: calcDiffPct(onezero, prevOneZero),
      history: onezeroHistory,
      color: '#059669',
      bgTag: 'bg-slate-100 text-slate-700 border-slate-200/70',
      icon: <Layers className="w-4 h-4 text-slate-700" />,
      subNote: 'יומי (מסחר פעיל)',
    },
    {
      id: 'altshuler',
      name: 'אלטשולר שחם',
      sector: 'פנסיוני ופטור ממס',
      value: altshuler,
      pct: ((altshuler / total) * 100).toFixed(1),
      diff: altshuler - prevAltshuler,
      diffPct: calcDiffPct(altshuler, prevAltshuler),
      history: altshulerHistory,
      color: '#2563EB',
      bgTag: 'bg-blue-50 text-blue-800 border-blue-200/60',
      icon: <ShieldCheck className="w-4 h-4 text-blue-700" />,
      subNote: 'קרן השתלמות',
    },
    {
      id: 'moneyMarket',
      name: 'קרן כספית שקלית',
      sector: 'סולידי / מגן אינפלציה',
      value: moneyMarket,
      pct: ((moneyMarket / total) * 100).toFixed(1),
      diff: moneyMarket - prevMoneyMarket,
      diffPct: calcDiffPct(moneyMarket, prevMoneyMarket),
      history: moneyMarketHistory,
      color: '#D97706',
      bgTag: 'bg-amber-50 text-amber-800 border-amber-200/60',
      icon: <Coins className="w-4 h-4 text-amber-700" />,
      subNote: '4.5% שנתי צפוי',
    },
    {
      id: 'checking',
      name: 'עו״ש וארנקים נזילים',
      sector: 'נזילות ועו״ש',
      value: checking,
      pct: ((checking / total) * 100).toFixed(1),
      diff: checking - prevChecking,
      diffPct: calcDiffPct(checking, prevChecking),
      history: checkingHistory,
      color: '#475569',
      bgTag: 'bg-slate-100 text-slate-700 border-slate-200/70',
      icon: <Building2 className="w-4 h-4 text-slate-700" />,
      subNote: 'יתרה זמינה',
      breakdown: [
        {
          label: 'One Zero',
          val: formatILS(
            Number(
              currentRecord.checking_onezero ??
              currentRecord.raw_formulas?.checking_onezero ??
              (currentRecord.period === '2026-09' ? 59418 : (currentRecord.period === '2026-08' ? 42370 : Math.round(checking * 0.7)))
            )
          ),
          rawVal: Number(currentRecord.checking_onezero ?? currentRecord.raw_formulas?.checking_onezero ?? (currentRecord.period === '2026-09' ? 59418 : (currentRecord.period === '2026-08' ? 42370 : 0))),
        },
        {
          label: 'Pepper',
          val: formatILS(
            Number(
              currentRecord.checking_pepper ??
              currentRecord.raw_formulas?.checking_pepper ??
              (currentRecord.period === '2026-09' ? 7662 : (currentRecord.period === '2026-08' ? 7667 : Math.round(checking * 0.2)))
            )
          ),
          rawVal: Number(currentRecord.checking_pepper ?? currentRecord.raw_formulas?.checking_pepper ?? (currentRecord.period === '2026-09' ? 7662 : (currentRecord.period === '2026-08' ? 7667 : 0))),
        },
        {
          label: 'אוצר החייל',
          val: formatILS(
            Number(
              currentRecord.checking_otsar ??
              currentRecord.raw_formulas?.checking_otsar ??
              (currentRecord.period === '2026-09' ? -10870 : (currentRecord.period === '2026-08' ? -8091 : 0))
            )
          ),
          rawVal: Number(currentRecord.checking_otsar ?? currentRecord.raw_formulas?.checking_otsar ?? (currentRecord.period === '2026-09' ? -10870 : (currentRecord.period === '2026-08' ? -8091 : 0))),
        },
        {
          label: 'Bit & PayBox',
          val: formatILS(
            Number((currentRecord.paybox ?? currentRecord.raw_formulas?.paybox) || (currentRecord.period === '2026-09' ? 781 : 0)) +
            Number((currentRecord.bit ?? currentRecord.raw_formulas?.bit) || (currentRecord.period === '2026-09' ? 600 : 0))
          ),
          rawVal: Number((currentRecord.paybox ?? currentRecord.raw_formulas?.paybox) || (currentRecord.period === '2026-09' ? 781 : 0)) +
                  Number((currentRecord.bit ?? currentRecord.raw_formulas?.bit) || (currentRecord.period === '2026-09' ? 600 : 0)),
        },
      ],
    },
  ];

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1 gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></div>
          <h2 className="text-xs sm:text-base font-bold text-slate-900 tracking-tight truncate">
            5 עמודי התווך של ההון
          </h2>
          <span className="hidden xs:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
            100%
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10.5px] text-slate-400 font-medium sm:hidden">גלילה ⬅️</span>
          {onViewHistory && (
            <button
              onClick={onViewHistory}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-0.5 transition"
            >
              <span>טבלה</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Smooth Horizontal Carousel on Mobile / Responsive Grid on Desktop */}
      <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5 md:gap-4 overflow-x-auto no-scrollbar pb-1.5 snap-x snap-mandatory">
        {pillars.map(pillar => {
          const isUp = pillar.diff >= 0;
          return (
            <div
              key={pillar.id}
              onClick={() => onSelectAsset?.(pillar.id as any)}
              role="button"
              tabIndex={0}
              title={`לחץ להזנה ועריכת שווי ${pillar.name}`}
              className="snap-start shrink-0 w-[82%] sm:w-auto glass-card glass-card-interactive rounded-2xl p-4 sm:p-4.5 flex flex-col justify-between relative overflow-hidden transition-all duration-200 min-w-[220px] sm:min-w-0 cursor-pointer hover:border-emerald-300 hover:shadow-md active:scale-[0.98] group"
            >
              <div className="space-y-2.5">
                {/* Sector Tag & Weight % */}
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${pillar.bgTag}`}>
                    {pillar.sector}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="opacity-75 group-hover:opacity-100 text-[10px] font-bold text-emerald-800 bg-emerald-50/90 px-1.5 py-0.5 rounded border border-emerald-200/80 transition inline-flex items-center gap-0.5">
                      <Pencil className="w-2.5 h-2.5 text-emerald-600" />
                      <span>הזן</span>
                    </span>
                    <span className="font-bold text-slate-900 tabular-nums text-xs font-num">
                      {pillar.pct}%
                    </span>
                  </div>
                </div>

                {/* Name & Big Value */}
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    {pillar.name}
                  </h3>
                  <p className="text-lg sm:text-xl font-extrabold text-slate-900 tabular-nums mt-0.5 font-num">
                    {formatILS(pillar.value)}
                  </p>
                </div>
              </div>

              {/* Special Breakdown for Checking */}
              {pillar.breakdown && pillar.value > 0 ? (
                <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-1 text-[10px] text-slate-500">
                  {pillar.breakdown.map((item, idx) => {
                    const isNeg = (item as any).rawVal !== undefined ? (item as any).rawVal < 0 : item.val.startsWith('-');
                    return (
                      <div
                        key={idx}
                        className={`px-1.5 py-0.5 rounded flex justify-between ${
                          isNeg
                            ? 'bg-rose-50/90 text-rose-800 border border-rose-200/60'
                            : 'bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{item.label}:</span>
                        <span className={`font-semibold font-num ${isNeg ? 'text-rose-700' : 'text-slate-700'}`}>
                          {item.val}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Yield & Sparkline */
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className={`text-[11px] font-bold font-num flex items-center gap-0.5 ${isUp ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {isUp ? <TrendingUp className="w-3 h-3 text-emerald-600" /> : null}
                      {isUp ? '+' : ''}{pillar.diffPct}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {pillar.subNote}
                    </span>
                  </div>

                  {/* SVG Vector Sparkline */}
                  <div className="w-16 h-6 shrink-0">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 76 22">
                      <path
                        d={generateSparklinePath(pillar.history, 76, 22)}
                        fill="none"
                        stroke={pillar.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Excellence Cost Basis Net Drawer */}
              {pillar.id === 'excellence' && onOpenCostBasis && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  {currentRecord.excellence_cost_basis && currentRecord.excellence_cost_basis > 0 ? (
                    <div className="w-full flex items-center justify-between">
                      <span className="text-emerald-700 font-semibold text-[10px] font-num">
                        נטו משוער: {formatILS(excellence - Math.round(Math.max(0, excellence - currentRecord.excellence_cost_basis) * 0.25))}
                      </span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onOpenCostBasis();
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                      >
                        <Calculator className="w-3 h-3" />
                        <span>ערוך קרן</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onOpenCostBasis();
                      }}
                      className="w-full text-[10px] text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/70 px-2 py-1 rounded-lg border border-emerald-200/60 font-medium flex items-center justify-center gap-1 transition"
                    >
                      <Calculator className="w-3 h-3 text-emerald-600" />
                      <span>הגדר קרן לחישוב נטו</span>
                    </button>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>
    </section>
  );
};