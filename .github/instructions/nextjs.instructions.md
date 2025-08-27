---
applyTo: '**/*.ts', '**/*.tsx'
---


You are an expert in TypeScript, Node.js, Next.js App Router, React, Shadcn UI, Radix UI, and Tailwind CSS.
All code written in this project must strictly follow the guidelines below.

🏗 Code Style and Structure

Write concise, technical TypeScript code with accurate examples.

Use functional, declarative programming; avoid classes.

Prefer composition and modularization over duplication.

Use descriptive, semantic variable names with auxiliary verbs (e.g., isLoading, hasError, shouldRedirect).

Structure files in the following order:

Exported component

Subcomponents (if any)

Local helpers

Static content/constants

Types/interfaces

Keep functions small and single-purpose.

🗂 Naming Conventions

Directories: lowercase with dashes → components/auth-wizard/

Files: PascalCase for components → AuthWizard.tsx

Hooks: use prefix → useAuth.ts

Utilities: camelCase → formatDate.ts

Constants: UPPER_SNAKE_CASE → API_BASE_URL

Exports: Favor named exports (avoid default exports except for Next.js pages/layouts).

🧩 TypeScript Usage

All code must be typed; avoid any.

Prefer interfaces over type for objects & props.

Avoid enum; use string unions or maps/objects.

Use React.FC only when you need children; otherwise, declare props interfaces explicitly.

Type props, state, hooks return values, and external API responses.

Use zod or valibot for runtime type validation where required.

✍️ Syntax and Formatting

Use the function keyword for pure functions (not arrow functions).

For small conditionals, use ternaries or logical operators instead of verbose if statements.

Avoid unnecessary curly braces and return statements for simple JSX.

Prefer declarative JSX: describe what should render, not how.

Maintain Prettier + ESLint formatting (no manual styling quirks).

🎨 UI and Styling

Use Shadcn UI + Radix UI + TailwindCSS for all components.

Follow mobile-first responsive design with Tailwind breakpoints.

Avoid inline styles; use utility classes or extracted variants (cva).

Use Radix primitives for accessibility (dialogs, menus, sliders, etc.).

Keep UI consistent:

Buttons → @/components/ui/button

Modals → @/components/ui/dialog

Forms → @/components/ui/form

Use Tailwind config for spacing, colors, typography (don’t hardcode values).

⚡ Performance Optimization

Use React Server Components (RSC) whenever possible.

Minimize use client, useEffect, and useState.

Use them only for browser APIs, animations, or truly client-only logic.

Wrap client components in <Suspense fallback={...}>.

Dynamically import non-critical components with next/dynamic.

Optimize images:

Use Next.js <Image />

Use WebP/AVIF

Always set width, height, and priority when relevant

Enable lazy loading by default.

🔑 Key Conventions

URL state: use nuqs for query parameters instead of local state.

SEO & Metadata: Always configure metadata in page components.

Accessibility (a11y):

All interactive elements must be keyboard accessible.

Provide aria-* attributes when necessary.

Error Handling:

Use error boundaries for UI crashes.

Catch async errors gracefully (try/catch, useMutation error handlers).

Data Fetching:

Follow Next.js App Router conventions for fetch, revalidate, and cache.

Use server actions when possible.

Keep all API contracts strongly typed.

🚦 Workflow and Standards

All code must pass ESLint and TypeScript checks.

PRs must include types, tests, and documentation (JSDoc or comments) where relevant.

Avoid adding third-party libraries unless absolutely necessary (prefer native or existing Shadcn/Radix solutions).

Follow Next.js official documentation for data fetching, routing, and rendering strategies.

✅ These rules create consistency, performance, and maintainability across the entire codebase.