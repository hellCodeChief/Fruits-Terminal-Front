"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { getAllPropertyClient } from "@/components/utils/actionsClient";
import PropertyShowTable from "./components/show-table";

export default function AdminPropertyPage() {
  const [allProperties, setAllProperties] = useState([]);
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
    async function fetchProperties() {
      const properties = await getAllPropertyClient();
      setAllProperties(properties || []);
      setLoading(false);
    }

    fetchProperties();
  }, []);

  if (loading) return <div>در حال بارگذاری ویژگی‌ها...</div>;

  return (
    <PropertyShowTable
      dataSource={allProperties}
      userPermission={userPermission}
      isGodUser={isGodUser}
    />
  );
}
