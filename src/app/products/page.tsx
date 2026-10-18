"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getAllCategoriesClient,
  getAllProductClient,
} from "@/components/utils/actionsClient";
import ProductsClient from "./components/products-client";

function latestVariant(product: any) {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  return variants.reduce((latest: any, item: any) => {
    if (!latest) return item;
    const latestTime = Date.parse(latest.createdAt || "") || latest.id || 0;
    const itemTime = Date.parse(item.createdAt || "") || item.id || 0;
    return itemTime >= latestTime ? item : latest;
  }, null);
}

// ✅ همان ترتیب داشبورد: تاریخ تازه‌ترین تنوع، نه آیدی یا تاریخ محصول
function productTime(product: any) {
  const createdAt = latestVariant(product)?.createdAt;
  const variantTime = Date.parse(createdAt || "");
  if (createdAt && !Number.isNaN(variantTime)) return variantTime;
  return 0;
}

// ✅ جدیدترین تنوع اول؛ قیمت مرتب‌سازی همان ریال ذخیره‌شده است
function listedProducts(
  products: any[],
  params: { get(name: string): string | null } | null
) {
  const byCategory = params?.get("byCategory");
  const gte = params?.get("gte");
  const lte = params?.get("lte");
  const available = params?.get("available");
  const sort = params?.get("sort") || "desc";
  const categoryIds = byCategory ? byCategory.split(",").map(Number) : [];
  const min = gte ? Number(gte) : null;
  const max = lte ? Number(lte) : null;

  const filtered = products.filter((product) => {
    const variants = Array.isArray(product.variants) ? product.variants : [];
    // ✅ ردیف قدیمی بدون تنوع کارت روزانه نمی‌گیرد
    if (variants.length === 0) return false;
    const categories = Array.isArray(product.categories) ? product.categories : [];
    if (categoryIds.length && !categories.some((cat: any) => categoryIds.includes(cat.id))) {
      return false;
    }
    if (min !== null || max !== null) {
      const inRange = variants.some((variant: any) => {
        const price = Number(variant.price);
        if (min !== null && price < min) return false;
        if (max !== null && price > max) return false;
        return true;
      });
      if (!inRange) return false;
    }
    if (available === "true" && !variants.some((variant: any) => Number(variant.stock) > 0)) {
      return false;
    }
    return true;
  });

  const priceOf = (product: any) => Number(latestVariant(product)?.price) || 0;
  return filtered.sort((a, b) => {
    if (sort === "asc") return productTime(a) - productTime(b);
    if (sort === "cheap") return priceOf(a) - priceOf(b);
    if (sort === "expensive") return priceOf(b) - priceOf(a);
    return productTime(b) - productTime(a);
  });
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    let ignore = false;
    // ✅ به‌جای getAllProductISR و getAllCategoriesISR؛ بدون کش ۶۰ ثانیه
    async function load() {
      try {
        const [productList, categoryList] = await Promise.all([
          getAllProductClient(),
          getAllCategoriesClient(),
        ]);
        if (ignore) return;
        setProducts(Array.isArray(productList) ? productList : []);
        setCategories(Array.isArray(categoryList) ? categoryList : []);
      } catch {
        if (!ignore) {
          setProducts([]);
          setCategories([]);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredCategories = categories.filter((cat) => cat.slug !== "noCats");

  return (
    <ProductsClient
      categories={filteredCategories}
      products={listedProducts(products, searchParams)}
    />
  );
}
