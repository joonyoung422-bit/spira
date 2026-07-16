# Supabase 셋업 (STEP 1 — 계정 + 데이터베이스)

코드 쪽 기반은 준비됐습니다. 아래 5단계는 **직접** 해주셔야 이어서 인증·저장 연동을 마무리할 수 있어요.
(Supabase는 무료 플랜으로 충분히 시작 가능합니다.)

## 1. 프로젝트 생성
1. https://supabase.com 가입 → **New project**
2. 프로젝트 이름 `spira`, DB 비밀번호 아무거나(잘 보관), 리전은 `Northeast Asia (Seoul)` 권장
3. 생성까지 1~2분 대기

## 2. 스키마 실행
1. 좌측 **SQL Editor** → **New query**
2. 저장소의 `supabase/schema.sql` 내용을 통째로 붙여넣고 **Run**
3. `profiles`, `app_data` 테이블이 생기고 RLS가 켜졌는지 **Table Editor**에서 확인

## 3. API 키 복사 → .env.local
1. **Project Settings → API**
2. 아래 두 값을 프로젝트 루트 `.env.local`에 추가:
```
NEXT_PUBLIC_SUPABASE_URL=https://<프로젝트>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public 키>
```
   ⚠️ `service_role` 키는 절대 넣지 마세요(공개 위험). `anon public` 키만.

## 4. 로그인 방식 활성화 (Authentication → Providers)
- **Email**: 켜기 (가장 간단, 바로 테스트 가능)
- **Google**: 켜기 → 기존 Google OAuth 클라이언트 재사용 가능.
  - Google Cloud Console에서 **승인된 리디렉션 URI**에 다음 추가:
    `https://<프로젝트>.supabase.co/auth/v1/callback`
- **Apple**: 앱스토어 출시 단계에서 설정 (Apple Developer 필요) — 지금은 건너뛰어도 됨

## 5. Site URL 설정 (Authentication → URL Configuration)
- **Site URL**: `http://localhost:3000` (개발용)
- 배포 후 프로덕션 도메인을 추가 (STEP 4에서)

---

## 다 되면 알려주세요
`.env.local`에 위 두 키를 넣고 "완료"라고 하시면, 제가 이어서:
- 로그인 화면을 Supabase 인증으로 교체 (이메일/Google)
- 로그인 강제(middleware 라우트 보호)
- 기존 localStorage 데이터를 서버(app_data)로 자동 이전 + 자동저장·기기 동기화

를 붙이겠습니다. 그 전까지는 앱이 기존 localStorage 방식 그대로 정상 작동합니다.
