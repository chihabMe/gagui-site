# Sanity CMS Integration Guide

This guide explains how to set up and use Sanity CMS for blog content management in your IPTV Pro landing page.

## Overview

The blog system is integrated with Sanity CMS, allowing you to:

- Create and manage blog posts through Sanity Studio
- Automatically fetch and display posts on your website
- Support rich text content with images
- Manage authors and categories
- Use fallback content when Sanity is not configured

## Quick Setup

### 1. Install Sanity Dependencies

The required packages are already installed:

```bash
pnpm add @sanity/client @sanity/image-url
```

### 2. Create Sanity Project

1. Go to [sanity.io](https://sanity.io) and create a free account
2. Create a new project
3. Note your Project ID and Dataset name (usually "production")

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Sanity credentials:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

### 4. Set Up Sanity Studio (Optional)

If you want to manage content through Sanity Studio:

```bash
# Install Sanity CLI globally
npm install -g @sanity/cli

# Create a new Sanity studio in a separate directory
sanity init

# Follow the prompts and use the same project ID
```

## Sanity Schema Setup

Create these schemas in your Sanity Studio:

### Post Schema (`schemas/post.js`)

```javascript
export default {
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    },
    {
      name: "mainImage",
      title: "Main Image",
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
    },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    },
    {
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" },
    },
    {
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "featured",
      title: "Featured Post",
      type: "boolean",
      description: "Display this post prominently",
    },
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "URL",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url",
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection) {
      const { author } = selection;
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`,
      });
    },
  },
};
```

### Author Schema (`schemas/author.js`)

```javascript
export default {
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "bio",
      title: "Bio",
      type: "array",
      of: [
        {
          title: "Block",
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
};
```

### Category Schema (`schemas/category.js`)

```javascript
export default {
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
  ],
};
```

## File Structure

```
src/
├── lib/
│   └── sanity.ts          # Sanity client and utilities
├── app/
│   └── blogs/
│       ├── page.tsx       # All blogs listing page
│       └── [slug]/
│           └── page.tsx   # Individual blog post page
└── components/
    └── BlogSection.tsx    # Blog section for homepage
```

## Features

### Automatic Fallback

- If Sanity is not configured, the blog displays static fallback content
- No errors or broken pages when Sanity is unavailable

### Rich Content Support

- Rich text editor content from Sanity
- Image support with automatic optimization
- Author information and categories
- Reading time calculation

### SEO Ready

- Dynamic page titles and descriptions
- Structured data ready
- Social sharing support

### Performance Optimized

- Image optimization with Next.js Image component
- CDN delivery through Sanity
- Efficient data fetching with GROQ queries

## API Functions

The `src/lib/sanity.ts` file provides these functions:

```typescript
// Fetch all blog posts
const posts = await getAllBlogPosts();

// Fetch featured posts only
const featured = await getFeaturedBlogPosts();

// Fetch recent posts (for homepage)
const recent = await getRecentBlogPosts();

// Fetch single post by slug
const post = await getBlogPostBySlug("my-post-slug");
```

## Customization

### Adding New Fields

1. Add fields to your Sanity schema
2. Update the `BlogPost` interface in `src/lib/sanity.ts`
3. Update GROQ queries to include new fields
4. Modify components to display new data

### Styling

- All components use Tailwind CSS classes
- Motion effects with Framer Motion
- Responsive design with mobile-first approach

## Troubleshooting

### Common Issues

1. **Posts not loading**: Check environment variables and Sanity project settings
2. **Images not displaying**: Verify image field names and URL generation
3. **Build errors**: Ensure all required fields are properly typed

### Debug Mode

Add console.log statements in the API functions to debug data fetching:

```typescript
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch(blogQueries.getAllPosts);
    console.log("Fetched posts:", posts.length); // Debug line
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}
```

## Production Deployment

1. Ensure environment variables are set in your hosting platform
2. Test Sanity connection in production environment
3. Consider using Sanity's CDN for faster content delivery
4. Set up webhooks for automatic rebuilds when content changes

## Next Steps

1. Set up your Sanity project and schemas
2. Add your environment variables
3. Create some test blog posts in Sanity Studio
4. Test the blog functionality on your site
5. Customize styling and layout as needed

For more advanced features, consider:

- Setting up incremental static regeneration (ISR)
- Adding search functionality
- Implementing comment systems
- Setting up email notifications for new posts
