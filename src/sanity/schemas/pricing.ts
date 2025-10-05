import { defineField, defineType } from "sanity";

export default defineType({
  name: "pricing",
  title: "Pricing Plans",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Plan Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Plan Description",
      type: "text",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "object",
      fields: [
        defineField({
          name: "amount",
          title: "Amount",
          type: "number",
          validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
          name: "currency",
          title: "Currency",
          type: "string",
          options: {
            list: [
              { title: "Euro (€)", value: "EUR" },
              { title: "US Dollar ($)", value: "USD" },
              { title: "Dirham (DH)", value: "MAD" },
              { title: "British Pound (£)", value: "GBP" },
            ],
          },
          initialValue: "EUR",
        }),
        defineField({
          name: "period",
          title: "Billing Period",
          type: "string",
          options: {
            list: [
              { title: "Monthly", value: "monthly" },
              { title: "Quarterly", value: "quarterly" },
              { title: "Yearly", value: "yearly" },
              { title: "Lifetime", value: "lifetime" },
            ],
          },
          initialValue: "monthly",
        }),
      ],
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "feature",
              title: "Feature",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "included",
              title: "Included",
              type: "boolean",
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              title: "feature",
              included: "included",
            },
            prepare(selection: { title?: string; included?: boolean }) {
              const { title, included } = selection;
              return {
                title: title || "Feature",
                subtitle: included ? "✓ Included" : "✗ Not included",
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "isPopular",
      title: "Popular Plan",
      type: "boolean",
      description: "Mark this plan as popular/recommended",
      initialValue: false,
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Show this plan on the website",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Order in which this plan appears (lower numbers first)",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "ctaText",
      title: "Call to Action Text",
      type: "string",
      description: "Text for the subscription button",
      initialValue: "S'abonner",
    }),
    defineField({
      name: "ctaUrl",
      title: "Call to Action URL",
      type: "url",
      description: "Link for the subscription button",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "price.amount",
      currency: "price.currency",
      period: "price.period",
      isPopular: "isPopular",
    },
    prepare(selection: {
      title?: string;
      subtitle?: number;
      currency?: string;
      period?: string;
      isPopular?: boolean;
    }) {
      const { title, subtitle, currency, period, isPopular } = selection;
      const price = subtitle ? `${subtitle} ${currency}/${period}` : "";
      return {
        title: title || "Pricing Plan",
        subtitle: `${price}${isPopular ? " (Popular)" : ""}`,
      };
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Price, Low to High",
      name: "priceAsc",
      by: [{ field: "price.amount", direction: "asc" }],
    },
    {
      title: "Price, High to Low",
      name: "priceDesc",
      by: [{ field: "price.amount", direction: "desc" }],
    },
  ],
});
