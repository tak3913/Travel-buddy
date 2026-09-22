-- 관리자 권한은 Dashboard SQL Editor에서만 부여합니다.
alter table public.profiles
  add column if not exists role text not null default 'user'
  check (role in ('user', 'admin'));

-- private는 등록자가 직접 관리하는 비공개 상태, hidden은 관리자 조치 상태입니다.
alter table public.guides drop constraint if exists guides_status_check;
alter table public.guides
  add constraint guides_status_check check (status in ('draft', 'published', 'private', 'hidden'));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "Anyone can view published guides" on public.guides;
create policy "Published guides, owners, and admins can view guides"
  on public.guides for select to anon, authenticated
  using (status = 'published' or (select auth.uid()) = owner_id or public.is_admin());

-- 관리자가 숨긴 카드는 등록자가 다시 공개하거나 수정할 수 없습니다.
drop policy if exists "Guides can update their own cards" on public.guides;
create policy "Guide owners can update non-hidden cards"
  on public.guides for update to authenticated
  using ((select auth.uid()) = owner_id and status <> 'hidden')
  with check ((select auth.uid()) = owner_id and status <> 'hidden');

create policy "Admins can update any guide"
  on public.guides for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete guides"
  on public.guides for delete to authenticated
  using (public.is_admin());

create table if not exists public.guide_reports (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.guides(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (reason in ('inappropriate', 'misleading', 'safety', 'copyright', 'other')),
  details text check (char_length(details) <= 1000),
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (guide_id, reporter_id)
);

alter table public.guide_reports enable row level security;

create policy "Users can submit a guide report"
  on public.guide_reports for insert to authenticated
  with check ((select auth.uid()) = reporter_id and status = 'pending');

create policy "Users can view their own reports"
  on public.guide_reports for select to authenticated
  using ((select auth.uid()) = reporter_id);

create policy "Admins can manage reports"
  on public.guide_reports for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.guide_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null unique references public.guides(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  reason text check (char_length(reason) <= 1000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null
);

alter table public.guide_deletion_requests enable row level security;

create policy "Guide owners can request deletion"
  on public.guide_deletion_requests for insert to authenticated
  with check (
    (select auth.uid()) = owner_id
    and status = 'pending'
    and exists (
      select 1 from public.guides
      where id = guide_id and owner_id = (select auth.uid())
    )
  );

create policy "Guide owners can view their requests"
  on public.guide_deletion_requests for select to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Admins can manage deletion requests"
  on public.guide_deletion_requests for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create index if not exists guide_reports_status_created_at_idx
  on public.guide_reports (status, created_at desc);

create index if not exists guide_deletion_requests_status_created_at_idx
  on public.guide_deletion_requests (status, created_at desc);

-- 첫 관리자 지정: 아래 이메일을 실제 운영자 이메일로 바꿔 한 번 실행하세요.
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'admin@example.com');
