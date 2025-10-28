import author from "@/sanity/schemas/author";
import blockContent from "@/sanity/schemas/blockContent";
import category from "@/sanity/schemas/category";
import contact from "@/sanity/schemas/contact";
import newsletter from "@/sanity/schemas/newsletter";
import post from "@/sanity/schemas/post";
import siteSettings from "@/sanity/schemas/siteSettings";
import pricing from "@/sanity/schemas/pricing";
import faq from "@/sanity/schemas/faq";
import testimonial from "@/sanity/schemas/testimonial";
import { subscriptionRequest } from "@/sanity/schemas/subscription-request";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

const config = defineConfig({
  name: "default",
  title: "Monde iptv IPTV & Blog",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // IPTV Site Content
            S.listItem()
              .title("IPTV Site")
              .child(
                S.list()
                  .title("IPTV Site Content")
                  .items([
                    S.listItem()
                      .title("Site Settings")
                      .child(
                        S.document()
                          .schemaType("siteSettings")
                          .documentId("siteSettings")
                      ),
                    S.listItem()
                      .title("Pricing Plans")
                      .child(
                        S.documentTypeList("pricing").title("Pricing Plans")
                      ),
                    S.listItem()
                      .title("FAQ")
                      .child(S.documentTypeList("faq").title("FAQ")),
                    S.listItem()
                      .title("Testimonials")
                      .child(
                        S.documentTypeList("testimonial").title("Testimonials")
                      ),
                    S.divider(),
                    S.listItem()
                      .title("Subscription Requests")
                      .child(
                        S.documentTypeList("subscriptionRequest").title(
                          "Subscription Requests"
                        )
                      ),
                    S.listItem()
                      .title("Contact Messages")
                      .child(
                        S.documentTypeList("contact").title("Contact Messages")
                      ),
                    S.listItem()
                      .title("Newsletter Subscribers")
                      .child(
                        S.documentTypeList("newsletter").title(
                          "Newsletter Subscribers"
                        )
                      ),
                  ])
              ),

            S.divider(),

            // Blog Content
            S.listItem()
              .title("Blog")
              .child(
                S.list()
                  .title("Blog Content")
                  .items([
                    S.listItem()
                      .title("Posts")
                      .child(S.documentTypeList("post").title("Posts")),
                    S.listItem()
                      .title("Authors")
                      .child(S.documentTypeList("author").title("Authors")),
                    S.listItem()
                      .title("Categories")
                      .child(
                        S.documentTypeList("category").title("Categories")
                      ),
                  ])
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: [
      author,
      blockContent,
      category,
      post,
      newsletter,
      contact,
      siteSettings,
      pricing,
      faq,
      testimonial,
      subscriptionRequest,
    ],
  },
});

export default config;
