"use client";
import { usePostHog as usePostHogBase } from "posthog-js/react";

/**
 * Custom hook to access PostHog instance with type safety
 * Usage:
 * ```tsx
 * const posthog = usePostHog();
 * posthog?.capture('event_name', { property: 'value' });
 * ```
 */
export function usePostHog() {
  return usePostHogBase();
}

/**
 * Hook to identify users in PostHog
 * Usage:
 * ```tsx
 * const identify = usePostHogIdentify();
 * identify('user_id', { email: 'user@example.com', name: 'User Name' });
 * ```
 */
export function usePostHogIdentify() {
  const posthog = usePostHogBase();

  return (userId: string, properties?: Record<string, unknown>) => {
    if (posthog) {
      posthog.identify(userId, properties);
    }
  };
}

/**
 * Hook to capture events in PostHog
 * Usage:
 * ```tsx
 * const capture = usePostHogCapture();
 * capture('button_clicked', { button_name: 'Subscribe' });
 * ```
 */
export function usePostHogCapture() {
  const posthog = usePostHogBase();

  return (eventName: string, properties?: Record<string, unknown>) => {
    if (posthog) {
      posthog.capture(eventName, properties);
    }
  };
}
