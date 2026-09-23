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
import { TrendingUp, Layers, PiggyBank, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';

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
        <div className="glass-card border border-slate-200/90 p-3.5 rounded-2xl shadow-xl text-xs font-sans text-right min-w-[220px]">
          <div className="font-bold text-slate-900 mb-2 border-b border-slate-100 pb-1.5 flex items-center justify-between">
            <span className="text-slate-600">{data.label}</span>
            <span className="text-emerald-700 font-num font-extrabold text-sm">
              ₪{Math.round(data.total_wealth).toLocaleString('he-IL')}
            </span>
          </div>
          <div className="flex flex-col gap-1 text-[11px]">
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>אקסלנס (מניות):</span>
              </span>
              <span className="font-num font-semibold text-slate-900">
                ₪{Math.round(data.excellence).toLocaleString('he-IL')}
              </span>
            </div>
            {data.onezero_portfolio ? (
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-800" />
                  <span>One Zero (מסחר):</span>
                </span>
                <span className="font-num font-semibold text-slate-900">
                  ₪{Math.round(data.onezero_portfolio).toLocaleString('he-IL')}
                </span>
              </div>
            ) : null}
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
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>קרן כספית:</span>
              </span>
              <span className="font-num font-semibold text-slate-900">
                ₪{Math.round(data.money_market).toLocaleString('he-IL')}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>עו״ש וארנקים:</span>
              </span>
              <span className="font-num font-semibold text-slate-900">
                ₪{Math.round(data.checking).toLocaleString('he-IL')}
              </span>
            </div>
            {data.savings > 0 && (
              <div className="flex justify-between items-center text-emerald-800 pt-1.5 mt-1 border-t border-slate-100 font-semibold">
                <span>חיסכון בחודש זה:</span>
                <span className="font-num font-bold">
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
    <div className="glass-card rounded-3xl p-5 sm:p-7 relative overflow-hidden transition-all duration-300">
      {/* Decorative ambient orb */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  מסלול צמיחת ההון
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {records.length} חודשים
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                מ-₪{Math.round(firstVal / 1000)}k ל-₪{(lastVal / 1000000).toFixed(3)}M • צמיחה עקבית של{' '}
                <span className="text-emerald-700 font-bold font-num">+{growthPct}%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-slate-100/90 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto border border-slate-200/60">
          <button
            onClick={() => setChartMode('total')}
            className={`px-3 py-1 rounded-lg transition ${
              chartMode === 'total'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            שווי כולל
          </button>
          <button
            onClick={() => setChartMode('stacked')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              chartMode === 'stacked'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>חלוקה לנכסים</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-64 sm:h-80 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'total' ? (
            <AreaChart data={sortedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="quietWealthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#006c4a" stopOpacity={0.28} />
                  <stop offset="60%" stopColor="#059669" stopOpacity={0.06} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.6)" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(226, 232, 240, 0.8)' }}
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
                stroke="#006c4a"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#quietWealthGradient)"
                name="שווי כולל"
              />
            </AreaChart>
          ) : (
            <AreaChart data={sortedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.6)" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(226, 232, 240, 0.8)' }}
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
                stroke="#64748B"
                fill="#94A3B8"
                name="עו״ש וארנקים"
              />
              <Area
                type="monotone"
                dataKey="money_market"
                stackId="1"
                stroke="#D97706"
                fill="#F59E0B"
                name="קרן כספית"
              />
              <Area
                type="monotone"
                dataKey="altshuler"
                stackId="1"
                stroke="#2563EB"
                fill="#3B82F6"
                name="אלטשולר (גמל)"
              />
              <Area
                type="monotone"
                dataKey="onezero_portfolio"
                stackId="1"
                stroke="#0F172A"
                fill="#334155"
                name="One Zero"
              />
              <Area
                type="monotone"
                dataKey="excellence"
                stackId="1"
                stroke="#006c4a"
                fill="#10B981"
                name="אקסלנס (מניות)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Bottom Chart Metrics Ledger */}
      <div className="mt-5 pt-4 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10 text-xs">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-slate-100">
          <div className="p-2 rounded-xl bg-slate-50 text-slate-700 shadow-2xs">
            <PiggyBank className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">ממוצע חיסכון חודשי</span>
            <span className="font-bold text-slate-900 font-num text-sm">₪16,200</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-slate-100">
          <div className="p-2 rounded-xl bg-slate-50 text-slate-700 shadow-2xs">
            <RefreshCw className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">השקעה מחדש (דיבידנדים)</span>
            <span className="font-bold text-emerald-700 font-num text-sm">85% מהרווח</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-slate-100">
          <div className="p-2 rounded-xl bg-slate-50 text-slate-700 shadow-2xs">
            <ShieldAlert className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">מקסימום נסיגה (Max Drawdown)</span>
            <span className="font-bold text-slate-800 font-num text-sm">-3.2% בלבד</span>
          </div>
        </div>
      </div>
    </div>
  );
};
