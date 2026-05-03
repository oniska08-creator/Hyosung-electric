import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import KakaoFAB from "@/components/common/KakaoFAB";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "효성전기 | Hyosung Electric Systems",
  description: "20년 신뢰의 고성능 산업급 전력 인력 인프라 및 전기자재 솔루션 마스터.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased overflow-x-hidden">
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <KakaoFAB />
        </AuthProvider>
      </body>
    </html>
  );
}
