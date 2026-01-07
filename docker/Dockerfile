# ===========================================
# Next.js 15 Docker 멀티스테이지 빌드
# ===========================================
# 이 Dockerfile은 프로덕션 배포를 위한 최적화된 이미지를 생성합니다.
# 멀티스테이지 빌드를 사용하여 최종 이미지 크기를 최소화합니다.
#
# 사용법:
#   docker build -t nextjs-app .
#   docker run -p 3000:3000 nextjs-app

# ===========================================
# 1단계: 의존성 설치 (deps)
# ===========================================
FROM node:20-alpine AS deps

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 의존성 파일 복사
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 의존성 설치 (프로덕션 + 개발 의존성 모두 필요 - 빌드에 필요)
RUN pnpm install --frozen-lockfile

# ===========================================
# 2단계: 빌드 (builder)
# ===========================================
FROM node:20-alpine AS builder

# pnpm 활성화
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 의존성 복사
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 환경 변수 설정 (빌드 시점)
# 실제 값은 docker-compose나 CI/CD에서 주입
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Next.js 빌드
RUN pnpm build

# ===========================================
# 3단계: 프로덕션 이미지 (runner)
# ===========================================
FROM node:20-alpine AS runner

WORKDIR /app

# 보안: non-root 사용자 생성
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 환경 변수 설정
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# standalone 출력 복사 (next.config.ts에서 output: 'standalone' 설정 필요)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# non-root 사용자로 전환
USER nextjs

# 포트 노출
EXPOSE 3000

# 애플리케이션 시작
CMD ["node", "server.js"]
