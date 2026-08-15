import type { CalculationResult } from './types';

export interface CurrencyRates { base: string; date: string; rates: Record<string, number>; }

export async function fetchRates(): Promise<CurrencyRates> {
  const cached = localStorage.getItem('md-currency-rates');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      const oneDay = 24 * 60 * 60 * 1000;
      if (Date.now() - parsed.fetchedAt < oneDay) return parsed.data;
    } catch (e) { /* ignore corrupt cache */ }
  }
  const res = await fetch('https://open.er-api.com/v6/latest/USD');
  if (!res.ok) throw new Error('Failed to fetch rates');
  const json = await res.json();
  const data: CurrencyRates = { base: json.base_code, date: json.time_last_update_utc, rates: json.rates };
  localStorage.setItem('md-currency-rates', JSON.stringify({ data, fetchedAt: Date.now() }));
  return data;
}

export function convertCurrency(
  amount: number, from: string, to: string, rates: Record<string, number>
): CalculationResult<number> {
  if (!Number.isFinite(amount)) return { success: false, error: 'Invalid amount.' };
  if (amount < 0) return { success: false, error: 'Amount cannot be negative.' };
  
  const fromRate = from === 'USD' ? 1 : rates[from];
  const toRate = to === 'USD' ? 1 : rates[to];
  
  if (!fromRate || !toRate) return { success: false, error: 'Unsupported currency.' };
  const usd = amount / fromRate;
  return { success: true, value: usd * toRate };
}
