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
    // Fallback: if only income_net is recorded and no non-work, treat as work income
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

  // Filter records by year
  const filtered = records.filter(r => {
    if (selectedYear === 'all') return true;
    return String(r.year) === selectedYear;
  });

  // Sort by period
  const sorted = [...filtered].sort((a, b) => {
    return sortAsc ? a.period.localeCompare(b.period) : b.period.localeCompare(a.period);
  });

  // YTD Calculations for 2026 (or selected year)
  const activeYearRecords = records.filter(r => r.year === (selectedYear === 'all' ? 2026 : Number(selectedYear)));
  const ytdTotalIncome = activeYearRecords.reduce((sum, r) => sum + (r.income_net || 0), 0);
  const ytdWorkIncome = activeYearRecords.reduce((sum, r) => sum + getWorkIncome(r), 0);
  const ytdGrantsIncome = activeYearRecords.reduce((sum, r) => sum + getGrantsIncome(r), 0);
  const monthsWithIncome = activeYearRecords.filter(r => (r.income_net || 0) > 0).length || 1;
  const avgMonthlyIncome = Math.round(ytdTotalIncome / monthsWithIncome);

  const formatILS = (val: number) => {
    if (!val && val !== 0) return '—';
    return '₪' + Math.round(val).toLocaleString('he-IL');
  };

  // Export dedicated income dataset
  const handleExportExcel = () => {
    setIsExporting(true);
    try {
      const exportData = sorted.map(r => {
        const work = getWorkIncome(r);
        const grants = getGrantsIncome(r);
        const total = r.income_net || (work + grants);
        return {
          'תקופה': r.period,
          'חודש': r.label,
          'סה"כ הכנסות (עבודה ומענקים) (₪)': total,
          'הכנסות מעבודה נטו (₪)': work,
          'מענקים ושלא מעבודה (₪)': grants,
          'שכר דניאל (₪)': r.salary_daniel || 0,
          'שלא מעבודה/מילואים דניאל (₪)': r.non_work_daniel || 0,
          'שכר שובל (₪)': r.salary_shoval || 0,
          'שלא מעבודה שובל (₪)': r.non_work_shoval || 0,
          'קצבאות ילדים והכנסות נוספות (₪)': r.other_income || 0,
          'הוצאות חודשיות (₪)': r.expenses || 0,
          'חיסכון נטו (₪)': r.savings || (total - (r.expenses || 0)),
          'אחוז חיסכון (%)': r.savings_rate ? `${r.savings_rate.toFixed(1)}%` : '—',
          'הערות': r.notes || '',
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const colWidths = [
        { wch: 10 }, { wch: 14 }, { wch: 28 }, { wch: 22 },
        { wch: 24 }, { wch: 16 }, { wch: 26 }, { wch: 16 },
        { wch: 22 }, { wch: 28 }, { wch: 18 }, { wch: 16 },
        { wch: 16 }, { wch: 25 },
      ];
      worksheet['!cols'] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'דוח הכנסות ומענקים');

      const todayStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `דוח_הכנסות_ומענקים_${todayStr}.xlsx`);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  return (
    <div className="space-y-6">

      {/* Top Banner / Month Context Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 shadow-lg shadow-emerald-600/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold mb-2">
              <Coins className="w-3.5 h-3.5 text-amber-300" />
              <span>ניהול הכנסות חודשיות • {currentRecord.label}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              הכנסות חודשיות מעבודה ומענקים
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
              ריכוז מלא של הכנסות משק הבית — שכר עבודה נטו, מענקי מילואים, ביטוח לאומי, דמי לידה וקצבאות.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onNavigateToForm}
              className="px-4 py-2 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold transition shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <span>ערוך הכנסות חודש זה</span>
              <ChevronRight className="w-4 h-4 transform rotate-180" />
            </button>
            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className="px-4 py-2 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 text-white text-xs font-semibold transition border border-white/20 flex items-center gap-1.5"
            >
              {isExporting ? <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" /> : <Download className="w-3.5 h-3.5" />}
              <span>ייצוא לאקסל</span>
            </button>
          </div>
        </div>

        {/* Current Month Split Progress Bar */}
        <div className="mt-6 pt-5 border-t border-white/20">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-200" />
              <span>שכר מעבודה ({workPct}%): {formatILS(curWorkIncome)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span>מענקים ושלא מעבודה ({grantsPct}%): {formatILS(curGrantsIncome)}</span>
              <Gift className="w-3.5 h-3.5 text-amber-200" />
            </span>
          </div>

          <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden flex p-0.5">
            <div
              style={{ width: `${Math.max(5, workPct)}%` }}
              className="h-full bg-gradient-to-r from-emerald-300 to-teal-200 rounded-full transition-all duration-500"
              title={`עבודה: ${workPct}%`}
            />
            <div
              style={{ width: `${Math.max(0, grantsPct)}%` }}
              className="h-full bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full transition-all duration-500 mr-1"
              title={`מענקים: ${grantsPct}%`}
            />
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Total Monthly Income */}
        <div className="bg-white rounded-2xl p-4 card-diffused-shadow border border-slate-200/80 flex flex-col justify-between hover:border-emerald-200 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">סה״כ הכנסות החודש</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-num">
              {formatILS(curTotalIncome)}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">{currentRecord.label}</span>
          </div>
        </div>

        {/* Card 2: Work Income */}
        <div className="bg-white rounded-2xl p-4 card-diffused-shadow border border-slate-200/80 flex flex-col justify-between hover:border-blue-200 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">הכנסה מעבודה נטו</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-blue-600 font-num">
              {formatILS(curWorkIncome)}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              דניאל: {formatILS(currentRecord.salary_daniel || 0)} • שובל: {formatILS(currentRecord.salary_shoval || 0)}
            </span>
          </div>
        </div>

        {/* Card 3: Grants & Non-Work */}
        <div className="bg-white rounded-2xl p-4 card-diffused-shadow border border-slate-200/80 flex flex-col justify-between hover:border-amber-200 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">מענקים ושלא מעבודה</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-600 font-num">
              {formatILS(curGrantsIncome)}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              מילואים, ביטוח לאומי וקצבאות
            </span>
          </div>
        </div>

        {/* Card 4: Monthly Average */}
        <div className="bg-white rounded-2xl p-4 card-diffused-shadow border border-slate-200/80 flex flex-col justify-between hover:border-purple-200 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">ממוצע חודשי ({selectedYear === 'all' ? '2026' : selectedYear})</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-purple-600 font-num">
              {formatILS(avgMonthlyIncome)}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              מצטבר: {formatILS(ytdTotalIncome)}
            </span>
          </div>
        </div>

      </div>

      {/* Main Income & Grants Interactive Table Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 card-diffused-shadow border border-slate-200/80">
        
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
              <Coins className="w-4 h-4 text-emerald-600" />
              <span>טבלת הכנסות ומענקים חודשית</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              כולל עמודת "הכנסות (עבודה ומענקים)" מאוחדת עם פירוט פנימי של שכר, מענקים וקצבאות
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
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
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
          </div>
        </div>

        {/* Mobile Card Feed (sm:hidden) */}
        <div className="sm:hidden space-y-3">
          {sorted.map(rec => {
            const isSelected = rec.period === selectedPeriod;
            const workInc = getWorkIncome(rec);
            const grantsInc = getGrantsIncome(rec);
            const totalInc = rec.income_net || (workInc + grantsInc);
            const hasDetailedSplit = (rec.salary_daniel || 0) > 0 || (rec.salary_shoval || 0) > 0 || grantsInc > 0;
            const workPercent = totalInc > 0 ? Math.round((workInc / totalInc) * 100) : 0;
            const grantsPercent = totalInc > 0 ? 100 - workPercent : 0;

            return (
              <div
                key={rec.period}
                onClick={() => onSelectPeriod(rec.period)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {/* Top Row: Month & Action */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>{rec.label}</span>
                    {isSelected && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-600 text-white">נבחר</span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPeriod(rec.period);
                      onNavigateToForm();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-emerald-700 text-xs font-bold transition shadow-xs active:scale-95"
                  >
                    ערוך
                  </button>
                </div>

                {/* Total Income Big Pill */}
                <div className="pt-2.5 pb-2 flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 font-medium">סה״כ הכנסות נטו:</span>
                  <span className="text-xl font-extrabold text-emerald-700 font-num">
                    {formatILS(totalInc)}
                  </span>
                </div>

                {/* Progress bar split */}
                {totalInc > 0 && (
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex my-1.5">
                    <div className="h-full bg-blue-500 rounded-r-full" style={{ width: `${workPercent}%` }} />
                    <div className="h-full bg-amber-500 rounded-l-full" style={{ width: `${grantsPercent}%` }} />
                  </div>
                )}

                {/* Breakdown Badges */}
                <div className="grid grid-cols-2 gap-2 pt-1.5 text-xs font-num">
                  <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-2">
                    <span className="text-[10px] text-blue-700 block font-sans font-medium">💼 שכר עבודה</span>
                    <span className="font-extrabold text-blue-900 text-sm">{formatILS(workInc)}</span>
                    {(rec.salary_daniel || rec.salary_shoval) && (
                      <span className="text-[9.5px] text-blue-500 block truncate mt-0.5">
                        ד: {formatILS(rec.salary_daniel || 0)} | ש: {formatILS(rec.salary_shoval || 0)}
                      </span>
                    )}
                  </div>

                  <div className="bg-amber-50/80 border border-amber-100 rounded-xl p-2">
                    <span className="text-[10px] text-amber-700 block font-sans font-medium">🛡️ מענקים וקצבאות</span>
                    <span className="font-extrabold text-amber-900 text-sm">{formatILS(grantsInc)}</span>
                    <span className="text-[9.5px] text-amber-600 block truncate mt-0.5">
                      {rec.other_income ? `קצבה: ${formatILS(rec.other_income)}` : 'מילואים/ביטוח לאומי'}
                    </span>
                  </div>
                </div>

                {/* Expenses & Savings Footnote */}
                {(rec.expenses > 0 || rec.savings > 0) && (
                  <div className="flex items-center justify-between text-[11px] font-num text-slate-500 pt-2 mt-2 border-t border-slate-200/60">
                    <span>הוצאות: {formatILS(rec.expenses)}</span>
                    <span className="text-blue-600 font-bold">
                      חיסכון: {formatILS(rec.savings)} ({rec.savings_rate.toFixed(0)}%)
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop / Tablet The Table (hidden on mobile) */}
        <div className="hidden sm:block overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold select-none">
                <th className="py-3.5 px-4">חודש</th>
                {/* === The Requested Unified Column with Internal Breakdown === */}
                <th className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-700 font-extrabold text-sm">הכנסות (עבודה ומענקים)</span>
                    <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">(סה״כ + פירוט)</span>
                  </div>
                </th>
                <th className="py-3.5 px-3 text-left hidden md:table-cell">שכר עבודה נטו</th>
                <th className="py-3.5 px-3 text-left hidden md:table-cell">מענקים ושלא מעבודה</th>
                <th className="py-3.5 px-3 text-left hidden lg:table-cell">הוצאות</th>
                <th className="py-3.5 px-3 text-left hidden lg:table-cell">חיסכון נטו</th>
                <th className="py-3.5 px-3 text-center">פעולה</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-num">
              {sorted.map(rec => {
                const isSelected = rec.period === selectedPeriod;
                const workInc = getWorkIncome(rec);
                const grantsInc = getGrantsIncome(rec);
                const totalInc = rec.income_net || (workInc + grantsInc);
                const hasDetailedSplit = (rec.salary_daniel || 0) > 0 || (rec.salary_shoval || 0) > 0 || grantsInc > 0;

                return (
                  <tr
                    key={rec.period}
                    onClick={() => onSelectPeriod(rec.period)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/70 font-semibold text-slate-900 border-r-4 border-emerald-600'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {/* Month Column */}
                    <td className="py-3.5 px-4 font-sans font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rec.label}</span>
                    </td>

                    {/* === Unified Column: הכנסות (עבודה ומענקים) with Internal Breakdown === */}
                    <td className="py-3.5 px-4 text-left">
                      {totalInc > 0 ? (
                        <div className="space-y-1">
                          {/* Large Bold Total */}
                          <div className="text-sm font-extrabold text-emerald-700">
                            {formatILS(totalInc)}
                          </div>
                          
                          {/* Internal Breakdown Badges */}
                          {hasDetailedSplit ? (
                            <div className="flex flex-wrap items-center gap-1.5 text-[10.5px]">
                              {workInc > 0 && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 font-medium">
                                  <span>💼 עבודה:</span>
                                  <span className="font-bold">{formatILS(workInc)}</span>
                                </span>
                              )}
                              {grantsInc > 0 && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 font-medium">
                                  <span>🛡️ מענקים:</span>
                                  <span className="font-bold">{formatILS(grantsInc)}</span>
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">
                              (הכנסה חודשית נטו)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Separate Work Income Column (Desktop) */}
                    <td className="py-3.5 px-3 text-left hidden md:table-cell">
                      {workInc > 0 ? (
                        <div>
                          <span className="font-bold text-slate-800">{formatILS(workInc)}</span>
                          {(rec.salary_daniel || rec.salary_shoval) && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {rec.salary_daniel ? `ד: ${formatILS(rec.salary_daniel)} ` : ''}
                              {rec.salary_shoval ? `ש: ${formatILS(rec.salary_shoval)}` : ''}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Separate Grants Column (Desktop) */}
                    <td className="py-3.5 px-3 text-left hidden md:table-cell">
                      {grantsInc > 0 ? (
                        <div>
                          <span className="font-bold text-amber-700">{formatILS(grantsInc)}</span>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {rec.other_income ? `קצבאות: ${formatILS(rec.other_income)}` : 'מענקים/מילואים'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">₪0</span>
                      )}
                    </td>

                    {/* Expenses */}
                    <td className="py-3.5 px-3 text-left text-rose-700 hidden lg:table-cell">
                      {rec.expenses > 0 ? formatILS(rec.expenses) : '—'}
                    </td>

                    {/* Savings */}
                    <td className="py-3.5 px-3 text-left text-blue-700 hidden lg:table-cell">
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

                    {/* Action */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPeriod(rec.period);
                          onNavigateToForm();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-600 text-[11px] font-semibold transition"
                        title="ערוך הכנסות חודש זה"
                      >
                        ערוך
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
          <span>סה״כ חודשים בטבלה: {sorted.length}</span>
          <span className="text-emerald-600 font-medium">סנכרון ענן פעיל</span>
        </div>
      </div>

    </div>
  );
};
