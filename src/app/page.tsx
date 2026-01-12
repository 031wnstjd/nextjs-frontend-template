/**
 * @file 홈 페이지
 * @description Next.js 15 템플릿 메인 페이지
 */

'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useLocalStorage, useBreakpoints, useIndexedDB, useDebounce } from '@/hooks';
import { useUIStore } from '@/lib/store';
import { formatDate, formatNumber, formatBytes, formatRelativeTime } from '@/lib/format';
import { toast } from 'sonner';

/**
 * IndexedDB에 저장할 메모 타입
 */
interface Memo {
  id: string;
  content: string;
  createdAt: string;
}

/**
 * 홈 페이지 컴포넌트
 */
export default function Home() {
  // 로컬 스토리지 훅 데모
  const [userName, setUserName] = useLocalStorage('demo-username', '');

  // IndexedDB 훅 데모
  const {
    data: memo,
    isLoading: isMemoLoading,
    save: saveMemo,
    remove: removeMemo,
  } = useIndexedDB<Memo>({
    dbName: 'demo-app',
    storeName: 'memos',
    key: 'current-memo',
  });

  // 반응형 브레이크포인트 훅 데모
  const { isMobile, isTablet, isDesktop } = useBreakpoints();

  // Zustand 스토어 데모
  const { theme } = useUIStore();

  // 다이얼로그 상태
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // IndexedDB 메모 입력
  const [memoInput, setMemoInput] = useState('');

  // 디바운스 데모
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);
  const [searchCount, setSearchCount] = useState(0);

  // 디바운스 효과 확인
  useEffect(() => {
    if (debouncedSearch) {
      setSearchCount((prev) => prev + 1);
    }
  }, [debouncedSearch]);

  // Skeleton 데모
  const [showSkeleton, setShowSkeleton] = useState(false);

  /**
   * 토스트 알림 데모
   */
  const handleShowToast = () => {
    toast.success('성공!', {
      description: '토스트 알림이 정상적으로 표시됩니다.',
    });
  };

  /**
   * 다이얼로그 확인 핸들러
   */
  const handleDialogConfirm = () => {
    if (inputValue.trim()) {
      setUserName(inputValue);
      toast.success(`이름이 "${inputValue}"으로 저장되었습니다.`);
      setDialogOpen(false);
      setInputValue('');
    } else {
      toast.error('이름을 입력해주세요.');
    }
  };

  /**
   * 이름 초기화
   */
  const handleClearName = () => {
    setUserName('');
    toast.info('저장된 이름이 초기화되었습니다.');
  };

  /**
   * IndexedDB에 메모 저장
   */
  const handleSaveMemo = async () => {
    if (!memoInput.trim()) {
      toast.error('메모 내용을 입력해주세요.');
      return;
    }

    try {
      await saveMemo({
        id: Date.now().toString(),
        content: memoInput,
        createdAt: new Date().toISOString(),
      });
      toast.success('메모가 IndexedDB에 저장되었습니다.');
      setMemoInput('');
    } catch {
      toast.error('메모 저장 실패');
    }
  };

  /**
   * IndexedDB 메모 삭제
   */
  const handleRemoveMemo = async () => {
    try {
      await removeMemo();
      toast.info('메모가 삭제되었습니다.');
    } catch {
      toast.error('메모 삭제 실패');
    }
  };

  /**
   * Skeleton 토글
   */
  const handleToggleSkeleton = () => {
    setShowSkeleton(true);
    setTimeout(() => setShowSkeleton(false), 2000);
  };

  return (
    <DashboardLayout>
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Next.js 15 템플릿
        </h1>
        <p className="text-muted-foreground mt-2">
          템플릿에 포함된 기능들을 확인해보세요.
        </p>
      </div>

      {/* 상태 정보 카드 */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {/* 환경 정보 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">환경 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isMobile ? '📱 Mobile' : isTablet ? '📟 Tablet' : isDesktop ? '🖥️ Desktop' : '...'}
            </div>
            <p className="text-xs text-muted-foreground">
              현재 화면 크기 감지
            </p>
          </CardContent>
        </Card>

        {/* 테마 정보 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">테마</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {theme === 'dark' ? '🌙 Dark' : theme === 'light' ? '☀️ Light' : '💻 System'}
            </div>
            <p className="text-xs text-muted-foreground">
              헤더에서 테마 변경 가능
            </p>
          </CardContent>
        </Card>

        {/* 저장된 이름 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">LocalStorage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {userName || '(없음)'}
            </div>
            <p className="text-xs text-muted-foreground">
              저장된 이름
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 포맷 유틸리티 데모 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>포맷 유틸리티 데모</CardTitle>
          <CardDescription>
            formatDate, formatNumber, formatBytes, formatRelativeTime 함수
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">날짜 포맷팅</p>
              <p className="font-mono text-sm">{formatDate(new Date())}</p>
              <p className="text-xs text-muted-foreground mt-1">formatDate(new Date())</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">상대 시간</p>
              <p className="font-mono text-sm">{formatRelativeTime(Date.now() - 3600000)}</p>
              <p className="text-xs text-muted-foreground mt-1">formatRelativeTime(1시간 전)</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">숫자 포맷팅</p>
              <p className="font-mono text-sm">{formatNumber(1234567)}</p>
              <p className="text-xs text-muted-foreground mt-1">formatNumber(1234567)</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">통화 포맷팅</p>
              <p className="font-mono text-sm">{formatNumber(50000, { currency: 'KRW' })}</p>
              <p className="text-xs text-muted-foreground mt-1">{`formatNumber(50000, { currency: 'KRW' })`}</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">파일 크기</p>
              <p className="font-mono text-sm">{formatBytes(1234567890)}</p>
              <p className="text-xs text-muted-foreground mt-1">formatBytes(1234567890)</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">축약 표기</p>
              <p className="font-mono text-sm">{formatNumber(1234567, { compact: true })}</p>
              <p className="text-xs text-muted-foreground mt-1">{`formatNumber(1234567, { compact: true })`}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debounce 데모 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>useDebounce 훅 데모</CardTitle>
          <CardDescription>
            입력 후 500ms 지연 후 검색 실행 (API 호출 최적화)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="검색어를 입력하세요..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <div className="p-4 bg-muted rounded-lg">
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">현재 입력값:</span>
                <span className="font-mono">{searchInput || '(없음)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">디바운스된 값:</span>
                <span className="font-mono">{debouncedSearch || '(없음)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">검색 실행 횟수:</span>
                <span className="font-mono">{searchCount}회</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skeleton 데모 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Skeleton 컴포넌트 데모</CardTitle>
          <CardDescription>
            로딩 상태 표시용 Skeleton 컴포넌트
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleToggleSkeleton}>
            Skeleton 보기 (2초)
          </Button>

          {showSkeleton ? (
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                AB
              </div>
              <div className="space-y-1">
                <p className="font-medium">실제 컨텐츠</p>
                <p className="text-sm text-muted-foreground">로딩이 완료된 상태</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* LocalStorage 데모 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>LocalStorage 데모</CardTitle>
          <CardDescription>
            useLocalStorage 훅을 사용한 브라우저 저장소 연동
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleShowToast}>
              토스트 알림
            </Button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">이름 저장하기</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>이름 입력</DialogTitle>
                  <DialogDescription>
                    입력한 이름은 LocalStorage에 저장됩니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="이름을 입력하세요"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleDialogConfirm()}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={handleDialogConfirm}>
                    저장
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {userName && (
              <Button variant="secondary" onClick={handleClearName}>
                이름 초기화
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* IndexedDB 데모 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>IndexedDB 데모</CardTitle>
          <CardDescription>
            useIndexedDB 훅을 사용한 대용량 데이터 저장
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 현재 저장된 메모 표시 */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">저장된 메모:</p>
            {isMemoLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-[200px]" />
              </div>
            ) : memo ? (
              <div>
                <p className="font-mono text-sm">{memo.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  저장 시간: {formatRelativeTime(memo.createdAt)}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">(저장된 메모 없음)</p>
            )}
          </div>

          {/* 메모 입력 */}
          <div className="flex gap-2">
            <Input
              placeholder="메모 내용을 입력하세요"
              value={memoInput}
              onChange={(e) => setMemoInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveMemo()}
              className="flex-1"
            />
            <Button onClick={handleSaveMemo}>저장</Button>
            {memo && (
              <Button variant="destructive" onClick={handleRemoveMemo}>
                삭제
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
