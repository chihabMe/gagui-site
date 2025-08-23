import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Site Description",
      type: "text",
    }),
    defineField({
      name: "contactInfo",
      title: "Contact Information",
      type: "object",
      fields: [
        defineField({
          name: "email",
          title: "Email",
          type: "string",
          validation: (Rule) => Rule.email(),
        }),
        defineField({
          name: "phone",
          title: "Phone",
          type: "string",
        }),
        defineField({
          name: "whatsapp",
          title: "WhatsApp",
          type: "string",
        }),
        defineField({
          name: "address",
          title: "Address",
          type: "text",
        }),
        defineField({
          name: "socialLinks",
          title: "Social Links",
          type: "object",
          fields: [
            defineField({
              name: "facebook",
              title: "Facebook",
              type: "url",
            }),
            defineField({
              name: "twitter",
              title: "Twitter",
              type: "url",
            }),
            defineField({
              name: "instagram",
              title: "Instagram",
              type: "url",
            }),
            defineField({
              name: "youtube",
              title: "YouTube",
              type: "url",
            }),
            defineField({
              name: "telegram",
              title: "Telegram",
              type: "url",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "businessHours",
      title: "Business Hours",
      type: "object",
      fields: [
        defineField({
          name: "monday",
          title: "Monday",
          type: "string",
        }),
        defineField({
          name: "tuesday",
          title: "Tuesday",
          type: "string",
        }),
        defineField({
          name: "wednesday",
          title: "Wednesday",
          type: "string",
        }),
        defineField({
          name: "thursday",
          title: "Thursday",
          type: "string",
        }),
        defineField({
          name: "friday",
          title: "Friday",
          type: "string",
        }),
        defineField({
          name: "saturday",
          title: "Saturday",
          type: "string",
        }),
        defineField({
          name: "sunday",
          title: "Sunday",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare(selection: { title?: string }) {
      const { title } = selection;
      return {
        title: title || "Site Settings",
      };
    },
  },
});
