"use client";

/** Opção selecionável (radio/checkbox visual) acessível por teclado. */
export function OptionCard({
  selected,
  onToggle,
  title,
  description,
  disabled,
}: {
  selected: boolean;
  onToggle: () => void;
  title: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      disabled={disabled}
      onClick={onToggle}
      className={`w-full min-h-[48px] border px-5 py-4 text-left transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
        selected
          ? "border-accent bg-surface text-ink"
          : "border-line bg-transparent text-ink-muted hover:border-ink-muted"
      }`}
    >
      <span className={`block font-display text-sm tracking-wide ${selected ? "text-accent" : ""}`}>
        {title}
      </span>
      {description && <span className="mt-1 block text-sm opacity-80">{description}</span>}
    </button>
  );
}
