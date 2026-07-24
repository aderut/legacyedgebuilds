-- Run this in the Supabase SQL editor after cms.sql. Safe to run more than once.
-- Creates the invoices table. There is deliberately NO public read/write policy —
-- invoices are only ever touched through the authenticated /api/admin/invoices
-- routes using the service role key.

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_seq bigserial,
  enquiry_id uuid references enquiries(id) on delete set null,
  client_name text not null,
  client_email text,
  client_phone text,
  project_type text,
  items jsonb not null default '[]',
  tax_rate numeric not null default 0,
  notes text default '',
  status text not null default 'draft',
  created_at timestamptz default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'invoices_status_check'
  ) then
    alter table invoices add constraint invoices_status_check
      check (status in ('draft', 'sent', 'paid'));
  end if;
end $$;

alter table invoices enable row level security;
-- No policies created — RLS with zero policies means only the service role
-- (used exclusively by /api/admin/invoices routes) can read or write here.
