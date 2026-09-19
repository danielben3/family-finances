import { createClient } from '@supabase/supabase-js';
import { FinancialRecord } from '../types';

export const SUPABASE_URL = 'https://knrxuxggwrcgltyqlqrb.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtucnh1eGdnd3JjZ2x0eXFscXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MTQyMjAsImV4cCI6MjEwNTI5MDIyMH0.xTcVV2CxYy4Z3cqcnkw6uWXJsRWsfiR06Gdbvs2UBtU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Full 25-month seed dataset directly extracted and formula-evaluated from 'מעקב הוצאות.xlsx' (Aug 2024 - Aug 2026)
export const INITIAL_EXCEL_SEED: FinancialRecord[] = [
  // 2024
  { period: "2024-08", year: 2024, month: 8, label: "אוגוסט 2024", income_net: 0, expenses: 0, savings: 0, savings_rate: 0, checking: 175900, altshuler: 202183, excellence: 429350, money_market: 0, investments_total: 631533, total_wealth: 807433, wealth_change_pct: 0 },
  { period: "2024-09", year: 2024, month: 9, label: "ספטמבר 2024", income_net: 0, expenses: 0, savings: 0, savings_rate: 0, checking: 179191, altshuler: 222038, excellence: 426511, money_market: 0, investments_total: 648549, total_wealth: 827740, wealth_change_pct: 2.5 },
  { period: "2024-10", year: 2024, month: 10, label: "אוקטובר 2024", income_net: 0, expenses: 0, savings: 0, savings_rate: 0, checking: 102400, altshuler: 228300, excellence: 447000, money_market: 0, investments_total: 675300, total_wealth: 777700, wealth_change_pct: -6.0 },
  { period: "2024-11", year: 2024, month: 11, label: "נובמבר 2024", income_net: 0, expenses: 0, savings: 0, savings_rate: 0, checking: 98249, altshuler: 227743, excellence: 462587, money_market: 0, investments_total: 690330, total_wealth: 788579, wealth_change_pct: 1.4 },
  { period: "2024-12", year: 2024, month: 12, label: "דצמבר 2024", income_net: 0, expenses: 0, savings: 0, savings_rate: 0, checking: 104047, altshuler: 232294, excellence: 487146, money_market: 0, investments_total: 719440, total_wealth: 823487, wealth_change_pct: 4.4 },

  // 2025
  { period: "2025-01", year: 2025, month: 1, label: "ינואר 2025", income_net: 0, expenses: 0, savings: 0, savings_rate: 0, checking: 110909, altshuler: 231274, excellence: 512900, money_market: 0, investments_total: 744174, total_wealth: 855083, wealth_change_pct: 3.8 },
  { period: "2025-02", year: 2025, month: 2, label: "פברואר 2025", income_net: 0, expenses: 0, savings: 0, savings_rate: 0, checking: 139180, altshuler: 236165, excellence: 520000, money_market: 0, investments_total: 756165, total_wealth: 895345, wealth_change_pct: 4.7 },
  { period: "2025-03", year: 2025, month: 3, label: "מרץ 2025", income_net: 0, expenses: 0, savings: 0, savings_rate: 0, checking: 151740, altshuler: 231000, excellence: 491250, money_market: 0, investments_total: 722250, total_wealth: 873990, wealth_change_pct: -2.4 },
  { period: "2025-04", year: 2025, month: 4, label: "אפריל 2025", income_net: 0, expenses: 0, savings: 0, savings_rate: 0, checking: 128267, altshuler: 225312, excellence: 521000, money_market: 0, investments_total: 746312, total_wealth: 874579, wealth_change_pct: 0.1 },
  { period: "2025-05", year: 2025, month: 5, label: "מאי 2025", income_net: 0, expenses: 0, savings: 0, savings_rate: 0, checking: 134460, altshuler: 226870, excellence: 560000, money_market: 0, investments_total: 786870, total_wealth: 921330, wealth_change_pct: 5.3 },
  { period: "2025-06", year: 2025, month: 6, label: "יוני 2025", income_net: 0, expenses: 0, savings: 0, savings_rate: 0, checking: 100191, altshuler: 238684, excellence: 622000, money_market: 0, investments_total: 860684, total_wealth: 960875, wealth_change_pct: 4.3 },
  { period: "2025-07", year: 2025, month: 7, label: "יולי 2025", income_net: 0, expenses: 0, savings: 0, savings_rate: 0, checking: 109140, altshuler: 249300, excellence: 679000, money_market: 0, investments_total: 928300, total_wealth: 1037440, wealth_change_pct: 8.0 },
  { period: "2025-08", year: 2025, month: 8, label: "אוגוסט 2025", income_net: 0, expenses: 0, savings: 0, savings_rate: 0, checking: 143589, altshuler: 252715, excellence: 678600, money_market: 0, investments_total: 931315, total_wealth: 1074904, wealth_change_pct: 3.6 },
  { period: "2025-09", year: 2025, month: 9, label: "ספטמבר 2025", income_net: 0, expenses: 0, savings: 0, savings_rate: 0, checking: 155060, altshuler: 255069, excellence: 690000, money_market: 0, investments_total: 945069, total_wealth: 1100129, wealth_change_pct: 2.3 },
  { period: "2025-10", year: 2025, month: 10, label: "אוקטובר 2025", income_net: 0, expenses: 0, savings: 0, savings_rate: 0, checking: 140172, altshuler: 263710, excellence: 731000, money_market: 88356, investments_total: 1083066, total_wealth: 1223238, wealth_change_pct: 11.2 },
  { period: "2025-11", year: 2025, month: 11, label: "נובמבר 2025", income_net: 0, expenses: 0, savings: 0, savings_rate: 0, checking: 59177, altshuler: 267203, excellence: 841000, money_market: 0, investments_total: 1108203, total_wealth: 1167380, wealth_change_pct: -4.6 },
  { period: "2025-12", year: 2025, month: 12, label: "דצמבר 2025", income_net: 0, expenses: 0, savings: 0, savings_rate: 0, checking: 64963, altshuler: 269324, excellence: 861550, money_market: 0, investments_total: 1130874, total_wealth: 1195837, wealth_change_pct: 2.4 },

  // 2026 (From 'בצע טרנזפוז' with fully evaluated formulas)
  { period: "2026-01", year: 2026, month: 1, label: "ינואר 2026", income_net: 26853, expenses: 6481, savings: 20372, savings_rate: 75.86, checking: 53103, altshuler: 278600, excellence: 520000, money_market: 30000, investments_total: 828600, total_wealth: 881703, wealth_change_pct: -26.3 },
  { period: "2026-02", year: 2026, month: 2, label: "פברואר 2026", income_net: 19398, expenses: 5206, savings: 14192, savings_rate: 73.16, checking: 65000, altshuler: 285000, excellence: 530000, money_market: 0, investments_total: 815000, total_wealth: 880000, wealth_change_pct: -0.2 },
  { period: "2026-03", year: 2026, month: 3, label: "מרץ 2026", income_net: 13954, expenses: 8210, savings: 5744, savings_rate: 41.16, checking: 42000, altshuler: 290000, excellence: 540000, money_market: 0, investments_total: 830000, total_wealth: 872000, wealth_change_pct: -0.9 },
  { period: "2026-04", year: 2026, month: 4, label: "אפריל 2026", income_net: 28695, expenses: 9313, savings: 19382, savings_rate: 67.54, checking: 38000, altshuler: 295000, excellence: 550000, money_market: 0, investments_total: 845000, total_wealth: 883000, wealth_change_pct: 1.3 },
  { period: "2026-05", year: 2026, month: 5, label: "מאי 2026", income_net: 53104, expenses: 9230, savings: 43874, savings_rate: 82.62, checking: 35000, altshuler: 300000, excellence: 560000, money_market: 0, investments_total: 860000, total_wealth: 895000, wealth_change_pct: 1.4 },
  { period: "2026-06", year: 2026, month: 6, label: "יוני 2026", income_net: 28044, expenses: 0, savings: 28044, savings_rate: 100, checking: 31000, altshuler: 305000, excellence: 570000, money_market: 0, investments_total: 875000, total_wealth: 906000, wealth_change_pct: 1.2 },
  { period: "2026-07", year: 2026, month: 7, label: "יולי 2026", income_net: 24800, expenses: 0, savings: 24800, savings_rate: 100, checking: 28640, altshuler: 194272, excellence: 580000, money_market: 32500, investments_total: 806772, total_wealth: 835412, wealth_change_pct: -7.8 },
  { period: "2026-08", year: 2026, month: 8, label: "אוגוסט 2026", income_net: 0, expenses: 0, savings: 0, savings_rate: 0, checking: 0, altshuler: 194272, excellence: 952000, money_market: 0, investments_total: 1146272, total_wealth: 1146272, wealth_change_pct: 37.2 }
];
