// GROQ queries for fetching data from Sanity

// Get all posts with basic information for listing
export const postsQuery = `*[_type == "post"] | order(publishedAt desc) {
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

// Get a single post by slug with full content
export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  author->{
    _id,
    name,
    slug,
    image,
    bio
  },
  mainImage,
  categories[]->{
    _id,
    title,
    description
  },
  publishedAt,
  body
}`;

// Get all post slugs for static generation
export const postSlugsQuery = `*[_type == "post" && defined(slug.current)][].slug.current`;

// Get all authors
export const authorsQuery = `*[_type == "author"] {
  _id,
  name,
  slug,
  image,
  bio
}`;

// Get all categories
export const categoriesQuery = `*[_type == "category"] {
  _id,
  title,
  slug,
  description
}`;

// Get posts by category
export const postsByCategoryQuery = `*[_type == "post" && $categoryId in categories[]._ref] | order(publishedAt desc) {
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
    title
  },
  publishedAt,
  "excerpt": array::join(string::split((pt::text(body))[0..255], "")[0..255], "") + "..."
}`;

// Get posts by category slug
export const postsByCategorySlugQuery = `*[_type == "post" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
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

// Get posts by author
export const postsByAuthorQuery = `*[_type == "post" && author._ref == $authorId] | order(publishedAt desc) {
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

// Newsletter queries
export const newsletterSubscribersQuery = `*[_type == "newsletter" && isActive == true] | order(subscribedAt desc) {
  _id,
  email,
  subscribedAt,
  firstName,
  lastName,
  source
}`;

export const newsletterByEmailQuery = `*[_type == "newsletter" && email == $email][0] {
  _id,
  email,
  isActive,
  subscribedAt
}`;

// Contact queries
export const contactMessagesQuery = `*[_type == "contact"] | order(submittedAt desc) {
  _id,
  name,
  email,
  subject,
  message,
  isRead,
  submittedAt,
  status
}`;

export const contactMessageByIdQuery = `*[_type == "contact" && _id == $id][0] {
  _id,
  name,
  email,
  subject,
  message,
  isRead,
  submittedAt,
  status
}`;

export const unreadContactMessagesQuery = `*[_type == "contact" && isRead == false] | order(submittedAt desc) {
  _id,
  name,
  email,
  subject,
  submittedAt,
  status
}`;

// Get recent posts (limited number for homepage/blog section)
export const recentPostsQuery = `*[_type == "post"] | order(publishedAt desc) [0...$limit] {
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

// Get site settings (contact info, etc.)
export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  _id,
  title,
  description,
  contactInfo,
  businessHours
}`;

// Get all active pricing plans
export const pricingPlansQuery = `*[_type == "pricing" && isActive == true] | order(order asc) {
  _id,
  name,
  description,
  price,
  features,
  isPopular,
  order,
  ctaText,
  ctaUrl,
  specifications
}`;

// Get a specific pricing plan by ID
export const pricingPlanByIdQuery = `*[_type == "pricing" && _id == $id][0] {
  _id,
  name,
  description,
  price,
  features,
  isPopular,
  isActive,
  order,
  ctaText,
  ctaUrl,
  specifications
}`;

// Get all active FAQ items
export const faqQuery = `*[_type == "faq" && isActive == true] | order(order asc) {
  _id,
  question,
  answer,
  category,
  order,
  tags
}`;

// Get FAQ items by category
export const faqByCategoryQuery = `*[_type == "faq" && isActive == true && category == $category] | order(order asc) {
  _id,
  question,
  answer,
  category,
  order,
  tags
}`;

// Get all active testimonials
export const testimonialsQuery = `*[_type == "testimonial" && isActive == true] | order(order asc) {
  _id,
  name,
  location,
  avatar,
  testimonial,
  rating,
  plan,
  isFeatured,
  order,
  submittedAt,
  platform
}`;

// Get featured testimonials
export const featuredTestimonialsQuery = `*[_type == "testimonial" && isActive == true && isFeatured == true] | order(order asc) {
  _id,
  name,
  location,
  avatar,
  testimonial,
  rating,
  plan,
  order,
  submittedAt,
  platform
}`;
