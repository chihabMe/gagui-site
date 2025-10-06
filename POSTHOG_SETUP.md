# PostHog Session Replay Setup

## Overview

This project uses PostHog for session replay and analytics. Session replay allows you to record user sessions and watch how real users interact with your IPTV website.

## Setup

### 1. Environment Variables

The PostHog configuration is stored in `.env.local`:

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_NZjSo0qdp1CRW6bbGerq6dRHCyXzhrZZBD194fKs6Hp
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

**Important:** Replace these values with your actual PostHog project credentials from your [PostHog project settings](https://us.i.posthog.com/settings/project).

### 2. Components

#### PostHogProvider (`src/components/PostHogProvider.tsx`)

- Initializes PostHog on the client side
- Wraps the app to provide PostHog context
- Configures session recording with privacy controls

#### PostHogPageView (`src/components/PostHogPageView.tsx`)

- Automatically tracks page views
- Captures route changes in Next.js App Router

### 3. Integration

PostHog is integrated in `src/components/Providers.tsx` and wraps all other providers.

## Usage

### Basic Event Tracking

```tsx
"use client";
import { usePostHogCapture } from "@/hooks/use-posthog";

export function SubscribeButton() {
  const capture = usePostHogCapture();

  const handleClick = () => {
    capture("subscribe_button_clicked", {
      plan: "premium",
      location: "pricing_section",
    });
  };

  return <button onClick={handleClick}>S'abonner</button>;
}
```

### User Identification

When a user subscribes or logs in, identify them:

```tsx
"use client";
import { usePostHogIdentify } from "@/hooks/use-posthog";

export function LoginComponent() {
  const identify = usePostHogIdentify();

  const handleLogin = (userId: string, email: string) => {
    identify(userId, {
      email,
      plan: "premium",
      subscription_date: new Date().toISOString(),
    });
  };

  return <form onSubmit={handleLogin}>...</form>;
}
```

### Direct PostHog Access

For advanced usage:

```tsx
"use client";
import { usePostHog } from "@/hooks/use-posthog";

export function AdvancedComponent() {
  const posthog = usePostHog();

  useEffect(() => {
    // Feature flags
    if (posthog?.getFeatureFlag("new-pricing") === "test") {
      // Show new pricing
    }

    // Custom events
    posthog?.capture("custom_event", { property: "value" });

    // Session recording control
    posthog?.startSessionRecording();
    posthog?.stopSessionRecording();
  }, [posthog]);
}
```

## Privacy Controls

### Masking Sensitive Data

By default, all input fields are masked. To mask additional elements, add the `ph-no-capture` class:

```tsx
<div className="ph-no-capture">
  Sensitive information like credit card numbers
</div>
```

### Disable Recording on Specific Pages

If you need to disable recording on certain pages (e.g., payment pages):

```tsx
"use client";
import { usePostHog } from "@/hooks/use-posthog";
import { useEffect } from "react";

export default function PaymentPage() {
  const posthog = usePostHog();

  useEffect(() => {
    // Stop recording on this page
    posthog?.stopSessionRecording();

    return () => {
      // Resume recording when leaving
      posthog?.startSessionRecording();
    };
  }, [posthog]);

  return <div>Payment form...</div>;
}
```

## Configuration Options

Current PostHog configuration in `PostHogProvider.tsx`:

- `person_profiles: 'identified_only'` - Only create profiles for identified users
- `capture_pageview: false` - Manual pageview tracking via `PostHogPageView`
- `capture_pageleave: true` - Track when users leave pages
- `disable_session_recording: false` - Enable session recording
- `session_recording.maskAllInputs: true` - Mask all input fields
- `session_recording.maskTextSelector: '.ph-no-capture'` - Custom mask selector

## Viewing Session Replays

1. Go to your PostHog dashboard at https://us.i.posthog.com
2. Navigate to "Session Replay" in the sidebar
3. Filter and watch recorded sessions
4. Analyze user behavior and identify issues

## Best Practices

1. **Always mask sensitive data**: Use `ph-no-capture` class on sensitive elements
2. **Identify users**: Call `identify()` when users subscribe or log in
3. **Track key events**: Capture important actions like subscriptions, contact form submissions
4. **Respect privacy**: Disable recording on payment/sensitive pages
5. **Monitor performance**: Session recording adds minimal overhead but monitor initial impact

## Troubleshooting

### Session Replays Not Showing

1. Check that PostHog is initialized:

   ```tsx
   const posthog = usePostHog();
   console.log("PostHog loaded:", !!posthog);
   ```

2. Verify environment variables are set correctly

3. Check browser console for PostHog errors

4. Ensure session recording is enabled in your PostHog project settings

### Custom Fonts Not Loading

If custom fonts don't appear in recordings, make sure your font files are served with proper CORS headers.

## Resources

- [PostHog Documentation](https://posthog.com/docs)
- [Session Replay Docs](https://posthog.com/docs/session-replay)
- [Privacy Controls](https://posthog.com/docs/session-replay/privacy)
- [Next.js Integration](https://posthog.com/docs/libraries/next-js)
