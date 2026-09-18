import { prisma } from "@/lib/prisma";
import { client } from "./client";
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

// ============================================================================
// Site Settings
// ============================================================================

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (!settings) return null;

    return {
      _id: settings.id,
      _type: "siteSettings",
      title: settings.title,
      description: settings.description || undefined,
      contactInfo: {
        email: settings.email || undefined,
        phone: settings.phone || undefined,
        whatsapp: settings.whatsapp || undefined,
        address: settings.address || undefined,
        socialLinks: (settings.socialLinks as Record<string, string>) || undefined,
      },
    };
  } catch (error) {
    console.error("❌ [getSiteSettings] Error fetching from Prisma:", error);
    return null;
  }
}

// ============================================================================
// Pricing Plans
// ============================================================================

export async function getPricingPlans(): Promise<PricingPlan[]> {
  try {
    const plans = await prisma.pricingPlan.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return plans.map((plan) => ({
      _id: plan.id,
      _type: "pricing",
      name: plan.name,
      description: plan.description || undefined,
      price: {
        amount: plan.amount,
        currency: plan.currency as "EUR" | "USD" | "MAD" | "GBP",
        period: plan.period as "monthly" | "quarterly" | "yearly" | "lifetime",
      },
      features: (plan.features as { feature: string; included: boolean }[]) || [],
      isPopular: plan.isPopular,
      isActive: plan.isActive,
      order: plan.order,
      ctaText: plan.ctaText || "S'abonner",
      ctaUrl: plan.ctaUrl || undefined,
    }));
  } catch (error) {
    console.error("❌ [getPricingPlans] Error fetching from Prisma:", error);
    return [];
  }
}

export async function getPricingPlanById(id: string): Promise<PricingPlan | null> {
  try {
    const plan = await prisma.pricingPlan.findFirst({
      where: {
        OR: [{ id }, { sanityId: id }],
      },
    });

    if (!plan) return null;

    return {
      _id: plan.id,
      _type: "pricing",
      name: plan.name,
      description: plan.description || undefined,
      price: {
        amount: plan.amount,
        currency: plan.currency as "EUR" | "USD" | "MAD" | "GBP",
        period: plan.period as "monthly" | "quarterly" | "yearly" | "lifetime",
      },
      features: (plan.features as { feature: string; included: boolean }[]) || [],
      isPopular: plan.isPopular,
      isActive: plan.isActive,
      order: plan.order,
      ctaText: plan.ctaText || "S'abonner",
      ctaUrl: plan.ctaUrl || undefined,
    };
  } catch (error) {
    console.error("❌ [getPricingPlanById] Error fetching from Prisma:", error);
    return null;
  }
}

// ============================================================================
// FAQs
// ============================================================================

export async function getFAQ(): Promise<FAQ[]> {
  try {
    const faqs = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return faqs.map((faq) => ({
      _id: faq.id,
      _type: "faq",
      question: faq.question,
      answer: faq.answer,
      category: faq.category as FAQ["category"],
      isActive: faq.isActive,
      order: faq.order,
    }));
  } catch (error) {
    console.error("❌ [getFAQ] Error fetching from Prisma:", error);
    return [];
  }
}

export async function getFAQByCategory(category: string): Promise<FAQ[]> {
  try {
    const faqs = await prisma.faq.findMany({
      where: { isActive: true, category },
      orderBy: { order: "asc" },
    });

    return faqs.map((faq) => ({
      _id: faq.id,
      _type: "faq",
      question: faq.question,
      answer: faq.answer,
      category: faq.category as FAQ["category"],
      isActive: faq.isActive,
      order: faq.order,
    }));
  } catch (error) {
    console.error("❌ [getFAQByCategory] Error fetching from Prisma:", error);
    return [];
  }
}

