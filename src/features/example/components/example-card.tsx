/**
 * @file 예시 카드 컴포넌트
 * @description Example 도메인의 카드 UI 컴포넌트
 */

'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Example } from '../types';

/**
 * 상태별 배지 색상 매핑
 */
const STATUS_COLORS = {
    draft: 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    archived: 'bg-yellow-100 text-yellow-800',
} as const;

/**
 * 상태별 한글 라벨
 */
const STATUS_LABELS = {
    draft: '초안',
    active: '진행중',
    completed: '완료',
    archived: '보관됨',
} as const;

/**
 * 예시 카드 Props
 */
interface ExampleCardProps {
    /** 예시 데이터 */
    example: Example;
    /** 수정 버튼 클릭 핸들러 */
    onEdit?: (example: Example) => void;
    /** 삭제 버튼 클릭 핸들러 */
    onDelete?: (example: Example) => void;
    /** 카드 클릭 핸들러 */
    onClick?: (example: Example) => void;
}

/**
 * 예시 카드 컴포넌트
 *
 * @example
 * <ExampleCard
 *   example={exampleData}
 *   onEdit={(e) => handleEdit(e)}
 *   onDelete={(e) => handleDelete(e)}
 * />
 */
export function ExampleCard({ example, onEdit, onDelete, onClick }: ExampleCardProps) {
    return (
        <Card
            className={onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
            onClick={() => onClick?.(example)}
        >
            <CardHeader>
                {/* 제목과 상태 배지 */}
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{example.title}</CardTitle>
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[example.status]}`}
                    >
                        {STATUS_LABELS[example.status]}
                    </span>
                </div>
                {/* 설명 */}
                <CardDescription className="line-clamp-2">{example.description}</CardDescription>
            </CardHeader>

            <CardContent>
                {/* 태그 목록 */}
                {example.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {example.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </CardContent>

            {/* 액션 버튼 (Edit/Delete 핸들러가 있는 경우에만 표시) */}
            {(onEdit || onDelete) && (
                <CardFooter className="flex justify-end gap-2">
                    {onEdit && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
                                onEdit(example);
                            }}
                        >
                            수정
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(example);
                            }}
                        >
                            삭제
                        </Button>
                    )}
                </CardFooter>
            )}
        </Card>
    );
}

export default ExampleCard;
