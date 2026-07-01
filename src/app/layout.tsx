import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "国际清真食品贸易平台 | IHFTP",
  description: "International Halal Food Trade Platform - 国家级、全球化、垂直型清真食品B2B贸易与产业服务平台",
  keywords: ["halal", "清真食品", "B2B", "贸易平台", "清真认证", "跨境电商"],
  icons: {
    icon: "/favicon-128.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
