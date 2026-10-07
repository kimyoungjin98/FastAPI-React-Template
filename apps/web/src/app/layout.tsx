import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FastAPI + Next.js Starter",
  description: "FastAPI와 Next.js를 함께 개발하는 Turborepo 템플릿",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
