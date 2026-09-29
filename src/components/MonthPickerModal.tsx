import React, { useState } from 'react';
import { FinancialRecord } from '../types';
import { X, Calendar, Check, ArrowRight } from 'lucide-react';

interface MonthPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: FinancialRecord[];
  selectedPeriod: string;
  onSelectPeriod: (period: string) => void;
}

export const MonthPickerModal: React.FC<MonthPickerModalProps> = ({
  isOpen,
  onClose,
  records,
  selectedPeriod,
  onSelectPeriod,
}) => {
  if (!isOpen) return null;

  // Extract unique years sorted descending
  const years = Array.from(new Set(records.map(r => String(r.year || r.period.slice(0, 4))))).sort((a, b) => b.localeCompare(a));
  const [activeYear, setActiveYear] = useState<string>(() => {
    const curRec = records.find(r => r.period === selectedPeriod);
    return curRec ? String(curRec.year || curRec.period.slice(0, 4)) : years[0] || '2026';
  });

  const filteredRecords = records.filter(r => String(r.year || r.period.slice(0, 4)) === activeYear);

  const formatILS = (val: number) => {
    if (!val && val !== 0) return '—';
    return '₪ ' + Math.round(val).toLocaleString('he-IL');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="w-full sm:max-w-md bg-[#FAF8F5] rounded-t-3xl sm:rounded-3xl border border-[#EAE6DF] shadow-2xl p-5 sm:p-6 space-y-4 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-3 shrink-0">
          <div>
            <span className="text-[10px] tracking-[0.16em] uppercase text-stone-400 font-semibold block mb-0.5">
              TIMELINE NAVIGATION // לוח חודשים
            </span>
            <h3 className="text-lg font-bold font-serif text-stone-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-stone-700" />
              בחירת חודש פעיל
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#EAE6DF] flex items-center justify-center text-stone-500 hover:text-stone-900 transition active:scale-95 shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Year Pills Filter */}
        <div className="flex items-center gap-2 shrink-0 bg-white p-1 rounded-2xl border border-[#EAE6DF]">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-serif font-bold transition-all ${
                activeYear === year
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Scrollable Month List */}
        <div className="overflow-y-auto space-y-2 flex-1 pr-0.5">
          {filteredRecords.map(r => {
            const isSelected = r.period === selectedPeriod;
            return (
              <button
                key={r.period}
                onClick={() => {
                  onSelectPeriod(r.period);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
                    : 'bg-white hover:bg-stone-50 text-stone-800 border-[#EAE6DF]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-xs font-bold shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {r.period.slice(5, 7)}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                      {r.label}
                    </p>
                    <p className={`text-xs font-serif ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                      שווי כולל: {formatILS(r.total_wealth)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <ArrowRight className="w-4 h-4 text-stone-400 rotate-180" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
