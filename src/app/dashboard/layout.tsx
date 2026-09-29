"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Provider } from "react-redux";
import { store } from "@/app/store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Provider store={store}>
        <section>{children}</section>
      </Provider>
    </ProtectedRoute>
  );
}
