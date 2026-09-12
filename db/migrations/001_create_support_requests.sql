-- Migration: create support_requests table
-- Run this in the Supabase SQL editor (SQL -> New query)

create extension if not exists pgcrypto;

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  ai_response text,
  status text not null default 'pending',
  category text,
  urgency text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger to update updated_at
create or replace function public.trigger_set_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_timestamp on public.support_requests;
create trigger set_timestamp
  before update on public.support_requests
  for each row execute procedure public.trigger_set_timestamp();
