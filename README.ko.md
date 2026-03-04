<p align="center">
  <h1 align="center">SoDam AI Studio</h1>
  <p align="center">
    AI 기반 크리에이티브 포트폴리오 — 바이브 코딩으로 제작
    <br />
    <a href="#기능"><strong>기능 »</strong></a> · <a href="#시작하기"><strong>시작하기 »</strong></a> · <a href="README.md"><strong>English README »</strong></a>
  </p>
</p>

---

## 개요

**SoDam AI Studio**는 AI 이미지 합성, 영상 제작, 바이브 코딩 등 AI 기반 크리에이티브 작업을 선보이는 프리미엄 포트폴리오 웹사이트입니다. 이 프로젝트는 **AI 에이전트 오케스트레이션**을 통해 설계·개발되었습니다 — Gemini, Claude, Codex 등 여러 AI 코딩 어시스턴트를 자연어 지시만으로 조율하여, 코드를 직접 작성하지 않고 완성했습니다.

## 기술 스택

| 분류              | 기술                              |
| ----------------- | --------------------------------- |
| **프레임워크**    | Next.js 15.1.0 (App Router)       |
| **언어**          | TypeScript 5                      |
| **스타일링**      | Tailwind CSS 4.2.0                |
| **애니메이션**    | Framer Motion 11                  |
| **폼 처리**       | React Hook Form + Zod 유효성 검증 |
| **아이콘**        | Lucide React                      |
| **이미지 최적화** | Next.js Image + Sharp             |
| **보안**          | DOMPurify (XSS 방지)              |
| **패키지 매니저** | pnpm                              |

## 기능

- 🎨 **프리미엄 다크 테마** — 그래디언트 포인트와 glassmorphism 효과의 시네마틱 UI
- ✨ **부드러운 애니메이션** — Framer Motion 기반 페이지 전환 및 마이크로 인터랙션
- 📱 **완전 반응형** — 데스크톱, 태블릿, 모바일 뷰포트에 최적화
- 🖼️ **다이나믹 프로젝트 쇼케이스** — 카테고리 필터링 + 인터랙티브 프로젝트 카드
- 🤖 **AI 인터랙티브 터미널** — 임베디드 AI 어시스턴트 체험
- 🔧 **Admin 패널** — 프로젝트, 설정, 연락처 정보 관리 CMS
- 🛡️ **입력 검증** — Zod 스키마 + DOMPurify 산출물 정화
- 🖥️ **SEO 최적화** — 시맨틱 HTML, 메타 태그, 구조화된 데이터

## 페이지 구성

| 페이지      | 경로       | 설명                                           |
| ----------- | ---------- | ---------------------------------------------- |
| **Home**    | `/`        | 히어로 섹션, 프로젝트 쇼케이스, 철학           |
| **Work**    | `/work`    | 카테고리 필터가 있는 프로젝트 아카이브         |
| **About**   | `/about`   | 크리에이터 소개 및 경력 타임라인               |
| **Contact** | `/contact` | 연락 수단 (이메일, 카카오톡, 인스타그램, 전화) |
| **Admin**   | `/admin`   | 콘텐츠 관리 패널                               |

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── about/              # About 페이지
│   ├── admin/              # Admin 패널
│   ├── api/                # API 라우트 (projects, settings, contact)
│   ├── contact/            # Contact 페이지
│   ├── work/               # Work 아카이브 + 프로젝트 상세 페이지
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # Home 페이지
│   └── globals.css         # 글로벌 스타일 + Tailwind
├── components/
│   ├── features/           # 기능별 컴포넌트 (Admin 폼 등)
│   ├── sections/           # 페이지 섹션 컴포넌트 (Hero, Showcase 등)
│   ├── shared/             # 공유/재사용 컴포넌트
│   └── ui/                 # 기본 UI 프리미티브
├── content/                # JSON 데이터 파일 (projects, contact, settings)
├── data/                   # 정적 데이터 상수
├── hooks/                  # 커스텀 React 훅
├── lib/                    # 유틸리티 함수
└── types/                  # TypeScript 타입 정의
```

## 시작하기

### 사전 요구사항

- **Node.js** 18.17 이상
- **pnpm** (권장) 또는 npm

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/personal-portfolio.git
cd personal-portfolio

# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev
```

개발 서버가 **http://localhost:3000** 에서 실행됩니다.

### 프로덕션 빌드

```bash
# 최적화된 프로덕션 빌드 생성
pnpm build

# 프로덕션 서버 시작
pnpm start
```

## 환경 설정

필요 시 루트 디렉토리에 `.env.local` 파일을 생성하세요:

```env
# 필요한 환경 변수를 여기에 추가
# NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Admin 패널

`/admin` 경로에서 Admin 패널에 접근하여 관리할 수 있습니다:

- **Projects** — 포트폴리오 프로젝트 추가, 편집, 순서 변경
- **Settings** — 사이트 설정, SEO, 브랜딩
- **Contact** — 연락처 정보 및 소셜 링크

## 바이브 코딩으로 제작

이 프로젝트는 소프트웨어 개발의 미래인 **바이브 코딩(Vibe Coding)**을 실증합니다. 모든 코드가 AI 에이전트 오케스트레이션을 통한 자연어 지시로 생성되었습니다:

- **Gemini (Antigravity)** — 메인 오케스트레이터, 아키텍처 설계, 주요 개발
- **Claude Code** — 코드 생성, 자동화 작업
- **Codex (ChatGPT)** — 코드 리뷰, 리팩토링 보조

## 라이선스

이 프로젝트는 개인 포트폴리오 용도입니다.

---

<p align="center">
  <sub>❤️ 와 AI로 만들었습니다 · SoDam AI Studio</sub>
</p>
