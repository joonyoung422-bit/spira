# Design System — Health Records Dashboard (reference 분석)

레퍼런스 이미지를 분석해 수치화한 디자인 시스템 명세.
기준 캔버스: **1440 × 1024** (데스크탑), 8px 베이스 그리드.

---

## 0. Palette (분석 기반 토큰)

| Token | HEX | 용도 |
|---|---|---|
| `--bg` | `#EFEFEC` | 앱 배경 (warm gray) |
| `--surface` | `#FFFFFF` | 카드 표면 |
| `--surface-muted` | `#F5F5F2` | 카드 내부 보조 영역 |
| `--ink` | `#111111` | 기본 텍스트 / 블랙 버튼 |
| `--ink-secondary` | `#6B6B6B` | 보조 텍스트 |
| `--ink-tertiary` | `#A0A0A0` | 캡션 / 비활성 |
| `--accent` | `#C8F94E` (lime) | 강조·하이라이트·차트 바·활성 칩 |
| `--accent-ink` | `#1B2400` | accent 위 텍스트 |
| `--border` | `#E6E6E2` | 카드/구분선 |
| `--positive` | `#9BE000` | 증감 +태그 |

---

## 1. Navigation

### 1-1. Left rail (사이드 아이콘 내비)
| 속성 | 값 |
|---|---|
| width | `64px` |
| 배경 | `--bg` (투명 동화) |
| 아이템 크기 | `40 × 40px` |
| 아이템 radius | `12px` (활성), 원형 아이콘 |
| 활성 표시 | `--accent` 칩 배경 + 라벨(`Sp02` 등) |
| 아이템 세로 간격 | `12px` |
| 아이콘 size | `20px` |
| 상단 로고 | `28 × 28px`, 캔버스 상단 `24px` |
| 하단 유저 버튼 | `40px` 원형, bottom `24px` |

### 1-2. Top bar
| 속성 | 값 |
|---|---|
| height | `64px` |
| 좌측 컨트롤 캡슐 | height `44px`, radius `22px` (pill) |
| 아이콘 버튼 | `36 × 36px` 원형, 간격 `8px` |
| 프로필 캡슐 | height `44px`, 좌우 padding `8px / 16px`, 아바타 `32px` |
| 우측 날짜/메뉴 캡슐 | height `44px`, radius `22px` |
| 그룹 간 간격 | `16–24px` |

### 1-3. Tab / segment (카드 내 탭)
| 속성 | 값 |
|---|---|
| tab height | `32px` |
| radius | `16px` (pill) |
| 활성 배경 | `--accent` |
| 비활성 텍스트 | `--ink-secondary` |
| tab 간격 | `8px` |
| 우측 토글(Weekly 등) | height `40px`, radius `20px`, 블랙 fill |

---

## 2. Card