// ============================================================================
// Testimonials
// ============================================================================

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: "asc" },
    });

    return testimonials.map((t) => ({
      _id: t.id,
      _type: "testimonial",
      _createdAt: t.createdAt.toISOString(),
      _updatedAt: t.updatedAt.toISOString(),
      _rev: "1",
      name: t.name,
      location: t.role || undefined,
      testimonial: t.content,
      rating: t.rating,
      isFeatured: t.isFeatured,
      order: t.order,
      submittedAt: t.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("❌ [getTestimonials] Error fetching from Prisma:", error);
    return [];
  }
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isFeatured: true },
      orderBy: { order: "asc" },
    });

    return testimonials.map((t) => ({
      _id: t.id,
      _type: "testimonial",
      _createdAt: t.createdAt.toISOString(),
      _updatedAt: t.updatedAt.toISOString(),
      _rev: "1",
      name: t.name,
      location: t.role || undefined,
      testimonial: t.content,
      rating: t.rating,
      isFeatured: t.isFeatured,
      order: t.order,
      submittedAt: t.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("❌ [getFeaturedTestimonials] Error fetching from Prisma:", error);
    return [];
  }
}

// ============================================================================
// Newsletter
// ============================================================================

export async function subscribeToNewsletter(data: {
  email: string;
  source?: string;
}): Promise<{ success: boolean; message: string; data?: Newsletter }> {
  try {
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: data.email },
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return {
          success: false,
          message: "This email is already subscribed to our newsletter.",
        };
      } else {
        const updated = await prisma.newsletterSubscriber.update({
          where: { email: data.email },
          data: { isActive: true, subscribedAt: new Date() },
        });
        return {
          success: true,
          message: "Welcome back! Your subscription has been reactivated.",
          data: {
            _id: updated.id,
            _type: "newsletter",
            email: updated.email,
            subscribedAt: updated.subscribedAt.toISOString(),
            isActive: updated.isActive,
            source: (data.source as Newsletter["source"]) || "website",
          },
        };
      }
    }

    const created = await prisma.newsletterSubscriber.create({
      data: {
        email: data.email,
        isActive: true,
      },
    });

    return {
      success: true,
      message: "Successfully subscribed to our newsletter!",
      data: {
        _id: created.id,
        _type: "newsletter",
        email: created.email,
        subscribedAt: created.subscribedAt.toISOString(),
        isActive: created.isActive,
        source: (data.source as Newsletter["source"]) || "website",
      },
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
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: "desc" },
    });

    return subscribers.map((s) => ({
      _id: s.id,
      _type: "newsletter",
      email: s.email,
      subscribedAt: s.subscribedAt.toISOString(),
      isActive: s.isActive,
      source: "website",
    }));
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return [];
  }
}

export async function checkEmailSubscription(
  email: string
): Promise<Newsletter | null> {
  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!subscriber) return null;

    return {
      _id: subscriber.id,
      _type: "newsletter",
      email: subscriber.email,
      subscribedAt: subscriber.subscribedAt.toISOString(),
      isActive: subscriber.isActive,
      source: "website",
    };
  } catch (error) {
    console.error("Error checking email subscription:", error);
    return null;
  }
}

// ============================================================================
// Blog / Posts
// ============================================================================

export async function getPosts(): Promise<PostPreview[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { isPublished: true },
      include: { author: true, categories: { include: { category: true } } },
      orderBy: { publishedAt: "desc" },
    });

    return posts.map((post) => ({
      _id: post.id,
      title: post.title,
      slug: { current: post.slug },
      author: post.author ? { name: post.author.name } : undefined,
      categories: post.categories.map((c) => ({
        _id: c.category.id,
        title: c.category.title,
        slug: { current: c.category.slug },
      })),
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : post.createdAt.toISOString(),
      excerpt: post.excerpt || undefined,
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getRecentPosts(limit: number = 4): Promise<PostPreview[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { isPublished: true },
      include: { author: true, categories: { include: { category: true } } },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    return posts.map((post) => ({
      _id: post.id,
      title: post.title,
      slug: { current: post.slug },
      author: post.author ? { name: post.author.name } : undefined,
      categories: post.categories.map((c) => ({
        _id: c.category.id,
        title: c.category.title,
        slug: { current: c.category.slug },
      })),
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : post.createdAt.toISOString(),
      excerpt: post.excerpt || undefined,
    }));
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { author: true, categories: { include: { category: true } } },
    });

    if (!post) return null;

    return {
      _id: post.id,
      _type: "post",
      title: post.title,
      slug: { current: post.slug },
      author: post.author
        ? {
            _id: post.author.id,
            _type: "author",
            name: post.author.name,
            slug: { current: post.author.slug },
          }
        : undefined,
      categories: post.categories.map((c) => ({
        _id: c.category.id,
        _type: "category",
        title: c.category.title,
        slug: { current: c.category.slug },
      })),
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : post.createdAt.toISOString(),
      body: [],
    };
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
}

export async function getPostSlugs(): Promise<string[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
    return posts.map((p) => p.slug);
  } catch (error) {
    console.error("Error fetching post slugs:", error);
    return [];
  }
}

