import type { ReactNode } from 'react';

type FormFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mono?: boolean;
};

export function FormField({ label, value, onChange, placeholder, mono }: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${
          mono ? 'font-mono' : ''
        }`}
      />
    </label>
  );
}

type FormSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

export function FormSelect({ label, value, options, onChange }: FormSelectProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">—</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

type FormTextareaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
};

export function FormTextarea({ label, value, onChange, rows = 4 }: FormTextareaProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-500">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />
    </label>
  );
}

type FormCheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

export function FormCheckbox({ label, checked, onChange }: FormCheckboxProps) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-zinc-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-2 focus:ring-indigo-100"
      />
      {label}
    </label>
  );
}

type FormActionsProps = {
  primaryLabel: string;
  secondaryLabel: string;
  onSecondary: () => void;
  disabled?: boolean;
};

export function FormActions({
  primaryLabel,
  secondaryLabel,
  onSecondary,
  disabled,
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button
        type="button"
        onClick={onSecondary}
        disabled={disabled}
        className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {secondaryLabel}
      </button>
      <button
        type="submit"
        disabled={disabled}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {primaryLabel}
      </button>
    </div>
  );
}

type FormErrorProps = {
  children: ReactNode;
};

export function FormError({ children }: FormErrorProps) {
  return <p className="text-sm text-red-600">{children}</p>;
}

type FormStepProps = {
  current: number;
  total: number;
  hint?: string;
};

export function FormStep({ current, total, hint }: FormStepProps) {
  return (
    <p className="text-xs font-medium text-zinc-500">
      Passo {current} de {total}
      {hint ? ` · ${hint}` : ''}
    </p>
  );
}
