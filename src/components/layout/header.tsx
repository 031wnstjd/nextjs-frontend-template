/**
 * @file 헤더 컴포넌트
 * @description 애플리케이션 상단 헤더 레이아웃 컴포넌트
 *
 * 특징:
 * - 반응형 디자인 (모바일/데스크톱)
 * - 사이드바 토글 버튼
 * - 테마 토글
 * - 사용자 메뉴
 */

'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUIStore } from '@/lib/store';
import { useBreakpoints } from '@/hooks';

/**
 * 헤더 컴포넌트 Props
 */
interface HeaderProps {
    /** 앱 타이틀 */
    title?: string;
}

/**
 * 헤더 컴포넌트
 *
 * @example
 * <Header title="My App" />
 */
export function Header({ title = 'Next.js Template' }: HeaderProps) {
    // 스토어에서 필요한 상태와 액션 가져오기
    const { toggleSidebar, theme, toggleTheme } = useUIStore();

    // 반응형 브레이크포인트
    const { isMobile } = useBreakpoints();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-6 flex h-14 items-center">
                {/* 사이드바 토글 버튼 (모바일에서만 표시) */}
                {isMobile && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="mr-2"
                        onClick={toggleSidebar}
                        aria-label="사이드바 토글"
                    >
                        {/* 햄버거 메뉴 아이콘 */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </Button>
                )}

                {/* 앱 타이틀 */}
                <div className="mr-4 flex">
                    <a href="/" className="mr-6 flex items-center space-x-2">
                        <span className="font-bold">{title}</span>
                    </a>
                </div>

                {/* 우측 메뉴 영역 */}
                <div className="flex flex-1 items-center justify-end space-x-2">
                    {/* 테마 토글 버튼 */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label="테마 변경"
                    >
                        {/* 테마 아이콘 (해/달) */}
                        {theme === 'dark' ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="12" cy="12" r="5" />
                                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        )}
                    </Button>

                    {/* 사용자 드롭다운 메뉴 */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="사용자 메뉴">
                                {/* 사용자 아이콘 */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>프로필</DropdownMenuItem>
                            <DropdownMenuItem>설정</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>로그아웃</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

export default Header;
