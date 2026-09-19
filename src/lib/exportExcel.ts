import * as XLSX from 'xlsx';
import { FinancialRecord } from '../types';

export const exportFinancialRecordsToExcel = (records: FinancialRecord[]) => {
  const sorted = [...records].sort((a, b) => a.period.localeCompare(b.period));
  const exportData = sorted.map(r => ({
    'תקופה': r.period,
    'חודש': r.label,
    'שווי כולל (₪)': r.total_wealth,
    'שינוי מחודש קודם (%)': r.wealth_change_pct ? `${r.wealth_change_pct}%` : '—',
    'עו"ש ונזילות (₪)': r.checking,
    'אלטשולר שחם - גמל (₪)': r.altshuler,
    'אקסלנס - מניות (₪)': r.excellence,
    'קרן אקסלנס (₪)': r.excellence_cost_basis || '—',
    'רווח הון אקסלנס (₪)': r.excellence_cost_basis && r.excellence > r.excellence_cost_basis ? r.excellence - r.excellence_cost_basis : '—',
    'מס רווחי הון 25% (₪)': r.excellence_cost_basis && r.excellence > r.excellence_cost_basis ? Math.round((r.excellence - r.excellence_cost_basis) * 0.25) : '—',
    'אקסלנס נטו לאחר מס (₪)': r.excellence_cost_basis && r.excellence > r.excellence_cost_basis ? r.excellence - Math.round((r.excellence - r.excellence_cost_basis) * 0.25) : r.excellence,
    'קרן כספית (₪)': r.money_market,
    'סה"כ השקעות (₪)': r.investments_total,
    'משכורות נטו (₪)': r.income_net,
    'הוצאות (₪)': r.expenses,
    'חיסכון (₪)': r.savings,
    'אחוז חיסכון (%)': r.savings_rate ? `${r.savings_rate.toFixed(1)}%` : '—',
    'הערות': r.notes || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'דוח פיננסי משפחתי');
  XLSX.writeFile(workbook, `Family_Finances_${new Date().toISOString().slice(0, 10)}.xlsx`);
};