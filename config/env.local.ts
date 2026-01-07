/**
 * @file 로컬 개발 환경 설정
 * @description 로컬 개발 시 사용되는 환경별 설정값
 */

import type { EnvConfig } from './types';

/**
 * 로컬 개발 환경 설정
 */
export const localConfig: EnvConfig = {
    /** 환경 이름 */
    env: 'local',

    /** API 기본 URL */
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',

    /** 디버그 모드 활성화 */
    debug: true,

    /** 로그 레벨 */
    logLevel: 'debug',

    /** 기능 플래그 */
    features: {
        /** 개발자 도구 표시 */
        devTools: true,
        /** 목 데이터 사용 */
        useMockData: true,
    },
};

export default localConfig;
