# Dynamic Content Setup for Production

## Overview

This document explains the changes made to ensure that content from Sanity CMS is dynamically loaded in production and updates automatically when content is changed in the studio.

## 🔧 Changes Made

### 1. Disabled CDN Caching

- **File**: `src/sanity/client.ts`
- **Change**: Set `useCdn: false` to ensure fresh content instead of cached responses
- **Impact**: All Sanity queries now fetch the latest data directly from the API

### 2. Force Dynamic Rendering

- **Files**: All page components (`src/app/page.tsx`, `src/app/channels/page.tsx`, `src/app/contact/page.tsx`)
- **Change**: Added `export const dynamic = 'force-dynamic'` and `export const revalidate = 0`
- **Impact**: Pages are rendered on each request instead of being statically generated

### 3. Server-Side Data Fetching

- **File**: `src/app/page.tsx`
- **Change**: Moved blog post fetching to server-side and pass data as props to components
- **Impact**: BlogSection now receives fresh data on each page load

### 4. Updated BlogSection Component

- **File**: `src/components/BlogSection.tsx`
- **Change**: Converted from client-side fetching to props-based rendering
- **Impact**: Eliminates additional client-side API calls and ensures fresh content

### 5. No-Cache Fetch Options

- **File**: `src/sanity/utils.ts`
- **Change**: Added `{ cache: 'no-store', next: { revalidate: 0 } }` to all fetch calls
- **Impact**: Prevents Next.js from caching Sanity responses

### 6. Webhook Revalidation API

- **File**: `src/app/api/revalidate/route.ts` (new)
- **Purpose**: Receives webhooks from Sanity to trigger revalidation when content changes
- **Security**: Protected with webhook secret authentication

## 🚀 Access Sanity Studio

1. Start your development server:

   ```bash
   pnpm dev
   ```

2. Open Sanity Studio in your browser:
   ```
   http://localhost:3000/studio
   ```

## 📝 Setting Up Content

### 1. Site Settings (Contact Information)

1. In Sanity Studio, go to **IPTV Site** → **Site Settings**
2. Create a new document with:
   - **Site Title**: "IPTV Pro" (or your preferred name)
   - **Description**: Your site description
   - **Contact Info**:
     - Email: your-email@example.com
     - Phone: +33 1 23 45 67 89
     - WhatsApp: +33 6 12 34 56 78
     - Address: Your business address
     - Social Links:
       - Facebook: https://facebook.com/yourpage
       - Instagram: https://instagram.com/yourpage
       - YouTube: https://youtube.com/yourchannel
       - etc.
   - **Business Hours**: Set hours for each day

### 2. Pricing Plans

1. Go to **IPTV Site** → **Pricing Plans**
2. Create pricing plans with:

#### Example Plan 1 - Free Trial:

- **Name**: "Essai Gratuit"
- **Description**: "Testez notre service gratuitement"
- **Price**:
  - Amount: 0
  - Currency: EUR
  - Period: monthly
- **Features**:
  - ✓ 1000+ chaînes
  - ✓ Qualité HD
  - ✓ 1 appareil
  - ✓ Accès limité 24h
- **Specifications**:
  - Channels: "1000+"
  - Quality: "HD"
  - Devices: "1"
  - Support: "Email Only"
- **Display Order**: 1
- **Active**: ✓
- **Popular**: ✗
- **CTA Text**: "Essayer gratuitement"
- **CTA URL**: https://wa.me/1234567890 (your WhatsApp link)

#### Example Plan 2 - Premium:

- **Name**: "Premium"
- **Description**: "Le plus populaire"
- **Price**:
  - Amount: 55
  - Currency: EUR
  - Period: yearly
- **Features**:
  - ✓ 10000+ chaînes
  - ✓ Qualité HD/4K
  - ✓ 3 appareils simultanés
  - ✓ Support prioritaire
  - ✓ Films et séries
- **Specifications**:
  - Channels: "10000+"
  - Quality: "4K"
  - Devices: "3"
  - Support: "24/7"
- **Display Order**: 2
- **Active**: ✓
- **Popular**: ✓ (mark as popular)
- **CTA Text**: "S'abonner"
- **CTA URL**: https://wa.me/1234567890

## 🔧 How It Works

### Fallback System

- If no pricing plans are found in Sanity, the site will show fallback static plans
- If no site settings are found, it will show default contact info
- This ensures your site always works, even during initial setup

