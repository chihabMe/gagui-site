import { defineField, defineType } from "sanity";

export default defineType({
  name: "newsletter",
  title: "Newsletter Subscriber",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "isActive",
      title: "Active Subscription",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "source",
      title: "Subscription Source",
      type: "string",
      options: {
        list: [
          { title: "Website", value: "website" },
          { title: "Blog Post", value: "blog_post" },
          { title: "Social Media", value: "social_media" },
          { title: "Direct", value: "direct" },
        ],
      },
      initialValue: "website",
    }),
  ],
  preview: {
    select: {
      title: "email",
      subtitle: "subscribedAt",
      media: "isActive",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || "No email",
        subtitle: subtitle
          ? `Subscribed: ${new Date(subtitle).toLocaleDateString()}`
          : "No date",
        description: media ? "Active subscription" : "Inactive subscription",
      };
    },
  },
});
