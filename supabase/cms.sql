-- Run this AFTER schema.sql and storage.sql, in the Supabase SQL editor.
-- Adds tables so Products, Gallery, and Blog are manageable from /admin
-- instead of living in static code files.
-- Safe to run more than once.

-- Add a status column to enquiries so quotes can be tracked through a pipeline.
alter table enquiries add column if not exists status text not null default 'new';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'enquiries_status_check'
  ) then
    alter table enquiries add constraint enquiries_status_check
      check (status in ('new', 'contacted', 'won', 'lost'));
  end if;
end $$;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  image text not null,
  description text not null default '',
  features text[] not null default '{}',
  colors text[] not null default '{}',
  sizes text[] not null default '{}',
  applications text[] not null default '{}',
  created_at timestamptz default now()
);

create table if not exists gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  image text not null,
  created_at timestamptz default now()
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  image text not null,
  date date not null default current_date,
  content text[] not null default '{}',
  created_at timestamptz default now()
);

alter table products enable row level security;
alter table gallery_items enable row level security;
alter table blog_posts enable row level security;

-- Public (anon) can read — the live site displays these without login.
-- Drop-then-create makes this safe to re-run.
drop policy if exists "Public read products" on products;
create policy "Public read products" on products for select to anon using (true);

drop policy if exists "Public read gallery_items" on gallery_items;
create policy "Public read gallery_items" on gallery_items for select to anon using (true);

drop policy if exists "Public read blog_posts" on blog_posts;
create policy "Public read blog_posts" on blog_posts for select to anon using (true);

-- No anon insert/update/delete policies are created on purpose — all writes
-- go through /api/admin/* routes, which use the service role key on the
-- server after verifying an authenticated Supabase session. This keeps the
-- three tables read-only from the public site while still editable by you.

-- Enquiries: keep the existing "Allow public insert" policy from schema.sql.
-- No public select/update policy is added — reading/updating enquiries only
-- happens through the authenticated /admin dashboard via the service role key.
