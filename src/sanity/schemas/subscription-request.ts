import { defineField, defineType } from "sanity";

export const subscriptionRequest = defineType({
  name: "subscriptionRequest",
  title: "Subscription Request",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (rule) => rule.required().min(2).max(100),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      validation: (rule) => rule.required().min(8).max(20),
    }),
    defineField({
      name: "selectedPlan",
      title: "Selected Plan",
      type: "reference",
      to: [{ type: "pricing" }],
      validation: (rule) => rule.required(),
      weak: true,
    }),
    defineField({
      name: "planName",
      title: "Plan Name",
      type: "string",
      description: "Fallback for plan name if reference is not available",
    }),
    defineField({
      name: "planPrice",
      title: "Plan Price",
      type: "object",
      fields: [
        defineField({
          name: "amount",
          title: "Amount",
          type: "number",
        }),
        defineField({
          name: "currency",
          title: "Currency",
          type: "string",
        }),
        defineField({
          name: "period",
          title: "Period",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "En attente", value: "pending" },
          { title: "Contacté", value: "contacted" },
          { title: "Converti", value: "converted" },
          { title: "Annulé", value: "cancelled" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      description: "Internal notes for follow-up",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      media: "planName",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Unnamed Subscriber",
        subtitle: `${subtitle} - Plan: ${media}`,
      };
    },
  },
  orderings: [
    {
      title: "Submitted Date, New",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
    {
      title: "Name A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
});
