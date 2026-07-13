import type { DiagnosticResult } from "@/lib/schemas/diagnostic-result";
import type { QuestionnaireInput } from "@/lib/schemas/questionnaire";
import type { LeadTemperature } from "@/lib/leadscore";

export type AssessmentStatus =
  | "draft"
  | "answering"
  | "photo_pending"
  | "processing"
  | "free_ready"
  | "paid"
  | "failed"
  | "deleted";

export type LeadRecord = {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  company?: string;
  role?: string;
  segment?: string;
  instagram?: string;
  linkedin?: string;
  city?: string;
  contactOrigin?: string;
  utm: Record<string, string | undefined>;
  consentContact: boolean;
  consentMarketing: boolean;
  score: number;
  temperature: LeadTemperature;
  anonymizedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type AssessmentRecord = {
  id: string;
  leadId: string;
  publicToken: string;
  status: AssessmentStatus;
  answers?: QuestionnaireInput;
  desiredArchetypes: string[];
  overallScore?: number;
  result?: DiagnosticResult;
  aiProvider?: string;
  aiModel?: string;
  promptVersion?: string;
  processedAt?: string;
  releasedAt?: string;
  failureReason?: "no_face" | "multiple_people" | "provider_error";
  createdAt: string;
  updatedAt: string;
};

export type AssessmentImageRecord = {
  id: string;
  assessmentId: string;
  storagePath: string;
  mimeType: string;
  width: number;
  height: number;
  sizeBytes: number;
  hashSha256: string;
  consentAnalysis: boolean;
  consentPortfolio: boolean;
  retentionUntil: string;
  createdAt: string;
  deletedAt?: string;
};

export type PaymentRecord = {
  id: string;
  assessmentId: string;
  provider: string;
  externalId?: string;
  amountCents: number;
  currency: string;
  status: "pending" | "approved" | "rejected" | "refunded" | "cancelled";
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type AnalyticsEventRecord = {
  id: string;
  assessmentId?: string;
  leadId?: string;
  eventName: string;
  payload: Record<string, unknown>;
  sessionId?: string;
  source?: string;
  createdAt: string;
};
