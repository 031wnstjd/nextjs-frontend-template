/**
 * @file 테마 프로바이더
 * @description HTML 요소에 테마 클래스를 적용하는 클라이언트 컴포넌트
 */

'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/lib/store';

/**
 * 테마 프로바이더 컴포넌트
 * Zustand 스토어의 테마 상태에 따라 html 요소에 dark 클래스를 추가/제거
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme } = useUIStore();

    useEffect(() => {
        const root = document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark');
        } else if (theme === 'light') {
            root.classList.remove('dark');
        } else {
            // system: 시스템 설정에 따라 다크 모드 적용
            const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (isDarkSystem) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    }, [theme]);

    return <>{children}</>;
}

export default ThemeProvider;
