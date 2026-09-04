import { useState, useCallback } from 'react';

export type FormField = {
  id: string;
  label: string;
  type?: 'text' | 'number' | 'select' | 'color';
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  defaultValue?: string | number;
  min?: number;
  max?: number;
  step?: number;
};

export type CalculatorFormProps = {
  fields: FormField[];
  onSubmit: (values: Record<string, string>) => void;
  onReset?: () => void;
  calculateLabel?: string;
  resetLabel?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function CalculatorForm({
  fields,
  onSubmit,
  onReset,
  calculateLabel = 'Calculate',
  resetLabel = 'Reset',
  children,
  className = '',
}: CalculatorFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach((field) => {
      initial[field.id] = field.defaultValue?.toString() || '';
    });
    return initial;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  }, [errors]);

  const handleSubmit = useCallback(() => {
    onSubmit(values);
  }, [onSubmit, values]);

  const handleReset = useCallback(() => {
    const reset: Record<string, string> = {};
    fields.forEach((field) => {
      reset[field.id] = field.defaultValue?.toString() || '';
    });
    setValues(reset);
    setErrors({});
    onReset?.();
  }, [fields, onReset]);

  return (
    <div className={`rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20 ${className}`}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="mb-1 block text-sm font-medium">
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                id={field.id}
                value={values[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="field"
              >
                <option value="">Select...</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'color' ? (
              <input
                type="color"
                id={field.id}
                value={values[field.id] || '#1B2430'}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="h-10 w-full cursor-pointer rounded-md border border-ink/10"
              />
            ) : (
              <input
                id={field.id}
                type={field.type || 'text'}
                inputMode={field.type === 'number' ? 'decimal' : undefined}
                value={values[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                min={field.min}
                max={field.max}
                step={field.step}
                className={'field' + (errors[field.id] ? ' field-invalid' : '')}
              />
            )}
            {errors[field.id] && <p className="err-text">{errors[field.id]}</p>}
          </div>
        ))}
      </div>

      {children}

      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleSubmit} className="btn-filled">
          {calculateLabel}
        </button>
        {onReset && (
          <button onClick={handleReset} className="btn-text">
            {resetLabel}
          </button>
        )}
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {Object.keys(errors).length > 0 ? 'Form has errors' : 'Form submitted'}
      </div>
    </div>
  );
}
