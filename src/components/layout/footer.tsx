/**
 * @file 푸터 컴포넌트
 * @description 애플리케이션 하단 푸터 레이아웃 컴포넌트
 */

import React from 'react';

/**
 * 푸터 컴포넌트 Props
 */
interface FooterProps {
    /** 회사/프로젝트 이름 */
    companyName?: string;
}

/**
 * 푸터 컴포넌트
 *
 * @example
 * <Footer companyName="My Company" />
 */
export function Footer({ companyName = 'Your Company' }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t py-6 md:py-0">
            <div className="container mx-auto px-6 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                {/* 저작권 정보 */}
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © {currentYear} {companyName}. All rights reserved.
                </p>

                {/* 푸터 링크 */}
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <a
                        href="/privacy"
                        className="hover:text-foreground transition-colors"
                    >
                        개인정보처리방침
                    </a>
                    <a
                        href="/terms"
                        className="hover:text-foreground transition-colors"
                    >
                        이용약관
                    </a>
                    <a
                        href="/contact"
                        className="hover:text-foreground transition-colors"
                    >
                        문의하기
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
