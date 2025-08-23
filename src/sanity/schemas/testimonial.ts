import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonials",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "City, Country or just Country",
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "testimonial",
      title: "Testimonial",
      type: "text",
      validation: (Rule) => Rule.required().min(10).max(500),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5),
      options: {
        list: [
          { title: "⭐ 1 Star", value: 1 },
          { title: "⭐⭐ 2 Stars", value: 2 },
          { title: "⭐⭐⭐ 3 Stars", value: 3 },
          { title: "⭐⭐⭐⭐ 4 Stars", value: 4 },
          { title: "⭐⭐⭐⭐⭐ 5 Stars", value: 5 },
        ],
      },
      initialValue: 5,
    }),
    defineField({
      name: "plan",
      title: "Subscription Plan",
      type: "string",
      options: {
        list: [
          { title: "Free Trial", value: "free" },
          { title: "Basic", value: "basic" },
          { title: "Premium", value: "premium" },
          { title: "VIP", value: "vip" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Show this testimonial on the website",
      initialValue: true,
    }),
    defineField({
      name: "isFeatured",
      title: "Featured",
      type: "boolean",
      description: "Feature this testimonial prominently",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description:
        "Order in which this testimonial appears (lower numbers first)",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "platform",
      title: "Platform Used",
      type: "string",
      options: {
        list: [
          { title: "Android TV", value: "android_tv" },
          { title: "Smart TV", value: "smart_tv" },
          { title: "iOS", value: "ios" },
          { title: "Android", value: "android" },
          { title: "Windows", value: "windows" },
          { title: "Mac", value: "mac" },
          { title: "Fire TV", value: "fire_tv" },
          { title: "Other", value: "other" },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "testimonial",
      rating: "rating",
      featured: "isFeatured",
    },
    prepare(selection: {
      title?: string;
      subtitle?: string;
      rating?: number;
      featured?: boolean;
    }) {
      const { title, subtitle, rating, featured } = selection;
      const stars = "⭐".repeat(rating || 0);
      return {
        title: `${title || "Customer"}${featured ? " (Featured)" : ""}`,
        subtitle: `${stars} - ${subtitle?.slice(0, 60) || "No testimonial"}${
          subtitle && subtitle.length > 60 ? "..." : ""
        }`,
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
      title: "Rating, High to Low",
      name: "ratingDesc",
      by: [{ field: "rating", direction: "desc" }],
    },
    {
      title: "Submitted Date, New",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
});
