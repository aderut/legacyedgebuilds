-- Run this in the Supabase SQL editor. Safe to run more than once.
-- Adds preferred size/color fields so customers can specify what they want
-- directly in the quote request, now that those aren't shown as fixed lists
-- on the product page.

alter table enquiries add column if not exists preferred_size text;
alter table enquiries add column if not exists preferred_color text;
