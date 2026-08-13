export type CalculationResult<T> = {
  success: boolean;
  value?: T;
  error?: string;
};
