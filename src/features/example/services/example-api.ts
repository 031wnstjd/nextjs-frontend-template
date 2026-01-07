/**
 * @file 예시 API 서비스
 * @description Example 도메인의 백엔드 API 연동 서비스
 *
 * 이 파일은 백엔드 API 연동의 모범 사례를 보여줍니다:
 * - 타입 안전한 API 호출
 * - 에러 핸들링
 * - CRUD 작업 구현
 *
 * @example
 * // 목록 조회
 * const examples = await exampleApi.getList({ page: 1, limit: 10 });
 *
 * // 생성
 * const newExample = await exampleApi.create({ title: 'New', ... });
 */

import { apiClient, ENDPOINTS, withQueryParams } from '@/lib/api';
import type { PaginationParams } from '@/lib/api';
import type {
    Example,
    CreateExampleRequest,
    UpdateExampleRequest,
    ExampleListResponse,
    ExampleFilter,
} from '../types';

/**
 * 예시 API 서비스 클래스
 *
 * 각 도메인별로 이와 같은 API 서비스 클래스를 만들어
 * API 호출 로직을 캡슐화합니다.
 */
class ExampleApiService {
    /**
     * 예시 목록 조회
     *
     * @param params - 페이지네이션 파라미터
     * @param filter - 필터 조건
     * @returns 페이지네이션된 예시 목록
     *
     * @example
     * const result = await exampleApi.getList(
     *   { page: 1, limit: 20 },
     *   { status: 'active', search: '검색어' }
     * );
     */
    async getList(
        params: PaginationParams = {},
        filter: ExampleFilter = {}
    ): Promise<ExampleListResponse> {
        // 기본값 설정
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;

        // 필터에서 배열을 문자열로 변환 (API 요구사항에 맞게 조정)
        const { tags, ...restFilter } = filter;

        // 쿼리 파라미터 조합
        const queryParams = {
            page,
            limit,
            sortBy,
            sortOrder,
            ...restFilter,
            // tags 배열은 쉼표로 구분된 문자열로 변환
            ...(tags && tags.length > 0 ? { tags: tags.join(',') } : {}),
        };

        // URL에 쿼리 파라미터 추가
        const url = withQueryParams(ENDPOINTS.EXAMPLE.LIST, queryParams);

        return apiClient.get<ExampleListResponse>(url);
    }

    /**
     * 예시 상세 조회
     *
     * @param id - 예시 ID
     * @returns 예시 상세 정보
     *
     * @example
     * const example = await exampleApi.getById('example-id-123');
     */
    async getById(id: string): Promise<Example> {
        return apiClient.get<Example>(ENDPOINTS.EXAMPLE.DETAIL(id));
    }

    /**
     * 예시 생성
     *
     * @param data - 생성할 예시 데이터
     * @returns 생성된 예시
     *
     * @example
     * const newExample = await exampleApi.create({
     *   title: '새 예시',
     *   description: '설명',
     *   status: 'draft',
     *   priority: 1,
     *   tags: ['tag1', 'tag2'],
     * });
     */
    async create(data: CreateExampleRequest): Promise<Example> {
        return apiClient.post<Example>(ENDPOINTS.EXAMPLE.CREATE, data);
    }

    /**
     * 예시 수정
     *
     * @param id - 수정할 예시 ID
     * @param data - 수정할 데이터 (변경할 필드만 포함)
     * @returns 수정된 예시
     *
     * @example
     * const updated = await exampleApi.update('example-id', {
     *   title: '수정된 제목',
     *   status: 'active',
     * });
     */
    async update(id: string, data: UpdateExampleRequest): Promise<Example> {
        return apiClient.patch<Example>(ENDPOINTS.EXAMPLE.UPDATE(id), data);
    }

    /**
     * 예시 삭제
     *
     * @param id - 삭제할 예시 ID
     *
     * @example
     * await exampleApi.delete('example-id');
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(ENDPOINTS.EXAMPLE.DELETE(id));
    }

    /**
     * 예시 일괄 삭제
     *
     * @param ids - 삭제할 예시 ID 목록
     *
     * @example
     * await exampleApi.deleteMany(['id1', 'id2', 'id3']);
     */
    async deleteMany(ids: string[]): Promise<void> {
        // 병렬로 삭제 요청 실행
        await Promise.all(ids.map((id) => this.delete(id)));
    }
}

/**
 * 예시 API 서비스 인스턴스
 * 앱 전체에서 이 인스턴스를 import하여 사용
 */
export const exampleApi = new ExampleApiService();

export default exampleApi;
