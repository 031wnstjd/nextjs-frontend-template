/**
 * @file 대시보드 레이아웃
 * @description Header, Sidebar가 포함된 메인 레이아웃
 */

'use client';

import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { useUIStore } from '@/lib/store';
import { useBreakpoints } from '@/hooks';
import { cn } from '@/lib/utils';

/**
 * 대시보드 레이아웃 Props
 */
interface DashboardLayoutProps {
    children: React.ReactNode;
}

/**
 * 대시보드 레이아웃 컴포넌트
 * Header + Sidebar + Main Content + Footer 구조
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { sidebarCollapsed } = useUIStore();
    const { isMobile } = useBreakpoints();

    // 사이드바 너비에 따른 메인 콘텐츠 여백 계산
    const mainMarginLeft = isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-16' : 'ml-64';

    return (
        <div className="min-h-screen bg-background">
            {/* 헤더 */}
            <Header title="Next.js Template" />

            {/* 사이드바 */}
            <Sidebar />

            {/* 메인 콘텐츠 영역 */}
            <main
                className={cn(
                    'min-h-[calc(100vh-3.5rem)] pt-14 transition-all duration-300',
                    mainMarginLeft
                )}
            >
                <div className="container mx-auto px-6 py-6">
                    {children}
                </div>
            </main>

            {/* 푸터 */}
            <div className={cn('transition-all duration-300', mainMarginLeft)}>
                <Footer companyName="Your Company" />
            </div>
        </div>
    );
}

export default DashboardLayout;
