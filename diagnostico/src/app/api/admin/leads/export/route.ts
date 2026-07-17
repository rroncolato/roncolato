import { NextResponse, type NextRequest } from "next/server";
import { getStore } from "@/lib/db";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

const HEADERS = [
  "nome", "email", "whatsapp", "empresa", "cargo", "segmento",
  "temperatura", "score", "origem", "cidade", "data",
] as const;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const temperatura = searchParams.get("temperatura") ?? "";

  const store = getStore();
  let leads = store.listLeads();

  if (q) {
    leads = leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.company ?? "").toLowerCase().includes(q),
    );
  }
  if (temperatura) leads = leads.filter((l) => l.temperature === temperatura);

  const rows = leads.map((l) =>
    [
      l.name, l.email, l.whatsapp, l.company ?? "", l.role ?? "", l.segment ?? "",
      l.temperature, String(l.score), l.utm.utm_source ?? "", l.city ?? "",
      new Date(l.createdAt).toLocaleDateString("pt-BR"),
    ]
      .map(csvEscape)
      .join(","),
  );

  const csv = [HEADERS.join(","), ...rows].join("\n");

  store.recordAudit({
    action: "exported",
    entityType: "lead",
    detail: { count: leads.length, filters: { q, temperatura } },
  });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${Date.now()}.csv"`,
    },
  });
}
