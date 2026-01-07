/**
 * @file 로컬 스토리지 상태 관리 훅
 * @description 브라우저 로컬 스토리지를 React 상태처럼 사용할 수 있는 커스텀 훅
 *
 * 특징:
 * - SSR 안전 (서버 사이드 렌더링 환경에서 에러 없이 동작)
 * - 타입 안전 (제네릭을 통한 타입 추론)
 * - 자동 직렬화/역직렬화 (JSON)
 * - 기본값 지원
 *
 * @example
 * // 기본 사용법
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 *
 * // 객체 저장
 * const [user, setUser] = useLocalStorage<User>('user', null);
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * 로컬 스토리지 상태 관리 훅
 *
 * @template T - 저장할 데이터의 타입
 * @param key - 로컬 스토리지 키
 * @param initialValue - 초기값 (로컬 스토리지에 값이 없을 때 사용)
 * @returns [저장된 값, 값 설정 함수, 값 제거 함수] 튜플
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
    /**
     * 로컬 스토리지에서 값을 읽어오는 함수
     * SSR 환경에서는 초기값을 반환
     */
    const readValue = useCallback((): T => {
        // 서버 사이드에서는 초기값 반환
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);

            // 저장된 값이 있으면 파싱하여 반환
            if (item) {
                return JSON.parse(item) as T;
            }

            return initialValue;
        } catch (error) {
            console.warn(`[useLocalStorage] "${key}" 읽기 실패:`, error);
            return initialValue;
        }
    }, [key, initialValue]);

    // 상태 초기화
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    /**
     * 컴포넌트 마운트 시 로컬 스토리지에서 값 읽어오기
     * hydration mismatch 방지를 위해 useEffect 사용
     */
    useEffect(() => {
        setStoredValue(readValue());
    }, [readValue]);

    /**
     * 값을 로컬 스토리지에 저장하는 함수
     * React의 setState와 동일한 방식으로 사용 가능
     */
    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            try {
                // 함수형 업데이트 지원
                const valueToStore = value instanceof Function ? value(storedValue) : value;

                // 상태 업데이트
                setStoredValue(valueToStore);

                // 로컬 스토리지에 저장
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));

                    // 다른 탭/윈도우에 변경 알림 (storage 이벤트 발생)
                    window.dispatchEvent(
                        new StorageEvent('storage', {
                            key,
                            newValue: JSON.stringify(valueToStore),
                        })
                    );
                }
            } catch (error) {
                console.warn(`[useLocalStorage] "${key}" 저장 실패:`, error);
            }
        },
        [key, storedValue]
    );

    /**
     * 로컬 스토리지에서 값을 제거하는 함수
     */
    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue);

            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.warn(`[useLocalStorage] "${key}" 제거 실패:`, error);
        }
    }, [key, initialValue]);

    /**
     * 다른 탭/윈도우에서의 스토리지 변경 감지
     */
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === key && event.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(event.newValue) as T);
                } catch {
                    // 파싱 실패 시 무시
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
