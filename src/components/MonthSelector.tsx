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

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 card-diffused-shadow border border-slate-200/80">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>בחר חודש לעיון והזנה (שנת 2026):</span>
        </div>
        <span className="text-xs text-blue-600 font-semibold">
          {months2026.find(m => m.key === selectedPeriod)?.name || ''} 2026
        </span>
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
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex flex-col items-center gap-1 min-w-[76px] ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-600 transform -translate-y-0.5'
                  : hasData
                  ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                  : 'bg-white hover:bg-slate-50 text-slate-400 border border-slate-200/50'
              }`}
            >
              <span>{m.name}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSelected ? 'bg-white' : hasData ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
