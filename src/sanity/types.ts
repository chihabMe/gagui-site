import { PortableTextBlock } from "@portabletext/types";

export interface Author {
  _id: string;
  _type: "author";
  name: string;
  slug: {
    current: string;
  };
  image?: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    hotspot?: boolean;
  };
  bio?: PortableTextBlock[];
}

export interface Category {
  _id: string;
  _type: "category";
  title: string;
  slug: {
    current: string;
  };
  description?: string;
}

export interface Post {
  _id: string;
  _type: "post";
  title: string;
  slug: {
    current: string;
  };
  author?: Author;
  mainImage?: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    hotspot?: boolean;
  };
  categories?: Category[];
  publishedAt: string;
  body: PortableTextBlock[];
}

export interface PostPreview {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  author?: {
    name: string;
  };
  mainImage?: {
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
  categories?: {
    _id: string;
    title: string;
    slug: {
      current: string;
    };
  }[];
  publishedAt: string;
  excerpt?: string;
}

export interface Newsletter {
  _id: string;
  _type: "newsletter";
  email: string;
  subscribedAt: string;
  isActive: boolean;
  source: "website" | "blog_post" | "social_media" | "direct";
}

export interface Contact {
  _id: string;
  _type: "contact";
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  submittedAt: string;
  status: "new" | "in-progress" | "replied" | "closed";
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SiteSettings {
  _id: string;
  _type: "siteSettings";
  title: string;
  description?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
    socialLinks?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      youtube?: string;
      telegram?: string;
    };
  };
  businessHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
}

export interface PricingPlan {
  _id: string;
  _type: "pricing";
  name: string;
  description?: string;
  price: {
    amount: number;
    currency: "EUR" | "USD" | "MAD" | "GBP";
    period: "monthly" | "quarterly" | "yearly" | "lifetime";
  };
  features?: {
    feature: string;
    included: boolean;
  }[];
  isPopular?: boolean;
  isActive?: boolean;
  order: number;
  ctaText?: string;
  ctaUrl?: string;
  specifications?: {
    channels?: string;
    quality?: "HD" | "FHD" | "4K" | "mixed";
    devices?: string;
    support?: "24_7" | "business" | "email";
  };
}

export interface FAQ {
  _id: string;
  _type: "faq";
  question: string;
  answer: string;
  category:
    | "general"
    | "technical"
    | "billing"
    | "installation"
    | "troubleshooting";
  isActive?: boolean;
  order: number;
  tags?: string[];
}

export interface Testimonial {
  _id: string;
  _type: "testimonial";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name: string;
  location?: string;
  avatar?: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    hotspot?: boolean;
  };
  testimonial: string;
  rating: number;
  plan?: "free" | "basic" | "premium" | "vip" | "other";
  isActive?: boolean;
  isFeatured?: boolean;
  order: number;
  submittedAt: string;
  platform?:
    | "android_tv"
    | "smart_tv"
    | "ios"
    | "android"
    | "windows"
    | "mac"
    | "fire_tv"
    | "other";
}
