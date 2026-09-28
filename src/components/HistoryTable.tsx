import React, { useState } from 'react';
import { FinancialRecord } from '../types';
import { Table, Download, Calendar, ArrowUpDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import * as XLSX from 'xlsx';

interface HistoryTableProps {
  records: FinancialRecord[];
  selectedPeriod: string;
  onSelectPeriod: (period: string) => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  records,
  selectedPeriod,
  onSelectPeriod,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Filter by year
  const filtered = records.filter(r => {
    if (selectedYear === 'all') return true;
    return String(r.year) === selectedYear;
  });

  // Sort by period
  const sorted = [...filtered].sort((a, b) => {
    return sortAsc ? a.period.localeCompare(b.period) : b.period.localeCompare(a.period);
  });

  const formatILS = (val: number) => {
    if (!val && val !== 0) return '—';
    return '₪ ' + Math.round(val).toLocaleString('he-IL');
  };

  // Export full financial dataset to Excel (.xlsx)
  const handleExportExcel = () => {
    setIsExporting(true);
    try {
      const exportData = sorted.map(r => ({
        'תקופה': r.period,
        'חודש': r.label,
        'שווי כולל (₪)': r.total_wealth,
        'שינוי מחודש קודם (%)': r.wealth_change_pct ? `${r.wealth_change_pct}%` : '—',
        'עו"ש ונזילות (₪)': r.checking,
        'אלטשולר שחם - גמל (₪)': r.altshuler,
        'אקסלנס - מניות (₪)': r.excellence,
        'קרן כספית (₪)': r.money_market,
        'סה"כ השקעות (₪)': r.investments_total,
        'סה"כ הכנסות (₪)': r.income_net,
        'הוצאות (₪)': r.expenses,
        'חיסכון (₪)': r.savings,
        'אחוז חיסכון (%)': r.savings_rate ? `${r.savings_rate.toFixed(1)}%` : '—',
        'הערות': r.notes || '',
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'היסטוריה פיננסית');
      XLSX.writeFile(workbook, `FamilyFinances_History_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } finally {
      setTimeout(() => setIsExporting(false), 1500);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in" dir="rtl">
      
      {/* 1. Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div>
          <span className="text-[10px] tracking-[0.16em] uppercase text-stone-400 font-semibold block mb-0.5">
            HISTORICAL FINANCIAL LEDGER // היסטוריית חודשים
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-stone-900">
            היסטוריית הון ומעקב
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Year Filter Tabs */}
          <div className="flex bg-[#FAF8F5] border border-black/[0.06] rounded-xl p-0.5 text-xs">
            {['all', '2026', '2025', '2024'].map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1 rounded-lg font-medium transition-all btn-press ${
                  selectedYear === year
                    ? 'bg-[#1A1A1A] text-white font-semibold shadow-2xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {year === 'all' ? 'הכל' : year}
              </button>
            ))}
          </div>

          {/* Sort Toggle */}
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-black/[0.06] text-xs text-stone-700 transition btn-press shadow-2xs"
            title="שינוי כיוון מיון"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <span>{sortAsc ? 'מהישן לחדש' : 'מהחדש לישן'}</span>
          </button>

          {/* Export to Excel Button */}
          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E5E0D8] text-stone-900 text-xs font-medium transition shadow-2xs active:scale-95 btn-press"
          >
            {isExporting ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Download className="w-3.5 h-3.5 text-stone-500" />
            )}
            <span>{isExporting ? 'מייצא...' : 'ייצוא לאקסל'}</span>
          </button>
        </div>
      </div>

      {/* 2. Mobile Card Feed (sm:hidden) */}
      <div className="sm:hidden space-y-3">
        {sorted.map(rec => {
          const isSelected = rec.period === selectedPeriod;
          const hasDiff = rec.wealth_change_pct !== 0 && rec.wealth_change_pct !== undefined;
          const isPos = (rec.wealth_change_pct || 0) > 0;
          const totalInc = rec.income_net || ((rec.salary_daniel || 0) + (rec.salary_shoval || 0) + (rec.non_work_daniel || 0) + (rec.non_work_shoval || 0) + (rec.other_income || 0));

          return (
            <div
              key={rec.period}
              onClick={() => onSelectPeriod(rec.period)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-stone-900 ring-1 ring-stone-900 shadow-sm'
                  : 'bg-white border-black/[0.06] hover:border-black/10 shadow-sm'
              }`}
            >
              {/* Card Top: Month & Diff Badge */}
              <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.04]">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-sm font-serif">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>{rec.label}</span>
                  {isSelected && (
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-[#1A1A1A] text-white">נבחר</span>
                  )}
                </div>

                {hasDiff ? (
                  <span
                    className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold font-serif ${
                      isPos
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-500/20'
                        : 'bg-rose-50 text-rose-800 border border-rose-500/20'
                    }`}
                  >
                    {isPos ? '+' : ''}{rec.wealth_change_pct}%
                  </span>
                ) : (
                  <span className="text-xs text-stone-400 font-serif">—</span>
                )}
              </div>

              {/* Total Wealth Hero in Card */}
              <div className="pt-2.5 pb-2">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block mb-0.5">
                  שווי הון כולל
                </span>
                <span className="text-xl font-bold text-stone-900 font-serif">
                  {formatILS(rec.total_wealth)}
                </span>
              </div>

              {/* 2x2 Financial Pillars Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/[0.04] text-xs font-serif">
                <div className="bg-[#FAF8F5] p-2 rounded-xl border border-black/[0.04]">
                  <span className="text-[10px] text-stone-400 block font-sans">עו״ש וארנקים</span>
                  <span className="font-bold text-stone-800">{formatILS(rec.checking)}</span>
                </div>
                <div className="bg-[#FAF8F5] p-2 rounded-xl border border-black/[0.04]">
                  <span className="text-[10px] text-stone-400 block font-sans">סה״כ השקעות</span>
                  <span className="font-bold text-emerald-800">{formatILS(rec.investments_total)}</span>
                </div>
                <div className="bg-[#FAF8F5] p-2 rounded-xl border border-black/[0.04]">
                  <span className="text-[10px] text-stone-400 block font-sans">הכנסות נטו</span>
                  <span className="font-bold text-stone-900">{formatILS(totalInc)}</span>
                </div>
                <div className="bg-[#FAF8F5] p-2 rounded-xl border border-black/[0.04]">
                  <span className="text-[10px] text-stone-400 block font-sans">חיסכון חודשי</span>
                  <span className="font-bold text-emerald-800">
                    {rec.savings > 0 ? `${formatILS(rec.savings)} (${rec.savings_rate.toFixed(0)}%)` : '—'}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-2.5 pt-2 flex items-center justify-end text-[11px] text-stone-900 font-semibold">
                <span>טען לטופס עריכה</span>
                <ChevronRight className="w-3.5 h-3.5 mr-1 transform rotate-180 text-stone-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Desktop / Tablet Table Container (hidden on mobile) */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-black/[0.06] bg-white shadow-sm">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b border-black/[0.06] bg-[#FAF8F5] text-stone-500 font-semibold select-none">
              <th className="py-3 px-4">חודש</th>
              <th className="py-3 px-3 text-left">שווי כולל</th>
              <th className="py-3 px-3 text-left">שינוי</th>
              <th className="py-3 px-3 text-left">עו"ש</th>
              <th className="py-3 px-3 text-left hidden sm:table-cell">אלטשולר</th>
              <th className="py-3 px-3 text-left hidden sm:table-cell">אקסלנס</th>
              <th className="py-3 px-3 text-left hidden md:table-cell">קרן כספית</th>
              <th className="py-3 px-3 text-left">סה"כ השקעות</th>
              <th className="py-3 px-3 text-left">הכנסות</th>
              <th className="py-3 px-3 text-left hidden lg:table-cell">הוצאות</th>
              <th className="py-3 px-3 text-left hidden md:table-cell">חיסכון</th>
              <th className="py-3 px-3 text-center">פעולה</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04] font-serif">
            {sorted.map(rec => {
              const isSelected = rec.period === selectedPeriod;
              const hasDiff = rec.wealth_change_pct !== 0 && rec.wealth_change_pct !== undefined;
              const isPos = (rec.wealth_change_pct || 0) > 0;

              return (
                <tr
                  key={rec.period}
                  onClick={() => onSelectPeriod(rec.period)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#FAF8F5] font-semibold text-stone-900 border-r-2 border-stone-900'
                      : 'hover:bg-[#FAF8F5]/60 text-stone-700'
                  }`}
                >
                  <td className="py-3 px-4 font-sans font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{rec.label}</span>
                  </td>

                  <td className="py-3 px-3 text-left font-bold text-stone-900">
                    {formatILS(rec.total_wealth)}
                  </td>

                  <td className="py-3 px-3 text-left">
                    {hasDiff ? (
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          isPos
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-500/20'
                            : 'bg-rose-50 text-rose-800 border border-rose-500/20'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {rec.wealth_change_pct}%
                      </span>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-left text-stone-700">
                    {formatILS(rec.checking)}
                  </td>

                  <td className="py-3 px-3 text-left text-amber-900 hidden sm:table-cell">
                    {formatILS(rec.altshuler)}
                  </td>

                  <td className="py-3 px-3 text-left text-emerald-800 hidden sm:table-cell">
                    {formatILS(rec.excellence)}
                  </td>

                  <td className="py-3 px-3 text-left text-stone-800 hidden md:table-cell">
                    {rec.money_market > 0 ? formatILS(rec.money_market) : '—'}
                  </td>

                  <td className="py-3 px-3 text-left text-stone-900 font-bold">
                    {formatILS(rec.investments_total)}
                  </td>

                  <td className="py-3 px-3 text-left text-emerald-800 font-bold">
                    {rec.income_net > 0 ? formatILS(rec.income_net) : '—'}
                  </td>

                  <td className="py-3 px-3 text-left text-stone-600 hidden lg:table-cell">
                    {rec.expenses > 0 ? formatILS(rec.expenses) : '—'}
                  </td>

                  <td className="py-3 px-3 text-left text-emerald-800 hidden md:table-cell">
                    {rec.savings > 0 ? (
                      <span>
                        {formatILS(rec.savings)}{' '}
                        <span className="text-[10px] text-stone-500 font-normal">
                          ({rec.savings_rate.toFixed(0)}%)
                        </span>
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPeriod(rec.period);
                      }}
                      className="p-1 rounded-lg hover:bg-stone-200 text-stone-400 hover:text-stone-900 transition"
                      title="ערוך חודש זה"
                    >
                      <ChevronRight className="w-4 h-4 transform rotate-180" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Footer Info */}
      <div className="mt-3 flex items-center justify-between text-xs text-stone-400 px-1">
        <span>סה"כ רשומות: {sorted.length} חודשים</span>
        <span className="text-emerald-700 font-medium">סנכרון ענן פעיל</span>
      </div>
    </div>
  );
};
