import type { NextConfig } from "next";

/**
 * Next.js 설정
 * 
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 */
const nextConfig: NextConfig = {
  /**
   * Docker 배포를 위한 standalone 출력 모드
   * 이 설정은 .next/standalone 디렉토리에 독립 실행 가능한 빌드를 생성합니다.
   * 주의: Windows 로컬 개발 환경에서 문제가 발생할 수 있음
   * 프로덕션 Docker 배포 시 아래 주석을 해제하세요.
   */
  // output: 'standalone',

  /**
   * 이미지 최적화 설정
   */
  images: {
    // 허용된 외부 이미지 도메인 (필요시 추가)
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      // },
    ],
  },

  /**
   * 실험적 기능
   */
  experimental: {
    // 필요한 실험적 기능 활성화
  },

  /**
   * 환경 변수 (빌드 타임)
   */
  env: {
    // 빌드 타임에 주입되는 환경 변수
  },

  /**
   * 리다이렉트 설정 (필요시 활성화)
   */
  // async redirects() {
  //   return [
  //     {
  //       source: '/old-path',
  //       destination: '/new-path',
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;
