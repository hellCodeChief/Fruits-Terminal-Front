"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  getAllProductClient,
  getAllCategoriesClient,
} from "@/components/utils/actionsClient";
import ProductShowTable from "./components/show-table";

function canOpenProduct(isGodUser: boolean, permissions: { name: string }[]) {
  return (
    isGodUser ||
    permissions.some((item) => item.name === "product:read" || item.name === "product:create")
  );
}

export default function AdminProductPage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // گرفتن اطلاعات کاربر از استور
  const user = useSelector((state: RootState) => state.user.userInfo);

  // بررسی God بودن کاربر
  const isGodUser =
    user?.email?.toLowerCase() ===
      process.env.NEXT_PUBLIC_GOD_ADMIN_GMAIL?.toLowerCase() &&
    user?.phone?.trim() === process.env.NEXT_PUBLIC_GOD_ADMIN_NUMBER?.trim();

  const userPermission = useSelector(
    (state: RootState) => state.user.userInfo?.roles[0]?.permissions || []
  );

  useEffect(() => {
    async function fetchData() {
      const products = await getAllProductClient();
      const categories = await getAllCategoriesClient();

      setAllProducts(Array.isArray(products) ? products : []);
      setAllCategories(categories || []);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <div>در حال بارگذاری محصولات...</div>;

  // ✅ مجوز product:read مسیر داشبورد محصول را باز می‌کند
  if (!canOpenProduct(isGodUser, userPermission)) {
    return <div>به این صفحه دسترسی ندارید</div>;
  }

  return (
    <>
      <ProductShowTable
        dataSource={allProducts}
        allCategories={allCategories}
        userPermission={userPermission}
        isGodUser={isGodUser}
      />
    </>
  );
}
