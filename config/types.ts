/**
 * @file 환경 설정 타입 정의
 * @description 환경별 설정에 사용되는 타입들
 */

/**
 * 환경 이름 타입
 */
export type Environment = 'local' | 'development' | 'production';

/**
 * 로그 레벨 타입
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * 기능 플래그 타입
 */
export interface FeatureFlags {
    /** 개발자 도구 표시 여부 */
    devTools: boolean;
    /** 목 데이터 사용 여부 */
    useMockData: boolean;
}

/**
 * 환경 설정 타입
 */
export interface EnvConfig {
    /** 환경 이름 */
    env: Environment;
    /** API 기본 URL */
    apiUrl: string;
    /** 디버그 모드 */
    debug: boolean;
    /** 로그 레벨 */
    logLevel: LogLevel;
    /** 기능 플래그 */
    features: FeatureFlags;
}
