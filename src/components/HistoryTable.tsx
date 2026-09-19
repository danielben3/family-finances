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
        'משכורות נטו (₪)': r.income_net,
        'הוצאות (₪)': r.expenses,
        'חיסכון (₪)': r.savings,
        'אחוז חיסכון (%)': r.savings_rate ? `${r.savings_rate.toFixed(1)}%` : '—',
        'הערות': r.notes || '',
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Auto-size columns
      const colWidths = [
        { wch: 10 }, { wch: 14 }, { wch: 16 }, { wch: 18 },
        { wch: 16 }, { wch: 22 }, { wch: 20 }, { wch: 15 },
        { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 14 },
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
    <div className="glass-card p-5 sm:p-6 bg-slate-900/70 border border-white/10 rounded-2xl shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg">
            <Table className="w-5 h-5 text-amber-400" />
            <span>טבלת נתונים היסטורית מלאה</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            כל הרשומות מאוגוסט 2024 ועד היום — לחץ על שורה לעריכה מהירה
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Year Filter Tabs */}
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 text-xs">
            {['all', '2026', '2025', '2024'].map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  selectedYear === year
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {year === 'all' ? 'הכל' : year}
              </button>
            ))}
          </div>

          {/* Sort Toggle */}
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition"
            title="שינוי כיוון מיון"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>{sortAsc ? 'מהישן לחדש' : 'מהחדש לישן'}</span>
          </button>

          {/* Export to Excel Button */}
          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 text-xs font-semibold transition"
          >
            {isExporting ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isExporting ? 'מייצא...' : 'ייצוא לאקסל'}</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0B0F19]/60">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-slate-400 font-semibold select-none">
              <th className="py-3 px-4">חודש</th>
              <th className="py-3 px-3 text-left">שווי כולל</th>
              <th className="py-3 px-3 text-left">שינוי</th>
              <th className="py-3 px-3 text-left">עו"ש</th>
              <th className="py-3 px-3 text-left hidden sm:table-cell">אלטשולר</th>
              <th className="py-3 px-3 text-left hidden sm:table-cell">אקסלנס</th>
              <th className="py-3 px-3 text-left hidden md:table-cell">קרן כספית</th>
              <th className="py-3 px-3 text-left">סה"כ השקעות</th>
              <th className="py-3 px-3 text-left hidden lg:table-cell">הכנסות</th>
              <th className="py-3 px-3 text-left hidden lg:table-cell">הוצאות</th>
              <th className="py-3 px-3 text-left hidden md:table-cell">חיסכון</th>
              <th className="py-3 px-3 text-center">פעולה</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-num">
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
                      ? 'bg-amber-500/15 text-white font-medium border-r-2 border-amber-500'
                      : 'hover:bg-white/[0.04] text-slate-300'
                  }`}
                >
                  <td className="py-3 px-4 font-sans font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{rec.label}</span>
                  </td>

                  <td className="py-3 px-3 text-left font-bold text-white">
                    {formatILS(rec.total_wealth)}
                  </td>

                  <td className="py-3 px-3 text-left">
                    {hasDiff ? (
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                          isPos
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {rec.wealth_change_pct}%
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-left text-slate-300">
                    {formatILS(rec.checking)}
                  </td>

                  <td className="py-3 px-3 text-left text-purple-300 hidden sm:table-cell">
                    {formatILS(rec.altshuler)}
                  </td>

                  <td className="py-3 px-3 text-left text-sky-300 hidden sm:table-cell">
                    {formatILS(rec.excellence)}
                  </td>

                  <td className="py-3 px-3 text-left text-emerald-300 hidden md:table-cell">
                    {rec.money_market > 0 ? formatILS(rec.money_market) : '—'}
                  </td>

                  <td className="py-3 px-3 text-left text-amber-300 font-semibold">
                    {formatILS(rec.investments_total)}
                  </td>

                  <td className="py-3 px-3 text-left text-emerald-400 hidden lg:table-cell">
                    {rec.income_net > 0 ? formatILS(rec.income_net) : '—'}
                  </td>

                  <td className="py-3 px-3 text-left text-rose-400 hidden lg:table-cell">
                    {rec.expenses > 0 ? formatILS(rec.expenses) : '—'}
                  </td>

                  <td className="py-3 px-3 text-left text-teal-300 hidden md:table-cell">
                    {rec.savings > 0 ? (
                      <span>
                        {formatILS(rec.savings)}{' '}
                        <span className="text-[10px] text-teal-400/80">
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
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-amber-400 transition"
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
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
        <span>סה"כ רשומות מוצגות: {sorted.length} חודשים</span>
        <span>סנכרון בזמן אמת פעיל</span>
      </div>
    </div>
  );
};
