import { client } from "./client";
import {
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
import {
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

// Fetch all posts
export async function getPosts(): Promise<PostPreview[]> {
  try {
    return await client.fetch(
      postsQuery,
      {},
      {
        next: {
          revalidate: 3600, // Cache for 1 hour
          tags: ["posts"],
        },
      }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// Fetch recent posts with limit
export async function getRecentPosts(
  limit: number = 4
): Promise<PostPreview[]> {
  try {
    return await client.fetch(
      recentPostsQuery,
      { limit },
      {
        next: {
          revalidate: 3600,
          tags: ["posts"],
        },
      }
    );
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return [];
  }
}

// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    return await client.fetch(
      postBySlugQuery,
      { slug },
      {
        next: {
          revalidate: 3600,
          tags: ["posts", `post-${slug}`],
        },
      }
    );
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
}

// Fetch all post slugs (useful for static generation)
export async function getPostSlugs(): Promise<string[]> {
  try {
    return await client.fetch(postSlugsQuery);
  } catch (error) {
    console.error("Error fetching post slugs:", error);
    return [];
  }
}

// Fetch all authors
export async function getAuthors(): Promise<Author[]> {
  try {
    return await client.fetch(authorsQuery);
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
}

// Fetch all categories
export async function getCategories(): Promise<Category[]> {
  try {
    return await client.fetch(categoriesQuery);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Fetch a single category by slug
export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  try {
    const categoryQuery = `*[_type == "category" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description
    }`;
    return await client.fetch(categoryQuery, { slug });
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    return null;
  }
}

// Fetch posts by category
export async function getPostsByCategory(
  categoryId: string
): Promise<PostPreview[]> {
  try {
    return await client.fetch(postsByCategoryQuery, { categoryId });
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return [];
  }
}

// Fetch posts by category slug
export async function getPostsByCategorySlug(
  categorySlug: string
): Promise<PostPreview[]> {
  try {
    return await client.fetch(postsByCategorySlugQuery, { categorySlug });
  } catch (error) {
    console.error("Error fetching posts by category slug:", error);
    return [];
  }
}

// Fetch posts by author
export async function getPostsByAuthor(
  authorId: string
): Promise<PostPreview[]> {
  try {
    return await client.fetch(postsByAuthorQuery, { authorId });
  } catch (error) {
    console.error("Error fetching posts by author:", error);
    return [];
  }
}

// Search posts by title, excerpt, or content
export async function searchPosts(query: string): Promise<PostPreview[]> {
  try {
    const searchPattern = `*${query}*`;
    const searchQuery = `*[_type == "post" && (title match "${searchPattern}" || pt::text(body) match "${searchPattern}")] | order(publishedAt desc) {
      _id,
      title,
      slug,
      author->{
        name,
        slug
      },
      mainImage,
      categories[]->{
        _id,
        title,
        slug
      },
      publishedAt,
      "excerpt": array::join(string::split((pt::text(body))[0..255], "")[0..255], "") + "..."
    }`;
    return await client.fetch(searchQuery);
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
}

// Get posts with pagination
export async function getPostsPaginated(
  page: number = 1,
  pageSize: number = 6
): Promise<{
  posts: PostPreview[];
  total: number;
  totalPages: number;
}> {
  try {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const paginatedQuery = `{
      "posts": *[_type == "post"] | order(publishedAt desc) [$start...$end] {
        _id,
        title,
        slug,
        author->{
          name,
          slug
        },
        mainImage,
        categories[]->{
          _id,
          title,
          slug
        },
        publishedAt,
        "excerpt": array::join(string::split((pt::text(body))[0..255], "")[0..255], "") + "..."
      },
      "total": count(*[_type == "post"])
    }`;

    const result = await client.fetch(paginatedQuery, { start, end });
    return {
      posts: result.posts,
      total: result.total,
      totalPages: Math.ceil(result.total / pageSize),
    };
  } catch (error) {
    console.error("Error fetching paginated posts:", error);
    return { posts: [], total: 0, totalPages: 0 };
  }
}

// Utility function to get image URL from Sanity
export function getImageUrl(
  source: { asset?: { _ref?: string } },
  width?: number,
  height?: number
): string {
  if (!source?.asset?._ref) return "";

  const baseUrl = `https://cdn.sanity.io/images/${client.config().projectId}/${
    client.config().dataset
  }`;
  const [, id, dimensions, format] = source.asset._ref.split("-");

  let url = `${baseUrl}/${id}-${dimensions}.${format}`;

  if (width || height) {
    const params = new URLSearchParams();
    if (width) params.append("w", width.toString());
    if (height) params.append("h", height.toString());
    params.append("fit", "crop");
    url += `?${params.toString()}`;
  }

  return url;
}

// Newsletter functions
export async function subscribeToNewsletter(data: {
  email: string;
  source?: string;
}): Promise<{ success: boolean; message: string; data?: Newsletter }> {
  try {
    // Check if email already exists
    const existingSubscriber = await client.fetch(newsletterByEmailQuery, {
      email: data.email,
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return {
          success: false,
          message: "This email is already subscribed to our newsletter.",
        };
      } else {
        // Reactivate subscription
        const updated = await client
          .patch(existingSubscriber._id)
          .set({ isActive: true, subscribedAt: new Date().toISOString() })
          .commit();
        return {
          success: true,
          message: "Welcome back! Your subscription has been reactivated.",
          data: updated as unknown as Newsletter,
        };
      }
    }

    // Create new subscription
    const newSubscriber = await client.create({
      _type: "newsletter",
      email: data.email,
      source: data.source || "website",
      subscribedAt: new Date().toISOString(),
      isActive: true,
    });

    return {
      success: true,
      message: "Successfully subscribed to our newsletter!",
      data: newSubscriber as unknown as Newsletter,
    };
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return {
      success: false,
      message: "An error occurred while subscribing. Please try again later.",
    };
  }
}

export async function getNewsletterSubscribers(): Promise<Newsletter[]> {
  try {
    return await client.fetch(newsletterSubscribersQuery);
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return [];
  }
}

export async function checkEmailSubscription(
  email: string
): Promise<Newsletter | null> {
  try {
    return await client.fetch(newsletterByEmailQuery, { email });
  } catch (error) {
    console.error("Error checking email subscription:", error);
    return null;
  }
}

// Fetch site settings (contact info, etc.)
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch(
      siteSettingsQuery,
      {},
      {
        next: {
          revalidate: 3600,
          tags: ["site-settings"],
        },
      }
    );
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
}

// Fetch all active pricing plans
export async function getPricingPlans(): Promise<PricingPlan[]> {
  try {
    return await client.fetch(
      pricingPlansQuery,
      {},
      {
        next: {
          revalidate: 3600,
          tags: ["pricing"],
        },
      }
    );
  } catch (error) {
    console.error("Error fetching pricing plans:", error);
    return [];
  }
}

// Fetch a specific pricing plan by ID
export async function getPricingPlanById(
  id: string
): Promise<PricingPlan | null> {
  try {
    return await client.fetch(
      pricingPlanByIdQuery,
      { id },
      {
        next: {
          revalidate: 3600,
          tags: ["pricing", `pricing-${id}`],
        },
      }
    );
  } catch (error) {
    console.error("Error fetching pricing plan by ID:", error);
    return null;
  }
}

// Fetch all active FAQ items
export async function getFAQ(): Promise<FAQ[]> {
  try {
    return await client.fetch(
      faqQuery,
      {},
      {
        next: {
          revalidate: 3600,
          tags: ["faq"],
        },
      }
    );
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return [];
  }
}

// Fetch FAQ items by category
export async function getFAQByCategory(category: string): Promise<FAQ[]> {
  try {
    return await client.fetch(
      faqByCategoryQuery,
      { category },
      {
        next: {
          revalidate: 3600,
          tags: ["faq", `faq-${category}`],
        },
      }
    );
  } catch (error) {
    console.error("Error fetching FAQ by category:", error);
    return [];
  }
}

// Fetch all active testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await client.fetch(
      testimonialsQuery,
      {},
      {
        next: {
          revalidate: 3600,
          tags: ["testimonials"],
        },
      }
    );
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

// Fetch featured testimonials only
export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  try {
    return await client.fetch(
      featuredTestimonialsQuery,
      {},
      {
        next: {
          revalidate: 3600,
          tags: ["testimonials"],
        },
      }
    );
  } catch (error) {
    console.error("Error fetching featured testimonials:", error);
    return [];
  }
}
