"use client";

import DailyProductCard, {
  variantSortTime,
} from "@/components/daily-product-card/daily-product-card";
import { getAllProductClient } from "@/components/utils/actionsClient";
import { Typography } from "antd";
import { useEffect, useState } from "react";

// ✅ فراورده از جدول product؛ حجره روی dailyProduct می‌ماند
export default function FruitProducePage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    let ignore = false;
    getAllProductClient().then((list) => {
      if (ignore) return;
      const items = Array.isArray(list) ? list : [];
      // ✅ همان فهرست کاتالوگ: ردیف بدون تنوع کارت نمی‌گیرد
      const withVariants = items.filter(
        (product) => Array.isArray(product?.variants) && product.variants.length > 0
      );
      setProducts([...withVariants].sort((a, b) => variantSortTime(b) - variantSortTime(a)));
    });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="w-full p-4">
      <Typography.Title level={2}>فراورده میوه</Typography.Title>
      {products.length > 0 ? (
        <div className="mt-4 flex w-full min-w-0 max-w-full flex-col gap-3">
          {products.map((product) => (
            <DailyProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </main>
  );
}
