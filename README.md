This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- 🎬 **IPTV Service Website** - Modern landing page for IPTV subscription service
- 🎨 **Sanity CMS Integration** - Content management for pricing, channels, and blog posts
- 📊 **PostHog Analytics** - Session replay and user behavior tracking
- 🌙 **Dark/Light Mode** - Theme switching with persistent preferences
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- 🎭 **Animations** - Smooth animations with Motion (Framer Motion)
- 📧 **Contact Form** - WhatsApp integration for customer support

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd gagui-iptv
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset (usually "production")
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host URL
- `SANITY_API_TOKEN` - Sanity API token with write access
- `SANITY_REVALIDATE_SECRET` - Secret for revalidation webhooks

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

````
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   └── ...          # Feature components
│   ├── hooks/           # Custom React hooks
│   ├── contexts/        # React contexts (Theme, etc.)
│   ├── sanity/          # Sanity CMS configuration
│   ├── actions/         # Server actions
│   └── lib/             # Utility functions
├── public/              # Static assets
└── ...

## Analytics & Tracking

This project uses **PostHog** for session replay and analytics. See [POSTHOG_SETUP.md](./POSTHOG_SETUP.md) for detailed configuration and usage.

### Quick Usage

```tsx
import { usePostHogCapture } from '@/hooks/use-posthog';

function MyComponent() {
  const capture = usePostHogCapture();

  const handleClick = () => {
    capture('button_clicked', { button_name: 'Subscribe' });
  };

  return <button onClick={handleClick}>Subscribe</button>;
}
````

## CMS Setup

This project uses Sanity CMS for content management. See the following guides:

- [SANITY_SETUP.md](./SANITY_SETUP.md) - Initial Sanity setup
- [DYNAMIC_CONTENT_SETUP.md](./DYNAMIC_CONTENT_SETUP.md) - Dynamic content configuration
- [REVALIDATION_SETUP.md](./REVALIDATION_SETUP.md) - Webhook revalidation setup

## Deployment

### Environment Variables

Make sure to set all required environment variables in your deployment platform:

- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Build & Deploy → Environment

### PostHog Setup

1. Go to [PostHog](https://posthog.com) and create a project
2. Copy your project API key from Project Settings
3. Add `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to your environment variables
4. Enable session recording in PostHog project settings

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# gagui-site
