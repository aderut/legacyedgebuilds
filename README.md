# Legacy Edge Builds

Premium interior materials website — Next.js 14 (App Router) + Tailwind CSS + Supabase.
Includes a full admin dashboard for managing quotes, products, gallery, and blog content.

## Design

Black-and-gold luxury palette:
- `ink` #0B0B0C — background
- `charcoal` #161418 — cards/panels
- `gold` #C9A24B / `gold-bright` #E8CD84 — accents, CTAs
- `gold-deep` #7C5F22 — hairlines, borders
- `ivory` #F3EEE2 — primary text
- `slate` #9A9489 — muted text

Fonts: **Playfair Display** (display/headlines) + **Inter** (body/UI).

Signature element: the **gold "edge"** — a thin gold bevel/hairline that runs along
section tops and card edges, echoing the literal finished edge of an interior
material (and the "Edge" in Legacy Edge Builds).

## Public pages

- `/` — Homepage
- `/about` — Story, mission, vision, values
- `/products` — Filterable product catalogue (pulled from Supabase)
- `/products/[slug]` — Individual product detail pages
- `/gallery` — Filterable inspiration gallery (pulled from Supabase)
- `/blog` — Article listing (pulled from Supabase)
- `/blog/[slug]` — Article detail pages
- `/contact` — Contact form (writes to Supabase) + WhatsApp + contact details

## Admin dashboard (`/admin`)

Password-protected with real Supabase accounts (not a shared password):

- `/admin` — Dashboard: quick stats + recent quote requests
- `/admin/enquiries` — Every quote/contact request submitted on the site.
  Filter by status (new / contacted / won / lost), expand any request to read
  the full message, update its status, message the client on WhatsApp, or
  **download a branded PDF** of the quote request.
- `/admin/products` — Add, edit, and delete products (name, category, image,
  description, features, colors, sizes, applications). Changes appear on the
  live `/products` pages immediately.
- `/admin/gallery` — Add, edit, and delete gallery photos.
- `/admin/blog` — Add, edit, and delete blog posts.

- `/admin/invoices` — Create invoices from scratch or from an existing quote
  (pulls in the client's name/phone/email automatically). Add line items with
  quantity and unit price, set a tax rate, **download a branded PDF**, **email
  it to the client** (via Resend), or send a WhatsApp notification with the
  total due. Track status through draft → sent → paid.

Every image field has a built-in uploader — pick a file and it uploads straight
to Supabase Storage and fills in the URL, no separate step needed.

The admin area has no public link anywhere on the site — go directly to `/admin`
and it will prompt for login.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a Supabase project at [supabase.com](https://supabase.com).

3. In the Supabase SQL editor, run these files **in order**:
   1. `supabase/schema.sql` — creates the `enquiries` table (contact form submissions)
   2. `supabase/storage.sql` — creates the public `site-images` storage bucket
   3. `supabase/cms.sql` — creates `products`, `gallery_items`, `blog_posts` tables
      and adds a `status` column to `enquiries`
   4. `supabase/invoices.sql` — creates the `invoices` table
   5. `supabase/reviews.sql` — creates the `reviews` table (website
      submissions + ones you add from WhatsApp)
   6. `supabase/enquiry-fields.sql` — adds preferred size/color fields to
      quote requests
   7. `supabase/seed.sql` — populates products/gallery/blog with the current
      placeholder content, so the site isn't blank on first launch

4. Create your admin login: in the Supabase dashboard, go to
   **Authentication → Users → Add User**, and create an account with the email
   and password you (or your client) will use to log into `/admin`. You can add
   more than one user here if more than one person needs access.

5. Set up email sending for invoices, at [resend.com](https://resend.com):
   - Sign up for a free account
   - Go to **Domains** and add/verify a domain you own (e.g. `legacyedgebuilds.com`)
     so you can send from an address like `invoices@legacyedgebuilds.com`.
     Without a verified domain, Resend's test mode only lets you send to your
     own account email — fine for testing, not for real clients.
   - Go to **API Keys** and create one

6. Copy `.env.local.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase → Project Settings → API
   - `SUPABASE_SERVICE_ROLE_KEY` — same page, under "service_role" (keep this secret, server-only)
   - `RESEND_API_KEY` — from Resend → API Keys
   - `RESEND_FROM_EMAIL` — e.g. `Legacy Edge Builds <invoices@legacyedgebuilds.com>`
   - `ADMIN_NOTIFICATION_EMAIL` — your own email; every quote request submitted
     on the site gets emailed here automatically (uses the same Resend key above)
   - `NEXT_PUBLIC_SITE_URL` — your live site URL, used in notification email links
   - `NEXT_PUBLIC_TAWKTO_PROPERTY_ID` / `NEXT_PUBLIC_TAWKTO_WIDGET_ID` — optional,
     for live chat (see "Live chat" section below)
   ```bash
   cp .env.local.example .env.local
   ```

7. Update the WhatsApp number: search for `2348000000000` across the project
   (`components/WhatsAppFloat.tsx`, contact/product pages) and replace with the
   real business WhatsApp number in international format, no `+` or spaces.

8. Run locally:
   ```bash
   npm run dev
   ```

9. Visit `/admin`, log in with the account you created in step 4, and start
   managing content.

## Reviews

Two ways reviews get onto the site:
- **Customers submit them directly** at `/reviews` — these save as unapproved
  and won't show publicly until you approve them in `/admin/reviews`.
- **You add ones a customer told you on WhatsApp** — in `/admin/reviews`,
  use the "Add a Review" form. These go live immediately since you're
  vouching for them.

Approved reviews show on both `/reviews` and the homepage testimonials section.

## Live chat

Optional. To turn it on:
1. Sign up free at [tawk.to](https://tawk.to)
2. Create a property for your site
3. Go to **Admin → Channels → Chat Widget**, find the embed code — it looks like
   `https://embed.tawk.to/PROPERTY_ID/WIDGET_ID`
4. Put those two IDs in `.env.local` as `NEXT_PUBLIC_TAWKTO_PROPERTY_ID` and
   `NEXT_PUBLIC_TAWKTO_WIDGET_ID`
5. Restart the dev server

Leave those two blank and the site works exactly the same, just without the
chat bubble — the WhatsApp button still works either way.

## Deployment

Deploy to [Vercel](https://vercel.com): connect the repo, add the three
environment variables from `.env.local` in the Vercel project settings, and deploy.

## Security notes

- `products`, `gallery_items`, and `blog_posts` are readable by anyone (that's
  how the public site displays them) but **cannot be written to** except
  through `/api/admin/*` routes, which require a valid Supabase login.
- `enquiries` can be **inserted** by anyone (that's the public contact form)
  but can only be **read or updated** through the authenticated admin routes.
- `invoices` has no public access at all — not even reads. Only the
  authenticated `/api/admin/invoices` routes can touch it.
- Image uploads always go through the server using the service role key —
  the storage bucket itself only allows public reads, never public writes.
- Don't commit `.env.local` or share `SUPABASE_SERVICE_ROLE_KEY` outside your
  team — it has full read/write access to the database, bypassing all the
  read-only rules above.

## Notes

- Product/gallery/blog images seeded from `seed.sql` are Unsplash placeholders —
  replace them via the admin dashboard with real photography before launch.
- To get notified by email when a new quote comes in, consider adding a
  Supabase Database Webhook or Edge Function that fires on `enquiries` insert.
