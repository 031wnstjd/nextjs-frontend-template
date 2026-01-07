/**
 * @file API 공통 타입 정의
 * @description 백엔드 API 통신에 사용되는 공통 타입들
 */

/**
 * API 응답 래퍼 타입
 * 모든 API 응답은 이 형태로 반환됨
 */
export interface ApiResponse<T> {
    /** 응답 데이터 */
    data: T;
    /** HTTP 상태 코드 */
    status: number;
}

/**
 * API 에러 타입
 * API 호출 실패 시 발생하는 에러 객체
 */
export interface ApiError extends Error {
    /** HTTP 상태 코드 */
    status: number;
    /** 에러 메시지 */
    message: string;
}

/**
 * 요청 설정 타입
 * fetch 요청에 사용되는 설정 객체
 */
export interface RequestConfig {
    /** HTTP 메서드 */
    method: string;
    /** 요청 URL */
    url: string;
    /** 요청 헤더 */
    headers: HeadersInit;
    /** 요청 본문 (JSON 문자열) */
    body?: string;
}

/**
 * 페이지네이션 요청 파라미터
 * 목록 조회 API에 공통으로 사용
 */
export interface PaginationParams {
    /** 페이지 번호 (1부터 시작) */
    page?: number;
    /** 페이지당 항목 수 */
    limit?: number;
    /** 정렬 기준 필드 */
    sortBy?: string;
    /** 정렬 방향 */
    sortOrder?: 'asc' | 'desc';
}

/**
 * 페이지네이션 응답 타입
 * 목록 조회 API의 응답 형태
 */
export interface PaginatedResponse<T> {
    /** 항목 목록 */
    items: T[];
    /** 전체 항목 수 */
    total: number;
    /** 현재 페이지 */
    page: number;
    /** 페이지당 항목 수 */
    limit: number;
    /** 전체 페이지 수 */
    totalPages: number;
}

/**
 * 공통 엔티티 기본 타입
 * 모든 엔티티가 공통으로 가지는 필드
 */
export interface BaseEntity {
    /** 고유 식별자 */
    id: string;
    /** 생성 일시 */
    createdAt: string;
    /** 수정 일시 */
    updatedAt: string;
}
