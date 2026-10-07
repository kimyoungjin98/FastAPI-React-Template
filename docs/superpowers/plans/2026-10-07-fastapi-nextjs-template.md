# FastAPI + Next.js Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 새 프로젝트에서 복제하여 바로 개발할 수 있는 FastAPI + Next.js + Turborepo 템플릿을 제공한다.

**Architecture:** pnpm workspace에서 apps/web과 apps/api를 Turbo 작업으로 실행한다. Python은 uv로 독립 관리하며 Next.js rewrite로 웹과 API를 연결한다.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, FastAPI, uv, pytest, Ruff, pnpm, Turborepo.

**Spec:** ../specs/2026-10-07-fastapi-nextjs-template-design.md

## Global Constraints

- 생성 위치: `/home/user/workspace/fastapi-nextjs-template`.
- API: Python 3.12+, uv 잠금 파일; Node 및 pnpm 버전 고정.
- 웹/API 기본 포트: 3000/8000; 헬스 계약: GET `/api/health` → `{ "status": "ok" }`.
- DB, 인증, 배포 서비스 연결, 외부 계정 연동은 기본 범위에 포함하지 않는다.
- 빌드는 실행 중인 API 없이 성공해야 한다.
- 문서는 한국어로 작성한다.

## Review Focus

- API 중단: 웹 요청은 오류를 표시하고 재시도할 수 있어야 한다.
- 응답 스키마가 잘못됨: 웹 API 함수는 성공으로 오인하지 않아야 한다.
- 환경 변수 변경: API_URL과 API 설정 변경이 실제 실행 및 캐시 키에 반영되어야 한다.
- 깨끗한 복제: 잠금 파일 고정 설치와 uv 동기화가 성공해야 한다.
- 빌드 시 API 미실행: 정적 페이지 빌드는 네트워크 연결을 요구하지 않아야 한다.

### Task 1: FastAPI 서비스와 실행 기반

**Files:** 루트 package.json/pnpm-workspace.yaml/turbo.json/.gitignore, apps/api/package.json/pyproject.toml/.python-version/.env.example, apps/api/app/main.py/core/config.py/api/routes/health.py, apps/api/tests/test_health.py.

**Interfaces:** Produces `create_app() -> FastAPI`, `GET /api/health`, uv 명령을 호출하는 setup/dev/start/lint/test 스크립트.

- [x] pnpm/Turbo workspace와 Python 개발 의존성을 설정하고 uv 동기화한다.
- [x] 헬스 계약 테스트와 설정 환경 변수 반영 테스트를 먼저 작성한다.
- [x] 앱 팩토리와 설정의 최소 골격에서 응답 계약 테스트가 실패함을 확인한다.
- [x] 헬스 라우트와 환경 설정을 구현하고 API 전체 테스트·Ruff 검사 성공을 확인한다.

### Task 2: Next.js 웹과 공유 설정

**Files:** apps/web/package.json/next.config.ts/tsconfig.json/eslint.config.mjs/postcss.config.mjs/.env.example, apps/web/src/app/{layout.tsx,page.tsx,globals.css}, apps/web/src/lib/health.ts, apps/web/tests/health.test.ts, packages/{typescript-config,eslint-config}/package.json과 설정 파일.

**Interfaces:** Consumes GET `/api/health`; produces `fetchHealth(): Promise<{ status: "ok" }>`와 사용자 상태 조회 화면. 서버 환경 변수 `API_URL`은 rewrite 대상이다.

- [x] 공유 설정과 웹 의존성을 생성하고 pnpm 설치로 잠금 파일을 생성한다.
- [x] API 성공/HTTP 실패/잘못된 JSON 스키마의 웹 함수 테스트를 작성하고 최소 골격에서 실패함을 확인한다.
- [x] 상대 경로 조회, 오류 처리, 조회 중 중복 클릭 방지, 재조회 가능한 화면을 구현한다.
- [x] 웹 함수 테스트, ESLint, 타입 검사, API를 실행하지 않은 프로덕션 빌드를 검증한다.

### Task 3: 템플릿 배포 준비와 통합 검증

**Files:** README.md, .github/workflows/ci.yml, pnpm-lock.yaml, apps/api/uv.lock.

**Interfaces:** Consumes Task 1/2의 루트 명령; produces 한국어 설치·복제·환경 변수·포트·확장 안내와 고정 설치 CI.

- [x] README와 GitHub Actions에 고정 설치, setup, lint, typecheck, test, build 절차를 반영한다.
- [x] 루트 명령 전체를 실행해 종료 코드와 결과를 확인한다.
- [x] 실제 dev 서버를 실행하고 직접 API와 웹 프록시 응답 및 웹 페이지를 확인한다.
- [x] API를 중단한 프록시 실패 경로와 API 재시작 후 복구를 확인하고 서버를 정리한다.
- [x] 잠금 파일 고정 설치, 코드 리뷰, Git 상태를 확인하고 검증된 템플릿을 커밋한다.
