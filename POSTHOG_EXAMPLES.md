# PostHog Tracking Examples

This document provides practical examples of how to use PostHog tracking throughout the application.

## Basic Event Tracking

### Track Button Clicks

```tsx
"use client";
import { usePostHogCapture } from "@/hooks/use-posthog";

export function SubscribeButton() {
  const capture = usePostHogCapture();

  const handleClick = () => {
    capture("subscribe_button_clicked", {
      location: "hero_section",
      plan: "premium",
      timestamp: new Date().toISOString(),
    });
  };

  return <button onClick={handleClick}>S'abonner</button>;
}
```

### Track Form Interactions

```tsx
"use client";
import { usePostHogCapture } from "@/hooks/use-posthog";
import { useState } from "react";

export function ContactForm() {
  const capture = usePostHogCapture();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleFieldFocus = (fieldName: string) => {
    setFocusedField(fieldName);
    capture("form_field_focused", {
      form: "contact",
      field: fieldName,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    capture("contact_form_submitted", {
      fields_filled: ["name", "email", "message"].length,
    });

    // Submit form...
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" onFocus={() => handleFieldFocus("name")} />
      {/* ... other fields */}
    </form>
  );
}
```

## User Identification

### Identify User After Subscription

```tsx
"use client";
import { usePostHogIdentify } from "@/hooks/use-posthog";

export function useSubscription() {
  const identify = usePostHogIdentify();

  const completeSubscription = async (data: {
    userId: string;
    email: string;
    plan: string;
  }) => {
    // Complete subscription logic...

    // Identify user in PostHog
    identify(data.userId, {
      email: data.email,
      plan: data.plan,
      subscription_date: new Date().toISOString(),
      user_type: "subscriber",
    });
  };

  return { completeSubscription };
}
```

## Page-Specific Tracking

### Track Video Player Events

```tsx
"use client";
import { usePostHogCapture } from "@/hooks/use-posthog";
import { useEffect, useRef } from "react";

export function VideoPlayer({ channelId }: { channelId: string }) {
  const capture = usePostHogCapture();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      capture("video_played", {
        channel_id: channelId,
        timestamp: video.currentTime,
      });
    };

    const handlePause = () => {
      capture("video_paused", {
        channel_id: channelId,
        timestamp: video.currentTime,
        watch_duration: video.currentTime,
      });
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [channelId, capture]);

  return <video ref={videoRef} controls />;
}
```

### Track Pricing Plan Views

```tsx
"use client";
import { usePostHogCapture } from "@/hooks/use-posthog";
import { useEffect } from "react";

export function PricingCard({ plan }: { plan: any }) {
  const capture = usePostHogCapture();

  useEffect(() => {
    // Track when plan comes into view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          capture("pricing_plan_viewed", {
            plan_id: plan.id,
            plan_name: plan.name,
            plan_price: plan.price.amount,
          });
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`plan-${plan.id}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [plan, capture]);

  return <div id={`plan-${plan.id}`}>{/* Plan content */}</div>;
}
```

## Advanced Tracking

### Track User Journey

```tsx
"use client";
import { usePostHogCapture } from "@/hooks/use-posthog";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function UserJourneyTracker() {
  const capture = usePostHogCapture();
  const pathname = usePathname();
  const previousPath = useRef<string>("");
  const entryTime = useRef<number>(Date.now());

  useEffect(() => {
    // Track time spent on previous page
    if (previousPath.current) {
      const timeSpent = Date.now() - entryTime.current;
      capture("page_time_spent", {
        path: previousPath.current,
        duration_ms: timeSpent,
        next_path: pathname,
      });
    }

    previousPath.current = pathname;
    entryTime.current = Date.now();
  }, [pathname, capture]);

  return null;
}
```

### Track Feature Usage

```tsx
"use client";
import { usePostHog } from "@/hooks/use-posthog";
import { useEffect } from "react";

export function ChannelFilter() {
  const posthog = usePostHog();

  const handleFilterChange = (filterType: string, value: string) => {
    posthog?.capture("channel_filter_used", {
      filter_type: filterType,
      filter_value: value,
      $set: {
        // Set user properties
        last_filter_used: filterType,
        filter_usage_count: "$increment",
      },
    });
  };

  return (
    <div>
      <select onChange={(e) => handleFilterChange("category", e.target.value)}>
        {/* Categories */}
      </select>
    </div>
  );
}
```

## Session Recording Controls

### Disable Recording on Sensitive Pages

```tsx
"use client";
import { usePostHog } from "@/hooks/use-posthog";
import { useEffect } from "react";

export default function PaymentPage() {
  const posthog = usePostHog();

  useEffect(() => {
    // Stop recording on payment page
    posthog?.stopSessionRecording();

    return () => {
      // Resume recording when leaving
      posthog?.startSessionRecording();
    };
  }, [posthog]);

  return <div>{/* Payment form - won't be recorded */}</div>;
}
```

### Mask Sensitive Elements

```tsx
export function PaymentForm() {
  return (
    <form>
      {/* Regular field - will be recorded but masked */}
      <input type="text" name="name" />

      {/* Credit card - extra privacy */}
      <div className="ph-no-capture">
        <input type="text" name="card" placeholder="Card Number" />
        <input type="text" name="cvv" placeholder="CVV" />
      </div>
    </form>
  );
}
```

## Error Tracking

```tsx
"use client";
import { usePostHogCapture } from "@/hooks/use-posthog";

export function useErrorTracking() {
  const capture = usePostHogCapture();

  const trackError = (error: Error, context?: Record<string, any>) => {
    capture("error_occurred", {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      ...context,
    });
  };

  return { trackError };
}

// Usage
function MyComponent() {
  const { trackError } = useErrorTracking();

  try {
    // Some risky operation
  } catch (error) {
    trackError(error as Error, {
      component: "MyComponent",
      action: "data_fetch",
    });
  }
}
```

## A/B Testing with Feature Flags

```tsx
"use client";
import { usePostHog } from "@/hooks/use-posthog";
import { useEffect, useState } from "react";

export function PricingSection() {
  const posthog = usePostHog();
  const [showNewPricing, setShowNewPricing] = useState(false);

  useEffect(() => {
    if (posthog) {
      const variant = posthog.getFeatureFlag("new-pricing-design");
      setShowNewPricing(variant === "test");

      // Track which variant user sees
      posthog.capture("pricing_variant_shown", {
        variant: variant || "control",
      });
    }
  }, [posthog]);

  return showNewPricing ? <NewPricing /> : <OldPricing />;
}
```

## Tips

1. **Be Consistent**: Use consistent naming conventions for events (e.g., `noun_verb` format)
2. **Add Context**: Include relevant context with each event (page, section, user state)
3. **Don't Over-Track**: Focus on meaningful user actions, not every interaction
4. **Protect Privacy**: Always mask sensitive data and disable recording on payment/auth pages
5. **Test Tracking**: Use PostHog's debug mode to verify events are being sent correctly

```tsx
// Enable debug mode
posthog.debug();
```
