import type { CalculationResult } from './types';

export interface DiscountResult { saved: number; finalPrice: number; }

export function calculateDiscount(originalPrice: number, discountPercent: number): CalculationResult<DiscountResult> {
  if (!Number.isFinite(originalPrice) || !Number.isFinite(discountPercent)) return { success: false, error: 'Invalid input values.' };
  if (originalPrice < 0) return { success: false, error: 'Price cannot be negative.' };
  if (discountPercent < 0 || discountPercent > 100) return { success: false, error: 'Discount must be between 0 and 100.' };
  const saved = originalPrice * (discountPercent / 100);
  return { success: true, value: { saved, finalPrice: originalPrice - saved } };
}

export interface SimpleInterestResult { interest: number; total: number; }

export function calculateSimpleInterest(principal: number, annualRatePercent: number, years: number): CalculationResult<SimpleInterestResult> {
  if (!Number.isFinite(principal) || !Number.isFinite(annualRatePercent) || !Number.isFinite(years)) return { success: false, error: 'Invalid input values.' };
  if (principal < 0) return { success: false, error: 'Principal cannot be negative.' };
  if (annualRatePercent < 0) return { success: false, error: 'Rate cannot be negative.' };
  if (years < 0) return { success: false, error: 'Time cannot be negative.' };
  const interest = (principal * annualRatePercent * years) / 100;
  return { success: true, value: { interest, total: principal + interest } };
}

export interface CompoundInterestResult { amount: number; interest: number; }

export function calculateCompoundInterest(
  principal: number,
  annualRatePercent: number,
  years: number,
  compoundsPerYear: number
): CalculationResult<CompoundInterestResult> {
  if (!Number.isFinite(principal) || !Number.isFinite(annualRatePercent) || !Number.isFinite(years) || !Number.isFinite(compoundsPerYear)) {
    return { success: false, error: 'Invalid input values.' };
  }
  if (principal < 0) return { success: false, error: 'Principal cannot be negative.' };
  if (annualRatePercent < 0) return { success: false, error: 'Rate cannot be negative.' };
  if (years < 0) return { success: false, error: 'Time cannot be negative.' };
  if (!Number.isInteger(compoundsPerYear) || compoundsPerYear < 1) {
    return { success: false, error: 'Compounding frequency must be at least 1 per year.' };
  }
  const r = annualRatePercent / 100;
  const amount = principal * Math.pow(1 + r / compoundsPerYear, compoundsPerYear * years);
  return { success: true, value: { amount, interest: amount - principal } };
}

export interface EmiResult { emi: number; totalPayment: number; totalInterest: number; }

export function calculateEmi(principal: number, annualRatePercent: number, months: number): CalculationResult<EmiResult> {
  if (!Number.isFinite(principal) || !Number.isFinite(annualRatePercent) || !Number.isFinite(months)) return { success: false, error: 'Invalid input values.' };
  if (principal <= 0) return { success: false, error: 'Loan amount must be greater than zero.' };
  if (annualRatePercent < 0) return { success: false, error: 'Rate cannot be negative.' };
  if (!Number.isInteger(months) || months < 1) return { success: false, error: 'Tenure must be at least 1 month.' };
  const r = annualRatePercent / 100 / 12;
  let emi: number;
  if (r === 0) {
    emi = principal / months;
  } else {
    const factor = Math.pow(1 + r, months);
    emi = (principal * r * factor) / (factor - 1);
  }
  const totalPayment = emi * months;
  return { success: true, value: { emi, totalPayment, totalInterest: totalPayment - principal } };
}

export interface TipResult { tip: number; total: number; perPerson: number; }

export function calculateTip(bill: number, tipPercent: number, people: number): CalculationResult<TipResult> {
  if (!Number.isFinite(bill) || !Number.isFinite(tipPercent) || !Number.isFinite(people)) return { success: false, error: 'Invalid input values.' };
  if (bill < 0) return { success: false, error: 'Bill cannot be negative.' };
  if (tipPercent < 0 || tipPercent > 500) return { success: false, error: 'Tip must be between 0 and 500.' };
  if (!Number.isInteger(people) || people < 1) return { success: false, error: 'People must be at least 1.' };
  const tip = bill * (tipPercent / 100);
  const total = bill + tip;
  return { success: true, value: { tip, total, perPerson: total / people } };
}

export interface TaxResult { base: number; tax: number; total: number; }

export function calculateTax(amount: number, taxPercent: number, mode: 'add' | 'extract'): CalculationResult<TaxResult> {
  if (!Number.isFinite(amount) || !Number.isFinite(taxPercent)) return { success: false, error: 'Invalid input values.' };
  if (amount < 0) return { success: false, error: 'Amount cannot be negative.' };
  if (taxPercent < 0 || taxPercent > 100) return { success: false, error: 'Tax rate must be between 0 and 100.' };
  if (mode === 'add') {
    const tax = amount * (taxPercent / 100);
    return { success: true, value: { base: amount, tax, total: amount + tax } };
  }
  const base = amount / (1 + taxPercent / 100);
  return { success: true, value: { base, tax: amount - base, total: amount } };
}
