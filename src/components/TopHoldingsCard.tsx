import React, { useState } from 'react';
import { ArrowLeft, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Holding } from '../types/portfolio';
import { calcHoldingValueILS } from '../lib/stockPricesService';

interface TopHoldingsCardProps {
  holdings?: Holding[];
  onViewAllStocks?: () => void;
}

export const TopHoldingsCard: React.FC<TopHoldingsCardProps> = ({
  holdings = [],
  onViewAllStocks,
}) => {
  const [filter, setFilter] = useState<'main' | 'indexes'>('main');

  // Compute top holdings from real props if available
  const sortedHoldings = [...holdings].sort((a, b) => calcHoldingValueILS(b) - calcHoldingValueILS(a));

  const realAssets = sortedHoldings.slice(0, 5).map(h => {
    const val = calcHoldingValueILS(h);
    const dayPct = h.day_change_pct ?? 0;
    const isIndex = h.asset_type === 'etf' || h.symbol.includes('500') || h.symbol === 'VOO' || h.symbol === 'CSPX' || h.symbol === 'QQQ';
    return {
      symbol: h.symbol,
      name: h.name,
      units: `${h.shares.toLocaleString()} יח׳`,
      price: h.currency === 'USD' ? `$${h.current_price}` : `₪${h.current_price}`,
      valueILS: val,
      changeToday: `${dayPct >= 0 ? '+' : ''}${dayPct}%`,
      isUp: dayPct >= 0,
      type: isIndex ? 'index' : 'stock',
    };
  });

  const defaultTopAssets = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      units: '240 יח׳',
      price: '$228.40',
      valueILS: 184200,
      changeToday: '+2.3%',
      isUp: true,
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
      type: 'index',
    },
  ];

  const sourceAssets = realAssets.length >= 3 ? realAssets : defaultTopAssets;

  const displayedAssets = filter === 'indexes'
    ? sourceAssets.filter(a => a.type === 'index')
    : sourceAssets;

  const totalHoldingsCount = holdings.length > 0 ? holdings.length : 34;

  const getChipStyle = (symbol: string, isIndex: boolean) => {
    if (isIndex) {
      return 'border-emerald-600/30 text-emerald-900 bg-emerald-50/80';
    }
    if (symbol.includes('NVDA') || symbol.includes('AAPL')) {
      return 'border-stone-900 text-stone-900 bg-stone-100';
    }
    return 'border-stone-300 text-stone-800 bg-[#FAF8F5]';
  };

  return (
    <section className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.06] shadow-sm flex flex-col justify-between">
      <div>
        {/* Header & Filter */}
        <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.06]">
          <div>
            <span className="text-[10px] tracking-[0.14em] font-semibold text-stone-400 uppercase block mb-0.5">
              // LIVE HOLDINGS
            </span>
            <h3 className="font-bold font-serif text-stone-900 text-base">
              אחזקות מובילות בזמן אמת
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              חי
            </span>

            {/* Segmented Filter */}
            <div className="p-0.5 rounded-xl bg-[#FAF8F5] flex text-[11px] font-medium border border-black/[0.06]">
              <button
                type="button"
                onClick={() => setFilter('main')}
                className={`px-2.5 py-1 rounded-lg transition-all btn-press ${
                  filter === 'main' ? 'bg-[#1A1A1A] text-white shadow-xs font-semibold' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                הכל
              </button>
              <button
                type="button"
                onClick={() => setFilter('indexes')}
                className={`px-2.5 py-1 rounded-lg transition-all btn-press ${
                  filter === 'indexes' ? 'bg-[#1A1A1A] text-white shadow-xs font-semibold' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                מדדים
              </button>
            </div>
          </div>
        </div>

        {/* Assets List */}
        <div className="divide-y divide-black/[0.04] mt-1">
          {displayedAssets.map((asset, idx) => (
            <div
              key={idx}
              className="py-3 flex items-center justify-between hover:bg-[#FAF8F5] rounded-xl px-2 transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[11px] font-mono border shadow-2xs ${getChipStyle(asset.symbol, asset.type === 'index')}`}>
                  {asset.symbol.slice(0, 4)}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-stone-900 leading-tight">
                    {asset.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-num mt-0.5">
                    {asset.price} • {asset.units}
                  </p>
                </div>
              </div>

              <div className="text-left">
                <p className="text-xs sm:text-sm font-bold text-stone-900 font-serif leading-tight">
                  ₪{Math.round(asset.valueILS).toLocaleString('he-IL')}
                </p>
                <p className={`text-[11px] font-medium font-num flex items-center justify-end gap-0.5 mt-0.5 ${
                  asset.isUp ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  <ArrowUpRight className={`w-3 h-3 ${asset.isUp ? 'text-emerald-600' : 'text-rose-600 rotate-90'}`} />
                  {asset.changeToday}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Button to view all assets */}
      <div className="pt-3 mt-3 border-t border-black/[0.06]">
        <button
          type="button"
          onClick={onViewAllStocks}
          className="w-full py-2.5 px-4 rounded-xl border border-[#E5E0D8] bg-white hover:bg-[#FAF8F5] text-stone-900 font-semibold text-xs flex items-center justify-center gap-2 transition-all btn-press shadow-2xs"
        >
          <span>צפייה בכל {totalHoldingsCount} הנכסים בתיק המניות</span>
          <ArrowLeft className="w-3.5 h-3.5 text-stone-500" />
        </button>
      </div>
    </section>
  );
};
