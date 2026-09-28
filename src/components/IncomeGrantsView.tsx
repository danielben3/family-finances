import React, { useState } from 'react';
import { FinancialRecord } from '../types';
import {
  Coins,
  Briefcase,
  Gift,
  TrendingUp,
  Download,
  Calendar,
  ArrowUpDown,
  CheckCircle2,
  ChevronRight,
  Shield,
  User,
  Users,
  Sparkles,
  PieChart,
  ArrowDownLeft,
  Percent
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface IncomeGrantsViewProps {
  records: FinancialRecord[];
  selectedPeriod: string;
  onSelectPeriod: (period: string) => void;
  onNavigateToForm: () => void;
}

export const IncomeGrantsView: React.FC<IncomeGrantsViewProps> = ({
  records,
  selectedPeriod,
  onSelectPeriod,
  onNavigateToForm,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Selected current month record
  const currentRecord = records.find(r => r.period === selectedPeriod) || records[records.length - 1];

  // Helper calculations for income breakdown
  const getWorkIncome = (r: FinancialRecord) => {
    const dan = r.salary_daniel || 0;
    const shov = r.salary_shoval || 0;
    if (dan > 0 || shov > 0) return dan + shov;
    const nonWork = (r.non_work_daniel || 0) + (r.non_work_shoval || 0) + (r.other_income || 0);
    if (nonWork === 0 && r.income_net > 0) return r.income_net;
    return Math.max(0, (r.income_net || 0) - nonWork);
  };

  const getGrantsIncome = (r: FinancialRecord) => {
    return (r.non_work_daniel || 0) + (r.non_work_shoval || 0) + (r.other_income || 0);
  };

  const curWorkIncome = getWorkIncome(currentRecord);
  const curGrantsIncome = getGrantsIncome(currentRecord);
  const curTotalIncome = currentRecord.income_net || (curWorkIncome + curGrantsIncome);
  const workPct = curTotalIncome > 0 ? Math.round((curWorkIncome / curTotalIncome) * 100) : 0;
  const grantsPct = curTotalIncome > 0 ? 100 - workPct : 0;

  // Year filter
  const filtered = records.filter(r => {
    if (selectedYear === 'all') return true;
    return String(r.year) === selectedYear;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    return sortAsc ? a.period.localeCompare(b.period) : b.period.localeCompare(a.period);
  });

  // YTD & Average totals
  const ytdTotalIncome = filtered.reduce((acc, r) => acc + (r.income_net || (getWorkIncome(r) + getGrantsIncome(r))), 0);
  const ytdWorkIncome = filtered.reduce((acc, r) => acc + getWorkIncome(r), 0);
  const ytdGrantsIncome = filtered.reduce((acc, r) => acc + getGrantsIncome(r), 0);
  const avgMonthlyIncome = filtered.length > 0 ? Math.round(ytdTotalIncome / filtered.length) : 0;

  const formatILS = (val: number) => {
    if (!val && val !== 0) return '—';
    return '₪ ' + Math.round(val).toLocaleString('he-IL');
  };

  // Export to Excel
  const handleExportExcel = () => {
    setIsExporting(true);
    try {
      const exportData = sorted.map(r => {
        const w = getWorkIncome(r);
        const g = getGrantsIncome(r);
        const t = r.income_net || (w + g);
        return {
          'תקופה': r.period,
          'חודש': r.label,
          'סה״כ הכנסות (עבודה ומענקים) (₪)': t,
          'הכנסות מעבודה נטו (₪)': w,
          'שכר דניאל (₪)': r.salary_daniel || 0,
          'שכר שובל (₪)': r.salary_shoval || 0,
          'מענקים ושלא מעבודה (₪)': g,
          'דניאל שלא מעבודה (מילואים) (₪)': r.non_work_daniel || 0,
          'שובל שלא מעבודה (לידה/ביטוח לאומי) (₪)': r.non_work_shoval || 0,
          'קצבאות ילדים והכנסות נוספות (₪)': r.other_income || 0,
          'הוצאות (₪)': r.expenses || 0,
          'חיסכון (₪)': r.savings || 0,
          'שיעור חיסכון (%)': r.savings_rate ? `${r.savings_rate.toFixed(1)}%` : '—',
          'הערות': r.notes || '',
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'דוח הכנסות ומענקים');
      const todayStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `דוח_הכנסות_ומענקים_${todayStr}.xlsx`);
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in" dir="rtl">

      {/* 1. Top Banner / Month Context Header */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 border border-black/[0.06] shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] tracking-[0.16em] uppercase text-stone-400 font-semibold block mb-0.5">
              INCOME & GRANTS LEDGER // ניהול הכנסות
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-stone-900">
              הכנסות חודשיות מעבודה ומענקים
            </h1>
            <p className="text-xs text-stone-500 mt-1 max-w-xl font-sans">
              ריכוז מלא של הכנסות משק הבית — שכר עבודה נטו, מענקי מילואים, ביטוח לאומי, דמי לידה וקצבאות.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onNavigateToForm}
              className="px-3.5 py-2 rounded-xl bg-[#1A1A1A] text-white hover:opacity-90 text-xs font-semibold transition active:scale-95 flex items-center gap-1.5 btn-press shadow-2xs"
            >
              <span>ערוך הכנסות חודש זה</span>
              <ChevronRight className="w-3.5 h-3.5 transform rotate-180" />
            </button>
            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] text-stone-900 text-xs font-medium transition border border-[#E5E0D8] flex items-center gap-1.5 btn-press shadow-2xs"
            >
              {isExporting ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5 text-stone-500" />}
              <span>ייצוא לאקסל</span>
            </button>
          </div>
        </div>

        {/* Current Month Split Progress Bar */}
        <div className="mt-5 pt-4 border-t border-black/[0.06]">
          <div className="flex items-center justify-between text-xs font-medium mb-2 font-serif">
            <span className="flex items-center gap-1.5 text-stone-900">
              <span className="w-2 h-2 rounded-full bg-stone-900" />
              <span>שכר מעבודה ({workPct}%): {formatILS(curWorkIncome)}</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-900">
              <span>מענקים ושלא מעבודה ({grantsPct}%): {formatILS(curGrantsIncome)}</span>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            </span>
          </div>

          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden flex p-0.5">
            <div
              style={{ width: `${Math.max(5, workPct)}%` }}
              className="h-full bg-stone-900 rounded-full transition-all duration-500"
              title={`עבודה: ${workPct}%`}
            />
            <div
              style={{ width: `${Math.max(0, grantsPct)}%` }}
              className="h-full bg-amber-500 rounded-full transition-all duration-500 mr-1"
              title={`מענקים: ${grantsPct}%`}
            />
          </div>
        </div>
      </section>

      {/* 2. 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Card 1: Total Monthly Income */}
        <div className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">סה״כ החודש</span>
            <Coins className="w-4 h-4 text-stone-400" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
              {formatILS(curTotalIncome)}
            </div>
            <span className="text-[11px] text-stone-400 mt-0.5 block">{currentRecord.label}</span>
          </div>
        </div>

        {/* Card 2: Work Income */}
        <div className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">הכנסה מעבודה נטו</span>
            <Briefcase className="w-4 h-4 text-stone-400" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
              {formatILS(curWorkIncome)}
            </div>
            <span className="text-[11px] text-stone-400 mt-0.5 block truncate">
              ד: {formatILS(currentRecord.salary_daniel || 0)} • ש: {formatILS(currentRecord.salary_shoval || 0)}
            </span>
          </div>
        </div>

        {/* Card 3: Grants & Non-Work */}
        <div className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">מענקים ושלא מעבודה</span>
            <Gift className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-amber-900 font-serif">
              {formatILS(curGrantsIncome)}
            </div>
            <span className="text-[11px] text-stone-400 mt-0.5 block">
              מילואים וביטוח לאומי
            </span>
          </div>
        </div>

        {/* Card 4: Monthly Average */}
        <div className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">ממוצע חודשי</span>
            <TrendingUp className="w-4 h-4 text-stone-400" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
              {formatILS(avgMonthlyIncome)}
            </div>
            <span className="text-[11px] text-stone-400 mt-0.5 block">
              מצטבר: {formatILS(ytdTotalIncome)}
            </span>
          </div>
        </div>

      </div>

      {/* 3. Main Income & Grants Interactive Table Card */}
      <section className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-sm">
        
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold font-serif text-stone-900">
              טבלת הכנסות ומענקים חודשית
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              כולל עמודת "הכנסות (עבודה ומענקים)" מאוחדת עם פירוט פנימי
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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

            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-black/[0.06] text-xs text-stone-700 transition btn-press shadow-2xs"
              title="שינוי כיוון מיון"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <span>{sortAsc ? 'מהישן לחדש' : 'מהחדש לישן'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Card Feed */}
        <div className="sm:hidden space-y-3">
          {sorted.map(rec => {
            const isSelected = rec.period === selectedPeriod;
            const workInc = getWorkIncome(rec);
            const grantsInc = getGrantsIncome(rec);
            const totalInc = rec.income_net || (workInc + grantsInc);
            const workPercent = totalInc > 0 ? Math.round((workInc / totalInc) * 100) : 0;
            const grantsPercent = totalInc > 0 ? 100 - workPercent : 0;

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
                <div className="flex items-center justify-between pb-2 border-b border-black/[0.04]">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 text-sm font-serif">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{rec.label}</span>
                    {isSelected && (
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-[#1A1A1A] text-white">נבחר</span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPeriod(rec.period);
                      onNavigateToForm();
                    }}
                    className="px-2.5 py-1 rounded-xl bg-white border border-[#E5E0D8] text-stone-900 text-xs font-medium transition shadow-2xs btn-press"
                  >
                    ערוך
                  </button>
                </div>

                <div className="pt-2 pb-2 flex items-baseline justify-between">
                  <span className="text-[10px] uppercase font-semibold text-stone-400">סה״כ הכנסות נטו</span>
                  <span className="text-lg font-bold text-stone-900 font-serif">
                    {formatILS(totalInc)}
                  </span>
                </div>

                {totalInc > 0 && (
                  <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden flex my-1.5">
                    <div className="h-full bg-stone-900" style={{ width: `${workPercent}%` }} />
                    <div className="h-full bg-amber-500 mr-0.5" style={{ width: `${grantsPercent}%` }} />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1.5 text-xs font-serif">
                  <div className="bg-[#FAF8F5] border border-black/[0.04] rounded-xl p-2">
                    <span className="text-[10px] text-stone-500 block font-sans">💼 שכר עבודה</span>
                    <span className="font-bold text-stone-900">{formatILS(workInc)}</span>
                  </div>

                  <div className="bg-[#FAF8F5] border border-black/[0.04] rounded-xl p-2">
                    <span className="text-[10px] text-amber-700 block font-sans">🛡️ מענקים וקצבאות</span>
                    <span className="font-bold text-amber-900">{formatILS(grantsInc)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto rounded-2xl border border-black/[0.06] bg-white shadow-sm">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-black/[0.06] bg-[#FAF8F5] text-stone-600 font-semibold select-none">
                <th className="py-3.5 px-4">חודש</th>
                <th className="py-3.5 px-4 text-left">הכנסות (עבודה ומענקים)</th>
                <th className="py-3.5 px-3 text-left hidden md:table-cell">שכר עבודה נטו</th>
                <th className="py-3.5 px-3 text-left hidden md:table-cell">מענקים ושלא מעבודה</th>
                <th className="py-3.5 px-3 text-left hidden lg:table-cell">הוצאות</th>
                <th className="py-3.5 px-3 text-left hidden lg:table-cell">חיסכון נטו</th>
                <th className="py-3.5 px-3 text-center">פעולה</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] font-serif">
              {sorted.map(rec => {
                const isSelected = rec.period === selectedPeriod;
                const workInc = getWorkIncome(rec);
                const grantsInc = getGrantsIncome(rec);
                const totalInc = rec.income_net || (workInc + grantsInc);

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

                    <td className="py-3 px-4 text-left font-bold text-stone-900">
                      {formatILS(totalInc)}
                    </td>

                    <td className="py-3 px-3 text-left text-stone-800 hidden md:table-cell">
                      {formatILS(workInc)}
                    </td>

                    <td className="py-3 px-3 text-left text-amber-900 hidden md:table-cell">
                      {formatILS(grantsInc)}
                    </td>

                    <td className="py-3 px-3 text-left text-stone-600 hidden lg:table-cell">
                      {rec.expenses > 0 ? formatILS(rec.expenses) : '—'}
                    </td>

                    <td className="py-3 px-3 text-left text-emerald-800 hidden lg:table-cell">
                      {rec.savings > 0 ? formatILS(rec.savings) : '—'}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPeriod(rec.period);
                          onNavigateToForm();
                        }}
                        className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-900 transition"
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

      </section>

    </div>
  );
};