| 속성 | 값 |
|---|---|
| 배경 | `--surface` (#FFFFFF) |
| radius | `24px` (대형 카드) / `16px` (중형) / `12px` (내부 셀) |
| padding | `24px` (대형) / `16px` (소형) |
| border | `1px solid --border` 또는 none |
| 카드 간 gap | `16px` |
| 내부 섹션 gap | `16px` |
| 카드 헤더 높이 | `24px` (타이틀 + 우측 액션) |
| 헤더-본문 간격 | `16px` |
| 카드 내 칩/배지 radius | `999px` (pill) |
| 강조 카드(Progress 등) | 좌상단 `--accent` 점/라벨 + 화이트 본문 |
| 미니 통계 셀 | radius `12px`, padding `16px`, 배경 `--surface-muted` |

대표 카드 유형
- **Wellness (KPI)**: 큰 숫자 + 보조 통계 2분할
- **Analytics (chart)**: 헤더 메트릭 + 바 차트 + 하단 탭
- **Progress / Workout**: 썸네일 + 리스트 + 우측 큰 수치
- **Breath / Body**: 일러스트 + 인터랙티브 게이지

---

## 3. Typography

폰트: Grotesk 계열 sans (예: `Geist`, `Inter`, `Space Grotesk`).
스케일 (px / line-height / weight):

| 토큰 | size | line-height | weight | letter-spacing | 용도 |
|---|---|---|---|---|---|
| `display` | `40px` | `44px` | 700 | -0.02em | "Dashboard" 타이틀 |
| `h1` | `28px` | `34px` | 600 | -0.01em | 섹션 제목 |
| `metric-xl` | `48px` | `52px` | 700 | -0.02em | 큰 KPI 수치 (139, 19,365) |
| `metric-lg` | `32px` | `38px` | 700 | -0.01em | 카드 수치 (97.5%, 10.57) |
| `h2` | `18px` | `24px` | 600 | 0 | 카드 타이틀 |
| `body` | `14px` | `20px` | 400 | 0 | 본문 |
| `label` | `13px` | `18px` | 500 | 0 | 칩/탭 라벨 |
| `caption` | `11px` | `14px` | 500 | 0.04em (uppercase) | 메타·단위·캡션 |
| `tag` | `10px` | `12px` | 600 | 0 | +5% 증감 태그 |

규칙
- 숫자(KPI)는 `tabular-nums`, 볼드.
- 캡션·라벨은 `UPPERCASE` + 자간 +.
- 위계: display(40) → metric-xl(48) → h2(18) → body(14) → caption(11).

---

## 4. Grid

| 속성 | 값 |
|---|---|
| 콘텐츠 영역 width | `1440 - 64(rail) - 64(좌우 padding) ≈ 1312px` |
| 컬럼 | `12 columns` |
| gutter | `16px` |
| column width | `~93px` (계산값) |
| 대시보드 매크로 레이아웃 | 3-zone: **좌 KPI(3col)** · **중앙 Analytics(6col)** · **우 Progress(3col)** |
| 하단 행 | 3-zone: `4col / 4col / 4col` (Exposure · Breath · Workout) |
| 행 간 gap | `16px` |
| 카드 최소 높이 | `KPI 220px / chart 280px / mini 120px` |

반응형 분기 (권장)
- `≥1280px`: 12-col, 3-zone
- `768–1279px`: 8-col, 2-zone (우측 패널 하단 이동)
- `<768px`: 1-col 스택, rail → 하단/햄버거

---

## 5. Spacing

8px 베이스 스케일.

| 토큰 | 값 |
|---|---|
| `space-0` | `4px` |
| `space-1` | `8px` |
| `space-2` | `12px` |
| `space-3` | `16px` |
| `space-4` | `24px` |
| `space-5` | `32px` |
| `space-6` | `48px` |

적용
- 카드 외부 gap: `16px` (space-3)
- 카드 내부 padding: `24px` (space-4)
- 요소 간 기본 간격: `8–12px`
- 페이지 좌우 padding: `32px` (space-5)
- 탑바 ↔ 콘텐츠: `24px`
- 칩 내부 padding: `6px 12px`

---

## 6. Radius

| 토큰 | 값 | 용도 |
|---|---|---|
| `radius-pill` | `999px` | 칩·탭·캡슐 버튼·태그 |
| `radius-card` | `24px` | 대형 카드 |
| `radius-md` | `16px` | 중형 카드·세그먼트 |
| `radius-sm` | `12px` | 내부 셀·미니 통계·아이콘 버튼 |
| `radius-xs` | `8px` | 인풋·작은 배지 |
| `radius-full` | `50%` | 아바타·아이콘 버튼·게이지 |

규칙: 바깥 컨테이너가 클수록 큰 radius. 중첩 시 내부는 한 단계 작은 값.

---

## 7. Shadows

낮고 부드러운 그림자 (라이트 테마, 거의 평면 + 살짝 떠 있는 느낌).

| 토큰 | 값 | 용도 |
|---|---|---|
| `shadow-none` | `none` | 배경 동화 카드 |
| `shadow-sm` | `0 1px 2px rgba(17,17,17,0.04)` | 칩·인풋 |
| `shadow-card` | `0 4px 16px rgba(17,17,17,0.06)` | 기본 카드 |
| `shadow-md` | `0 8px 24px rgba(17,17,17,0.08)` | 강조 카드·팝오버 |
| `shadow-lg` | `0 16px 40px rgba(17,17,17,0.10)` | 모달·드롭다운 |
| `shadow-accent` | `0 8px 24px rgba(200,249,78,0.35)` | accent 버튼/하이라이트 |

규칙
- 색상은 블랙 기반 저투명도(4–10%), 블러 큼·오프셋 작음 → 소프트.
- border(`1px --border`)와 그림자를 함께 쓰지 않고 둘 중 하나로 깊이 표현.

---

## 요약 토큰 (CSS 변수)

```css
:root {
  /* color */
  --bg:#EFEFEC; --surface:#FFF; --surface-muted:#F5F5F2;
  --ink:#111; --ink-2:#6B6B6B; --ink-3:#A0A0A0;
  --accent:#C8F94E; --accent-ink:#1B2400; --border:#E6E6E2;

  /* radius */
  --r-pill:999px; --r-card:24px; --r-md:16px; --r-sm:12px; --r-xs:8px;

  /* spacing (8px base) */
  --s-0:4px; --s-1:8px; --s-2:12px; --s-3:16px; --s-4:24px; --s-5:32px; --s-6:48px;

  /* shadow */
  --sh-card:0 4px 16px rgba(17,17,17,.06);
  --sh-md:0 8px 24px rgba(17,17,17,.08);
  --sh-lg:0 16px 40px rgba(17,17,17,.10);
}
```
