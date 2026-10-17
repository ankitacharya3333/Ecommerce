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


# DAY 2: E-COMMERCE CATALOG AND SHOPPING FEATURES

Continue the existing NOVA MARKET project from Day 1.

Act as a senior Next.js and React developer.

## Mandatory instructions

- Inspect the existing code before editing.
- Preserve the design system, shared layout, and working navigation.
- Do not rebuild the project from scratch.
- Implement ONLY the features listed for Day 2.
- Do not implement authentication, database migrations, payment processing, or the admin dashboard yet.
- Do not proceed to Day 3 automatically.

## Technology

Use the existing Next.js App Router, TypeScript, Tailwind CSS, React, and Lucide React setup.

Use the Motion for React library for small, purposeful interactions where useful.

## Product catalog

Create a reusable product data model with fields such as:

- ID
- Slug
- Name
- Description
- Price
- Optional sale price
- Category
- Images
- Stock information
- Optional rating and review count
- Optional variants

For this phase, use a clearly identified local development dataset or an existing working product API. Keep the data access layer structured so it can later be connected to Prisma and PostgreSQL.

Do not claim that sample data is production inventory.

## Product listing

Implement `/products` with:

- Responsive product cards
- Product images
- Product names and prices
- Sale-price display where applicable
- Category filtering
- Price filtering
- Sorting by price and newest where supported by the data
- Search by product name
- Pagination or a sensible small-catalog loading strategy
- Empty results state
- Loading and error states where applicable
- Clear filters functionality

Keep relevant search, sorting, and filter state in URL search parameters.

## Product details

Implement `/products/[slug]`.

Include:

- Product image gallery
- Product description
- Price
- Stock status
- Quantity selector
- Add-to-cart button
- Wishlist button
- Product specifications
- Related products

Handle invalid product slugs with an appropriate not-found state.

## Cart

Implement a functional cart with:

- Add to cart
- Update quantity
- Remove item
- Clear cart
- Subtotal calculation
- Header cart count
- Empty cart state
- Cart drawer or cart page
- Persistence across refreshes

For now, a guest cart can use browser storage. Create a clean abstraction so authenticated database carts can be added later.

Do not trust browser-stored prices for future checkout calculations.

## Wishlist

Implement add/remove wishlist functionality and a wishlist page.

Use local development persistence for now and keep the implementation easy to replace with database-backed storage later.

## User experience

- Display useful feedback after adding an item.
- Prevent invalid quantities.
- Disable relevant controls while actions are processing.
- Maintain consistent styling.
- Ensure all buttons work.
- Avoid excessive animations.
- Keep mobile shopping usable.

## Day 2 testing

Verify:

1. Product cards render correctly.
2. Search and filters work together.
3. Product details load for valid slugs.
4. Invalid slugs display a not-found state.
5. Add-to-cart updates the header count.
6. Quantity updates change the subtotal.
7. Removing items works.
8. Cart persists across refreshes.
9. Wishlist add/remove works.
10. Internal navigation still works without full-page reloads.

Fix errors before finishing.

Report the changed files, test results, known limitations, and recommended Git commit message.

Stop after Day 2. Do not implement Day 3 features.



# DAY 3: DATABASE, AUTHENTICATION, VALIDATED FORMS, AND EMAIL

Continue the existing NOVA MARKET project.

Act as a senior full-stack engineer and security-conscious backend developer.

## Mandatory workflow

Inspect the current project and preserve existing features. Implement only Day 3.

Do not rebuild the frontend. Do not implement the complete payment and checkout system or full admin dashboard in this phase.

## Technology

Use:

- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma ORM
- React Hook Form
- Zod
- `@hookform/resolvers`
- Auth.js or a compatible secure authentication solution
- Resend for server-side transactional email
- React Email where appropriate

Select compatible versions and use the correct APIs for those versions.

## Database

Configure Prisma and PostgreSQL.

Create an appropriate schema for:

- User
- Authentication-related models required by the chosen adapter
- Product
- Category
- Address
- Cart
- CartItem
- WishlistItem
- Inquiry
- NewsletterSubscriber

Prepare the structure for future order and payment models without implementing the complete checkout flow.

Include appropriate relations, indexes, unique constraints, timestamps, and deletion rules.

Provide migrations and a development seed script.

Keep product prices and stock in the database once database-backed product integration is ready.

## Authentication

Implement a real authentication flow:

- Registration
- Login
- Logout
- Session handling
- Protected customer account page
- Profile page
- Forgot-password flow
- Secure password reset
- Email verification if supported by the selected setup
- Server-side authorization

Use secure password hashing for credentials-based authentication.

Never store plaintext passwords or send passwords through email.

Do not create fake login success messages or hardcoded authentication.

If required credentials or configuration are missing, identify them clearly.

## React Hook Form and Zod

Use React Hook Form and Zod for:

- Registration
- Login
- Password recovery
- Contact form
- Newsletter form
- Profile editing

Create reusable schemas where appropriate.

Validate on both client and server. Display accessible, field-specific error messages.

## Contact and inquiry system

Administrator notification address:

rmnrr333@gmail.com

Create a contact form containing:

- Name
- Email
- Subject
- Inquiry category
- Message
- Optional order number

On submission:

1. Validate the request on the server.
2. Apply rate limiting and abuse protection.
3. Save the inquiry to PostgreSQL.
4. Attempt to send an administrator notification to `rmnrr333@gmail.com`.
5. Send a customer confirmation email when appropriate.
6. Show an honest result to the user.
7. Record email delivery failures and provide a way to retry failed notifications.

An inquiry being saved successfully must not be confused with email delivery succeeding.

## Email configuration

Use Resend or an appropriate transactional email service.

Create `.env.example` with the required variable names, including:

DATABASE_URL=
AUTH_SECRET=
RESEND_API_KEY=
ADMIN_EMAIL=rmnrr333@gmail.com
EMAIL_FROM=
NEXT_PUBLIC_APP_URL=

Include other required variables for the selected configuration.

Never put private API keys in client-side code or `NEXT_PUBLIC_` variables.

Use a verified sender domain and explain the required configuration.

Do not claim that real emails are delivered until the provider is configured and delivery is tested.

## Newsletter

Implement a functional newsletter subscription endpoint.

Validate addresses, avoid duplicate subscriptions, and provide confirmation feedback. Use a consent-aware subscription flow.

## Security

- Protect account routes.
- Enforce resource ownership.
- Rate-limit sensitive endpoints.
- Avoid exposing database errors.
- Validate all untrusted input on the server.
- Keep secrets out of Git.
- Use appropriate secure cookies and session configuration.

## Preserve previous work

Connect the existing product catalog to the database where feasible, without breaking the UI.

Replace local cart persistence with database-backed persistence for authenticated customers if this can be completed safely in this phase. Retain guest cart functionality.

Do not remove working features simply to simplify the implementation.

## Day 3 verification

Test registration, login, logout, authorization, form validation, database persistence, contact submissions, and email failure handling.

Run migrations and tests using a development database.

Provide exact commands and report what has actually been tested.

Stop after Day 3. Do not implement Day 4 automatically.