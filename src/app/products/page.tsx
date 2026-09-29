import {
  getAllCategoriesISR,
  getAllProductISR,
} from "@/components/utils/actionsSSR";
import ProductsClient from "./components/products-client";

export default async function ProductsPage({ searchParams }: any) {
  // -----------------------------
  // 1) دسته‌بندی‌ها، قیمت، موجودی، sort
  // -----------------------------
  const mainFilters = {
    byCategory: searchParams.byCategory ?? "",
    gte: searchParams.gte ?? "",
    lte: searchParams.lte ?? "",
    available: searchParams.available ?? "",
    sort: searchParams.sort ?? "asc",
  };

  // -----------------------------
  // 2) فیلترهای داینامیک (هر پارامتر اضافی که میاد)
  // -----------------------------
  const dynamicFilters = Object.fromEntries(
    Object.entries(searchParams).filter(
      ([key]) =>
        ![
          "byCategory",
          "gte",
          "lte",
          "available",
          "sort",
          "page",
          "limit",
        ].includes(key),
    ),
  );

  const query = {
    ...mainFilters,
    ...dynamicFilters,
  };

  // -----------------------------
  // 3) fetch داده‌ها
  // -----------------------------
  const [products, categories] = await Promise.all([
    getAllProductISR(query),
    getAllCategoriesISR(),
  ]);
  console.log("test", products);

  const filteredCategories = categories.filter(
    (cat: any) => cat.slug !== "noCats",
  );

  return (
    <ProductsClient categories={filteredCategories} products={products.items} />
  );
}