export async function getAuthors(): Promise<Author[]> {
  try {
    const authors = await prisma.author.findMany();
    return authors.map((a) => ({
      _id: a.id,
      _type: "author",
      name: a.name,
      slug: { current: a.slug },
    }));
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany();
    return categories.map((c) => ({
      _id: c.id,
      _type: "category",
      title: c.title,
      slug: { current: c.slug },
      description: c.description || undefined,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
    });
    if (!category) return null;
    return {
      _id: category.id,
      _type: "category",
      title: category.title,
      slug: { current: category.slug },
      description: category.description || undefined,
    };
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    return null;
  }
}

export async function getPostsByCategory(categoryId: string): Promise<PostPreview[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        isPublished: true,
        categories: { some: { categoryId } },
      },
      include: { author: true, categories: { include: { category: true } } },
      orderBy: { publishedAt: "desc" },
    });

    return posts.map((post) => ({
      _id: post.id,
      title: post.title,
      slug: { current: post.slug },
      author: post.author ? { name: post.author.name } : undefined,
      categories: post.categories.map((c) => ({
        _id: c.category.id,
        title: c.category.title,
        slug: { current: c.category.slug },
      })),
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : post.createdAt.toISOString(),
      excerpt: post.excerpt || undefined,
    }));
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return [];
  }
}

export async function getPostsByCategorySlug(categorySlug: string): Promise<PostPreview[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        isPublished: true,
        categories: { some: { category: { slug: categorySlug } } },
      },
      include: { author: true, categories: { include: { category: true } } },
      orderBy: { publishedAt: "desc" },
    });

    return posts.map((post) => ({
      _id: post.id,
      title: post.title,
      slug: { current: post.slug },
      author: post.author ? { name: post.author.name } : undefined,
      categories: post.categories.map((c) => ({
        _id: c.category.id,
        title: c.category.title,
        slug: { current: c.category.slug },
      })),
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : post.createdAt.toISOString(),
      excerpt: post.excerpt || undefined,
    }));
  } catch (error) {
    console.error("Error fetching posts by category slug:", error);
    return [];
  }
}

export async function getPostsByAuthor(authorId: string): Promise<PostPreview[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        isPublished: true,
        authorId,
      },
      include: { author: true, categories: { include: { category: true } } },
      orderBy: { publishedAt: "desc" },
    });

    return posts.map((post) => ({
      _id: post.id,
      title: post.title,
      slug: { current: post.slug },
      author: post.author ? { name: post.author.name } : undefined,
      categories: post.categories.map((c) => ({
        _id: c.category.id,
        title: c.category.title,
        slug: { current: c.category.slug },
      })),
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : post.createdAt.toISOString(),
      excerpt: post.excerpt || undefined,
    }));
  } catch (error) {
    console.error("Error fetching posts by author:", error);
    return [];
  }
}

export async function searchPosts(query: string): Promise<PostPreview[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { author: true, categories: { include: { category: true } } },
      orderBy: { publishedAt: "desc" },
    });

    return posts.map((post) => ({
      _id: post.id,
      title: post.title,
      slug: { current: post.slug },
      author: post.author ? { name: post.author.name } : undefined,
      categories: post.categories.map((c) => ({
        _id: c.category.id,
        title: c.category.title,
        slug: { current: c.category.slug },
      })),
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : post.createdAt.toISOString(),
      excerpt: post.excerpt || undefined,
    }));
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
}

export async function getPostsPaginated(
  page: number = 1,
  pageSize: number = 6
): Promise<{
  posts: PostPreview[];
  total: number;
  totalPages: number;
}> {
  try {
    const skip = (page - 1) * pageSize;
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { isPublished: true },
        include: { author: true, categories: { include: { category: true } } },
        orderBy: { publishedAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.post.count({ where: { isPublished: true } }),
    ]);

    return {
      posts: posts.map((post) => ({
        _id: post.id,
        title: post.title,
        slug: { current: post.slug },
        author: post.author ? { name: post.author.name } : undefined,
        categories: post.categories.map((c) => ({
          _id: c.category.id,
          title: c.category.title,
          slug: { current: c.category.slug },
        })),
        publishedAt: post.publishedAt ? post.publishedAt.toISOString() : post.createdAt.toISOString(),
        excerpt: post.excerpt || undefined,
      })),
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("Error fetching paginated posts:", error);
    return { posts: [], total: 0, totalPages: 0 };
  }
}

// ============================================================================
// Helpers
// ============================================================================

export function getImageUrl(
  source: { asset?: { _ref?: string } },
  width?: number,
  height?: number
): string {
  if (!source?.asset?._ref) return "";

  try {
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
  } catch {
    return "";
  }
}
