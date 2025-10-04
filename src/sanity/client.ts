import { createClient } from "@sanity/client";

// Debug: Log Sanity configuration
const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  hasToken: !!process.env.SANITY_API_TOKEN,
  tokenLength: process.env.SANITY_API_TOKEN?.length || 0,
};

console.log("🔍 Sanity Client Configuration:", sanityConfig);

if (!sanityConfig.projectId) {
  console.error("❌ ERROR: NEXT_PUBLIC_SANITY_PROJECT_ID is not defined!");
}
if (!sanityConfig.dataset) {
  console.error("❌ ERROR: NEXT_PUBLIC_SANITY_DATASET is not defined!");
}

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false, // Set to false for real-time updates
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN, // Required for write operations
});

export const clientRead = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false, // Use CDN for read operations
  apiVersion: "2024-01-01",
});

// Debug: Log client instances
console.log("✅ Sanity clients created:", {
  clientProjectId: client.config().projectId,
  clientDataset: client.config().dataset,
  clientReadProjectId: clientRead.config().projectId,
  clientReadDataset: clientRead.config().dataset,
});
