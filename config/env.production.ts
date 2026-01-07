/**
 * @file 프로덕션 환경 설정
 * @description 프로덕션 서버에 배포 시 사용되는 환경별 설정값
 */

import type { EnvConfig } from './types';

/**
 * 프로덕션 환경 설정
 */
export const productionConfig: EnvConfig = {
    /** 환경 이름 */
    env: 'production',

    /** API 기본 URL */
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com/api',

    /** 디버그 모드 비활성화 */
    debug: false,

    /** 로그 레벨 */
    logLevel: 'error',

    /** 기능 플래그 */
    features: {
        /** 개발자 도구 비표시 */
        devTools: false,
        /** 목 데이터 사용 안함 */
        useMockData: false,
    },
};

export default productionConfig;
