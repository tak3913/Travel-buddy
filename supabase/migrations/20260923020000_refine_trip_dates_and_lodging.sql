-- 여행 문의: 숙박 수와 숙소 정보를 별도로 보관합니다.
alter table public.inquiries
  add column if not exists nights smallint,
  add column if not exists lodging text;

alter table public.inquiries
  add constraint inquiries_nights_check
  check (nights is null or nights between 0 and 30);

alter table public.inquiries
  add constraint inquiries_lodging_length_check
  check (lodging is null or char_length(lodging) <= 500);

-- 가이드의 제안은 특정 시간 수가 아니라 여행 전체를 기준으로 합니다.
alter table public.trip_proposals
  drop column if exists duration_hours;
