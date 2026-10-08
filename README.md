# FastAPI + React + Turborepo Template

FastAPI와 React를 한 저장소에서 개발하는 모노레포 템플릿입니다. 프론트엔드는 Vite, TypeScript, Tailwind CSS를 사용합니다. pnpm은 JavaScript workspace를, uv는 Python 의존성과 가상 환경을 관리합니다. Turborepo는 두 앱의 명령과 작업 캐시를 통합합니다.

## 빠른 시작

Node.js 24 이상, pnpm 11 이상, Python 3.12 이상, uv가 필요합니다.

API 실행 스크립트가 uv를 자동으로 찾으므로 별도 PATH 설정은 필요하지 않습니다. PATH, 프로젝트의 `.tools/bin`, 사용자 홈의 `.local/bin`과 `.cargo/bin`을 순서대로 확인합니다. 현재 개발 환경의 기존 `../fastapi-nextjs/.tools/bin` 설치도 지원합니다.

```bash
pnpm install --frozen-lockfile
pnpm setup
pnpm dev
```

웹은 http://localhost:3001, API는 http://127.0.0.1:8001에서 실행합니다. 기존 프로젝트의 3000·8000 포트와 겹치지 않도록 설정했습니다. 웹의 연결 확인 버튼으로 `GET /api/health` 응답을 확인할 수 있습니다.

## 구조

- `apps/web`: React 앱. `src/main.tsx`가 진입점이며 `src/App.tsx`에 기본 화면이 있습니다.
- `apps/api`: FastAPI 앱. `src/main.py`가 진입점입니다.
- `packages`: 공유 ESLint 및 TypeScript 설정입니다.

## API 연결

Vite 개발 서버와 빌드 미리보기 서버가 `/api` 요청을 FastAPI로 전달합니다. 기본 대상은 `http://127.0.0.1:8001`입니다. 변경하려면 `apps/web/.env.example`을 `apps/web/.env`로 복사하고 `API_URL`을 수정한 뒤 웹 서버를 재시작하세요. `API_URL`은 브라우저 번들에 포함하지 않습니다.

## 검증과 배포

```bash
pnpm check
pnpm build
pnpm start
```

`pnpm check`는 린트, 타입 검사, 테스트, 빌드를 실행합니다. `pnpm start`는 빌드한 웹의 로컬 미리보기와 API 서버를 실행합니다.

실제 웹 배포에는 `apps/web/dist`의 정적 파일을 사용하세요. 배포 서버에서 `/api` 요청을 FastAPI로 프록시하고, React 화면 경로는 `index.html`로 연결하세요. Vite 미리보기 서버는 프로덕션 서버 용도가 아닙니다.

`docs/superpowers`의 Next.js 문서는 전환 이전의 설계 및 작업 계획 기록입니다.
