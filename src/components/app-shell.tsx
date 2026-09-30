"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import PageFrame from "@/components/page-frame/pageFrame";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/vitrine")) return <>{children}</>;
  return <PageFrame>{children}</PageFrame>;
}
