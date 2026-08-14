export type NumberParseResult = {
  valid: boolean;
  num?: number;
  error?: string;
};

export function parseAndValidateNumber(value: string): NumberParseResult {
  if (!value || value.trim() === '') {
    return { valid: false, error: 'Enter a value to continue.' };
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    return { valid: false, error: 'Enter a number, like 12 or 4.5.' };
  }
  if (!Number.isFinite(num)) {
    return { valid: false, error: 'That number is too large to calculate.' };
  }
  return { valid: true, num };
}
