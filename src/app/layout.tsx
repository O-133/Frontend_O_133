import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '맛있는처방 - 건강 맞춤 레시피',
  description: '냉장고 재료 기반 건강 맞춤 레시피 추천 서비스',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#3B82F6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="mobile-frame">
          {children}
        </div>
      </body>
    </html>
  );
}