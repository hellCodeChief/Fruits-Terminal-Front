"use client";

import DailyProductCard, {
  variantSortTime,
} from "@/components/daily-product-card/daily-product-card";
import { getAllProductClient } from "@/components/utils/actionsClient";
import { useEffect, useState } from "react";

// ✅ همان خواندن زنده صفحه محصولات؛ آخرین تنوع هر محصول، تازه‌ترین اول
export default function DailyProducts() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    let ignore = false;
    getAllProductClient().then((list) => {
      if (ignore) return;
      const items = Array.isArray(list) ? list : [];
      // ✅ ردیف قدیمی بدون تنوع کارت روزانه نمی‌گیرد
      const withVariants = items.filter(
        (product) => Array.isArray(product?.variants) && product.variants.length > 0
      );
      setProducts(
        [...withVariants].sort((a, b) => variantSortTime(b) - variantSortTime(a))
      );
    });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="mt-4 w-full min-w-0 max-w-full">
      {/* ✅ عنوان ویترین روزانه */}
      <h2 className="font-bold text-xl">میوه‌های روز</h2>
      {products.length > 0 ? (
        <div className="mt-4 flex w-full min-w-0 max-w-full flex-col gap-3">
          {products.map((product) => (
            <DailyProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
