export interface FinancialRecord {
  period: string;             // '2024-08', '2026-07'
  year: number;               // 2024, 2025, 2026
  month: number;              // 1..12
  label: string;              // 'אוגוסט 2024', 'יולי 2026'
  income_net: number;         // משכורות נטו
  expenses: number;           // כרטיסי אשראי + שכירות + מיסי יישוב + חשמל
  savings: number;            // הכנסות נטו - הוצאות
  savings_rate: number;       // אחוז חיסכון
  checking: number;           // עו"ש
  altshuler: number;          // אלטשולר שחם (גמל)
  excellence: number;         // אקסלנס (מניות)
  excellence_cost_basis?: number; // קרן מושקעת באקסלנס (עלות בסיס)
  money_market: number;       // קרן כספית
  investments_total: number;  // סה"כ השקעות
  total_wealth: number;       // עו"ש + השקעות
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
