import { defineField, defineType } from "sanity";

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "General", value: "general" },
          { title: "Technical", value: "technical" },
          { title: "Billing", value: "billing" },
          { title: "Installation", value: "installation" },
          { title: "Troubleshooting", value: "troubleshooting" },
        ],
      },
      initialValue: "general",
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Show this FAQ on the website",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Order in which this FAQ appears (lower numbers first)",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Tags for searching and filtering",
    }),
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "category",
      order: "order",
    },
    prepare(selection: { title?: string; subtitle?: string; order?: number }) {
      const { title, subtitle, order } = selection;
      return {
        title: title || "FAQ Question",
        subtitle: `${subtitle || "general"} - Order: ${order || 0}`,
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
      title: "Category",
      name: "categoryAsc",
      by: [{ field: "category", direction: "asc" }],
    },
  ],
});
