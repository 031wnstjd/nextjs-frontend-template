/**
 * @file 환경 설정 배럴 파일
 * @description 현재 환경에 맞는 설정을 자동으로 로드
 *
 * @example
 * import { config } from '@/config';
 * console.log(config.apiUrl);
 */

import { localConfig } from './env.local';
import { developmentConfig } from './env.development';
import { productionConfig } from './env.production';
import type { EnvConfig } from './types';

/**
 * 현재 환경 감지
 */
function detectEnvironment(): 'local' | 'development' | 'production' {
    const nodeEnv = process.env.NODE_ENV;

    // 프로덕션 환경
    if (nodeEnv === 'production') {
        return 'production';
    }

    // NEXT_PUBLIC_ENV 환경 변수로 명시적 지정 가능
    const explicitEnv = process.env.NEXT_PUBLIC_ENV;
    if (explicitEnv === 'development') {
        return 'development';
    }

    // 기본: 로컬 개발
    return 'local';
}

/**
 * 환경별 설정 매핑
 */
const configMap: Record<string, EnvConfig> = {
    local: localConfig,
    development: developmentConfig,
    production: productionConfig,
};

/**
 * 현재 환경에 맞는 설정
 */
export const config: EnvConfig = configMap[detectEnvironment()];

// 타입 및 개별 설정 export
export type { EnvConfig, Environment, LogLevel, FeatureFlags } from './types';
export { localConfig } from './env.local';
export { developmentConfig } from './env.development';
export { productionConfig } from './env.production';

export default config;
