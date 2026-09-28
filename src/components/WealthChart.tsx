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
  const firstRecord = sortedData[0];
  const lastRecord = sortedData[sortedData.length - 1];

  const firstVal = firstRecord?.total_wealth || 807433;
  const lastVal = lastRecord?.total_wealth || 1429177;
  const growthPct = firstVal > 0 ? (((lastVal - firstVal) / firstVal) * 100).toFixed(1) : '77.0';

  const formatYAxis = (tick: number) => {
    if (tick >= 1000000) return `₪${(tick / 1000000).toFixed(1)}M`;
    if (tick >= 1000) return `₪${(tick / 1000).toFixed(0)}k`;
    return `₪${tick}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as FinancialRecord;
      return (
        <div className="bg-white/95 backdrop-blur-md border border-black/10 p-3.5 rounded-xl shadow-lg text-xs font-sans text-right min-w-[210px]">
          <div className="font-semibold text-stone-900 mb-2 border-b border-black/[0.06] pb-1.5 flex items-center justify-between">
            <span className="text-stone-500 font-sans">{data.label}</span>
            <span className="text-emerald-800 font-serif font-bold text-sm">
              ₪{Math.round(data.total_wealth).toLocaleString('he-IL')}
            </span>
          </div>
          <div className="flex flex-col gap-1 text-[11px]">
            <div className="flex justify-between items-center text-stone-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>אקסלנס (מניות):</span>
              </span>
              <span className="font-serif font-semibold text-stone-900">
                ₪{Math.round(data.excellence).toLocaleString('he-IL')}
              </span>
            </div>
            {data.onezero_portfolio ? (
              <div className="flex justify-between items-center text-stone-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-stone-900" />
                  <span>One Zero (מסחר):</span>
                </span>
                <span className="font-serif font-semibold text-stone-900">
                  ₪{Math.round(data.onezero_portfolio).toLocaleString('he-IL')}
                </span>
              </div>
            ) : null}
            <div className="flex justify-between items-center text-stone-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span>אלטשולר (גמל):</span>
              </span>
              <span className="font-serif font-semibold text-stone-900">
                ₪{Math.round(data.altshuler).toLocaleString('he-IL')}
              </span>
            </div>
            <div className="flex justify-between items-center text-stone-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>קרן כספית:</span>
              </span>
              <span className="font-serif font-semibold text-stone-900">
                ₪{Math.round(data.money_market).toLocaleString('he-IL')}
              </span>
            </div>
            <div className="flex justify-between items-center text-stone-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-stone-500" />
                <span>עו״ש וארנקים:</span>
              </span>
              <span className="font-serif font-semibold text-stone-900">
                ₪{Math.round(data.checking).toLocaleString('he-IL')}
              </span>
            </div>
            {data.savings > 0 && (
              <div className="flex justify-between items-center text-emerald-800 pt-1.5 mt-1 border-t border-black/[0.06] font-semibold">
                <span>חיסכון בחודש זה:</span>
                <span className="font-serif font-bold">
                  ₪{Math.round(data.savings).toLocaleString('he-IL')}
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
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-black/[0.06] shadow-sm relative overflow-hidden transition-all duration-300">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <div>
              <span className="text-[10px] tracking-[0.14em] font-semibold text-stone-400 uppercase block mb-0.5">
                // WEALTH TRAJECTORY
              </span>
              <div className="flex items-center gap-2">
                <h3 className="font-bold font-serif text-stone-900 text-base">
                  מסלול צמיחת ההון המשפחתי
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FAF8F5] text-stone-700 border border-black/[0.06]">
                  {records.length} חודשים
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                מ-₪{Math.round(firstVal / 1000)}k ל-₪{(lastVal / 1000000).toFixed(3)}M •{' '}
                <span className="text-emerald-700 font-semibold font-serif">+{growthPct}% צמיחה עקבית</span>
              </p>
            </div>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-[#FAF8F5] p-0.5 rounded-xl text-[11px] font-medium self-start sm:self-auto border border-black/[0.06]">
          <button
            onClick={() => setChartMode('total')}
            className={`px-3 py-1 rounded-lg transition-all btn-press ${
              chartMode === 'total'
                ? 'bg-[#1A1A1A] text-white shadow-xs font-semibold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            שווי כולל
          </button>
          <button
            onClick={() => setChartMode('stacked')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all btn-press ${
              chartMode === 'stacked'
                ? 'bg-[#1A1A1A] text-white shadow-xs font-semibold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>חלוקה לנכסים</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-64 sm:h-72 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'total' ? (
            <AreaChart data={sortedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="luxuryWealthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.22} />
                  <stop offset="60%" stopColor="#10B981" stopOpacity={0.04} />
                  <stop offset="100%" stopColor="#FAF8F5" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#A8A29E"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(0, 0, 0, 0.06)' }}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#A8A29E"
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
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#luxuryWealthGradient)"
                name="שווי כולל"
              />
            </AreaChart>
          ) : (
            <AreaChart data={sortedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#A8A29E"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(0, 0, 0, 0.06)' }}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#A8A29E"
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
                wrapperStyle={{ fontSize: '11px', color: '#737373' }}
              />
              <Area
                type="monotone"
                dataKey="checking"
                stackId="1"
                stroke="#737373"
                fill="#A8A29E"
                name="עו״ש וארנקים"
              />
              <Area
                type="monotone"
                dataKey="money_market"
                stackId="1"
                stroke="#2563EB"
                fill="#60A5FA"
                name="קרן כספית"
              />
              <Area
                type="monotone"
                dataKey="altshuler"
                stackId="1"
                stroke="#D97706"
                fill="#FBBF24"
                name="פנסיה והשתלמות"
              />
              <Area
                type="monotone"
                dataKey="excellence"
                stackId="1"
                stroke="#10B981"
                fill="#34D399"
                name="תיק השקעות"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
