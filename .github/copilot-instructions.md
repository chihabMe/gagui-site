# IPTV Pro Landing Page - AI Coding Instructions

## Architecture Overview

This is a **Next.js 15 landing page** for an IPTV service built with modern React patterns, TypeScript, and shadcn/ui components. The architecture follows a **modular component-based approach** with clear separation between UI components and page sections.

### Key Technologies

- **Next.js 15** with App Router (`src/app/`)
- **shadcn/ui** design system with Radix UI primitives
- **Tailwind CSS 4** with custom design tokens
- **TypeScript** for type safety
- **pnpm** for package management

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui primitives
│   └── [SectionName].tsx # Page-specific sections
├── hooks/              # Custom React hooks
└── lib/                # Utilities (utils.ts)
```

## Design System & Styling

### CSS Variables Architecture

The project uses a **dual CSS variables system**:

- `src/app/globals.css` - Primary CSS variables and utilities
- `src/index.css` - Duplicate variables for compatibility

### Custom Design Tokens

```css
/* Core IPTV-specific gradients */
--gradient-primary: linear-gradient(135deg, hsl(221 83% 53%), hsl(262 83% 58%))
--hero-gradient: linear-gradient(135deg, hsl(221 83% 53%), hsl(262 83% 58%))
--shadow-glow: 0 0 40px hsl(221 83% 53% / 0.3)
```

### Utility Classes

- `.gradient-primary` - Apply brand gradient backgrounds
- `.shadow-glow` - Brand-consistent glow effects
- `.transition-smooth` - Consistent smooth transitions

## Component Patterns

### Navigation System

Header component uses **conditional rendering** for routes vs anchors:

```tsx
// Pattern for mixed navigation (routes + hash links)
const navigation = [
  { name: "Accueil", href: "/", isRoute: true }, // Next.js Link
  { name: "Tarifs", href: "#tarifs", isRoute: false }, // Anchor tag
];

{
  navigation.map((item) =>
    item.isRoute ? (
      <Link href={item.href}>{item.name}</Link>
    ) : (
      <a href={item.href}>{item.name}</a>
    )
  );
}
```

### Mobile-First Responsive Design

Uses **custom mobile breakpoint** at 1024px (lg) instead of standard 768px:

```tsx
const MOBILE_BREAKPOINT = 1024; // lg breakpoint
```

### Mobile Menu Implementation

- **Full-screen overlay** with backdrop blur
- **Body scroll prevention** via `document.body.style.overflow`
- **Escape key handling** for accessibility
- **Auto-close on desktop resize**

### Landing Page Sections

Each section is a **self-contained component** imported into `app/page.tsx`:

- `HeroSection` - Main banner with gradient backgrounds
- `PopularChannels` - Feature showcase
- `WhyChooseUs` - Positioned feature cards with animations
- `PricingSection` - Service tiers
- Component composition in `page.tsx` with consistent container sizing

## Development Workflow

### Build Commands

```bash
pnpm dev          # Development with Turbopack
pnpm build        # Production build
pnpm start        # Production server
```

### Task Configuration

VS Code task available: "Start Development Server" (`pnpm dev`)

## Component Development Guidelines

### shadcn/ui Integration

- Use `components.json` configuration (New York style, `src/index.css`)
- All UI components in `components/ui/` follow shadcn patterns
- Import from `@/components/ui/[component]`

### Styling Conventions

- Use semantic color tokens: `text-foreground`, `bg-background`, `border`
- Leverage custom gradients: `bg-gradient-primary`
- Apply consistent spacing: `container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8`

### TypeScript Patterns

- Use `React.ComponentProps<"element">` for component prop types
- Extend with custom props using intersection types
- Leverage `cn()` utility for conditional class merging

### Animation & Interactions

- Use CSS custom properties for consistent transitions
- Implement hover states with `hover:` prefixes
- Apply staggered animations with `animationDelay` style properties

## French Language Context

All content is in **French** - maintain this when generating:

- UI text and labels
- Component names can remain English
- Comments should be in English for consistency

## Framer motion instructions

i am using the latest version of framer motion so please follow this instructions when using framer motion:
how to import it

```tsx
import { motion } from "motion/react";
```

## Key Files to Reference

- `src/components/Header.tsx` - Navigation patterns
- `src/app/globals.css` - Design system tokens
- `src/hooks/use-mobile.tsx` - Responsive utilities
- `tailwind.config.ts` - Extended Tailwind configuration
- `components.json` - shadcn/ui setup
