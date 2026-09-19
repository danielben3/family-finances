import React from 'react';
import { FinancialRecord } from '../types';
import { Calendar } from 'lucide-react';

interface MonthSelectorProps {
  records: FinancialRecord[];
  selectedPeriod: string;
  onSelectPeriod: (period: string) => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  records,
  selectedPeriod,
  onSelectPeriod,
}) => {
  // All 12 months for 2026
  const months2026 = [
    { key: '2026-01', name: 'ינואר' },
    { key: '2026-02', name: 'פברואר' },
    { key: '2026-03', name: 'מרץ' },
    { key: '2026-04', name: 'אפריל' },
    { key: '2026-05', name: 'מאי' },
    { key: '2026-06', name: 'יוני' },
    { key: '2026-07', name: 'יולי' },
    { key: '2026-08', name: 'אוגוסט' },
    { key: '2026-09', name: 'ספטמבר' },
    { key: '2026-10', name: 'אוקטובר' },
    { key: '2026-11', name: 'נובמבר' },
    { key: '2026-12', name: 'דצמבר' },
  ];

  const recordMap = new Map(records.map(r => [r.period, r]));

  return (
    <div className="glass-card p-3 sm:p-4 bg-slate-900/60 border border-white/10">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Calendar className="w-4 h-4 text-sky-400" />
          <span>בחר חודש לעיון והזנה (שנת 2026):</span>
        </div>
        <span className="text-[11px] text-slate-400 font-num">
          {months2026.find(m => m.key === selectedPeriod)?.name || ''} 2026
        </span>
      </div>

      {/* Horizontal Scroll Carousel */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {months2026.map(m => {
          const isSelected = m.key === selectedPeriod;
          const rec = recordMap.get(m.key);
          const hasData = rec && (rec.total_wealth > 0 || rec.income_net > 0);

          return (
            <button
              key={m.key}
              onClick={() => onSelectPeriod(m.key)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex flex-col items-center gap-1 min-w-[76px] ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-lg shadow-rose-950/40 border border-amber-400/40 transform -translate-y-0.5'
                  : hasData
                  ? 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10'
                  : 'bg-white/[0.02] hover:bg-white/5 text-slate-500 border border-white/5'
              }`}
            >
              <span>{m.name}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${
                isSelected ? 'bg-white' : hasData ? 'bg-emerald-400' : 'bg-slate-600'
              }`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
