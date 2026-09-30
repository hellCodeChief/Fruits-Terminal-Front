"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  getAllProductClient,
  getAllCategoriesClient,
} from "@/components/utils/actionsClient";
import ProductShowTable from "./components/show-table";

export default function AdminProductPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // گرفتن اطلاعات کاربر از استور
  const user = useSelector((state: RootState) => state.user.userInfo);

  // بررسی God بودن کاربر
  const isGodUser =
    user?.email?.toLowerCase() ===
      process.env.NEXT_PUBLIC_GOD_ADMIN_GMAIL?.toLowerCase() &&
    user?.phone?.trim() === process.env.NEXT_PUBLIC_GOD_ADMIN_NUMBER?.trim();

  const userPermission = useSelector(
    (state: RootState) => state.user.userInfo?.roles[0]?.permissions || [],
  );

  useEffect(() => {
    async function fetchData() {
      const products = await getAllProductClient();
      const categories = await getAllCategoriesClient();

      setAllProducts(products || []);
      setAllCategories(categories || []);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <div>در حال بارگذاری محصولات...</div>;

  return (
    <>
      {/* جدول محصولات */}
      <ProductShowTable
        dataSource={allProducts}
        allCategories={allCategories}
        userPermission={userPermission}
        isGodUser={isGodUser}
      />
    </>
  );
}
