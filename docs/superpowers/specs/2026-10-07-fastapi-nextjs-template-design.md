# FastAPI + Next.js + Turborepo 템플릿 설계

작성일: 2026-10-07
상태: 사용자 승인 후 구현

## 목적과 범위

사용자 요청은 기존 프로젝트와 별도로 FastAPI, Next.js, Turborepo를 결합한 재사용 가능한 새 템플릿을 만드는 것이다. 생성 위치는 `/home/user/workspace/fastapi-nextjs-template`로 제안한다. 이 문서의 추가 선택 사항은 기본 제안이며 사용자 검토에서 변경할 수 있다.

템플릿은 설치 후 루트의 단일 명령으로 두 개발 서버를 실행하고, 예제 화면에서 API 응답과 연결 실패를 확인할 수 있어야 한다. DB, 인증, 배포 서비스 연결, 외부 계정 연동은 기본 범위에 포함하지 않는다.

## 접근 방식

1. **권장: pnpm + uv, Turborepo로 명령 통합.** JavaScript와 Python 의존성을 각 생태계에서 관리하고 API 디렉터리의 작은 package.json이 uv 명령을 Turbo에 노출한다. Python 실행에 uv 설치가 필요하지만 잠금 파일과 가상 환경 관리가 명확하다.
2. pnpm + pip/venv: 추가 Python 도구는 줄지만 가상 환경 활성화와 의존성 고정 작업을 별도로 관리해야 한다.
3. Docker 우선 구성: 실행 환경을 통일할 수 있지만 기본 템플릿에 Docker 설치와 컨테이너 개발 흐름이 추가된다. 이번 기본 구성에서는 제외한다.

## 디렉터리 구조

```text
fastapi-nextjs-template/
  apps/
    web/                     # Next.js App Router, TypeScript, Tailwind CSS
      src/app/
      src/lib/
      package.json
      .env.example
    api/                     # FastAPI, Python 3.12+, uv
      app/main.py
      app/core/config.py
      app/api/routes/health.py
      tests/
      pyproject.toml
      uv.lock
      package.json           # Turbo 작업 연결용 uv 명령
      .env.example
  packages/
    typescript-config/       # 재사용 가능한 TS 설정
    eslint-config/           # 재사용 가능한 Next.js ESLint 설정
  .github/workflows/ci.yml
  package.json
  pnpm-workspace.yaml
  pnpm-lock.yaml
  turbo.json
  .gitignore
  README.md
```

공유 UI 라이브러리나 API 클라이언트 생성 패키지는 실제 소비자가 추가될 때 도입한다. Node와 pnpm은 구현 시 공식 요구사항과 사용 가능한 안정 버전을 확인해 고정한다. pnpm 및 uv 잠금 파일은 함께 제공한다.

## 실행과 데이터 흐름

루트 `pnpm setup`은 API의 uv 동기화를 수행한다. README의 최초 설치 절차는 `pnpm install`, `pnpm setup`, `pnpm dev` 순서다. 환경 변수는 개발 기본값으로도 동작하며 `.env.example` 복사 절차를 안내한다.

`pnpm dev`는 Turbo의 persistent 작업으로 웹 3000 포트와 API 8000 포트를 병렬 실행한다. Next.js의 `/api/:path*` rewrite가 FastAPI의 `/api/:path*`로 전달한다. 웹 요청은 상대 경로를 사용하며 API 원점은 서버 전용 `API_URL`로 설정한다. 브라우저에 내부 API 호스트 값을 노출하지 않는다.

FastAPI는 앱 팩토리, 환경 설정, `/api/health`, `/docs`를 제공한다. 헬스 응답은 JSON `{ "status": "ok" }`다. 웹 예제는 사용자가 상태 조회를 실행할 때 이 응답을 표시하고 실패 시 재시도 가능한 오류 메시지를 보여 준다. 웹 빌드 단계에는 실행 중인 API가 필요하지 않는다.

## 명령과 캐시

- `pnpm dev`: 두 개발 서버 실행; 캐시 비활성화.
- `pnpm build`: Next.js 프로덕션 빌드. Python 서비스에 가짜 빌드 단계를 만들지 않는다.
- `pnpm lint`: 웹 ESLint, API Ruff 검사 및 포맷 검사.
- `pnpm typecheck`: 웹 Next.js 타입 생성 및 TypeScript 검사.
- `pnpm test`: API pytest 및 실제 로컬 HTTP 서버를 이용한 웹 API 응답 검증. 앱 간 연결은 실행 중인 서버를 통한 통합 확인으로 검증한다.
- `pnpm start`: 웹 프로덕션 서버와 API 실행; 캐시 비활성화.

Turbo는 공유 설정 의존 관계를 추적하고 웹 빌드 결과는 `.next/**`에서 `.next/cache/**`를 제외해 저장한다. API 작업에는 Python 소스, pyproject.toml 및 uv.lock 변경이 캐시 키에 반영되어야 한다. 설정에 영향을 주는 환경 변수와 .env 파일을 해시에 반영한다. CI는 잠금 파일을 변경하지 않는 설치를 사용한다.

## 검증과 완료 기준

1. 루트 설치와 uv 동기화가 성공하고 잠금 파일이 제공된다.
2. lint, typecheck, API 테스트, 웹 빌드가 성공한다.
3. API 테스트로 헬스 응답 계약을 확인한다.
4. 개발 서버 실행 후 API 직접 요청과 Next.js 프록시 경유 요청이 같은 응답을 반환한다.
5. CI가 동일한 품질 검사를 실행한다.
6. 한국어 README에 요구 도구, 실행, 환경 변수, 구조, 포트 변경, 프로젝트 이름 변경 및 템플릿 복제 절차가 명시된다.

## 공식 참고 자료

- https://turborepo.com/docs/crafting-your-repository/structuring-a-repository
- https://turborepo.com/docs/crafting-your-repository/configuring-tasks
- https://nextjs.org/docs/app/getting-started/installation
- https://docs.astral.sh/uv/guides/projects/
- https://docs.astral.sh/uv/guides/integration/fastapi/
