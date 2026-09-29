"use client";

import {
  getAllroleClient,
  getAllUsersClient,
} from "@/components/utils/actionsClient";
import { RootState } from "@/app/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserRoleShowTable from "./components/show-table";

export default function AdminUserRolePage() {
  const [allRoles, setAllRoles] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
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
        const [roles, users] = await Promise.all([
          getAllroleClient(),
          getAllUsersClient(), // باید API گرفتن لیست کاربران داشته باشی
        ]);
        setAllRoles(roles || []);
        setAllUsers(users || []);
      } catch (error) {
        console.error("خطا در واکشی داده‌ها:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>در حال بارگذاری کاربران و نقش‌ها...</div>;

  return (
    <UserRoleShowTable
      allRoles={allRoles}
      userPermission={userPermission}
      allUsers={allUsers}
      isGodUser={isGodUser}
    />
  );
}
