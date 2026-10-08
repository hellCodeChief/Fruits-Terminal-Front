"use client";
import React, { ReactNode } from "react";
import Menu from "./menu";
import { Provider } from "react-redux";
import { store } from "@/app/store";

interface PageFrameProps {
  children: ReactNode;
}

export default function PageFrame({ children }: PageFrameProps) {
  return (
    // ✅ پوسته هم‌عرض پنجره؛ اسکرول افقی روی بدنه و این قاب نماند
    <div className="relative h-screen w-full min-w-0 max-w-full overflow-x-clip no-scrollbar">
      <Provider store={store}>
        <Menu />
        {children}
      </Provider>
    </div>
  );
}
