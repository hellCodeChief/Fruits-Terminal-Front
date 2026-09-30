import React, { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AppShell from "@/components/app-shell";
import { ConfigProvider } from "antd";
import "./styles/globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="fa" dir="rtl">
    <body>
      {/* Wrap the layout with ConfigProvider to apply RTL direction */}
      <ConfigProvider direction="rtl">
        <AntdRegistry>
          <AppShell>{children}</AppShell>
        </AntdRegistry>
      </ConfigProvider>
    </body>
  </html>
);

export default RootLayout;
