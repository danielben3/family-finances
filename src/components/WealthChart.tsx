import React, { useState } from 'react';
import { FinancialRecord } from '../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp, BarChart2, Layers } from 'lucide-react';

interface WealthChartProps {
  records: FinancialRecord[];
}

export const WealthChart: React.FC<WealthChartProps> = ({ records }) => {
  const [chartMode, setChartMode] = useState<'total' | 'stacked'>('total');

  const sortedData = [...records].sort((a, b) => a.period.localeCompare(b.period));

  const formatYAxis = (tick: number) => {
    if (tick >= 1000000) return `₪${(tick / 1000000).toFixed(1)}M`;
    if (tick >= 1000) return `₪${(tick / 1000).toFixed(0)}k`;
    return `₪${tick}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as FinancialRecord;
      return (
        <div className="bg-slate-900/95 border border-white/15 p-3 rounded-xl shadow-2xl text-xs font-sans text-right min-w-[200px]">
          <div className="font-bold text-white mb-2 border-b border-white/10 pb-1 flex items-center justify-between">
            <span>{data.label}</span>
            <span className="text-amber-400 font-num font-bold">₪{Math.round(data.total_wealth).toLocaleString('he-IL')}</span>
          </div>
          <div className="flex flex-col gap-1 text-[11px]">
            <div className="flex justify-between items-center text-blue-400">
              <span>אקסלנס (מניות):</span>
              <span className="font-num font-semibold">₪{Math.round(data.excellence).toLocaleString('he-IL')}</span>
            </div>
            <div className="flex justify-between items-center text-purple-400">
              <span>אלטשולר (גמל):</span>
              <span className="font-num font-semibold">₪{Math.round(data.altshuler).toLocaleString('he-IL')}</span>
            </div>
            <div className="flex justify-between items-center text-cyan-400">
              <span>עו"ש ונזילות:</span>
              <span className="font-num font-semibold">₪{Math.round(data.checking).toLocaleString('he-IL')}</span>
            </div>
            {data.money_market > 0 && (
              <div className="flex justify-between items-center text-emerald-400">
                <span>קרן כספית:</span>
                <span className="font-num font-semibold">₪{Math.round(data.money_market).toLocaleString('he-IL')}</span>
              </div>
            )}
            {data.income_net > 0 && (
              <div className="flex justify-between items-center text-emerald-300 pt-1 border-t border-white/5">
                <span>הכנסות נטו:</span>
                <span className="font-num font-semibold">₪{Math.round(data.income_net).toLocaleString('he-IL')}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-4 sm:p-6 bg-slate-900/70 border border-white/10">
      
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <span>צמיחת הון רב-שנתית (אוגוסט 2024 – היום)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            התפתחות השווי הכולל והרכב הנכסים לאורך ציר הזמן
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-white/10 text-xs self-start sm:self-auto">
          <button
            onClick={() => setChartMode('total')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
              chartMode === 'total' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>סך הון כולל</span>
          </button>
          <button
            onClick={() => setChartMode('stacked')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
              chartMode === 'stacked' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>פילוח נכסים</span>
          </button>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-64 sm:h-80 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sortedData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorExcellence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorAltshuler" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A855F7" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#A855F7" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorChecking" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickFormatter={formatYAxis}
              tickLine={false}
              axisLine={false}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />

            {chartMode === 'total' ? (
              <Area
                type="monotone"
                dataKey="total_wealth"
                stroke="#F59E0B"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTotal)"
                name="סה״כ הון"
              />
            ) : (
              <>
                <Area
                  type="monotone"
                  dataKey="excellence"
                  stackId="1"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorExcellence)"
                  name="אקסלנס (מניות)"
                />
                <Area
                  type="monotone"
                  dataKey="altshuler"
                  stackId="1"
                  stroke="#A855F7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAltshuler)"
                  name="אלטשולר (גמל)"
                />
                <Area
                  type="monotone"
                  dataKey="checking"
                  stackId="1"
                  stroke="#22D3EE"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorChecking)"
                  name="עו״ש ונזילות"
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
