/**
 * @file UI 상태 스토어
 * @description Zustand를 활용한 전역 UI 상태 관리
 *
 * 이 스토어는 다음과 같은 UI 상태를 관리합니다:
 * - 사이드바 열림/닫힘 상태
 * - 테마 (light/dark)
 * - 모달 상태
 * - 로딩 상태
 *
 * @example
 * // 컴포넌트에서 사용
 * const { sidebarOpen, toggleSidebar } = useUIStore();
 *
 * // 특정 상태만 구독 (성능 최적화)
 * const theme = useUIStore((state) => state.theme);
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 테마 타입
 */
type Theme = 'light' | 'dark' | 'system';

/**
 * UI 스토어 상태 타입
 */
interface UIState {
    // ===== 사이드바 상태 =====
    /** 사이드바 열림 상태 */
    sidebarOpen: boolean;
    /** 사이드바 축소 상태 (아이콘만 표시) */
    sidebarCollapsed: boolean;

    // ===== 테마 상태 =====
    /** 현재 테마 */
    theme: Theme;

    // ===== 모달 상태 =====
    /** 현재 열린 모달 ID (없으면 null) */
    activeModal: string | null;
    /** 모달 데이터 (모달별로 필요한 데이터 전달) */
    modalData: Record<string, unknown>;

    // ===== 로딩 상태 =====
    /** 전역 로딩 상태 */
    isLoading: boolean;
    /** 로딩 메시지 */
    loadingMessage: string;
}

/**
 * UI 스토어 액션 타입
 */
interface UIActions {
    // ===== 사이드바 액션 =====
    /** 사이드바 열기 */
    openSidebar: () => void;
    /** 사이드바 닫기 */
    closeSidebar: () => void;
    /** 사이드바 토글 */
    toggleSidebar: () => void;
    /** 사이드바 축소 토글 */
    toggleSidebarCollapse: () => void;

    // ===== 테마 액션 =====
    /** 테마 설정 */
    setTheme: (theme: Theme) => void;
    /** 다크/라이트 테마 토글 */
    toggleTheme: () => void;

    // ===== 모달 액션 =====
    /** 모달 열기 */
    openModal: (modalId: string, data?: Record<string, unknown>) => void;
    /** 모달 닫기 */
    closeModal: () => void;

    // ===== 로딩 액션 =====
    /** 로딩 시작 */
    startLoading: (message?: string) => void;
    /** 로딩 종료 */
    stopLoading: () => void;

    // ===== 초기화 =====
    /** 스토어 초기화 */
    reset: () => void;
}

/**
 * 초기 상태
 */
const initialState: UIState = {
    sidebarOpen: true,
    sidebarCollapsed: false,
    theme: 'system',
    activeModal: null,
    modalData: {},
    isLoading: false,
    loadingMessage: '',
};

/**
 * UI 상태 스토어
 *
 * persist 미들웨어를 사용하여 일부 상태를 로컬 스토리지에 저장합니다.
 * (테마, 사이드바 축소 상태 등 사용자 환경 설정)
 */
export const useUIStore = create<UIState & UIActions>()(
    persist(
        (set, get) => ({
            ...initialState,

            // ===== 사이드바 액션 구현 =====
            openSidebar: () => set({ sidebarOpen: true }),
            closeSidebar: () => set({ sidebarOpen: false }),
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            toggleSidebarCollapse: () =>
                set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

            // ===== 테마 액션 구현 =====
            setTheme: (theme) => set({ theme }),
            toggleTheme: () => {
                const currentTheme = get().theme;
                // system이면 현재 시스템 테마의 반대로, 그 외에는 토글
                if (currentTheme === 'system') {
                    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    set({ theme: isDark ? 'light' : 'dark' });
                } else {
                    set({ theme: currentTheme === 'dark' ? 'light' : 'dark' });
                }
            },

            // ===== 모달 액션 구현 =====
            openModal: (modalId, data = {}) =>
                set({ activeModal: modalId, modalData: data }),
            closeModal: () => set({ activeModal: null, modalData: {} }),

            // ===== 로딩 액션 구현 =====
            startLoading: (message = '로딩 중...') =>
                set({ isLoading: true, loadingMessage: message }),
            stopLoading: () => set({ isLoading: false, loadingMessage: '' }),

            // ===== 초기화 =====
            reset: () => set(initialState),
        }),
        {
            name: 'ui-store', // 로컬 스토리지 키
            // 저장할 상태만 선택 (로딩, 모달 상태는 제외)
            partialize: (state) => ({
                theme: state.theme,
                sidebarCollapsed: state.sidebarCollapsed,
            }),
        }
    )
);

export default useUIStore;
