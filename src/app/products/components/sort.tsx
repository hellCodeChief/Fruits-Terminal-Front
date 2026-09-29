"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "antd";

const options = [
  { value: "desc", label: "جدیدترین" },
  { value: "asc", label: "قدیمی‌ترین" },
  { value: "cheap", label: "ارزان‌ترین" },
  { value: "expensive", label: "گران‌ترین" },
];

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // query فعلی را flat می‌خوانیم
  const currentSort = searchParams.get("sort") ?? "desc";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // new change
    params.set("sort", value);
    // reason: backend فقط queryهای flat را پشتیبانی می‌کند

    router.replace(`/products?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <Select
      value={currentSort}
      onChange={handleChange}
      options={options}
      style={{ minWidth: 160 }}
      placeholder="مرتب‌سازی"
    />
  );
}
