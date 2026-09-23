-- profiles.role은 과거 호환용 값으로만 남기고, 권한 판정에는 절대 사용하지 않습니다.
-- 일반 사용자의 profile UPDATE 정책으로 role이 바뀌어도 관리자 권한에 영향을 주지 않습니다.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  assigned_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
-- admin_users에는 사용자용 RLS 정책을 만들지 않습니다. Dashboard SQL Editor로만 관리합니다.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
$$;

-- 기존 profiles.role은 어떠한 클라이언트 요청으로도 바꿀 수 없게 고정합니다.
create or replace function public.keep_profile_role_unchanged()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.role := old.role;
  return new;
end;
$$;

drop trigger if exists keep_profile_role_unchanged on public.profiles;
create trigger keep_profile_role_unchanged
  before update on public.profiles
  for each row execute procedure public.keep_profile_role_unchanged();

-- 물리 삭제 대신 deleted 상태로 보관합니다.
alter table public.guides
  add column if not exists deleted_at timestamptz;
alter table public.guides drop constraint if exists guides_status_check;
alter table public.guides
  add constraint guides_status_check check (status in ('draft', 'published', 'private', 'hidden', 'deleted'));

-- 프런트엔드에서 물리 삭제할 경로를 제거합니다.
drop policy if exists "Admins can delete guides" on public.guides;

-- 가이드가 삭제되어도 신고와 삭제 요청의 검토 이력을 남깁니다.
alter table public.guide_reports
  add column if not exists guide_name text;
alter table public.guide_reports
  alter column guide_id drop not null;
alter table public.guide_reports
  drop constraint if exists guide_reports_guide_id_fkey;
alter table public.guide_reports
  add constraint guide_reports_guide_id_fkey
  foreign key (guide_id) references public.guides(id) on delete set null;

alter table public.guide_deletion_requests
  add column if not exists guide_name text;
alter table public.guide_deletion_requests
  alter column guide_id drop not null;
alter table public.guide_deletion_requests
  drop constraint if exists guide_deletion_requests_guide_id_fkey;
alter table public.guide_deletion_requests
  add constraint guide_deletion_requests_guide_id_fkey
  foreign key (guide_id) references public.guides(id) on delete set null;

-- 첫 관리자 지정: 실제 운영자 이메일로 바꿔 한 번 실행하세요.
-- insert into public.admin_users (user_id)
-- select id from auth.users where email = 'admin@example.com'
-- on conflict (user_id) do nothing;
