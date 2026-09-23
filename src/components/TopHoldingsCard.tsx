import React, { useState } from 'react';
import { ArrowLeft, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Holding } from '../types/portfolio';

interface TopHoldingsCardProps {
  holdings?: Holding[];
  onViewAllStocks?: () => void;
}

export const TopHoldingsCard: React.FC<TopHoldingsCardProps> = ({
  holdings = [],
  onViewAllStocks,
}) => {
  const [filter, setFilter] = useState<'main' | 'indexes'>('main');

  // Default seed data matching Stitch Design 1
  const defaultTopAssets = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      units: '240 יח׳',
      price: '$228.40',
      valueILS: 184200,
      changeToday: '+2.3%',
      isUp: true,
      bg: 'bg-slate-900 text-white',
      type: 'stock',
    },
    {
      symbol: 'NVDA',
      name: 'Nvidia Corp.',
      units: '335 יח׳',
      price: '$128.50',
      valueILS: 162450,
      changeToday: '+4.8%',
      isUp: true,
      bg: 'bg-emerald-950 text-emerald-300',
      type: 'stock',
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com',
      units: '170 יח׳',
      price: '$186.20',
      valueILS: 118300,
      changeToday: '+1.1%',
      isUp: true,
      bg: 'bg-amber-100 text-amber-900 border border-amber-200',
      type: 'stock',
    },
    {
      symbol: 'TA125',
      name: 'מדד ת״א 125',
      units: '2,120 נק׳',
      price: 'סל מקומי',
      valueILS: 145000,
      changeToday: '+0.65%',
      isUp: true,
      bg: 'bg-blue-100 text-blue-900 border border-blue-200',
      type: 'index',
    },
    {
      symbol: 'VTV',
      name: 'Vanguard Value',
      units: '155 יח׳',
      price: '$164.10',
      valueILS: 95800,
      changeToday: '+0.4%',
      isUp: true,
      bg: 'bg-rose-100 text-rose-900 border border-rose-200',
      type: 'index',
    },
  ];

  const displayedAssets = filter === 'indexes'
    ? defaultTopAssets.filter(a => a.type === 'index' || a.symbol === 'VTV' || a.symbol === 'TA125')
    : defaultTopAssets;

  const totalHoldingsCount = holdings.length > 0 ? holdings.length : 34;

  return (
    <section className="glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300">
      <div>
        {/* Header & Filter */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
              <span>אחזקות מובילות בזמן אמת</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">נתוני מסחר חיים (Live Holdings)</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              מסחר פעיל
            </span>

            {/* Segmented Filter */}
            <div className="p-0.5 rounded-xl bg-slate-100 flex text-[11px] font-semibold border border-slate-200/60">
              <button
                type="button"
                onClick={() => setFilter('main')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filter === 'main' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                מניות
              </button>
              <button
                type="button"
                onClick={() => setFilter('indexes')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filter === 'indexes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                מדדים
              </button>
            </div>
          </div>
        </div>

        {/* Assets List */}
        <div className="divide-y divide-slate-100 mt-1">
          {displayedAssets.map((asset, idx) => (
            <div
              key={idx}
              className="py-3 flex items-center justify-between hover:bg-slate-50/70 rounded-xl px-2 transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${asset.bg}`}>
                  {asset.symbol}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                    {asset.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-num mt-0.5">
                    {asset.price} • {asset.units}
                  </p>
                </div>
              </div>

              <div className="text-left">
                <p className="text-xs sm:text-sm font-extrabold text-slate-900 font-num leading-tight">
                  ₪{asset.valueILS.toLocaleString('he-IL')}
                </p>
                <p className="text-[11px] font-semibold text-emerald-700 font-num flex items-center justify-end gap-0.5 mt-0.5">
                  <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                  {asset.changeToday} היום
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Button to view all assets */}
      <div className="pt-3 mt-3 border-t border-slate-200/60">
        <button
          type="button"
          onClick={onViewAllStocks}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200/90 hover:bg-slate-100/80 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-xs"
        >
          <span>צפייה בכל {totalHoldingsCount} הנכסים והניירות בתיק</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
