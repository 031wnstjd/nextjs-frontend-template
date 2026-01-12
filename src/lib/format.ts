/**
 * @file 포맷 유틸리티
 * @description 날짜, 숫자, 파일 크기 등의 포맷팅 함수
 */

/**
 * 날짜 포맷팅 옵션
 */
interface DateFormatOptions {
    /** 날짜 스타일 */
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
    /** 시간 스타일 */
    timeStyle?: 'full' | 'long' | 'medium' | 'short';
    /** 로케일 (기본: ko-KR) */
    locale?: string;
}

/**
 * 날짜를 포맷팅된 문자열로 변환
 *
 * @param date - 포맷팅할 날짜 (Date, string, number)
 * @param options - 포맷팅 옵션
 * @returns 포맷팅된 날짜 문자열
 *
 * @example
 * formatDate(new Date()); // '2026. 1. 12.'
 * formatDate('2026-01-12', { dateStyle: 'full' }); // '2026년 1월 12일 일요일'
 * formatDate(Date.now(), { dateStyle: 'short', timeStyle: 'short' }); // '26. 1. 12. 오후 11:00'
 */
export function formatDate(
    date: Date | string | number,
    options: DateFormatOptions = {}
): string {
    const { dateStyle = 'medium', timeStyle, locale = 'ko-KR' } = options;

    try {
        const dateObj = date instanceof Date ? date : new Date(date);

        if (isNaN(dateObj.getTime())) {
            return '유효하지 않은 날짜';
        }

        return new Intl.DateTimeFormat(locale, {
            dateStyle,
            timeStyle,
        }).format(dateObj);
    } catch {
        return '유효하지 않은 날짜';
    }
}

/**
 * 숫자 포맷팅 옵션
 */
interface NumberFormatOptions {
    /** 통화 코드 (예: 'KRW', 'USD') */
    currency?: string;
    /** 소수점 자릿수 */
    decimals?: number;
    /** 로케일 (기본: ko-KR) */
    locale?: string;
    /** 단위 축약 (K, M, B) */
    compact?: boolean;
}

/**
 * 숫자를 포맷팅된 문자열로 변환
 *
 * @param num - 포맷팅할 숫자
 * @param options - 포맷팅 옵션
 * @returns 포맷팅된 숫자 문자열
 *
 * @example
 * formatNumber(1234567); // '1,234,567'
 * formatNumber(1234567, { currency: 'KRW' }); // '₩1,234,567'
 * formatNumber(1234567, { compact: true }); // '123만'
 * formatNumber(1234.5678, { decimals: 2 }); // '1,234.57'
 */
export function formatNumber(
    num: number,
    options: NumberFormatOptions = {}
): string {
    const { currency, decimals, locale = 'ko-KR', compact = false } = options;

    if (typeof num !== 'number' || isNaN(num)) {
        return '0';
    }

    const formatOptions: Intl.NumberFormatOptions = {};

    if (currency) {
        formatOptions.style = 'currency';
        formatOptions.currency = currency;
    }

    if (decimals !== undefined) {
        formatOptions.minimumFractionDigits = decimals;
        formatOptions.maximumFractionDigits = decimals;
    }

    if (compact) {
        formatOptions.notation = 'compact';
    }

    return new Intl.NumberFormat(locale, formatOptions).format(num);
}

/**
 * 바이트 크기 단위
 */
const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;

/**
 * 바이트를 읽기 쉬운 형식으로 변환
 *
 * @param bytes - 바이트 크기
 * @param decimals - 소수점 자릿수 (기본: 2)
 * @returns 포맷팅된 파일 크기 문자열
 *
 * @example
 * formatBytes(1024); // '1 KB'
 * formatBytes(1234567); // '1.18 MB'
 * formatBytes(1234567890); // '1.15 GB'
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 B';
    if (typeof bytes !== 'number' || isNaN(bytes)) return '0 B';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;

    const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
    const unitIndex = Math.min(i, BYTE_UNITS.length - 1);

    return `${parseFloat((bytes / Math.pow(k, unitIndex)).toFixed(dm))} ${BYTE_UNITS[unitIndex]}`;
}

/**
 * 상대적 시간 표시
 *
 * @param date - 비교할 날짜
 * @param locale - 로케일 (기본: ko-KR)
 * @returns 상대적 시간 문자열
 *
 * @example
 * formatRelativeTime(Date.now() - 60000); // '1분 전'
 * formatRelativeTime(Date.now() - 3600000); // '1시간 전'
 */
export function formatRelativeTime(
    date: Date | string | number,
    locale: string = 'ko-KR'
): string {
    try {
        const dateObj = date instanceof Date ? date : new Date(date);

        if (isNaN(dateObj.getTime())) {
            return '유효하지 않은 날짜';
        }

        const now = Date.now();
        const diff = now - dateObj.getTime();
        const seconds = Math.floor(diff / 1000);

        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

        if (Math.abs(seconds) < 60) {
            return rtf.format(-seconds, 'second');
        }

        const minutes = Math.floor(seconds / 60);
        if (Math.abs(minutes) < 60) {
            return rtf.format(-minutes, 'minute');
        }

        const hours = Math.floor(minutes / 60);
        if (Math.abs(hours) < 24) {
            return rtf.format(-hours, 'hour');
        }

        const days = Math.floor(hours / 24);
        if (Math.abs(days) < 30) {
            return rtf.format(-days, 'day');
        }

        const months = Math.floor(days / 30);
        if (Math.abs(months) < 12) {
            return rtf.format(-months, 'month');
        }

        const years = Math.floor(days / 365);
        return rtf.format(-years, 'year');
    } catch {
        return '유효하지 않은 날짜';
    }
}
