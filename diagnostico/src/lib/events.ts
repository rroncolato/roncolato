import "server-only";
import { getStore } from "@/lib/db";

export const FUNNEL_EVENTS = [
  "landing_view",
  "diagnostic_started",
  "lead_submitted",
  "questionnaire_started",
  "questionnaire_completed",
  "photo_selected",
  "photo_uploaded",
  "analysis_started",
  "analysis_completed",
  "analysis_failed",
  "free_result_viewed",
  "checkout_started",
  "payment_pending",
  "payment_approved",
  "payment_failed",
  "full_report_viewed",
  "booking_clicked",
  "whatsapp_clicked",
  "deletion_requested",
] as const;

export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];

export function trackEvent(
  eventName: FunnelEvent,
  opts: {
    assessmentId?: string;
    leadId?: string;
    payload?: Record<string, unknown>;
    sessionId?: string;
    source?: string;
  } = {},
): void {
  try {
    getStore().recordEvent({
      eventName,
      assessmentId: opts.assessmentId,
      leadId: opts.leadId,
      payload: opts.payload ?? {},
      sessionId: opts.sessionId,
      source: opts.source,
    });
  } catch {
    // Analytics nunca derruba o fluxo principal.
  }
}
