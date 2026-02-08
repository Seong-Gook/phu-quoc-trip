import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // 1. 기본 제목 설명
  title: "푸꾸옥 쉐라톤 롱비치 여행",
  description: "2026 Family Memorial Trip",

  // 2. 주소 설정 (중요! 카톡이 이미지를 잘 찾도록 도와줌)
  metadataBase: new URL('https://phu-quoc-trip-opal.vercel.app'),

  // 3. 카카오톡 공유 미리보기 설정 (Open Graph)
  openGraph: {
    title: "푸꾸옥 쉐라톤 롱비치 여행",
    description: "2026년 우리 가족의 소중한 추억 저장소",
    images: [
      {
        url: "/images/bg-sheraton.jpg", // 배경으로 썼던 그 사진을 대표 이미지로!
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}