/**
 * @file 미디어 쿼리 훅
 * @description 반응형 디자인을 위한 미디어 쿼리 상태 관리 훅
 *
 * 특징:
 * - SSR 안전 (서버 사이드에서 기본값 반환)
 * - 실시간 반응 (화면 크기 변경 감지)
 * - 사전 정의된 브레이크포인트 제공
 *
 * @example
 * // 기본 사용법
 * const isMobile = useMediaQuery('(max-width: 768px)');
 *
 * // 사전 정의된 브레이크포인트 사용
 * const { isMobile, isTablet, isDesktop } = useBreakpoints();
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * 미디어 쿼리 상태 훅
 *
 * @param query - CSS 미디어 쿼리 문자열
 * @param defaultValue - SSR 환경에서의 기본값 (기본: false)
 * @returns 미디어 쿼리 일치 여부
 *
 * @example
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 * const isPortrait = useMediaQuery('(orientation: portrait)');
 */
export function useMediaQuery(query: string, defaultValue: boolean = false): boolean {
    const [matches, setMatches] = useState<boolean>(defaultValue);

    useEffect(() => {
        // 서버 사이드에서는 실행하지 않음
        if (typeof window === 'undefined') {
            return;
        }

        // 미디어 쿼리 매처 생성
        const mediaQuery = window.matchMedia(query);

        // 초기값 설정
        setMatches(mediaQuery.matches);

        /**
         * 미디어 쿼리 변경 이벤트 핸들러
         */
        const handleChange = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // 이벤트 리스너 등록
        // 최신 브라우저용 addEventListener 사용
        mediaQuery.addEventListener('change', handleChange);

        // 클린업: 이벤트 리스너 제거
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [query]);

    return matches;
}

/**
 * 공통 브레이크포인트 상수
 * Tailwind CSS 기본 브레이크포인트 기준
 */
export const BREAKPOINTS = {
    /** 모바일: 640px 미만 */
    SM: 640,
    /** 태블릿: 768px */
    MD: 768,
    /** 소형 데스크톱: 1024px */
    LG: 1024,
    /** 대형 데스크톱: 1280px */
    XL: 1280,
    /** 초대형 화면: 1536px */
    XXL: 1536,
} as const;

/**
 * 브레이크포인트 상태 반환 타입
 */
interface BreakpointState {
    /** 모바일 (640px 미만) */
    isMobile: boolean;
    /** 태블릿 (768px 이상 1024px 미만) */
    isTablet: boolean;
    /** 데스크톱 (1024px 이상) */
    isDesktop: boolean;
    /** 현재 화면 너비가 지정된 브레이크포인트 이상인지 확인 */
    isAbove: (breakpoint: keyof typeof BREAKPOINTS) => boolean;
    /** 현재 화면 너비가 지정된 브레이크포인트 미만인지 확인 */
    isBelow: (breakpoint: keyof typeof BREAKPOINTS) => boolean;
}

/**
 * 사전 정의된 브레이크포인트 훅
 *
 * @returns 각 브레이크포인트별 상태
 *
 * @example
 * const { isMobile, isTablet, isDesktop } = useBreakpoints();
 *
 * return (
 *   <div>
 *     {isMobile && <MobileNav />}
 *     {isDesktop && <DesktopNav />}
 *   </div>
 * );
 */
export function useBreakpoints(): BreakpointState {
    // 각 브레이크포인트별 미디어 쿼리 상태
    const isSm = useMediaQuery(`(min-width: ${BREAKPOINTS.SM}px)`);
    const isMd = useMediaQuery(`(min-width: ${BREAKPOINTS.MD}px)`);
    const isLg = useMediaQuery(`(min-width: ${BREAKPOINTS.LG}px)`);
    const isXl = useMediaQuery(`(min-width: ${BREAKPOINTS.XL}px)`);
    const isXxl = useMediaQuery(`(min-width: ${BREAKPOINTS.XXL}px)`);

    /**
     * 지정된 브레이크포인트 이상인지 확인
     */
    const isAbove = (breakpoint: keyof typeof BREAKPOINTS): boolean => {
        switch (breakpoint) {
            case 'SM':
                return isSm;
            case 'MD':
                return isMd;
            case 'LG':
                return isLg;
            case 'XL':
                return isXl;
            case 'XXL':
                return isXxl;
            default:
                return false;
        }
    };

    /**
     * 지정된 브레이크포인트 미만인지 확인
     */
    const isBelow = (breakpoint: keyof typeof BREAKPOINTS): boolean => {
        return !isAbove(breakpoint);
    };

    return {
        isMobile: !isMd,
        isTablet: isMd && !isLg,
        isDesktop: isLg,
        isAbove,
        isBelow,
    };
}

export default useMediaQuery;