### Dynamic Updates

- Changes in Sanity Studio appear immediately on your website
- No code changes needed for pricing or contact updates
- Content is fetched at build time for optimal performance

## 📊 Content Management

### For Blog (Existing)

- **Blog** → **Posts**: Manage blog articles
- **Blog** → **Authors**: Manage authors
- **Blog** → **Categories**: Manage categories

### For IPTV Site (New)

- **IPTV Site** → **Site Settings**: Contact info, social links
- **IPTV Site** → **Pricing Plans**: Dynamic pricing
- **IPTV Site** → **Contact Messages**: Contact form submissions
- **IPTV Site** → **Newsletter Subscribers**: Email subscriptions

## 🎯 Pro Tips

1. **Test Your Changes**: Always preview changes in Sanity before publishing
2. **SEO**: Fill out meta descriptions and titles in site settings
3. **Images**: Add product images to pricing plans for better visual appeal
4. **Validation**: Sanity will validate required fields automatically
5. **Backup**: Export your content regularly from Sanity Studio

## 🆘 Troubleshooting

If you don't see your content:

1. Check if the document is published in Sanity
2. Verify the content is marked as "Active"
3. Clear your browser cache
4. Check the browser console for any errors

Your website now uses:

- ✅ Dynamic contact information from Sanity
- ✅ Dynamic pricing plans from Sanity
- ✅ Dynamic FAQ content from Sanity
- ✅ Dynamic customer testimonials from Sanity
- ✅ Organized content structure for both IPTV site and blog
- ✅ Fallback content if Sanity data is not available
- ✅ Type-safe TypeScript interfaces

## 📋 FAQ Management

### Adding FAQ Items:

1. Go to **Content** → **FAQ** in Sanity Studio
2. Click **Create new FAQ**
3. Fill in:
   - **Question**: The customer question
   - **Answer**: Detailed answer (supports rich text)
   - **Category**: Choose from General, Technical, Billing, Installation, Troubleshooting
   - **Order**: Number for display ordering (lower = appears first)
   - **Tags**: Optional tags for future filtering

### FAQ Categories:

- **General**: Basic service questions
- **Technical**: Setup and technical support
- **Billing**: Payment and subscription questions
- **Installation**: Setup instructions
- **Troubleshooting**: Problem resolution

## ⭐ Testimonials Management

### Adding Customer Testimonials:

1. Go to **Content** → **Testimonials** in Sanity Studio
2. Click **Create new Testimonial**
3. Fill in:
   - **Customer Name**: Full customer name
   - **Location**: City, Country (optional)
   - **Avatar**: Customer photo (optional - will use emoji fallback)
   - **Testimonial**: Customer review text (10-500 characters)
   - **Rating**: 1-5 star rating
   - **Plan**: Which subscription plan they use (optional)
   - **Platform**: Which device/platform they use (optional)
   - **Is Featured**: Check to show on homepage
   - **Is Active**: Must be checked for testimonial to appear
   - **Order**: Display order (lower numbers appear first)

### Testimonial Display:

- Featured testimonials appear on the main page
- All active testimonials can be displayed on dedicated testimonials page
- Automatic emoji avatars based on customer name if no photo provided
- Star ratings displayed visually
- Responsive card layout with hover effects

## 🔄 Data Flow

1. **Server-Side Fetching**: Main page fetches all content at build time
2. **Component Props**: Data passed to relevant components
3. **Fallback System**: Default content shown if Sanity unavailable
4. **Type Safety**: Full TypeScript support ensures data integrity

## 📁 Updated File Structure

```
src/
├── sanity/
│   ├── schemas/
│   │   ├── siteSettings.ts    # Contact info, social links
│   │   ├── pricing.ts         # Pricing plans
│   │   ├── faq.ts            # FAQ items ✨ NEW
│   │   └── testimonial.ts    # Customer testimonials ✨ NEW
│   ├── queries.ts            # All GROQ queries
│   ├── utils.ts              # API helper functions
│   └── types.ts              # TypeScript interfaces
├── components/
│   ├── Footer.tsx            # Dynamic contact info
│   ├── PricingSection.tsx    # Dynamic pricing
│   ├── FAQSection.tsx        # Dynamic FAQ ✨ UPDATED
│   └── Testimonials.tsx      # Dynamic testimonials ✨ UPDATED
└── app/
    └── page.tsx              # Fetches all dynamic content
```
