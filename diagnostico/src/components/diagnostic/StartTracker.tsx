"use client";

import { useEffect } from "react";
import { sendEvent } from "@/lib/journey-client";

export function StartTracker() {
  useEffect(() => {
    sendEvent("diagnostic_started");
  }, []);
  return null;
}
