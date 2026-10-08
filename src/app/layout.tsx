import React, { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import PageFrame from "@/components/page-frame/pageFrame";
import { ConfigProvider } from "antd";
import tailwindConfig from "../../tailwind.config";
import "./styles/globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="fa" dir="rtl">
    <body className="bg-light-page">
      {/* ✅ رنگ اصلی دکمه‌ها همان سبز تم تیلویند است */}
      <ConfigProvider
        direction="rtl"
        theme={{ token: { colorPrimary: tailwindConfig.themeColors.primary } }}
      >
        <AntdRegistry>
          <PageFrame>{children}</PageFrame>
        </AntdRegistry>
      </ConfigProvider>
    </body>
  </html>
);

export default RootLayout;
