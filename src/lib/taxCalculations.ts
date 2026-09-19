export interface TaxCalculationResult {
  grossValue: number;
  costBasis: number;
  unrealizedGain: number;
  gainPct: number;
  estimatedTax: number;
  netValue: number;
  taxRatePct: number;
}

export const calculatePortfolioNet = (
  marketValue: number,
  costBasis?: number,
  taxRate = 0.25
): TaxCalculationResult => {
  const basis = costBasis && costBasis > 0 ? costBasis : 0;
  const gain = basis > 0 && marketValue > basis ? marketValue - basis : 0;
  const gainPct = basis > 0 ? (gain / basis) * 100 : 0;
  const estimatedTax = Math.round(gain * taxRate);
  const netValue = marketValue - estimatedTax;

  return {
    grossValue: marketValue,
    costBasis: basis,
    unrealizedGain: gain,
    gainPct,
    estimatedTax,
    netValue,
    taxRatePct: Math.round(taxRate * 100),
  };
};