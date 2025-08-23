// Sanity client and utilities
export { client } from "./client";

// Types
// Types
export type {
  Post,
  PostPreview,
  Author,
  Category,
  Newsletter,
  SiteSettings,
  PricingPlan,
  FAQ,
  Testimonial,
} from "./types";

// Data fetching functions
export {
  getPosts,
  getRecentPosts,
  getPostBySlug,
  getPostSlugs,
  getAuthors,
  getCategories,
  getCategoryBySlug,
  getPostsByCategory,
  getPostsByCategorySlug,
  getPostsByAuthor,
  searchPosts,
  getPostsPaginated,
  getImageUrl,
  subscribeToNewsletter,
  getNewsletterSubscribers,
  checkEmailSubscription,
  getSiteSettings,
  getPricingPlans,
  getPricingPlanById,
  getFAQ,
  getFAQByCategory,
  getTestimonials,
  getFeaturedTestimonials,
} from "./utils";

// GROQ queries (if you need them directly)
export {
  postsQuery,
  postBySlugQuery,
  postSlugsQuery,
  authorsQuery,
  categoriesQuery,
  postsByCategoryQuery,
  postsByCategorySlugQuery,
  postsByAuthorQuery,
  newsletterSubscribersQuery,
  newsletterByEmailQuery,
  recentPostsQuery,
  siteSettingsQuery,
  pricingPlansQuery,
  pricingPlanByIdQuery,
  faqQuery,
  faqByCategoryQuery,
  testimonialsQuery,
  featuredTestimonialsQuery,
} from "./queries";
