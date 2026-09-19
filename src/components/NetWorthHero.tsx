import React from 'react';
import { FinancialRecord } from '../types';
import { TrendingUp, TrendingDown, Vault, Wallet, PieChart, ShieldAlert } from 'lucide-react';

interface NetWorthHeroProps {
  currentRecord: FinancialRecord;
  previousRecord?: FinancialRecord;
}

export const NetWorthHero: React.FC<NetWorthHeroProps> = ({
  currentRecord,
  previousRecord,
}) => {
  const total = currentRecord.total_wealth || 0;
  const prevTotal = previousRecord?.total_wealth || total;
  const diff = total - prevTotal;
  const diffPct = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0;
  const isPositive = diff >= 0;

  const checking = currentRecord.checking || 0;
  const altshuler = currentRecord.altshuler || 0;
  const excellence = currentRecord.excellence || 0;
  const moneyMarket = currentRecord.money_market || 0;
  const investments = currentRecord.investments_total || (altshuler + excellence + moneyMarket);

  const checkingPct = total > 0 ? (checking / total) * 100 : 0;
  const altshulerPct = total > 0 ? (altshuler / total) * 100 : 0;
  const excellencePct = total > 0 ? (excellence / total) * 100 : 0;
  const moneyMarketPct = total > 0 ? (moneyMarket / total) * 100 : 0;

  const formatILS = (val: number) =>
    '₪' + Math.round(val).toLocaleString('he-IL');

  return (
    <div className="glass-card p-5 sm:p-7 relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-[#0B0F19]/80 to-[#14120B]/90 border border-amber-500/20 shadow-2xl">
      
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        
        {/* Left/Top: Main Net Worth Figure */}
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1 tracking-wider uppercase">
            <Vault className="w-4 h-4" />
            <span>סך הון כולל (שווי נכסים נקי)</span>
            <span className="text-slate-400 font-normal">| {currentRecord.label}</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-5xl font-extrabold text-white font-num tracking-tight">
              {formatILS(total)}
            </span>

            {previousRecord && (
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs sm:text-sm font-semibold font-num ${
                isPositive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}>
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{isPositive ? '+' : ''}{diffPct.toFixed(1)}%</span>
                <span className="text-[11px] opacity-80">({isPositive ? '+' : ''}{formatILS(diff)})</span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-2">
            יתרת עו"ש נזילה + קופות גמל (אלטשולר שחם) + תיק מניות (אקסלנס) + קרן כספית
          </p>
        </div>

        {/* Right/Bottom: Quick High-Level Split */}
        <div className="flex items-center gap-3 sm:gap-6 bg-slate-900/60 p-3 rounded-2xl border border-white/10 shrink-0">
          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">נזילות בעו"ש</span>
            <span className="font-num font-bold text-sm sm:text-base text-cyan-400">{formatILS(checking)}</span>
            <span className="text-[10px] text-slate-500 block">({checkingPct.toFixed(0)}%)</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">השקעות וגמל</span>
            <span className="font-num font-bold text-sm sm:text-base text-amber-400">{formatILS(investments)}</span>
            <span className="text-[10px] text-slate-500 block">({(100 - checkingPct).toFixed(0)}%)</span>
          </div>
        </div>

      </div>

      {/* Asset Allocation Multi-Segment Progress Bar */}
      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
          <span className="font-semibold flex items-center gap-1.5">
            <PieChart className="w-3.5 h-3.5 text-sky-400" />
            <span>התפלגות הנכסים:</span>
          </span>
          <span className="text-slate-400 text-[11px]">4 ערוצי החזקה</span>
        </div>

        {/* Visual Allocation Bar */}
        <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden flex p-0.5 border border-white/10">
          <div style={{ width: `${excellencePct}%` }} className="h-full bg-blue-500 rounded-sm" title={`אקסלנס: ${excellencePct.toFixed(1)}%`} />
          <div style={{ width: `${altshulerPct}%` }} className="h-full bg-purple-500 rounded-sm mx-0.5" title={`אלטשולר: ${altshulerPct.toFixed(1)}%`} />
          <div style={{ width: `${checkingPct}%` }} className="h-full bg-cyan-400 rounded-sm mx-0.5" title={`עו"ש: ${checkingPct.toFixed(1)}%`} />
          <div style={{ width: `${moneyMarketPct}%` }} className="h-full bg-emerald-400 rounded-sm" title={`קרן כספית: ${moneyMarketPct.toFixed(1)}%`} />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
            <span className="text-slate-400">אקסלנס (מניות):</span>
            <span className="font-num font-bold text-white">{formatILS(excellence)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
            <span className="text-slate-400">אלטשולר (גמל):</span>
            <span className="font-num font-bold text-white">{formatILS(altshuler)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
            <span className="text-slate-400">עו"ש ונזילות:</span>
            <span className="font-num font-bold text-white">{formatILS(checking)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-slate-400">קרן כספית:</span>
            <span className="font-num font-bold text-white">{formatILS(moneyMarket)}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
