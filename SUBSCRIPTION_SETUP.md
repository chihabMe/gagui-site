# Subscription System Setup

## Required Dependencies

Install the following dependencies:

```bash
pnpm add @radix-ui/react-dialog @radix-ui/react-label class-variance-authority zod @sanity/client
```

## Environment Variables

Add to your `.env.local` file:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token_here

# WhatsApp Configuration
WHATSAPP_BUSINESS_NUMBER=+212123456789
```

## Sanity Setup

1. Add the subscription-request schema to your Sanity schemas
2. Update your `src/sanity/schema.ts` to include the subscription request schema
3. Deploy the schema changes to your Sanity Studio
4. Generate a write token in your Sanity project settings

## Features

✅ Modal-based subscription form
✅ Form validation with error handling
✅ Data storage in Sanity CMS
✅ WhatsApp integration with pre-populated message
✅ Responsive design with animations
✅ TypeScript support
✅ Server actions for secure data handling

## Usage

The subscription system is automatically integrated into the PricingSection component. When users click on any pricing plan button, a modal will open asking for their information, then redirect them to WhatsApp with a pre-filled message.

## Customization

- Update WhatsApp number in environment variables
- Modify the WhatsApp message template in `src/actions/subscription.ts`
- Customize form fields in `src/components/SubscriptionModal.tsx`
- Adjust validation rules in the subscription action
