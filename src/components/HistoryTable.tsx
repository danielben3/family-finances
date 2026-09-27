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
    return '₪' + Math.round(val).toLocaleString('he-IL');
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
        'סה"כ הכנסות (עבודה ומענקים) (₪)': r.income_net || ((r.salary_daniel || 0) + (r.salary_shoval || 0) + (r.non_work_daniel || 0) + (r.non_work_shoval || 0) + (r.other_income || 0)),
        'הכנסות מעבודה נטו (₪)': ((r.salary_daniel || 0) + (r.salary_shoval || 0)) > 0 ? ((r.salary_daniel || 0) + (r.salary_shoval || 0)) : (((r.non_work_daniel || 0) + (r.non_work_shoval || 0) + (r.other_income || 0)) === 0 ? r.income_net : 0),
        'מענקים ושלא מעבודה (₪)': (r.non_work_daniel || 0) + (r.non_work_shoval || 0) + (r.other_income || 0),
        'שכר דניאל (₪)': r.salary_daniel || 0,
        'שכר שובל (₪)': r.salary_shoval || 0,
        'הוצאות (₪)': r.expenses,
        'חיסכון (₪)': r.savings,
        'אחוז חיסכון (%)': r.savings_rate ? `${r.savings_rate.toFixed(1)}%` : '—',
        'הערות': r.notes || '',
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      const colWidths = [
        { wch: 10 }, { wch: 14 }, { wch: 16 }, { wch: 18 },
        { wch: 16 }, { wch: 22 }, { wch: 20 }, { wch: 15 },
        { wch: 16 }, { wch: 28 }, { wch: 20 }, { wch: 22 },
        { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
        { wch: 16 }, { wch: 25 },
      ];
      worksheet['!cols'] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'מעקב פיננסי');

      const todayStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `מעקב_הוצאות_והון_משפחתי_${todayStr}.xlsx`);
    } catch (err) {
      console.error('Export to Excel failed:', err);
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 card-diffused-shadow border border-slate-200/80">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
            <Table className="w-4 h-4 text-blue-600" />
            <span>טבלת נתונים היסטורית מלאה</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            מאוגוסט 2024 ועד היום — לחץ על שורה לטעינת החודש לטופס
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Year Filter Tabs */}
          <div className="flex bg-slate-100 border border-slate-200/70 rounded-xl p-1 text-xs">
            {['all', '2026', '2025', '2024'].map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  selectedYear === year
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {year === 'all' ? 'הכל' : year}
              </button>
            ))}
          </div>

          {/* Sort Toggle */}
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-600 transition"
            title="שינוי כיוון מיון"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>{sortAsc ? 'מהישן לחדש' : 'מהחדש לישן'}</span>
          </button>

          {/* Export to Excel Button */}
          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold transition shadow-sm active:scale-95"
          >
            {isExporting ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isExporting ? 'מייצא...' : 'ייצוא לאקסל'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Card Feed (sm:hidden) */}
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
                  ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-sm'
                  : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {/* Card Top: Month & Diff Badge */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>{rec.label}</span>
                  {isSelected && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-blue-600 text-white">נבחר</span>
                  )}
                </div>

                {hasDiff ? (
                  <span
                    className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold font-num ${
                      isPos
                        ? 'bg-emerald-100/70 text-emerald-800'
                        : 'bg-rose-100/70 text-rose-800'
                    }`}
                  >
                    {isPos ? '+' : ''}{rec.wealth_change_pct}%
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-num">—</span>
                )}
              </div>

              {/* Total Wealth Hero in Card */}
              <div className="pt-2.5 pb-2">
                <span className="text-[11px] text-slate-400 font-medium block">סך שווי הון כולל</span>
                <span className="text-xl font-extrabold text-slate-900 font-num">
                  {formatILS(rec.total_wealth)}
                </span>
              </div>

              {/* 2x2 Financial Pillars Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs font-num">
                <div className="bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-sans">עו״ש וארנקים</span>
                  <span className="font-bold text-slate-800">{formatILS(rec.checking)}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-sans">סה״כ השקעות</span>
                  <span className="font-bold text-emerald-700">{formatILS(rec.investments_total)}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-sans">הכנסות נטו</span>
                  <span className="font-bold text-slate-900">{formatILS(totalInc)}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-sans">חיסכון חודשי</span>
                  <span className="font-bold text-blue-700">
                    {rec.savings > 0 ? `${formatILS(rec.savings)} (${rec.savings_rate.toFixed(0)}%)` : '—'}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-2.5 pt-2 flex items-center justify-end text-[11px] text-blue-600 font-bold">
                <span>טען לטופס עריכה</span>
                <ChevronRight className="w-3.5 h-3.5 mr-1 transform rotate-180" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop / Tablet Table Container (hidden on mobile) */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold select-none">
              <th className="py-3 px-4">חודש</th>
              <th className="py-3 px-3 text-left">שווי כולל</th>
              <th className="py-3 px-3 text-left">שינוי</th>
              <th className="py-3 px-3 text-left">עו"ש</th>
              <th className="py-3 px-3 text-left hidden sm:table-cell">אלטשולר</th>
              <th className="py-3 px-3 text-left hidden sm:table-cell">אקסלנס</th>
              <th className="py-3 px-3 text-left hidden md:table-cell">קרן כספית</th>
              <th className="py-3 px-3 text-left">סה"כ השקעות</th>
              <th className="py-3 px-3 text-left">הכנסות (עבודה ומענקים)</th>
              <th className="py-3 px-3 text-left hidden lg:table-cell">הוצאות</th>
              <th className="py-3 px-3 text-left hidden md:table-cell">חיסכון</th>
              <th className="py-3 px-3 text-center">פעולה</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-num">
            {sorted.map(rec => {
              const isSelected = rec.period === selectedPeriod;
              const hasDiff = rec.wealth_change_pct !== 0 && rec.wealth_change_pct !== undefined;
              const isPos = rec.wealth_change_pct > 0;

              return (
                <tr
                  key={rec.period}
                  onClick={() => onSelectPeriod(rec.period)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50/70 font-semibold text-slate-900 border-r-4 border-blue-600'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <td className="py-3 px-4 font-sans font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{rec.label}</span>
                  </td>

                  <td className="py-3 px-3 text-left font-bold text-slate-900">
                    {formatILS(rec.total_wealth)}
                  </td>

                  <td className="py-3 px-3 text-left">
                    {hasDiff ? (
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          isPos
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {rec.wealth_change_pct}%
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-left text-slate-700">
                    {formatILS(rec.checking)}
                  </td>

                  <td className="py-3 px-3 text-left text-blue-700 hidden sm:table-cell">
                    {formatILS(rec.altshuler)}
                  </td>

                  <td className="py-3 px-3 text-left text-emerald-700 hidden sm:table-cell">
                    {formatILS(rec.excellence)}
                  </td>

                  <td className="py-3 px-3 text-left text-indigo-700 hidden md:table-cell">
                    {rec.money_market > 0 ? formatILS(rec.money_market) : '—'}
                  </td>

                  <td className="py-3 px-3 text-left text-slate-900 font-bold">
                    {formatILS(rec.investments_total)}
                  </td>

                  <td className="py-3 px-3 text-left">
                    {rec.income_net > 0 ? (
                      <div>
                        <span className="font-bold text-emerald-700 block">
                          {formatILS(rec.income_net)}
                        </span>
                        {((rec.salary_daniel || 0) + (rec.salary_shoval || 0) > 0 || (rec.non_work_daniel || 0) + (rec.non_work_shoval || 0) + (rec.other_income || 0) > 0) && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">
                            <span className="text-slate-600">עבודה: {formatILS((rec.salary_daniel || 0) + (rec.salary_shoval || 0))}</span>
                            {((rec.non_work_daniel || 0) + (rec.non_work_shoval || 0) + (rec.other_income || 0)) > 0 && (
                              <span className="text-amber-700 font-semibold">• מענקים: {formatILS((rec.non_work_daniel || 0) + (rec.non_work_shoval || 0) + (rec.other_income || 0))}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-left text-rose-700 hidden lg:table-cell">
                    {rec.expenses > 0 ? formatILS(rec.expenses) : '—'}
                  </td>

                  <td className="py-3 px-3 text-left text-blue-700 hidden md:table-cell">
                    {rec.savings > 0 ? (
                      <span>
                        {formatILS(rec.savings)}{' '}
                        <span className="text-[10px] text-blue-500 font-normal">
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
                      className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-blue-600 transition"
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

      {/* Footer Info */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
        <span>סה"כ רשומות מוצגות: {sorted.length} חודשים</span>
        <span className="text-emerald-600 font-medium">סנכרון ענן פעיל</span>
      </div>
    </div>
  );
};
