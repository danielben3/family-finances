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
import { TrendingUp, Layers } from 'lucide-react';

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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as FinancialRecord;
      return (
        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-xl text-xs font-sans text-right min-w-[210px]">
          <div className="font-bold text-slate-900 mb-2 border-b border-slate-100 pb-1.5 flex items-center justify-between">
            <span>{data.label}</span>
            <span className="text-blue-600 font-num font-extrabold text-sm">
              ₪{Math.round(data.total_wealth).toLocaleString('he-IL')}
            </span>
          </div>
          <div className="flex flex-col gap-1 text-[11px]">
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>אקסלנס (מניות):</span>
              </span>
              <span className="font-num font-semibold text-slate-900">
                ₪{Math.round(data.excellence).toLocaleString('he-IL')}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>אלטשולר (גמל):</span>
              </span>
              <span className="font-num font-semibold text-slate-900">
                ₪{Math.round(data.altshuler).toLocaleString('he-IL')}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>עו"ש ונזילות:</span>
              </span>
              <span className="font-num font-semibold text-slate-900">
                ₪{Math.round(data.checking).toLocaleString('he-IL')}
              </span>
            </div>
            {data.money_market > 0 && (
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>קרן כספית:</span>
                </span>
                <span className="font-num font-semibold text-slate-900">
                  ₪{Math.round(data.money_market).toLocaleString('he-IL')}
                </span>
              </div>
            )}
            {data.income_net > 0 && (
              <div className="flex justify-between items-center text-emerald-700 pt-1.5 mt-1 border-t border-slate-100 font-medium">
                <span>הכנסות נטו:</span>
                <span className="font-num font-bold">
                  ₪{Math.round(data.income_net).toLocaleString('he-IL')}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 card-diffused-shadow border border-slate-200/80">
      {/* Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>מגמת צמיחת ההון (2024 - 2026)</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            התפתחות שווי הנכסים המצטבר לאורך כל תקופת המעקב
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto border border-slate-200/60">
          <button
            onClick={() => setChartMode('total')}
            className={`px-3 py-1 rounded-lg transition ${
              chartMode === 'total'
                ? 'bg-white text-blue-600 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            שווי כולל
          </button>
          <button
            onClick={() => setChartMode('stacked')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              chartMode === 'stacked'
                ? 'bg-white text-blue-600 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>חלוקה לנכסים</span>
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'total' ? (
            <AreaChart data={sortedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="totalWealthLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickFormatter={formatYAxis}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="total_wealth"
                stroke="#2563EB"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#totalWealthLight)"
                name="שווי כולל"
              />
            </AreaChart>
          ) : (
            <AreaChart data={sortedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickFormatter={formatYAxis}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={32}
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', color: '#64748B' }}
              />
              <Area
                type="monotone"
                dataKey="checking"
                stackId="1"
                stroke="#38BDF8"
                fill="#38BDF8"
                name="עו״ש"
              />
              <Area
                type="monotone"
                dataKey="money_market"
                stackId="1"
                stroke="#6366F1"
                fill="#6366F1"
                name="קרן כספית"
              />
              <Area
                type="monotone"
                dataKey="altshuler"
                stackId="1"
                stroke="#2563EB"
                fill="#2563EB"
                name="אלטשולר (גמל)"
              />
              <Area
                type="monotone"
                dataKey="excellence"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                name="אקסלנס (מניות)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
