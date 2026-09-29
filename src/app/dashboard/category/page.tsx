"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { getAllCategoriesClient } from "@/components/utils/actionsClient";
import CategoryShowTable from "./components/show-table";

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state: RootState) => state.user.userInfo);

  const isGodUser =
    user?.email?.toLowerCase() ===
      process.env.NEXT_PUBLIC_GOD_ADMIN_GMAIL?.toLowerCase() &&
    user?.phone?.trim() === process.env.NEXT_PUBLIC_GOD_ADMIN_NUMBER?.trim();

  const userPermission = useSelector(
    (state: RootState) => state.user.userInfo?.roles[0]?.permissions || [],
  );

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategoriesClient();

      setCategories(data || []);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  if (loading) return <div>در حال بارگذاری دسته‌بندی‌ها...</div>;

  return (
    <>
      <CategoryShowTable
        dataSource={categories}
        userPermission={userPermission}
        isGodUser={isGodUser}
      />
    </>
  );
}
