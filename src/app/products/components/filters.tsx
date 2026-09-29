"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, Slider, Switch } from "antd";
import { useState } from "react";
import FilterTitle from "./title";

type Category = { id: number; displayName: string };

export default function Filters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // -----------------------------
  // 1) خواندن مقادیر از URL
  // 🔥 نکته مهم: اگر پارامتر نبود، مقدار پیش‌فرض نمی‌گذاریم!
  // -----------------------------
  const query = {
    byCategory: searchParams.get("byCategory") ?? undefined,
    gte: searchParams.get("gte") ?? undefined,
    lte: searchParams.get("lte") ?? undefined,
    available: searchParams.get("available") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
  };

  // -----------------------------
  // 2) دسته‌بندی‌ها
  // -----------------------------
  const activeIds = query.byCategory
    ? query.byCategory.split(",").map(Number)
    : [];

  const handleCategoryChange = (values: number[]) => {
    pushQuery({
      ...query,
      byCategory: values.length > 0 ? values.join(",") : undefined,
    });
  };

  // -----------------------------
  // 3) بازه قیمت
  // -----------------------------
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(query.gte ?? 0),
    Number(query.lte ?? 1000000),
  ]);

  const handlePriceChangeComplete = (values: [number, number]) => {
    pushQuery({
      ...query,
      gte: values[0] === 0 ? undefined : String(values[0]),
      lte: values[1] === 1000000 ? undefined : String(values[1]),
    });
  };

  // -----------------------------
  // 4) موجودی
  // -----------------------------
  const availability = query.available === "true";

  const handleAvailability = (checked: boolean) => {
    pushQuery({
      ...query,
      available: checked ? "true" : undefined,
    });
  };

  // -----------------------------
  // 5) helper: pushQuery
  // فقط پارامترهایی اضافه می‌کنیم که مقدار دارند
  // -----------------------------
  const pushQuery = (newQuery: Record<string, string | undefined>) => {
    const params = new URLSearchParams();

    Object.entries(newQuery).forEach(([key, val]) => {
      if (val !== undefined && val !== "") {
        params.set(key, val);
      }
    });

    router.replace(`/products?${params.toString()}`, { scroll: false });
  };

  // -----------------------------
  // 6) UI
  // -----------------------------
  return (
    <div>
      <FilterTitle titleText="دسته بندی" />
      <Select
        mode="multiple"
        value={activeIds}
        onChange={handleCategoryChange}
        placeholder="انتخاب دسته‌بندی"
        className="w-full"
        options={categories.map((c) => ({ value: c.id, label: c.displayName }))}
        allowClear
      />

      <FilterTitle titleText="فیلتر قیمت (تومان):" />
      <Slider
        range
        min={0}
        max={1_000_000}
        step={50_000}
        value={priceRange}
        onChange={(v) => setPriceRange(v as [number, number])}
        onChangeComplete={(v) =>
          handlePriceChangeComplete(v as [number, number])
        }
        tooltip={{ placement: "top" }}
      />

      <div className="mt-1 text-sm">
        از {priceRange[0]} تا {priceRange[1]}
      </div>

      <FilterTitle titleText="کالاهای موجود" />
      <div className="flex items-center gap-2">
        <Switch checked={availability} onChange={handleAvailability} />
        <span className="text-sm">کالاهای موجود</span>
      </div>
    </div>
  );
}
