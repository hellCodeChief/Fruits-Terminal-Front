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
    <div className="relative h-screen no-scrollbar">
      <Provider store={store}>
        <Menu />
        {children}
      </Provider>
    </div>
  );
}
