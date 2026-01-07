/**
 * @file 예시 도메인 훅
 * @description Example 도메인의 커스텀 훅들
 *
 * 이 파일은 API 서비스와 UI 컴포넌트를 연결하는 훅을 제공합니다.
 * 로딩 상태, 에러 처리, 데이터 관리를 캡슐화합니다.
 */

'use client';

import { useState, useCallback } from 'react';
import { exampleApi } from '../services/example-api';
import type {
    Example,
    CreateExampleRequest,
    UpdateExampleRequest,
    ExampleListResponse,
    ExampleFilter,
} from '../types';
import type { PaginationParams } from '@/lib/api';

/**
 * 예시 목록 조회 훅 반환 타입
 */
interface UseExampleListReturn {
    /** 예시 목록 */
    data: ExampleListResponse | null;
    /** 로딩 상태 */
    isLoading: boolean;
    /** 에러 */
    error: Error | null;
    /** 데이터 조회 함수 */
    fetch: (params?: PaginationParams, filter?: ExampleFilter) => Promise<void>;
    /** 새로고침 함수 */
    refresh: () => Promise<void>;
}

/**
 * 예시 목록 조회 훅
 *
 * @example
 * const { data, isLoading, error, fetch } = useExampleList();
 *
 * useEffect(() => {
 *   fetch({ page: 1, limit: 10 });
 * }, [fetch]);
 */
export function useExampleList(): UseExampleListReturn {
    const [data, setData] = useState<ExampleListResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // 마지막 조회 파라미터 저장 (새로고침용)
    const [lastParams, setLastParams] = useState<{
        params: PaginationParams;
        filter: ExampleFilter;
    }>({ params: {}, filter: {} });

    /**
     * 목록 조회 함수
     */
    const fetch = useCallback(
        async (params: PaginationParams = {}, filter: ExampleFilter = {}) => {
            try {
                setIsLoading(true);
                setError(null);

                const result = await exampleApi.getList(params, filter);
                setData(result);

                // 새로고침을 위해 파라미터 저장
                setLastParams({ params, filter });
            } catch (err) {
                const error = err instanceof Error ? err : new Error('목록 조회 실패');
                setError(error);
                console.error('[useExampleList] 조회 실패:', error);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    /**
     * 새로고침 함수 (마지막 파라미터로 재조회)
     */
    const refresh = useCallback(async () => {
        await fetch(lastParams.params, lastParams.filter);
    }, [fetch, lastParams]);

    return { data, isLoading, error, fetch, refresh };
}

/**
 * 예시 상세 조회 훅 반환 타입
 */
interface UseExampleDetailReturn {
    /** 예시 상세 데이터 */
    data: Example | null;
    /** 로딩 상태 */
    isLoading: boolean;
    /** 에러 */
    error: Error | null;
    /** 데이터 조회 함수 */
    fetch: (id: string) => Promise<void>;
}

/**
 * 예시 상세 조회 훅
 *
 * @example
 * const { data, isLoading, fetch } = useExampleDetail();
 *
 * useEffect(() => {
 *   fetch('example-id');
 * }, [fetch]);
 */
export function useExampleDetail(): UseExampleDetailReturn {
    const [data, setData] = useState<Example | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetch = useCallback(async (id: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await exampleApi.getById(id);
            setData(result);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('상세 조회 실패');
            setError(error);
            console.error('[useExampleDetail] 조회 실패:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { data, isLoading, error, fetch };
}

/**
 * 예시 뮤테이션 훅 반환 타입
 */
interface UseExampleMutationReturn {
    /** 로딩 상태 */
    isLoading: boolean;
    /** 에러 */
    error: Error | null;
    /** 생성 함수 */
    create: (data: CreateExampleRequest) => Promise<Example | null>;
    /** 수정 함수 */
    update: (id: string, data: UpdateExampleRequest) => Promise<Example | null>;
    /** 삭제 함수 */
    remove: (id: string) => Promise<boolean>;
}

/**
 * 예시 뮤테이션(생성/수정/삭제) 훅
 *
 * @example
 * const { create, update, remove, isLoading } = useExampleMutation();
 *
 * const handleCreate = async () => {
 *   const result = await create({ title: '새 예시', ... });
 *   if (result) {
 *     // 성공 처리
 *   }
 * };
 */
export function useExampleMutation(): UseExampleMutationReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * 생성 함수
     */
    const create = useCallback(
        async (data: CreateExampleRequest): Promise<Example | null> => {
            try {
                setIsLoading(true);
                setError(null);

                const result = await exampleApi.create(data);
                return result;
            } catch (err) {
                const error = err instanceof Error ? err : new Error('생성 실패');
                setError(error);
                console.error('[useExampleMutation] 생성 실패:', error);
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    /**
     * 수정 함수
     */
    const update = useCallback(
        async (id: string, data: UpdateExampleRequest): Promise<Example | null> => {
            try {
                setIsLoading(true);
                setError(null);

                const result = await exampleApi.update(id, data);
                return result;
            } catch (err) {
                const error = err instanceof Error ? err : new Error('수정 실패');
                setError(error);
                console.error('[useExampleMutation] 수정 실패:', error);
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    /**
     * 삭제 함수
     */
    const remove = useCallback(async (id: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);

            await exampleApi.delete(id);
            return true;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('삭제 실패');
            setError(error);
            console.error('[useExampleMutation] 삭제 실패:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { isLoading, error, create, update, remove };
}
