/**
 * @file 사이드바 컴포넌트
 * @description 네비게이션 사이드바 레이아웃 컴포넌트
 *
 * 특징:
 * - 반응형 디자인 (모바일: 오버레이, 데스크톱: 고정)
 * - 축소/확장 모드 지원
 * - 아이콘 + 텍스트 메뉴
 */

'use client';

import { Button } from '@/components/ui/button';
import { useUIStore } from '@/lib/store';
import { useBreakpoints } from '@/hooks';
import { cn } from '@/lib/utils';

/**
 * 네비게이션 메뉴 아이템 타입
 */
interface NavItem {
    /** 메뉴 이름 */
    label: string;
    /** 링크 URL */
    href: string;
    /** 아이콘 (SVG path 또는 컴포넌트) */
    icon: React.ReactNode;
}

/**
 * 사이드바 컴포넌트 Props
 */
interface SidebarProps {
    /** 네비게이션 메뉴 아이템 목록 */
    navItems?: NavItem[];
}

/**
 * 기본 네비게이션 메뉴 아이템
 */
const defaultNavItems: NavItem[] = [
    {
        label: '대시보드',
        href: '/',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
            </svg>
        ),
    },
    {
        label: '사용자',
        href: '/users',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        label: '설정',
        href: '/settings',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        ),
    },
];

/**
 * 사이드바 컴포넌트
 *
 * @example
 * <Sidebar navItems={customNavItems} />
 */
export function Sidebar({ navItems = defaultNavItems }: SidebarProps) {
    // 스토어에서 사이드바 상태 가져오기
    const { sidebarOpen, sidebarCollapsed, closeSidebar, toggleSidebarCollapse } =
        useUIStore();

    // 반응형 브레이크포인트
    const { isMobile } = useBreakpoints();

    // 사이드바 너비 계산
    const sidebarWidth = sidebarCollapsed ? 'w-16' : 'w-64';

    return (
        <>
            {/* 모바일 오버레이 배경 */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            {/* 사이드바 본체 */}
            <aside
                className={cn(
                    'fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] border-r bg-background transition-all duration-300',
                    sidebarWidth,
                    // 모바일에서는 열림/닫힘 상태에 따라 위치 조정
                    isMobile && !sidebarOpen && '-translate-x-full',
                    // 데스크톱에서는 항상 표시
                    !isMobile && 'translate-x-0'
                )}
            >
                {/* 축소 토글 버튼 */}
                <div className="flex h-12 items-center justify-end border-b px-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebarCollapse}
                        aria-label={sidebarCollapsed ? '사이드바 확장' : '사이드바 축소'}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={cn(
                                'transition-transform',
                                sidebarCollapsed && 'rotate-180'
                            )}
                        >
                            <path d="M11 17l-5-5 5-5" />
                            <path d="M18 17l-5-5 5-5" />
                        </svg>
                    </Button>
                </div>

                {/* 네비게이션 메뉴 */}
                <nav className="flex flex-col gap-1 p-2">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                                sidebarCollapsed && 'justify-center'
                            )}
                        >
                            {/* 아이콘 */}
                            <span className="flex-shrink-0">{item.icon}</span>
                            {/* 라벨 (축소 모드에서는 숨김) */}
                            {!sidebarCollapsed && (
                                <span className="text-sm font-medium">{item.label}</span>
                            )}
                        </a>
                    ))}
                </nav>
            </aside>
        </>
    );
}

export default Sidebar;
