import { BrandLogo } from "@/components/ui/BrandLogo";

export default function DiagnosticoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-8">
      <header className="mb-10">
        <BrandLogo />
      </header>
      {children}
    </div>
  );
}
