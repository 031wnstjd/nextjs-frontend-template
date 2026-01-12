/**
 * @file 디바운스 훅
 * @description 값 변경을 지연시키는 커스텀 훅
 *
 * 특징:
 * - 검색 입력 최적화
 * - API 호출 빈도 감소
 * - 자동 저장 기능 구현
 *
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 300);
 *
 * useEffect(() => {
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * 디바운스 훅
 *
 * @template T - 디바운스할 값의 타입
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (밀리초)
 * @returns 디바운스된 값
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}
