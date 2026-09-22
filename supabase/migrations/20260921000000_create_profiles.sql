-- auth.users는 Supabase Auth가 관리합니다. 앱에서는 profiles만 직접 조회합니다.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  postal_code text,
  address text,
  address_detail text,
  terms_agreed_at timestamptz,
  privacy_agreed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- 이메일 가입과 소셜 가입 모두에서 profile을 자동 생성합니다.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (
    id, full_name, phone, postal_code, address, address_detail,
    terms_agreed_at, privacy_agreed_at
  ) values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    nullif(new.raw_user_meta_data ->> 'postal_code', ''),
    nullif(new.raw_user_meta_data ->> 'address', ''),
    nullif(new.raw_user_meta_data ->> 'address_detail', ''),
    coalesce((new.raw_user_meta_data ->> 'terms_agreed_at')::timestamptz, now()),
    coalesce((new.raw_user_meta_data ->> 'privacy_agreed_at')::timestamptz, now())
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 주민등록번호 원문은 이 DB에 저장하지 않습니다. 본인확인이 필요할 때에는
-- 별도 본인확인 사업자의 토큰/검증 결과만 최소 보관하는 전용 Edge Function을 사용하세요.
