create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  guide_id text not null,
  guide_name text not null,
  guide_owner_id uuid references auth.users(id) on delete set null,
  requester_id uuid not null references auth.users(id) on delete cascade,
  trip_start date not null,
  trip_end date not null,
  party_size smallint not null check (party_size between 1 and 6),
  preferred_language text not null check (preferred_language in ('ko', 'en', 'ja', 'zh')),
  message text not null check (char_length(message) between 1 and 1000),
  status text not null default 'pending' check (status in ('pending', 'answered', 'closed')),
  created_at timestamptz not null default now(),
  check (trip_end >= trip_start)
);

alter table public.inquiries enable row level security;

create policy "Travelers can create their own inquiries"
  on public.inquiries for insert to authenticated
  with check ((select auth.uid()) = requester_id);

create policy "Travelers can view their own inquiries"
  on public.inquiries for select to authenticated
  using ((select auth.uid()) = requester_id);

create policy "Guides can view inquiries addressed to them"
  on public.inquiries for select to authenticated
  using ((select auth.uid()) = guide_owner_id);

create index if not exists inquiries_requester_created_at_idx
  on public.inquiries (requester_id, created_at desc);

create index if not exists inquiries_guide_owner_created_at_idx
  on public.inquiries (guide_owner_id, created_at desc);
