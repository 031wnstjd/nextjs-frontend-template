/**
 * @file API 클라이언트 모듈
 * @description 백엔드 API 통신을 위한 타입 안전한 Fetch wrapper
 *
 * 이 모듈은 다음과 같은 기능을 제공합니다:
 * - 타입 안전한 HTTP 요청 (GET, POST, PUT, DELETE)
 * - 인터셉터 패턴을 통한 요청/응답 전처리
 * - 표준화된 에러 핸들링
 * - 인증 토큰 자동 주입
 *
 * @example
 * // 기본 사용법
 * const users = await apiClient.get<User[]>('/users');
 *
 * // POST 요청
 * const newUser = await apiClient.post<User>('/users', { name: 'John' });
 */

import { API_BASE_URL, DEFAULT_HEADERS } from './endpoints';
import type { ApiResponse, ApiError, RequestConfig } from './types';

/**
 * API 클라이언트 클래스
 * 싱글톤 패턴으로 구현되어 앱 전체에서 하나의 인스턴스만 사용
 */
class ApiClient {
    /** 기본 URL */
    private baseUrl: string;

    /** 기본 헤더 */
    private defaultHeaders: HeadersInit;

    /** 인증 토큰 저장 */
    private authToken: string | null = null;

    constructor(baseUrl: string, defaultHeaders: HeadersInit = {}) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = defaultHeaders;
    }

    /**
     * 인증 토큰 설정
     * @param token - Bearer 토큰 문자열
     */
    setAuthToken(token: string | null): void {
        this.authToken = token;
    }

    /**
     * 요청 헤더 생성
     * 인증 토큰이 있으면 Authorization 헤더 추가
     */
    private getHeaders(customHeaders?: HeadersInit): Record<string, string> {
        // HeadersInit을 Record<string, string>으로 변환
        const baseHeaders = this.headersToRecord(this.defaultHeaders);
        const additionalHeaders = customHeaders ? this.headersToRecord(customHeaders) : {};

        const headers: Record<string, string> = {
            ...baseHeaders,
            ...additionalHeaders,
        };

        // 인증 토큰이 있으면 헤더에 추가
        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        return headers;
    }

    /**
     * HeadersInit을 Record<string, string>으로 변환
     */
    private headersToRecord(headers: HeadersInit): Record<string, string> {
        if (headers instanceof Headers) {
            const result: Record<string, string> = {};
            headers.forEach((value, key) => {
                result[key] = value;
            });
            return result;
        }
        if (Array.isArray(headers)) {
            return Object.fromEntries(headers);
        }
        return headers as Record<string, string>;
    }

    /**
     * 요청 전처리 인터셉터
     * 요청 전에 로깅, 토큰 갱신 등의 작업 수행
     */
    private async requestInterceptor(config: RequestConfig): Promise<RequestConfig> {
        // 개발 환경에서 요청 로깅
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API] ${config.method} ${config.url}`);
        }

        return config;
    }

    /**
     * 응답 후처리 인터셉터
     * 응답 후 로깅, 에러 처리 등의 작업 수행
     */
    private async responseInterceptor<T>(response: Response): Promise<ApiResponse<T>> {
        // 응답이 성공적이지 않은 경우 에러 처리
        if (!response.ok) {
            const errorData = await this.parseErrorResponse(response);
            throw this.createApiError(response.status, errorData);
        }

        // 204 No Content 응답 처리
        if (response.status === 204) {
            return { data: null as T, status: response.status };
        }

        const data = await response.json();
        return { data, status: response.status };
    }

    /**
     * 에러 응답 파싱
     */
    private async parseErrorResponse(response: Response): Promise<{ message: string }> {
        try {
            const errorJson = await response.json();
            return { message: errorJson.message || '알 수 없는 오류가 발생했습니다.' };
        } catch {
            return { message: response.statusText || '서버 응답을 파싱할 수 없습니다.' };
        }
    }

    /**
     * API 에러 객체 생성
     */
    private createApiError(status: number, errorData: { message: string }): ApiError {
        const error: ApiError = {
            status,
            message: errorData.message,
            name: 'ApiError',
        };

        // 상태 코드별 에러 메시지 보강
        switch (status) {
            case 401:
                error.message = '인증이 필요합니다. 다시 로그인해주세요.';
                break;
            case 403:
                error.message = '접근 권한이 없습니다.';
                break;
            case 404:
                error.message = '요청한 리소스를 찾을 수 없습니다.';
                break;
            case 500:
                error.message = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
                break;
        }

        return error;
    }

    /**
     * HTTP 요청 실행
     */
    private async request<T>(
        method: string,
        endpoint: string,
        body?: unknown,
        customHeaders?: HeadersInit
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const config: RequestConfig = {
            method,
            url,
            headers: this.getHeaders(customHeaders),
            body: body ? JSON.stringify(body) : undefined,
        };

        // 요청 인터셉터 실행
        const processedConfig = await this.requestInterceptor(config);

        // 요청 실행
        const response = await fetch(processedConfig.url, {
            method: processedConfig.method,
            headers: processedConfig.headers,
            body: processedConfig.body,
        });

        // 응답 인터셉터 실행
        const result = await this.responseInterceptor<T>(response);
        return result.data;
    }

    /**
     * GET 요청
     * @param endpoint - API 엔드포인트 (예: '/users')
     * @param headers - 추가 헤더 (선택)
     */
    async get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
        return this.request<T>('GET', endpoint, undefined, headers);
    }

    /**
     * POST 요청
     * @param endpoint - API 엔드포인트
     * @param body - 요청 본문 데이터
     * @param headers - 추가 헤더 (선택)
     */
    async post<T>(endpoint: string, body?: unknown, headers?: HeadersInit): Promise<T> {
        return this.request<T>('POST', endpoint, body, headers);
    }

    /**
     * PUT 요청
     * @param endpoint - API 엔드포인트
     * @param body - 요청 본문 데이터
     * @param headers - 추가 헤더 (선택)
     */
    async put<T>(endpoint: string, body?: unknown, headers?: HeadersInit): Promise<T> {
        return this.request<T>('PUT', endpoint, body, headers);
    }

    /**
     * PATCH 요청
     * @param endpoint - API 엔드포인트
     * @param body - 요청 본문 데이터
     * @param headers - 추가 헤더 (선택)
     */
    async patch<T>(endpoint: string, body?: unknown, headers?: HeadersInit): Promise<T> {
        return this.request<T>('PATCH', endpoint, body, headers);
    }

    /**
     * DELETE 요청
     * @param endpoint - API 엔드포인트
     * @param headers - 추가 헤더 (선택)
     */
    async delete<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
        return this.request<T>('DELETE', endpoint, undefined, headers);
    }
}

/**
 * 전역 API 클라이언트 인스턴스
 * 앱 전체에서 이 인스턴스를 import하여 사용
 */
export const apiClient = new ApiClient(API_BASE_URL, DEFAULT_HEADERS);

export default apiClient;
