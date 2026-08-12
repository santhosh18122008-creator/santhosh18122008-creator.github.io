export type NumberParseResult = {
  valid: boolean;
  num?: number;
  error?: string;
};

export function parseAndValidateNumber(value: string): NumberParseResult {
  if (!value || value.trim() === '') {
    return { valid: false, error: 'This field is required.' };
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    return { valid: false, error: 'Please enter a valid number.' };
  }
  if (!Number.isFinite(num)) {
    return { valid: false, error: 'The number is too large.' };
  }
  return { valid: true, num };
}
