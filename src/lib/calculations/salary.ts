import type { CalculationResult } from './types';

export interface SalaryBreakdown {
  basic: number;
  hra: number;
  specialAllowance: number;
  employerPf: number;
  gratuity: number;
  employeePf: number;
  professionalTax: number;
  monthlyInHand: number;
  annualInHand: number;
}

export function calculateCtcToInHand(
  annualCtc: number,
  basicPercent: number = 40,
  hraPercent: number = 40,
  professionalTaxMonthly: number = 200
): CalculationResult<SalaryBreakdown> {
  if (![annualCtc, basicPercent, hraPercent, professionalTaxMonthly].every(Number.isFinite)) {
    return { success: false, error: 'Invalid input values.' };
  }
  if (annualCtc <= 0) return { success: false, error: 'CTC must be greater than zero.' };
  if (basicPercent <= 0 || basicPercent > 100) return { success: false, error: 'Basic % must be between 1 and 100.' };
  if (hraPercent < 0 || hraPercent > 100) return { success: false, error: 'HRA % must be between 0 and 100.' };

  const basic = (annualCtc * basicPercent) / 100;
  const hra = (basic * hraPercent) / 100;
  const pfBase = Math.min(basic, 180000); // ₹15,000/month cap
  const employerPf = pfBase * 0.12;
  const gratuity = basic * 0.0481;
  const specialAllowance = annualCtc - basic - hra - employerPf - gratuity;

  if (specialAllowance < 0) {
    return { success: false, error: 'Basic + HRA + statutory components exceed CTC. Reduce Basic or HRA %.' };
  }

  const employeePf = pfBase * 0.12;
  const annualProfessionalTax = professionalTaxMonthly * 12;
  const annualDeductions = employeePf + annualProfessionalTax;
  const annualInHand = annualCtc - employerPf - gratuity - annualDeductions;

  return {
    success: true,
    value: {
      basic,
      hra,
      specialAllowance,
      employerPf,
      gratuity,
      employeePf,
      professionalTax: annualProfessionalTax,
      monthlyInHand: annualInHand / 12,
      annualInHand,
    },
  };
}
