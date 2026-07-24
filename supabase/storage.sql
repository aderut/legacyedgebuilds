-- Run this in the Supabase SQL editor AFTER schema.sql, to set up image storage.
-- Safe to run more than once.

-- Create a public storage bucket for site images (products + gallery photos).
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

-- Allow public (anonymous) read access to files in this bucket, so images
-- display on the live site without authentication.
drop policy if exists "Public read access on site-images" on storage.objects;
create policy "Public read access on site-images"
  on storage.objects for select
  to public
  using (bucket_id = 'site-images');

-- Note: uploads are NOT allowed via the public anon key. All uploads go through
-- the /api/admin/upload route, which uses the service role key on the server
-- and checks an authenticated Supabase session before writing to storage. This
-- keeps the bucket read-only from the browser while still letting your team
-- upload easily.
