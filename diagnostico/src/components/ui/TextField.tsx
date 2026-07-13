"use client";

import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

type BaseProps = {
  label: string;
  error?: string;
  optional?: boolean;
};

const fieldClass =
  "w-full min-h-[48px] bg-surface border border-line px-4 py-3 text-ink placeholder:text-ink-muted/50 focus:border-accent focus:outline-none transition-colors";

export function TextField({
  label,
  error,
  optional,
  ...props
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm tracking-wide text-ink-muted">
        {label}
        {optional && <span className="ml-2 text-xs opacity-60">opcional</span>}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={fieldClass}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextAreaField({
  label,
  error,
  optional,
  ...props
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm tracking-wide text-ink-muted">
        {label}
        {optional && <span className="ml-2 text-xs opacity-60">opcional</span>}
      </label>
      <textarea
        id={id}
        rows={4}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={fieldClass}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
