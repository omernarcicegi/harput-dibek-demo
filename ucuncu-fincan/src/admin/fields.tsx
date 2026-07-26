// Admin panelinde tekrar eden form parçaları.
// Etiketler her zaman görünür (yer tutucu etiket yerine geçmez).

import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {/* Hata alanın hemen altında; sayfa başında toplu liste değil. */}
      {error && (
        <p role="alert" className="text-xs font-semibold text-accent">
          {error}
        </p>
      )}
    </div>
  );
}

const CONTROL_CLASS =
  'min-h-11 w-full rounded-xl border border-line bg-page px-3 py-2 text-base text-ink ' +
  'placeholder:text-muted/70 focus:border-accent focus:outline-none';

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${CONTROL_CLASS} ${props.className ?? ''}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${CONTROL_CLASS} ${props.className ?? ''}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${CONTROL_CLASS} ${props.className ?? ''}`} />;
}

type ButtonVariant = 'primary' | 'secondary' | 'danger';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent shadow-md',
  secondary: 'border border-line bg-surface text-ink',
  danger: 'border border-accent bg-page text-accent',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'secondary', className = '', ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      // min-h-11 + min-w-11: dokunma hedefi en az 44x44 px
      className={`press inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold disabled:opacity-40 ${BUTTON_VARIANTS[variant]} ${className}`}
    />
  );
}

/** Sadece ikon içeren küçük düğme; erişilebilir ad zorunlu. */
export function IconButton({
  label,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...rest}
      className="press flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-page text-ink disabled:opacity-30"
    >
      {children}
    </button>
  );
}
