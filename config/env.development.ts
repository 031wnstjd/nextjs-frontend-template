/**
 * @file 개발 서버 환경 설정
 * @description 개발 서버(staging)에 배포 시 사용되는 환경별 설정값
 */

import type { EnvConfig } from './types';

/**
 * 개발 서버 환경 설정
 */
export const developmentConfig: EnvConfig = {
    /** 환경 이름 */
    env: 'development',

    /** API 기본 URL */
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://dev-api.example.com/api',

    /** 디버그 모드 활성화 */
    debug: process.env.NEXT_PUBLIC_DEBUG === 'true',

    /** 로그 레벨 */
    logLevel: 'info',

    /** 기능 플래그 */
    features: {
        /** 개발자 도구 표시 */
        devTools: true,
        /** 목 데이터 사용 */
        useMockData: false,
    },
};

export default developmentConfig;
