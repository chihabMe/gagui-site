import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "xwvmvdty",
  dataset: "production",
  apiVersion: "2024-01-01", // Use current date
  useCdn: false, // Disable CDN to ensure fresh content
  token: process.env.SANITY_API_TOKEN, // Add token for write operations
  perspective: "published", // Only fetch published content
  stega: {
    enabled: false,
  },
});
