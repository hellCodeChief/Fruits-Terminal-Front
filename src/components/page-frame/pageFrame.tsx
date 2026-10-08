"use client";
import React, { ReactNode } from "react";
import Menu from "./menu";
import PublicNav from "./public-nav";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { usePathname } from "next/navigation";

interface PageFrameProps {
  children: ReactNode;
}

export default function PageFrame({ children }: PageFrameProps) {
  const pathname = usePathname();
  const publicSite = !pathname.startsWith("/dashboard");

  return (
    // ✅ پوسته هم‌عرض پنجره؛ اسکرول افقی روی بدنه و این قاب نماند
    <div className="relative h-screen w-full min-w-0 max-w-full overflow-x-clip no-scrollbar">
      <Provider store={store}>
        <Menu />
        <PublicNav />
        {children}
        {/* ✅ جای نوار پایین تا محتوا زیر آن نماند */}
        {publicSite ? <div className="h-24 lg:hidden" /> : null}
      </Provider>
    </div>
  );
}
