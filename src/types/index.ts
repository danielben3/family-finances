export interface FinancialRecord {
  period: string;             // '2024-08', '2026-07'
  year: number;               // 2024, 2025, 2026
  month: number;              // 1..12
  label: string;              // 'אוגוסט 2024', 'יולי 2026'
  income_net: number;         // סה״כ הכנסות נטו למשק הבית
  salary_daniel?: number;     // שכר עבודה דניאל (נטו)
  non_work_daniel?: number;   // שלא מעבודה דניאל (מילואים, מענקים, ביטוח לאומי)
  salary_shoval?: number;     // שכר עבודה שובל (נטו)
  non_work_shoval?: number;   // שלא מעבודה שובל (ביטוח לאומי, דמי לידה, קצבאות)
  other_income?: number;      // הכנסות נוספות למשק הבית (קצבאות ילדים וכד׳)
  expenses: number;           // כרטיסי אשראי + שכירות + מיסי יישוב + חשמל
  savings: number;            // הכנסות נטו - הוצאות
  savings_rate: number;       // אחוז חיסכון
  checking: number;           // סה״כ עו״ש ונזילות (כולל כל החשבונות והארנקים)
  checking_onezero?: number;  // עו״ש ONE ZERO — חשבון 2150
  checking_pepper?: number;   // עו״ש Pepper לאומי — חשבון 3302
  checking_otsar?: number;    // עו״ש אוצר החייל — חשבון 6775
  paybox?: number;            // ארנק PayBox
  bit?: number;               // ארנק Bit
  altshuler: number;          // אלטשולר שחם (גמל)
  excellence: number;         // אקסלנס (מניות)
  excellence_cost_basis?: number; // קרן מושקעת באקסלנס (עלות בסיס)
  money_market: number;       // קרן כספית
  investments_total: number;  // סה״כ השקעות
  total_wealth: number;       // עו״ש + השקעות
  wealth_change_pct: number;  // שינוי באחוזים מחודש קודם
  notes?: string | null;      // הערות חודשיות
  raw_formulas?: Record<string, string>;
  updated_at?: string;
}

export interface SummaryKPIs {
  latestWealth: number;
  latestWealthChange: number;
  latestWealthChangePct: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  monthlySavingsRate: number;
  checkingTotal: number;
  investmentsTotal: number;
  altshulerTotal: number;
  excellenceTotal: number;
  moneyMarketTotal: number;
}
