# 여행버디 (yeohaeng-buddy)

리디자인이 적용된 **jsx 전용** 프로젝트입니다. 이 폴더 하나만 쓰시면 되고,
기존 `guide-marketplace` / tsx 버전은 필요 없습니다.

## 실행

```bash
cd yeohaeng-buddy
npm install
npm run dev     # http://localhost:5173
```

## 이번 리디자인에서 바뀐 것

- **로고**: 파도 + 나침반 추상 마크 (`public/yeohaeng-buddy-logo.svg`).
  어두운 배경용 단색 버전은 `public/yeohaeng-buddy-logo-mono.svg`.
- **헤더**: 진한 네이비 → 흰 배경 + 얇은 하단 보더. 로고/워드마크 확대.
- **검색창**: "어디로" 라벨이 붙은 알약형 + 우측 파란 원형 검색 버튼.
- **필터칩**: 흰 배경 + 보더, 선택 시 파란 채움.
- **히어로**: LOCAL GUIDE CONCIERGE 라벨, 44px 헤드라인, 지표 3개.
  문구는 기존 `src/data/i18n.js` 값을 그대로 사용합니다.
- **카드**: 이미지 라운드 18px, 호버 시 살짝 떠오름, 매칭 배지 좌하단 흰 배지.
- **언어 선택 / 유저 메뉴**: 흰 헤더에 맞춰 보더형으로 변경.
- **폰트**: Fraunces 제거, Pretendard Variable 하나로 통일.

## 화면 구성

- `/` 홈 (헤더 · 히어로 · 카드 그리드)
- `/guide/:id` 가이드 상세 모달
- `/login`, `/signup` 로그인 · 회원가입
- `/guides/new` 가이드 카드 등록 (로그인 필요)

## 색상 토큰 (tailwind.config.js)

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `brand.primary` | #2563EB | CTA, 활성 상태 |
| `brand.primaryDark` | #1E40AF | hover |
| `brand.primaryLight` / `primarySoft` | #EFF6FF / #DBEAFE | 배지, 은은한 배경 |
| `brand.ink` / `navy` | #17223B | 본문 텍스트 |
| `brand.sub` / `faint` | #64748B / #94A3B8 | 보조 텍스트 |
| `brand.border` / `borderSoft` | #E3EAF5 / #EEF2F9 | 테두리 |
| `brand.bgSoft` / `tint` | #F6F9FE / #F4F9FF | 페이지 배경, 옅은 섹션 |

`brand.navy`는 더 이상 네비바 배경색이 아니라 **본문 잉크색**입니다.
다른 컴포넌트에서 `bg-brand-navy`를 새로 쓰지 마세요.

## Supabase 인증 설정

인증은 Supabase Auth를 사용합니다. 실행 전 프로젝트 루트의 `.env.example`을
복사해 `.env`를 만들고 API 값을 채우세요. `.env`는 저장소에 커밋하지 않습니다.

1. Supabase SQL Editor에서 `supabase/migrations/20260921000000_create_profiles.sql`을 실행합니다.
2. Authentication > URL Configuration에서 Site URL과 Redirect URLs에 개발/운영 도메인의
   `/auth/callback` 주소를 등록합니다. 예: `http://localhost:5173/auth/callback`
3. Authentication > Providers에서 Google과 Kakao를 각각 활성화하고, 각 제공자 콘솔의
   Supabase callback URL을 허용 리디렉션 URI로 등록합니다.
4. 이메일 인증을 켠 경우, 가입자는 인증 메일의 링크를 연 뒤 로그인할 수 있습니다.

프로필에는 이름, 전화번호, 우편번호 및 주소가 본인만 조회·수정하도록 RLS 정책이 적용됩니다.
주민등록번호 원문은 수집하거나 저장하지 않습니다. 법적으로 필요한 본인확인은 본인확인
사업자 연동으로 처리하고, 검증 결과만 최소한으로 보관하세요.

## 참고

- 가이드 사진은 기존 외부 URL을 그대로 사용합니다.
- 새 가이드 추가는 `src/data/guides.js`, 다국어 문구는 `src/data/i18n.js`에서 편집합니다.
