"use client";

import {
  getAllPermissionClient,
  getAllroleClient,
} from "@/components/utils/actionsClient";
import { RootState } from "@/app/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RoleShowTable from "./components/show-table";

export default function AdminRolePage() {
  const [allPermissions, setAllPermissions] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state: RootState) => state.user.userInfo);

  const isGodUser =
    user?.email?.toLowerCase() ===
      process.env.NEXT_PUBLIC_GOD_ADMIN_GMAIL?.toLowerCase() &&
    user?.phone?.trim() === process.env.NEXT_PUBLIC_GOD_ADMIN_NUMBER?.trim();

  const userPermission = useSelector(
    (state: RootState) => state.user.userInfo?.roles?.[0]?.permissions || []
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const [permissions, roles] = await Promise.all([
          getAllPermissionClient(),
          getAllroleClient(),
        ]);
        setAllPermissions(permissions || []);
        setAllRoles(roles || []);
      } catch (error) {
        console.error("خطا در واکشی داده‌ها:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>در حال بارگذاری مجوزها و نقش‌ها...</div>;

  return (
    <RoleShowTable
      allPermissions={allPermissions}
      userPermission={userPermission}
      allRoles={allRoles}
      isGodUser={isGodUser}
    />
  );
}
