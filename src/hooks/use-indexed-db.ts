/**
 * @file IndexedDB 상태 관리 훅
 * @description 대용량 데이터 저장을 위한 IndexedDB 커스텀 훅
 *
 * 특징:
 * - 대용량 데이터 저장 지원 (로컬 스토리지 용량 제한 없음)
 * - 비동기 CRUD 작업
 * - 타입 안전
 * - idb 라이브러리 기반의 간편한 API
 *
 * @example
 * // 기본 사용법
 * const { data, isLoading, error, save, remove } = useIndexedDB<User>({
 *   dbName: 'myApp',
 *   storeName: 'users',
 *   key: 'currentUser',
 * });
 *
 * // 데이터 저장
 * await save({ id: '1', name: 'John' });
 *
 * // 데이터 삭제
 * await remove();
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { openDB, IDBPDatabase } from 'idb';

/**
 * IndexedDB 훅 설정 옵션
 */
interface UseIndexedDBOptions {
    /** 데이터베이스 이름 */
    dbName: string;
    /** 객체 저장소(테이블) 이름 */
    storeName: string;
    /** 저장할 데이터의 키 */
    key: string;
    /** 데이터베이스 버전 (스키마 변경 시 증가) */
    version?: number;
}

/**
 * IndexedDB 훅 반환 타입
 */
interface UseIndexedDBReturn<T> {
    /** 저장된 데이터 */
    data: T | null;
    /** 로딩 상태 */
    isLoading: boolean;
    /** 에러 객체 */
    error: Error | null;
    /** 데이터 저장 함수 */
    save: (value: T) => Promise<void>;
    /** 데이터 삭제 함수 */
    remove: () => Promise<void>;
    /** 데이터 새로고침 함수 */
    refresh: () => Promise<void>;
}

/**
 * IndexedDB 데이터베이스 인스턴스 캐시
 * 동일한 데이터베이스에 대한 중복 연결 방지
 */
const dbCache: Map<string, Promise<IDBPDatabase>> = new Map();

/**
 * IndexedDB 데이터베이스 열기
 * 캐시된 연결이 있으면 재사용
 */
async function getDB(
    dbName: string,
    storeName: string,
    version: number
): Promise<IDBPDatabase> {
    const cacheKey = `${dbName}-${version}`;

    if (!dbCache.has(cacheKey)) {
        const dbPromise = openDB(dbName, version, {
            upgrade(db) {
                // 객체 저장소가 없으면 생성
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName);
                }
            },
        });
        dbCache.set(cacheKey, dbPromise);
    }

    return dbCache.get(cacheKey)!;
}

/**
 * IndexedDB 상태 관리 훅
 *
 * @template T - 저장할 데이터의 타입
 * @param options - IndexedDB 설정 옵션
 * @returns IndexedDB 상태 및 조작 함수
 */
export function useIndexedDB<T>(options: UseIndexedDBOptions): UseIndexedDBReturn<T> {
    const { dbName, storeName, key, version = 1 } = options;

    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    /**
     * 데이터 조회 함수
     */
    const fetchData = useCallback(async () => {
        // 서버 사이드에서는 실행하지 않음
        if (typeof window === 'undefined') {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const db = await getDB(dbName, storeName, version);
            const value = await db.get(storeName, key);

            setData(value as T | null);
        } catch (err) {
            console.error('[useIndexedDB] 데이터 조회 실패:', err);
            setError(err instanceof Error ? err : new Error('데이터 조회 중 오류 발생'));
        } finally {
            setIsLoading(false);
        }
    }, [dbName, storeName, key, version]);

    /**
     * 데이터 저장 함수
     */
    const save = useCallback(
        async (value: T): Promise<void> => {
            if (typeof window === 'undefined') {
                throw new Error('IndexedDB는 브라우저 환경에서만 사용 가능합니다.');
            }

            try {
                setError(null);

                const db = await getDB(dbName, storeName, version);
                await db.put(storeName, value, key);

                setData(value);
            } catch (err) {
                const error = err instanceof Error ? err : new Error('데이터 저장 중 오류 발생');
                console.error('[useIndexedDB] 데이터 저장 실패:', error);
                setError(error);
                throw error;
            }
        },
        [dbName, storeName, key, version]
    );

    /**
     * 데이터 삭제 함수
     */
    const remove = useCallback(async (): Promise<void> => {
        if (typeof window === 'undefined') {
            throw new Error('IndexedDB는 브라우저 환경에서만 사용 가능합니다.');
        }

        try {
            setError(null);

            const db = await getDB(dbName, storeName, version);
            await db.delete(storeName, key);

            setData(null);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('데이터 삭제 중 오류 발생');
            console.error('[useIndexedDB] 데이터 삭제 실패:', error);
            setError(error);
            throw error;
        }
    }, [dbName, storeName, key, version]);

    /**
     * 데이터 새로고침 함수
     * 외부에서 변경된 데이터를 다시 읽어올 때 사용
     */
    const refresh = useCallback(async (): Promise<void> => {
        await fetchData();
    }, [fetchData]);

    /**
     * 컴포넌트 마운트 시 데이터 조회
     */
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        isLoading,
        error,
        save,
        remove,
        refresh,
    };
}
