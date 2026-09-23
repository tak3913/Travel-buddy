create table if not exists public.trip_proposals (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null unique references public.inquiries(id) on delete cascade,
  guide_id uuid references public.guides(id) on delete set null,
  guide_owner_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'declined', 'withdrawn')),
  available_start date not null,
  available_end date not null,
  duration_hours numeric(4, 1) not null check (duration_hours > 0 and duration_hours <= 24),
  quoted_price integer not null check (quoted_price >= 0),
  currency text not null default 'KRW' check (currency in ('KRW', 'USD')),
  inclusions text check (char_length(inclusions) <= 2000),
  message text not null check (char_length(message) between 1 and 2000),
  sent_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (available_end >= available_start)
);

alter table public.trip_proposals enable row level security;

create policy "Travelers and addressed guides can view proposals"
  on public.trip_proposals for select to authenticated
  using (
    (select auth.uid()) = guide_owner_id
    or exists (
      select 1 from public.inquiries
      where inquiries.id = inquiry_id and inquiries.requester_id = (select auth.uid())
    )
  );

create policy "Addressed guides can create proposals"
  on public.trip_proposals for insert to authenticated
  with check (
    (select auth.uid()) = guide_owner_id
    and exists (
      select 1 from public.inquiries
      where inquiries.id = inquiry_id and inquiries.guide_owner_id = (select auth.uid())
    )
  );

create policy "Addressed guides can update proposals"
  on public.trip_proposals for update to authenticated
  using ((select auth.uid()) = guide_owner_id)
  with check ((select auth.uid()) = guide_owner_id);

-- 여행객은 API UPDATE 권한이 아니라 이 함수로만 수락합니다.
create or replace function public.accept_trip_proposal(proposal_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  proposal_inquiry_id uuid;
  proposal_status text;
  traveler_id uuid;
begin
  select p.inquiry_id, p.status, i.requester_id
    into proposal_inquiry_id, proposal_status, traveler_id
  from public.trip_proposals p
  join public.inquiries i on i.id = p.inquiry_id
  where p.id = proposal_id
  for update of p;

  if proposal_inquiry_id is null then
    raise exception '제안서를 찾을 수 없습니다.';
  end if;
  if traveler_id <> auth.uid() then
    raise exception '이 제안서를 수락할 권한이 없습니다.';
  end if;
  if proposal_status <> 'sent' then
    raise exception '현재 수락할 수 없는 제안서입니다.';
  end if;

  update public.trip_proposals
    set status = 'declined', updated_at = now()
    where inquiry_id = proposal_inquiry_id and id <> proposal_id and status = 'sent';

  update public.trip_proposals
    set status = 'accepted', accepted_at = now(), updated_at = now()
    where id = proposal_id;
end;
$$;

create table if not exists public.trip_plans (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null unique references public.trip_proposals(id) on delete cascade,
  guide_owner_id uuid not null references auth.users(id) on delete cascade,
  traveler_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '여행 계획',
  status text not null default 'draft' check (status in ('draft', 'revision_requested', 'finalized')),
  guide_note text check (char_length(guide_note) <= 3000),
  finalized_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.trip_plans enable row level security;

create policy "Travelers and guides can view their trip plans"
  on public.trip_plans for select to authenticated
  using ((select auth.uid()) = guide_owner_id or (select auth.uid()) = traveler_id);

create policy "Accepted proposal guides can create plans"
  on public.trip_plans for insert to authenticated
  with check (
    (select auth.uid()) = guide_owner_id
    and exists (
      select 1 from public.trip_proposals
      where id = proposal_id and status = 'accepted' and guide_owner_id = (select auth.uid())
    )
  );

create policy "Guides can update their plans"
  on public.trip_plans for update to authenticated
  using ((select auth.uid()) = guide_owner_id)
  with check ((select auth.uid()) = guide_owner_id);

create table if not exists public.trip_plan_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.trip_plans(id) on delete cascade,
  day_number smallint not null check (day_number between 1 and 31),
  start_time time not null,
  end_time time,
  sort_order integer not null default 0,
  title text not null,
  place_name text not null,
  address text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  google_place_id text,
  google_maps_url text,
  transport text,
  description text check (char_length(description) <= 2000),
  created_at timestamptz not null default now(),
  check (end_time is null or end_time >= start_time)
);

alter table public.trip_plan_items enable row level security;

create policy "Plan participants can view itinerary items"
  on public.trip_plan_items for select to authenticated
  using (exists (
    select 1 from public.trip_plans
    where id = plan_id and ((select auth.uid()) = guide_owner_id or (select auth.uid()) = traveler_id)
  ));

create policy "Plan guides can manage itinerary items"
  on public.trip_plan_items for all to authenticated
  using (exists (
    select 1 from public.trip_plans
    where id = plan_id and (select auth.uid()) = guide_owner_id
  ))
  with check (exists (
    select 1 from public.trip_plans
    where id = plan_id and (select auth.uid()) = guide_owner_id
  ));

create table if not exists public.trip_plan_review_requests (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.trip_plans(id) on delete cascade,
  traveler_id uuid not null references auth.users(id) on delete cascade,
  message text not null check (char_length(message) between 1 and 2000),
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.trip_plan_review_requests enable row level security;

create policy "Plan participants can view review requests"
  on public.trip_plan_review_requests for select to authenticated
  using (exists (
    select 1 from public.trip_plans
    where id = plan_id and ((select auth.uid()) = guide_owner_id or (select auth.uid()) = traveler_id)
  ));

create policy "Travelers can request plan revisions"
  on public.trip_plan_review_requests for insert to authenticated
  with check (
    (select auth.uid()) = traveler_id
    and exists (select 1 from public.trip_plans where id = plan_id and traveler_id = (select auth.uid()))
  );

create policy "Plan guides can resolve review requests"
  on public.trip_plan_review_requests for update to authenticated
  using (exists (select 1 from public.trip_plans where id = plan_id and guide_owner_id = (select auth.uid())));

create index if not exists trip_proposals_guide_status_idx on public.trip_proposals (guide_owner_id, status, created_at desc);
create index if not exists trip_proposals_inquiry_idx on public.trip_proposals (inquiry_id);
create index if not exists trip_plan_items_plan_day_idx on public.trip_plan_items (plan_id, day_number, start_time, sort_order);
