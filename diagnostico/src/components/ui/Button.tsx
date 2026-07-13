import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost";

const styles: Record<Variant, string> = {
  primary:
    "bg-accent text-primary hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-ink border border-line hover:border-accent disabled:opacity-40",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex min-h-[48px] items-center justify-center px-8 py-3 font-display text-sm tracking-[0.12em] uppercase transition-colors duration-300 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
