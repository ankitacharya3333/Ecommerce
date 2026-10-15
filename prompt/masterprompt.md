# DAY 1: PROFESSIONAL E-COMMERCE FOUNDATION

Act as a senior Next.js developer and UI/UX designer.

We are building a real-world, production-oriented e-commerce website over multiple development sessions. This is Day 1 of a five-part project.

## Technology stack

- Next.js with App Router
- React
- TypeScript
- Tailwind CSS
- Lucide React icons
- Motion for React for animations where needed

Use stable, compatible versions and follow current Next.js conventions.

## IMPORTANT WORKFLOW RULES

1. Implement ONLY Day 1.
2. Do not implement authentication, database integration, payments, checkout logic, or admin functionality yet.
3. Do not generate the entire application in advance.
4. Inspect the existing project before making changes.
5. If a project already exists, preserve its working code and adapt it.
6. Create clean, reusable components.
7. Do not create unnecessary placeholder pages or fake integrations.
8. Test the current implementation and fix errors.
9. Stop after completing Day 1.

## Brand and visual direction

Create a premium, contemporary e-commerce brand called "NOVA MARKET".

The website should look professionally designed by an experienced product team. Avoid generic AI-generated layouts, excessive gradients, unnecessary rounded cards, repetitive sections, and decorative elements without purpose.

Use a restrained color palette, excellent typography, consistent spacing, high-quality imagery, and thoughtful visual hierarchy.

The store should be suitable for a real lifestyle and general-products business.

## Project setup

Create or configure the project with:

- TypeScript
- Tailwind CSS
- ESLint
- Next.js App Router
- Lucide React
- Motion for React, if used in this phase

Do not replace the framework's existing configuration unnecessarily.

## Build the shared layout

Create reusable components for:

- Announcement bar
- Responsive header
- Brand logo
- Desktop navigation
- Mobile navigation menu
- Search interface
- Account, wishlist, and cart icons
- Reusable buttons
- Footer
- Newsletter section

Use a consistent design system.

## Build the home page

Implement:

1. Announcement bar.
2. Professional navigation.
3. Hero section with headline, supporting copy, image, and CTA.
4. Featured product categories.
5. Featured products using clearly identified development sample data.
6. Promotional banner.
7. Brand benefits, such as shipping and returns.
8. Newsletter form UI.
9. Footer with useful navigation and business information.

The visual layout must feel balanced and responsive, not like a collection of unrelated template sections.

## Required routes

Create the initial working routes:

- `/`
- `/products`
- `/about`
- `/contact`
- `/faq`
- `/shipping-returns`
- `/privacy-policy`
- `/terms`

These pages should use shared layouts and meaningful, simple content. The contact form may be a UI-only form in this phase; do not pretend that email delivery is connected.

Add a proper not-found page.

## Navigation requirement

Use Next.js `Link` for internal navigation.

Navigating between internal pages must use client-side navigation without a full browser document reload.

Do not use `window.location.href` for ordinary internal links.

Directly opening or refreshing a valid route must work.

## Responsive design

Support mobile, tablet, laptop, and desktop.

Ensure that the navigation, hero, category layout, product grid, and footer adapt to smaller screens without horizontal overflow.

Use semantic HTML, accessible labels, keyboard-friendly controls, and visible focus states.

## Code organization

Use a clean structure such as:

- `src/app/`
- `src/components/layout/`
- `src/components/ui/`
- `src/components/home/`
- `src/lib/`
- `src/data/`

Adapt it where appropriate.

## Day 1 completion requirements

- Project starts successfully.
- Homepage renders.
- Shared header and footer work.
- Internal navigation works.
- Required routes render.
- Mobile layout works.
- No obvious console errors.
- No broken imports.
- No unnecessary dependencies.
- No real secrets committed.

At the end, tell me:

1. Which files you created or changed.
2. How to run the project.
3. How to test the routes and responsive layout.
4. Any errors or unfinished work.
5. The recommended Git commit message.

Do not begin Day 2. Wait for my next instruction.