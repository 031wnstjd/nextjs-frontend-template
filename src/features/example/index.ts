/**
 * @file 예시 Feature 배럴 파일
 * @description Example 도메인의 모든 export를 통합
 *
 * 이 파일을 통해 외부에서 Example 기능을 import할 때
 * 단일 경로로 접근할 수 있습니다.
 *
 * @example
 * import { ExampleCard, useExampleList, exampleApi } from '@/features/example';
 */

// 컴포넌트
export * from './components';

// 훅
export * from './hooks';

// 서비스
export * from './services';

// 타입
export * from './types';
