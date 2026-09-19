import React from 'react';
import { FinancialRecord } from '../types';
import { TrendingUp, ShieldCheck, Globe, Coins, Building2, ChevronLeft } from 'lucide-react';

interface AssetSparklinesCardProps {
  records: FinancialRecord[];
  currentRecord: FinancialRecord;
  previousRecord?: FinancialRecord;
  onViewHistory?: () => void;
}

export const AssetSparklinesCard: React.FC<AssetSparklinesCardProps> = ({
  records,
  currentRecord,
  previousRecord,
  onViewHistory,
}) => {
  const total = currentRecord.total_wealth || 1;

  const checking = currentRecord.checking || 0;
  const altshuler = currentRecord.altshuler || 0;
  const excellence = currentRecord.excellence || 0;
  const moneyMarket = currentRecord.money_market || 0;

  const prevChecking = previousRecord?.checking || checking;
  const prevAltshuler = previousRecord?.altshuler || altshuler;
  const prevExcellence = previousRecord?.excellence || excellence;
  const prevMoneyMarket = previousRecord?.money_market || moneyMarket;

  const formatILS = (val: number) =>
    '₪' + Math.round(val).toLocaleString('he-IL');

  // Helper to generate SVG sparkline path
  const generateSparklinePath = (values: number[], width = 64, height = 24) => {
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
  const moneyMarketHistory = records.map(r => r.money_market || 0);

  const assets = [
    {
      id: 'excellence',
      name: 'אקסלנס (מניות ואג"ח)',
      subtitle: 'Global Equities · מדדי עולם ו-S&P 500',
      value: excellence,
      pct: ((excellence / total) * 100).toFixed(1),
      diff: excellence - prevExcellence,
      diffPct: prevExcellence > 0 ? (((excellence - prevExcellence) / prevExcellence) * 100).toFixed(1) : '0',
      history: excellenceHistory,
      color: '#10B981',
      bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      icon: <Globe className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 'altshuler',
      name: 'אלטשולר שחם (גמל והשתלמות)',
      subtitle: 'חיסכון פנסיוני והשתלמות מסלול מניות',
      value: altshuler,
      pct: ((altshuler / total) * 100).toFixed(1),
      diff: altshuler - prevAltshuler,
      diffPct: prevAltshuler > 0 ? (((altshuler - prevAltshuler) / prevAltshuler) * 100).toFixed(1) : '0',
      history: altshulerHistory,
      color: '#2563EB',
      bgLight: 'bg-blue-50 text-blue-700 border-blue-200/60',
      icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'moneyMarket',
      name: 'קרן כספית שקלית',
      subtitle: 'נזילות מניבה בריבית בנק ישראל',
      value: moneyMarket,
      pct: ((moneyMarket / total) * 100).toFixed(1),
      diff: moneyMarket - prevMoneyMarket,
      diffPct: prevMoneyMarket > 0 ? (((moneyMarket - prevMoneyMarket) / prevMoneyMarket) * 100).toFixed(1) : '0',
      history: moneyMarketHistory,
      color: '#F59E0B',
      bgLight: 'bg-amber-50 text-amber-700 border-amber-200/60',
      icon: <Coins className="w-5 h-5 text-amber-600" />,
    },
    {
      id: 'checking',
      name: 'עו"ש בנקאי שוטף',
      subtitle: 'חשבון תפעולי שוטף למחיה והוראות קבע',
      value: checking,
      pct: ((checking / total) * 100).toFixed(1),
      diff: checking - prevChecking,
      diffPct: prevChecking > 0 ? (((checking - prevChecking) / prevChecking) * 100).toFixed(1) : '0',
      history: checkingHistory,
      color: '#64748B',
      bgLight: 'bg-slate-100 text-slate-700 border-slate-200/60',
      icon: <Building2 className="w-5 h-5 text-slate-600" />,
    },
  ];

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            4 עמודי התווך של ההון
          </h2>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            פילוח מפורט
          </span>
        </div>
        {onViewHistory && (
          <button
            onClick={onViewHistory}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition"
          >
            <span>טבלה מלאה</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {assets.map(asset => {
          const isUp = asset.diff >= 0;
          return (
            <div
              key={asset.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 titanium-edge flex items-center justify-between hover:border-slate-300 transition-all shadow-xs"
            >
              {/* Right Side: Icon & Titles */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${asset.bgLight}`}>
                  {asset.icon}
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {asset.name}
                    </h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-num shrink-0">
                      {asset.pct}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {asset.subtitle}
                  </p>
                </div>
              </div>

              {/* Left Side: Sparkline SVG & Value */}
              <div className="flex items-center gap-3 shrink-0 mr-2">
                {/* Micro Sparkline */}
                <div className="hidden sm:block w-16 h-7">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 64 24">
                    <path
                      d={generateSparklinePath(asset.history, 64, 24)}
                      fill="none"
                      stroke={asset.color}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="text-left">
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900 font-num">
                    {formatILS(asset.value)}
                  </p>
                  <p className={`text-[11px] font-bold font-num ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isUp ? '+' : ''}{asset.diffPct}% ({isUp ? '+' : ''}{formatILS(asset.diff)})
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};