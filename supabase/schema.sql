-- Run this in the Supabase SQL editor to set up the enquiries table.
-- Safe to run more than once.

create extension if not exists pgcrypto;

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  project_type text,
  message text not null,
  created_at timestamptz default now()
);

alter table enquiries enable row level security;

-- Allow anyone (including the public anon key used by the website) to submit an enquiry.
drop policy if exists "Allow public insert" on enquiries;
create policy "Allow public insert" on enquiries
  for insert
  to anon
  with check (true);

-- Reads are restricted — only do reads from the Supabase dashboard or with a service role key.
