export function formatNumber(num: number, maxFractionDigits = 4): string {
  if (!Number.isFinite(num)) return 'Invalid';
  if (Math.abs(num) >= 1e21 || (Math.abs(num) < 1e-6 && num !== 0)) {
    return num.toExponential(2);
  }
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxFractionDigits,
    minimumFractionDigits: 0,
  }).format(num);
}
