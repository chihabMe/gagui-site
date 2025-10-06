"use client";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize PostHog only on the client side
    if (typeof window !== "undefined") {
      const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

      if (posthogKey && posthogHost) {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          person_profiles: "identified_only", // Only track identified users
          capture_pageview: false, // We'll manually capture pageviews
          capture_pageleave: true, // Capture when users leave pages
          disable_session_recording: false, // Enable session recording
          session_recording: {
            // Session recording configuration
            maskAllInputs: true, // Mask all input fields by default
            maskTextSelector: ".ph-no-capture", // Custom class to mask sensitive data
          },
        });
      }
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
