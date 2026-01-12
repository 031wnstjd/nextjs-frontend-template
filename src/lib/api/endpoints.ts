/**
 * @file API 엔드포인트 정의
 * @description 환경별 API Base URL 및 엔드포인트 상수 관리
 *
 * 환경 변수를 통해 API URL을 설정하고,
 * 각 리소스별 엔드포인트를 중앙에서 관리합니다.
 */

/**
 * API 기본 URL
 * 환경 변수에서 가져오며, 없을 경우 로컬 개발 서버 URL 사용
 */
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * 기본 요청 헤더
 * 모든 API 요청에 공통으로 적용되는 헤더
 */
export const DEFAULT_HEADERS: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
};

/**
 * API 엔드포인트 상수
 * 각 리소스별 엔드포인트를 정의
 *
 * @example
 * // 사용 예시
 * import { ENDPOINTS } from '@/lib/api/endpoints';
 * const users = await apiClient.get(ENDPOINTS.USERS.LIST);
 */
export const ENDPOINTS = {
    /** 인증 관련 엔드포인트 */
    AUTH: {
        /** 로그인 */
        LOGIN: '/auth/login',
        /** 로그아웃 */
        LOGOUT: '/auth/logout',
        /** 회원가입 */
        REGISTER: '/auth/register',
        /** 토큰 갱신 */
        REFRESH: '/auth/refresh',
        /** 현재 사용자 정보 */
        ME: '/auth/me',
    },

    /** 사용자 관련 엔드포인트 */
    USERS: {
        /** 사용자 목록 조회 */
        LIST: '/users',
        /** 사용자 상세 조회 (id 파라미터 필요) */
        DETAIL: (id: string) => `/users/${id}`,
        /** 사용자 생성 */
        CREATE: '/users',
        /** 사용자 수정 (id 파라미터 필요) */
        UPDATE: (id: string) => `/users/${id}`,
        /** 사용자 삭제 (id 파라미터 필요) */
        DELETE: (id: string) => `/users/${id}`,
    },
} as const;

/**
 * 쿼리 파라미터를 URL에 추가하는 유틸리티 함수
 *
 * @param endpoint - 기본 엔드포인트
 * @param params - 쿼리 파라미터 객체
 * @returns 쿼리 문자열이 추가된 URL
 *
 * @example
 * const url = withQueryParams(ENDPOINTS.USERS.LIST, { page: 1, limit: 10 });
 * // 결과: '/users?page=1&limit=10'
 */
export function withQueryParams(
    endpoint: string,
    params: Record<string, string | number | boolean | undefined>
): string {
    const filteredParams = Object.entries(params)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');

    return filteredParams ? `${endpoint}?${filteredParams}` : endpoint;
}
