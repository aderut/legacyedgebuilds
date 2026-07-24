-- Run this in the Supabase SQL editor. Safe to run more than once.
-- Reviews can come from two places: customers submitting them directly on
-- the site (approved = false until you check them), or you adding ones a
-- customer told you on WhatsApp (approved = true immediately, since you're
-- vouching for them yourself).

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating int not null default 5,
  message text not null,
  source text not null default 'website',
  approved boolean not null default false,
  created_at timestamptz default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'reviews_rating_check') then
    alter table reviews add constraint reviews_rating_check check (rating between 1 and 5);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'reviews_source_check') then
    alter table reviews add constraint reviews_source_check check (source in ('website', 'whatsapp'));
  end if;
end $$;

alter table reviews enable row level security;

-- Anyone can submit a review from the public site (goes in unapproved).
drop policy if exists "Public insert reviews" on reviews;
create policy "Public insert reviews" on reviews for insert to anon with check (true);

-- Anyone can read APPROVED reviews only — this is what the homepage/reviews
-- page displays. Unapproved reviews stay invisible until you approve them
-- in /admin/reviews.
drop policy if exists "Public read approved reviews" on reviews;
create policy "Public read approved reviews" on reviews for select to anon using (approved = true);

-- No public update/delete policy — approving, editing, and adding
-- WhatsApp-sourced reviews all go through the authenticated admin routes.
