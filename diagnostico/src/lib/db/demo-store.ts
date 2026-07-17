import "server-only";
import { mkdirSync, readFileSync, writeFileSync, existsSync, unlinkSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import type {
  AnalyticsEventRecord,
  AssessmentImageRecord,
  AssessmentRecord,
  LeadRecord,
  PaymentRecord,
} from "./types";

/**
 * Store do DEMO_MODE: persistência em JSON local (.demo-data/).
 * Mesma interface que a implementação Supabase terá — troca transparente.
 * NUNCA usar em produção.
 */

export type AppSettings = {
  fullReportPriceCents?: number;
  bookingUrl?: string;
  whatsappNumber?: string;
  imageRetentionDays?: number;
  checkoutEnabled?: boolean;
};

type StoreData = {
  leads: LeadRecord[];
  assessments: AssessmentRecord[];
  images: AssessmentImageRecord[];
  payments: PaymentRecord[];
  events: AnalyticsEventRecord[];
  settings: AppSettings;
};

const DATA_DIR = join(process.cwd(), ".demo-data");
const DATA_FILE = join(DATA_DIR, "store.json");
export const DEMO_UPLOADS_DIR = join(DATA_DIR, "uploads");

function emptyData(): StoreData {
  return { leads: [], assessments: [], images: [], payments: [], events: [], settings: {} };
}

class DemoStore {
  private data: StoreData;

  constructor() {
    mkdirSync(DEMO_UPLOADS_DIR, { recursive: true });
    if (existsSync(DATA_FILE)) {
      try {
        this.data = JSON.parse(readFileSync(DATA_FILE, "utf8")) as StoreData;
        this.data.settings ??= {}; // compatibilidade com store.json anterior a esta chave
      } catch {
        this.data = emptyData();
      }
    } else {
      this.data = emptyData();
    }
  }

  private persist() {
    writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2));
  }

  private now() {
    return new Date().toISOString();
  }

  // ── leads ────────────────────────────────────────────────
  createLead(input: Omit<LeadRecord, "id" | "createdAt" | "updatedAt">): LeadRecord {
    const lead: LeadRecord = {
      ...input,
      id: randomUUID(),
      createdAt: this.now(),
      updatedAt: this.now(),
    };
    this.data.leads.push(lead);
    this.persist();
    return lead;
  }

  getLead(id: string): LeadRecord | undefined {
    return this.data.leads.find((l) => l.id === id);
  }

  updateLead(id: string, patch: Partial<LeadRecord>): LeadRecord | undefined {
    const lead = this.getLead(id);
    if (!lead) return undefined;
    Object.assign(lead, patch, { updatedAt: this.now() });
    this.persist();
    return lead;
  }

  listLeads(): LeadRecord[] {
    return [...this.data.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  // ── assessments ──────────────────────────────────────────
  createAssessment(
    input: Omit<AssessmentRecord, "id" | "createdAt" | "updatedAt">,
  ): AssessmentRecord {
    const assessment: AssessmentRecord = {
      ...input,
      id: randomUUID(),
      createdAt: this.now(),
      updatedAt: this.now(),
    };
    this.data.assessments.push(assessment);
    this.persist();
    return assessment;
  }

  getAssessmentByToken(token: string): AssessmentRecord | undefined {
    return this.data.assessments.find((a) => a.publicToken === token);
  }

  getAssessment(id: string): AssessmentRecord | undefined {
    return this.data.assessments.find((a) => a.id === id);
  }

  updateAssessment(id: string, patch: Partial<AssessmentRecord>): AssessmentRecord | undefined {
    const assessment = this.getAssessment(id);
    if (!assessment) return undefined;
    Object.assign(assessment, patch, { updatedAt: this.now() });
    this.persist();
    return assessment;
  }

  listAssessments(): AssessmentRecord[] {
    return [...this.data.assessments].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  // ── images ───────────────────────────────────────────────
  createImage(input: Omit<AssessmentImageRecord, "id" | "createdAt">): AssessmentImageRecord {
    const image: AssessmentImageRecord = {
      ...input,
      id: randomUUID(),
      createdAt: this.now(),
    };
    this.data.images.push(image);
    this.persist();
    return image;
  }

  getImageByAssessment(assessmentId: string): AssessmentImageRecord | undefined {
    return this.data.images.find((i) => i.assessmentId === assessmentId && !i.deletedAt);
  }

  findImageByHash(hash: string): AssessmentImageRecord | undefined {
    return this.data.images.find((i) => i.hashSha256 === hash && !i.deletedAt);
  }

  updateImage(id: string, patch: Partial<AssessmentImageRecord>): AssessmentImageRecord | undefined {
    const image = this.data.images.find((i) => i.id === id);
    if (!image) return undefined;
    Object.assign(image, patch);
    this.persist();
    return image;
  }

  // ── payments ─────────────────────────────────────────────
  createPayment(input: Omit<PaymentRecord, "id" | "createdAt" | "updatedAt">): PaymentRecord {
    const payment: PaymentRecord = {
      ...input,
      id: randomUUID(),
      createdAt: this.now(),
      updatedAt: this.now(),
    };
    this.data.payments.push(payment);
    this.persist();
    return payment;
  }

  getPaymentByExternalId(provider: string, externalId: string): PaymentRecord | undefined {
    return this.data.payments.find(
      (p) => p.provider === provider && p.externalId === externalId,
    );
  }

  getPaymentsByAssessment(assessmentId: string): PaymentRecord[] {
    return this.data.payments.filter((p) => p.assessmentId === assessmentId);
  }

  updatePayment(id: string, patch: Partial<PaymentRecord>): PaymentRecord | undefined {
    const payment = this.data.payments.find((p) => p.id === id);
    if (!payment) return undefined;
    Object.assign(payment, patch, { updatedAt: this.now() });
    this.persist();
    return payment;
  }

  listPayments(): PaymentRecord[] {
    return [...this.data.payments].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  // ── events ───────────────────────────────────────────────
  recordEvent(input: Omit<AnalyticsEventRecord, "id" | "createdAt">): AnalyticsEventRecord {
    const event: AnalyticsEventRecord = {
      ...input,
      id: randomUUID(),
      createdAt: this.now(),
    };
    this.data.events.push(event);
    this.persist();
    return event;
  }

  listEvents(): AnalyticsEventRecord[] {
    return [...this.data.events];
  }

  // ── settings ─────────────────────────────────────────────
  getSettings(): AppSettings {
    return { ...this.data.settings };
  }

  updateSettings(patch: AppSettings): AppSettings {
    this.data.settings = { ...this.data.settings, ...patch };
    this.persist();
    return this.getSettings();
  }

  // ── imagens: exclusão administrativa ────────────────────
  deleteImage(assessmentId: string): void {
    const image = this.getImageByAssessment(assessmentId);
    if (!image) return;
    try {
      unlinkSync(image.storagePath);
    } catch {
      // arquivo já pode ter sido removido
    }
    this.updateImage(image.id, { deletedAt: this.now() });
  }
}

// Singleton sobrevive ao HMR do dev server
const globalStore = globalThis as unknown as { __demoStore?: DemoStore };

export function getDemoStore(): DemoStore {
  if (!globalStore.__demoStore) globalStore.__demoStore = new DemoStore();
  return globalStore.__demoStore;
}

export type { DemoStore };
