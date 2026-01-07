/**
 * @file 예시 기능 타입 정의
 * @description Example 도메인에서 사용되는 타입들
 */

import type { BaseEntity, PaginatedResponse } from '@/lib/api';

/**
 * 예시 엔티티 타입
 * 새로운 기능 개발 시 이 구조를 참고하여 타입 정의
 */
export interface Example extends BaseEntity {
    /** 제목 */
    title: string;
    /** 설명 */
    description: string;
    /** 상태 */
    status: ExampleStatus;
    /** 우선순위 */
    priority: number;
    /** 태그 목록 */
    tags: string[];
}

/**
 * 예시 상태 enum
 */
export type ExampleStatus = 'draft' | 'active' | 'completed' | 'archived';

/**
 * 예시 생성 요청 타입
 * id, createdAt, updatedAt은 서버에서 생성되므로 제외
 */
export type CreateExampleRequest = Omit<Example, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * 예시 수정 요청 타입
 * 모든 필드가 선택적
 */
export type UpdateExampleRequest = Partial<CreateExampleRequest>;

/**
 * 예시 목록 조회 응답 타입
 */
export type ExampleListResponse = PaginatedResponse<Example>;

/**
 * 예시 목록 조회 필터 타입
 */
export interface ExampleFilter {
    /** 상태 필터 */
    status?: ExampleStatus;
    /** 검색어 */
    search?: string;
    /** 태그 필터 */
    tags?: string[];
}
