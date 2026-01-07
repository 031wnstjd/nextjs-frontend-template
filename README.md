# Next.js 15 팀 템플릿

pnpm 기반의 Next.js 15.5.6 프로젝트 템플릿입니다. 팀 표준으로 사용할 수 있는 실무 베스트 프렉티스 구조를 적용했습니다.

## 🚀 주요 특징

| 기술 | 설명 |
|------|------|
| **Next.js 15.5.6** | 보안 취약점 해결 버전 |
| **pnpm** | 빠르고 효율적인 패키지 관리 |
| **TypeScript** | 타입 안정성 확보 |
| **shadcn/ui** | 커스터마이징 가능한 UI 컴포넌트 |
| **Zustand** | 경량 클라이언트 상태 관리 |
| **Docker + nginx** | 컨테이너 기반 배포 |

## 📁 프로젝트 구조

```
nextjs-template/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/
│   │   ├── ui/                 # shadcn/ui 컴포넌트
│   │   └── layout/             # 레이아웃 컴포넌트 (Header, Footer, Sidebar)
│   ├── features/               # 기능별 모듈 (Feature-based)
│   │   └── example/            # 예시 기능 (참고용)
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── types/
│   │       └── services/
│   ├── hooks/                  # 공통 훅
│   ├── lib/
│   │   ├── api/                # API 클라이언트
│   │   ├── store/              # Zustand 스토어
│   │   └── utils.ts
│   └── types/                  # 공통 타입
├── config/                     # 환경별 설정
├── docker/                     # Docker 설정
│   ├── Dockerfile
│   ├── docker-compose.*.yml
│   └── nginx/
└── .env.*.example              # 환경 변수 템플릿
```

## 🛠 시작하기

### 1. 저장소 클론

```bash
git clone <repository-url>
cd nextjs-template
```

### 2. 의존성 설치

```bash
pnpm install
```

### 3. 환경 변수 설정

```bash
cp .env.example .env.local
# .env.local 파일을 수정하여 환경 변수 설정
```

### 4. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 📜 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 (Turbopack) |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 실행 |
| `pnpm lint` | ESLint 검사 |
| `pnpm type-check` | TypeScript 타입 검사 |

## 🐳 Docker 배포

### 개발 환경

```bash
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up
```

### 프로덕션 환경

```bash
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.prod.yml up -d
```

## 📂 주요 모듈 설명

### API 클라이언트 (`src/lib/api/`)

백엔드 API 연동을 위한 타입 안전한 Fetch wrapper입니다.

```typescript
import { apiClient } from '@/lib/api';

// GET 요청
const users = await apiClient.get<User[]>('/users');

// POST 요청
const newUser = await apiClient.post<User>('/users', { name: 'John' });
```

### 공통 훅 (`src/hooks/`)

- **useLocalStorage**: 로컬 스토리지 상태 관리
- **useIndexedDB**: IndexedDB 대용량 데이터 관리
- **useMediaQuery**: 반응형 미디어 쿼리

### Zustand 스토어 (`src/lib/store/`)

UI 상태 관리를 위한 Zustand 스토어입니다.

```typescript
import { useUIStore } from '@/lib/store';

const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUIStore();
```

### Feature 모듈 (`src/features/`)

도메인별 기능을 캡슐화합니다. `features/example/`을 참고하여 새 기능을 추가하세요.

```
features/
└── [feature-name]/
    ├── components/     # 기능 전용 컴포넌트
    ├── hooks/          # 기능 전용 훅
    ├── types/          # 기능 전용 타입
    ├── services/       # API 서비스
    └── index.ts        # 배럴 파일
```

## 🌍 환경 설정

| 파일 | 용도 |
|------|------|
| `.env.local` | 로컬 개발 환경 |
| `.env.development` | 개발 서버 환경 |
| `.env.production` | 프로덕션 환경 |

### 주요 환경 변수

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 🎨 shadcn/ui 컴포넌트 추가

```bash
pnpm dlx shadcn@latest add [component-name]
```

설치된 컴포넌트:
- button, input, card, dialog, dropdown-menu, sonner

## 📝 코딩 컨벤션

1. **한글 주석**: 모든 주요 파일에 한글 주석 작성
2. **Feature-based 구조**: 도메인별로 코드 구성
3. **타입 안전성**: TypeScript 엄격 모드 사용
4. **배럴 파일**: 각 모듈에 index.ts로 통합 export

## 📄 라이선스

MIT License
