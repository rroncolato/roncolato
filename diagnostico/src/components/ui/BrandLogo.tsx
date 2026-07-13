import Link from "next/link";

export function BrandLogo() {
  return (
    <Link href="/" className="inline-block font-display tracking-[0.25em] text-ink">
      <span className="text-sm uppercase">Estúdio</span>{" "}
      <span className="text-sm uppercase text-accent">Roncolato</span>
    </Link>
  );
}
