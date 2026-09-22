create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  handle text not null unique check (char_length(handle) between 2 and 40),
  brand jsonb not null,
  tagline jsonb not null,
  bio jsonb not null,
  tags text[] not null check (cardinality(tags) between 1 and 8),
  photos text[] not null default '{}',
  brand_color text not null default '#2563EB',
  stats jsonb not null,
  rating numeric(2, 1) not null default 5.0 check (rating between 0 and 5),
  reviews integer not null default 0 check (reviews >= 0),
  match smallint not null default 90 check (match between 0 and 100),
  status text not null default 'published' check (status in ('draft', 'published', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.guides enable row level security;

-- 공개된 가이드 카드에는 연락처 등 개인정보를 넣지 않습니다.
create policy "Anyone can view published guides"
  on public.guides for select to anon, authenticated
  using (status = 'published' or (select auth.uid()) = owner_id);

create policy "Users can register their own guide"
  on public.guides for insert to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Guides can update their own cards"
  on public.guides for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create index if not exists guides_published_created_at_idx
  on public.guides (status, created_at desc);

create index if not exists guides_owner_id_idx
  on public.guides (owner_id);
