-- 가이드가 작성한 계획표를 여행객이 검토한 뒤 최종 확정할 수 있게 합니다.
alter table public.trip_plans
  add column if not exists traveler_confirmed_at timestamptz;

alter table public.trip_plans
  drop constraint if exists trip_plans_status_check;

alter table public.trip_plans
  add constraint trip_plans_status_check
  check (status in ('draft', 'revision_requested', 'ready_for_review', 'traveler_confirmed', 'finalized'));

-- 새 상태를 허용한 뒤, 기존에 가이드가 확정한 계획을 검토 대기로 전환합니다.
update public.trip_plans
  set status = 'ready_for_review'
  where status = 'finalized';

create or replace function public.confirm_trip_plan(plan_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.trip_plans
    set status = 'traveler_confirmed', traveler_confirmed_at = now(), updated_at = now()
    where id = plan_id
      and traveler_id = auth.uid()
      and status = 'ready_for_review';

  if not found then
    raise exception '지금은 이 여행 계획을 최종 확정할 수 없습니다.';
  end if;
end;
$$;
