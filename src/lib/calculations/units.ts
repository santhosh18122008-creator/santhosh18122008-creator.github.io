import type { CalculationResult } from './types';

export const LENGTH_UNITS = ['m', 'cm', 'km', 'in', 'ft', 'mi'] as const;
export const MASS_UNITS = ['kg', 'g', 'lb', 'oz'] as const;
export const TEMP_UNITS = ['C', 'F', 'K'] as const;

export type LengthUnit = (typeof LENGTH_UNITS)[number];
export type MassUnit = (typeof MASS_UNITS)[number];
export type TempUnit = (typeof TEMP_UNITS)[number];

// Base unit: meters
const LENGTH_TO_METERS: Record<LengthUnit, number> = {
  m: 1,
  cm: 0.01,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  mi: 1609.344,
};

// Base unit: kilograms
const MASS_TO_KG: Record<MassUnit, number> = {
  kg: 1,
  g: 0.001,
  lb: 0.45359237,
  oz: 0.028349523125,
};

export function convertLength(value: number, from: LengthUnit, to: LengthUnit): CalculationResult<number> {
  if (!Number.isFinite(value)) return { success: false, error: 'Invalid input value.' };
  const meters = value * LENGTH_TO_METERS[from];
  return { success: true, value: meters / LENGTH_TO_METERS[to] };
}

export function convertMass(value: number, from: MassUnit, to: MassUnit): CalculationResult<number> {
  if (!Number.isFinite(value)) return { success: false, error: 'Invalid input value.' };
  const kg = value * MASS_TO_KG[from];
  return { success: true, value: kg / MASS_TO_KG[to] };
}

function toCelsius(value: number, from: TempUnit): number {
  if (from === 'C') return value;
  if (from === 'F') return ((value - 32) * 5) / 9;
  if (from === 'K') return value - 273.15;
  return NaN;
}

function celsiusTo(value: number, to: TempUnit): number {
  if (to === 'C') return value;
  if (to === 'F') return (value * 9) / 5 + 32;
  if (to === 'K') return value + 273.15;
  return NaN;
}

export function convertTemperature(value: number, from: TempUnit, to: TempUnit): CalculationResult<number> {
  if (!Number.isFinite(value)) return { success: false, error: 'Invalid input value.' };
  return { success: true, value: celsiusTo(toCelsius(value, from), to) };
}
