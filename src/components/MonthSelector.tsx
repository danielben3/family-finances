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
  const currentMonthName = months2026.find(m => m.key === selectedPeriod)?.name || '';

  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-black/[0.06] shadow-sm">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-stone-400">
            // MONTHLY LEDGER
          </span>
          <span className="text-xs font-semibold text-stone-800">
            חודש נבחר לעיון:
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-black/[0.05]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-medium text-stone-700 font-serif">
            {currentMonthName} 2026
          </span>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {months2026.map(m => {
          const isSelected = m.key === selectedPeriod;
          const rec = recordMap.get(m.key);
          const hasData = rec && (rec.total_wealth > 0 || rec.income_net > 0);

          return (
            <button
              key={m.key}
              onClick={() => onSelectPeriod(m.key)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs transition-all flex flex-col items-center gap-1 min-w-[76px] btn-press ${
                isSelected
                  ? 'bg-[#1A1A1A] text-white shadow-sm font-semibold transform -translate-y-0.5'
                  : hasData
                  ? 'bg-white hover:bg-[#FAF8F5] text-stone-800 border border-black/10 font-medium'
                  : 'bg-white/60 hover:bg-white text-stone-400 border border-stone-200/60'
              }`}
            >
              <span>{m.name}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  isSelected
                    ? 'bg-emerald-400'
                    : hasData
                    ? 'bg-emerald-500'
                    : 'bg-stone-300'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
