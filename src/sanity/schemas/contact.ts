import { defineField, defineType } from "sanity";

export default defineType({
  name: "contact",
  title: "Contact Message",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "subject",
      title: "Subject",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      validation: (Rule) => Rule.required().min(10),
    }),
    defineField({
      name: "isRead",
      title: "Is Read",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "In Progress", value: "in-progress" },
          { title: "Replied", value: "replied" },
          { title: "Closed", value: "closed" },
        ],
      },
      initialValue: "new",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "subject",
    },
    prepare(selection: { title?: string; subtitle?: string }) {
      const { title, subtitle } = selection;
      return {
        title: title || "Unknown Contact",
        subtitle: subtitle || "No subject",
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
      title: "Submitted Date, Old",
      name: "submittedAtAsc",
      by: [{ field: "submittedAt", direction: "asc" }],
    },
  ],
});
