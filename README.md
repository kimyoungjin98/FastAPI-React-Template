# FastAPI + Next.js + Turborepo Template

FastAPI와 Next.js를 한 저장소에서 개발하는 모노레포 템플릿입니다. pnpm은 JavaScript workspace를, uv는 Python 의존성과 가상 환경을 관리합니다. Turborepo는 두 앱의 명령과 작업 캐시를 통합합니다.

## 빠른 시작

필요한 도구:

- Node.js 24 이상 (`.nvmrc`: 24)
- pnpm 11.0.9 (`package.json`에 고정)
- uv 0.12.23 권장
- Python 3.12 이상 (`apps/api/.python-version`: 3.12; 없으면 uv가 설치)

Node 설치 후 pnpm은 `npm install -g pnpm@11.0.9`로 준비할 수 있습니다. uv 설치 방법은 [공식 설치 안내](https://docs.astral.sh/uv/getting-started/installation/)를 참고하세요.

```bash
pnpm install --frozen-lockfile
pnpm setup
pnpm dev
```

기본값으로 바로 실행할 수 있습니다. 환경 설정을 바꾸려면 실행 전에 예제 파일을 복사하세요.

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

| 주소 | 용도 |
| --- | --- |
| http://localhost:3000 | 웹 예제 화면 |
| http://localhost:3000/api/health | Next.js 프록시 경유 API |
| http://127.0.0.1:8000/api/health | FastAPI 직접 요청 |
| http://127.0.0.1:8000/docs | Swagger UI |

웹에서 **연결 확인**을 누르면 FastAPI 상태를 조회합니다. API가 중단되거나 잘못된 응답을 보내면 오류를 표시하며 **다시 확인**으로 재시도할 수 있습니다. 요청은 5초 후 취소됩니다.

## 구조

```text
apps/
  web/
    src/app/                 # 화면, 레이아웃, 스타일
    src/lib/health.ts        # API 호출 및 응답 검증
    tests/                   # 실제 로컬 HTTP 서버를 사용하는 테스트
    next.config.ts           # API 프록시 rewrite
  api/
    app/main.py              # 앱 팩토리와 ASGI 앱
    app/core/config.py       # 환경 설정
    app/api/routes/health.py # 헬스 라우트와 응답 모델
    tests/                   # ASGI 응답 계약 테스트
    pyproject.toml           # Python 의존성 및 개발 도구
    uv.lock                  # Python 의존성 잠금 파일
    package.json             # uv 명령을 Turbo 작업으로 연결
packages/
  typescript-config/         # 공통 TS 및 Next.js 설정
  eslint-config/             # 공통 Next.js ESLint 설정
.github/workflows/ci.yml     # 고정 설치, 검사, 테스트, 빌드
turbo.json
pnpm-workspace.yaml
pnpm-lock.yaml
```

## 명령

루트에서 실행합니다.

| 명령 | 실행 내용 |
| --- | --- |
| `pnpm setup` | uv 잠금 파일 기준 API 개발 의존성 설치 |
| `pnpm dev` | 웹과 API 개발 서버 동시 실행 |
| `pnpm build` | Next.js 프로덕션 빌드 |
| `pnpm start` | 빌드된 웹과 API 프로덕션 서버 실행 |
| `pnpm lint` | ESLint, Ruff 및 Python 포맷 검사 |
| `pnpm typecheck` | Next.js 타입 생성 및 TypeScript 검사 |
| `pnpm test` | 웹 API 함수 테스트와 API pytest |
| `pnpm check` | lint → typecheck → test → build 순서로 전체 검사 |

`pnpm start` 전에는 `pnpm build`를 실행하세요. Python 서비스는 빌드 작업 없이 실행됩니다. 웹 빌드는 API 서버 연결을 요구하지 않습니다. 개발 서버는 `Ctrl+C`로 두 앱을 함께 종료합니다.

앱 하나만 실행할 수도 있습니다.

```bash
pnpm --filter @repo/web dev
pnpm --filter @repo/api dev
```

## 환경 변수와 포트

| 변수 | 기본값 | 설정 위치 |
| --- | --- | --- |
| `API_URL` | `http://127.0.0.1:8000` | 웹 `.env.local` 또는 셸 |
| `APP_NAME` | `FastAPI Template` | API `.env` 또는 셸 |
| `PORT` | `3000` | 셸; Next.js 포트 |
| `UVICORN_PORT` | `8000` | 셸; API 포트 |

`API_URL`은 서버 전용 변수입니다. 브라우저는 동일 원점의 `/api/health`를 요청하며 Next.js가 API로 전달합니다. 기본 흐름에는 CORS 설정이 필요하지 않습니다. 브라우저가 다른 원점의 API에 직접 접근하도록 변경할 때 CORS 정책을 추가하세요.

환경 파일을 바꾸면 서버를 재시작하세요. 프로덕션 rewrite 대상은 빌드 시 결정되므로 `API_URL`이 바뀌면 **다시 빌드**해야 합니다. `PORT`와 `UVICORN_PORT`는 환경 파일이 아닌 셸에서 지정합니다.

기본 포트가 사용 중인 경우, macOS/Linux:

```bash
PORT=3100 UVICORN_PORT=8001 API_URL=http://127.0.0.1:8001 pnpm dev
```

Windows PowerShell:

```powershell
$env:PORT = "3100"
$env:UVICORN_PORT = "8001"
$env:API_URL = "http://127.0.0.1:8001"
pnpm dev
```

외부 API 상태를 수동 확인하려면:

```bash
curl http://127.0.0.1:8000/api/health
curl http://localhost:3000/api/health
```

두 요청 모두 `{"status":"ok"}`를 반환해야 합니다.

## 새 프로젝트로 사용하기

GitHub에 이 저장소를 올린 뒤 Settings의 **Template repository**를 켜면 **Use this template**로 새 저장소를 생성할 수 있습니다. 현재 템플릿은 로컬 Git 저장소이며 원격 저장소는 연결되어 있지 않습니다.

로컬에서는 Git에 포함된 파일만 별도 폴더로 내보내면 설치 결과와 기존 Git 이력을 제외한 새 프로젝트를 만들 수 있습니다.

```bash
# 템플릿 루트에서 실행
mkdir -p ../my-project
git archive HEAD | tar -x -C ../my-project
cd ../my-project
git init -b main
```

새 프로젝트 이름은 루트 `package.json`의 `name`, API `pyproject.toml`의 `name`과 `description`, 웹 `layout.tsx`의 메타데이터에서 바꿉니다. workspace 이름인 `@repo/web`, `@repo/api`는 그대로 사용할 수 있습니다. Python 프로젝트 메타데이터 변경 후에는 아래 절차로 잠금 파일을 갱신하세요.

```bash
pnpm install
cd apps/api
uv lock
cd ../..
pnpm setup
pnpm dev
```

`.env` 파일, `node_modules`, `.venv`, `.next`, `.turbo`는 Git에 포함하지 않습니다. `pnpm-lock.yaml`과 `apps/api/uv.lock`은 커밋해서 설치 버전을 재현합니다.

## 기능 추가

- API 라우트: `apps/api/app/api/routes/`에 라우터를 추가하고 `create_app()`에서 `/api` prefix로 등록합니다.
- 웹 화면: `apps/web/src/app/`에 App Router 페이지를 추가합니다.
- 공통 패키지: `packages/`에 `package.json`을 만들고 소비 앱에 `workspace:*` 의존성으로 연결합니다.
- DB와 인증은 필요한 서비스에 맞게 추가합니다.

## 의존성 갱신과 CI

JavaScript 의존성은 `pnpm update`, Python 의존성은 `cd apps/api && uv lock --upgrade`로 갱신합니다. 이후 `pnpm setup`과 `pnpm check`를 실행하고 두 잠금 파일의 변경을 확인하세요.

ESLint는 Next.js 플러그인의 peer dependency 범위를 맞추기 위해 9.39.5로 고정했습니다. major 버전을 올릴 때는 `pnpm peers check`로 호환성을 확인하세요.

pnpm 네이티브 의존성 빌드는 `pnpm-workspace.yaml`의 `allowBuilds`에서 명시합니다. 새 빌드 스크립트가 있는 패키지를 추가할 때 승인 여부를 이 파일에 기록합니다.

GitHub Actions는 Node 24, pnpm 11.0.9, uv 0.12.23으로 `pnpm install --frozen-lockfile`, `pnpm setup`, `pnpm check`를 실행합니다. 원격 저장소에 push하면 동작합니다.

## 공식 참고 자료

- [Turborepo workspace 구조](https://turborepo.dev/docs/crafting-your-repository/structuring-a-repository)
- [Turborepo 작업 설정](https://turborepo.dev/docs/crafting-your-repository/configuring-tasks)
- [Next.js 설치](https://nextjs.org/docs/app/getting-started/installation)
- [uv와 FastAPI](https://docs.astral.sh/uv/guides/integration/fastapi/)
