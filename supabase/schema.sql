-- Spira — Supabase 스키마 (STEP 1: 계정 + 데이터베이스)
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.

-- 1) 사용자 프로필
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,
  display_name text,
  avatar_url   text,
  created_at   timestamptz default now()
);

-- 2) 사용자별 앱 데이터 (MVP: AppData 통째로 jsonb 한 행)
--    나중에 정규화가 필요하면 테이블을 분리한다.
create table if not exists public.app_data (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- 3) Row Level Security — 본인 데이터만 읽고 쓸 수 있음 (데이터 분리)
alter table public.profiles enable row level security;
alter table public.app_data enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own app_data" on public.app_data;
create policy "own app_data" on public.app_data
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 4) 신규 가입 시 프로필 자동 생성
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5) updated_at 자동 갱신
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists app_data_touch on public.app_data;
create trigger app_data_touch
  before update on public.app_data
  for each row execute function public.touch_updated_at();
