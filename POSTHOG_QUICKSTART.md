# PostHog Quick Start Guide

Get PostHog session replay up and running in 5 minutes!

## Step 1: Get Your PostHog Credentials

1. Go to [PostHog](https://posthog.com) and sign up or log in
2. Create a new project (if you don't have one)
3. Navigate to **Project Settings** → **Project Variables**
4. Copy your:
   - **Project API Key** (starts with `phc_`)
   - **Instance Address** (e.g., `https://us.i.posthog.com`)

## Step 2: Update Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values:

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_YOUR_ACTUAL_KEY_HERE
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

**Note:** If `.env.local` doesn't exist, copy from `.env.example`:

```bash
cp .env.example .env.local
```

## Step 3: Enable Session Recording in PostHog

1. In your PostHog project, go to **Settings**
2. Click on **Session Replay**
3. Toggle **Enable session replay** to ON
4. Save your settings

## Step 4: Start Your Dev Server

```bash
pnpm dev
```

## Step 5: Test It!

1. Open your browser to `http://localhost:3000`
2. Click around, navigate between pages
3. Go to your PostHog dashboard → **Session Replay**
4. You should see your session recording! (may take 30-60 seconds to appear)

## ✅ You're Done!

PostHog is now tracking:

- ✅ Page views
- ✅ User sessions
- ✅ Button clicks (on tracked components)
- ✅ Form submissions (on tracked forms)
- ✅ Session recordings

## Next Steps

### 1. Track Custom Events

Add tracking to important buttons:

```tsx
import { usePostHogCapture } from "@/hooks/use-posthog";

function MyButton() {
  const capture = usePostHogCapture();

  return (
    <button onClick={() => capture("button_clicked", { name: "my_button" })}>
      Click Me
    </button>
  );
}
```

### 2. Identify Users

When users subscribe or log in:

```tsx
import { usePostHogIdentify } from "@/hooks/use-posthog";

function handleSubscribe(userId: string, email: string) {
  const identify = usePostHogIdentify();
  identify(userId, { email, plan: "premium" });
}
```

### 3. Protect Sensitive Data

Add `ph-no-capture` class to sensitive elements:

```tsx
<div className="ph-no-capture">Credit card info won't be recorded</div>
```

## Troubleshooting

### No recordings showing up?

1. **Check environment variables**: Make sure `NEXT_PUBLIC_POSTHOG_KEY` is set correctly
2. **Check browser console**: Look for PostHog initialization messages or errors
3. **Wait a minute**: Recordings can take 30-60 seconds to process
4. **Check project settings**: Ensure session recording is enabled in PostHog

### Verify PostHog is loaded:

Open browser console and type:

```javascript
window.posthog;
```

You should see the PostHog object. If it's `undefined`, check your environment variables.

### Enable debug mode:

Add this temporarily to see what PostHog is doing:

```tsx
// In PostHogProvider.tsx
posthog.init(posthogKey, {
  api_host: posthogHost,
  // ... other options
  debug: true, // Add this line
});
```

## Learn More

- 📚 [Full Setup Guide](./POSTHOG_SETUP.md)
- 💡 [Tracking Examples](./POSTHOG_EXAMPLES.md)
- 🌐 [PostHog Documentation](https://posthog.com/docs)
- 🎥 [Session Replay Docs](https://posthog.com/docs/session-replay)

## Common Use Cases

### Track subscription clicks:

Already implemented in `SubscriptionModal.tsx`! Events tracked:

- `subscription_modal_opened`
- `subscription_modal_submitted`
- `subscription_success`
- `subscription_error`

### Track channel views:

```tsx
capture("channel_viewed", {
  channel_id: channel.id,
  channel_name: channel.name,
});
```

### Track video plays:

```tsx
capture("video_played", {
  channel_id: channelId,
  timestamp: currentTime,
});
```

---

**Need Help?** Check the [PostHog Community](https://posthog.com/questions) or [GitHub Issues](https://github.com/PostHog/posthog/issues)
