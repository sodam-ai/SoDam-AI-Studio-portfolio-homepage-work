# Task Checklist

- [x] Remove 'AI Command Terminal' section from landing page
- [x] Remove floating terminal button from `ClientLayout.tsx`
- [x] Update FEATURED_PROJECTS with AI-centric content
- [x] Fix logo navigation link in Navbar
- [x] Resolve hydration errors in Hero, Navbar, and ClientLayout
- [x] Fix Tailwind CSS utility linting errors (v4 migration)
- [x] Final 10-step verification
- [x] 관리자 페이지 데이터 미반영 이슈 (캐싱/경로) 해결
- [x] `projects.json` 데이터를 메인/Work 페이지에 실시간 연동
- [x] `site-config.json` 데이터를 레이아웃/Hero에 연동
- [x] Hero 섹션 정밀 제어 및 스타일 고도화 (1차 완료)
  - [x] Line 스타일 스타일 버그 수정 (글자 사라짐 방지)
  - [x] Accent, Glow 신규 스타일 추가
  - [x] 단어 클릭 시 스타일 순환(Solid->Line->Accent->Glow) 기능 구현
  - [x] 수직 정렬, Content Gap, Vertical Offset 제어 UI 추가
- [/] Hero 섹션 높이 제어 및 쇼케이스 간격 최적화 (진행 중)
  - [x] 간격 문제 원인 분석 (min-height: 100vh 고정 문제)
  - [x] 구현 계획서 작성 및 업데이트
  - [x] 관리자 페이지 블랙스크린 이슈 해결 (AnimatePresence mode="wait" 적용)
- [x] 관리자 메뉴 구조 재편성 (서비스 운영 중심 한국어 로컬라이징)
- [x] 쇼케이스 섹션 고도화 제어 UI 구현 (그리드, 화면비, 호버 요소)
- [x] 실환경 검증 및 빌드 에러 정비 완료

### Step 3: 시스템 리팩토링 및 아키텍처 고도화

- [ ] `LandingSectionsSettings.tsx` 대형 컴포넌트 분리 (섹션별 독립 컴포넌트화)
- [ ] `SiteConfig` 및 섹션 설정 타입 정합성 강화 (`src/types/config.ts` 업데이트)
- [ ] 관리자 설정 UI의 공통 패턴(버튼 그룹, 토글 스위치 등) 추상화
- [ ] 데이터 저장 시 유효성 검사 로직 보강
- [ ] 최종 성능 최적화 및 코드 클린업
- [x] `about.json` 데이터를 About 페이지에 연동
- [x] 사이트 확인을 위한 로컬 개발 서버 실행 (http://localhost:8123)
- [x] 사용자 직접 확인 및 피드백 반영 (404 오류 및 제어 이슈 수정 완료)
- [x] 빌드 에러 및 관리자 페이지 제어 통로 복구 완료 (npx next build 성공)
