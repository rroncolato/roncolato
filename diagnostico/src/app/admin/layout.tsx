import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

const NAV = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/diagnosticos", label: "Diagnósticos" },
  { href: "/admin/pagamentos", label: "Pagamentos" },
  { href: "/admin/configuracoes", label: "Configurações" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <nav className="flex flex-wrap gap-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs uppercase tracking-[0.15em] text-ink-muted transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <AdminLogoutButton />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
