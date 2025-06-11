import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "汇小金智能体应用",
  description:
    "hi，欢迎来到汇金国际商务社区，我是汇金智能体，有什么企业服务相关问题都可以咨询我。",
  keywords: "AI助手,百炼智能,汇金,金融咨询,人工智能,智能客服",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0a0e27",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-gray-800 text-white">{children}</body>
    </html>
  );
}
