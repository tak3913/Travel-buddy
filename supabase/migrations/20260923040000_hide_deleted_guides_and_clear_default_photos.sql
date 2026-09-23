-- 이전 버전이 자동으로 넣었던 기본 Picsum 이미지는 빈 사진 목록으로 정리합니다.
update public.guides
  set photos = '{}'::text[]
  where photos = array['1015', '1024', '1035']::text[];
