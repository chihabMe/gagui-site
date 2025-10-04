# Revalidation Setup Guide

This guide explains how to set up automatic content revalidation when you update content in Sanity CMS.

## How It Works

The system uses **Next.js Tag-based Revalidation** to efficiently update cached content:

1. **Content is cached** for 1 hour (3600 seconds) with specific tags
2. **When you call the revalidation endpoint**, it clears the cache for all tags
3. **Next request** fetches fresh data from Sanity

## Revalidation Tags

The following tags are used in the system:

- `posts` - Blog posts
- `testimonials` - Customer testimonials
- `faq` - FAQ items
- `pricing` - Pricing plans
- `site-settings` - Site configuration
- `categories` - Blog categories
- `authors` - Blog authors
- `newsletter` - Newsletter subscriptions
- `contact` - Contact form submissions

## Setup Instructions

### 1. Configure Environment Variable

Add this to your `.env.local` file:

```bash
SANITY_REVALIDATE_SECRET=your-secure-random-token-here
```

**Generate a secure token:**

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

### 2. Test the Revalidation Endpoint

#### Manual Testing (GET Request)

```bash
# Local development
curl "http://localhost:3000/api/revalidate?token=your-secure-random-token-here"

# Production
curl "https://yourdomain.com/api/revalidate?token=your-secure-random-token-here"
```

**Expected Response:**

```json
{
  "revalidated": true,
  "tags": [
    "posts",
    "testimonials",
    "faq",
    "pricing",
    "site-settings",
    "categories",
    "authors",
    "newsletter",
    "contact"
  ],
  "timestamp": 1704384000000,
  "message": "All content tags revalidated successfully"
}
```

### 3. Configure Sanity Webhook (Optional)

To automatically revalidate when content changes in Sanity:

1. Go to [Sanity Manage Console](https://www.sanity.io/manage)
2. Select your project
3. Navigate to **API** → **Webhooks**
4. Click **Create Webhook**

**Webhook Configuration:**

- **Name**: `Production Revalidation`
- **URL**: `https://yourdomain.com/api/revalidate?token=YOUR_SECRET_TOKEN`
- **Dataset**: `production`
- **Trigger on**: `Create`, `Update`, `Delete`
- **Filter**: Leave empty to trigger on all content types
- **HTTP method**: `GET`

### 4. Testing After Content Updates

1. Update pricing in Sanity Studio (e.g., change a price)
2. Call the revalidation endpoint (manually or wait for webhook)
3. Refresh your homepage
4. Verify the new pricing is displayed

## Troubleshooting

### Changes Not Appearing

**Check cache headers:**

```bash
curl -I https://yourdomain.com/
```

Look for `x-nextjs-cache` header:

- `HIT` - Served from cache (old content)
- `MISS` - Fresh fetch (new content)

**Force clear cache:**

```bash
# Delete .next cache folder
rm -rf .next

# Rebuild
pnpm build
pnpm start
```

### 401 Unauthorized Error

- Verify `SANITY_REVALIDATE_SECRET` is set in `.env.local`
- Ensure the token in the URL matches the environment variable
- Check there are no extra spaces in the token

### Webhook Not Triggering

1. Check webhook logs in Sanity dashboard
2. Verify the webhook URL is correct
3. Ensure your production site is accessible (not in maintenance mode)
4. Check webhook filter doesn't exclude content types

## Development vs Production

### Development (localhost)

- Revalidation works but changes may not be immediately visible due to Fast Refresh
- Use hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- Consider disabling cache for development:

```typescript
// src/app/page.tsx (development only)
export const dynamic = "force-dynamic"; // Disable caching
```

### Production (Vercel/other)

- Revalidation works as expected
- Cache is served from CDN
- Revalidation clears CDN cache

## Cache Strategy

All Sanity data fetching uses:

```typescript
{
  next: {
    revalidate: 3600, // 1 hour cache
    tags: ['pricing'] // Revalidation tag
  }
}
```

This provides:

- ✅ Fast page loads (cached for 1 hour)
- ✅ Fresh content when needed (via revalidation)
- ✅ Reduced Sanity API calls
- ✅ Lower costs

## Security Notes

- **Never commit** `.env.local` to version control
- Use **different tokens** for development and production
- Rotate tokens periodically
- Keep `SANITY_REVALIDATE_SECRET` private

## Additional Resources

- [Next.js Revalidation Docs](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)
- [Sanity Webhooks Guide](https://www.sanity.io/docs/webhooks)
- [Next.js Cache Tags](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
