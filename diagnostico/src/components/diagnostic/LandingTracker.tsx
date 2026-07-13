"use client";

import { useEffect } from "react";
import { sendEvent } from "@/lib/journey-client";

export function LandingTracker() {
  useEffect(() => {
    sendEvent("landing_view");
  }, []);
  return null;
}
