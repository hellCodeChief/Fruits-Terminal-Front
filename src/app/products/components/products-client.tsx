"use client";

import { useState } from "react";
import { CiFilter } from "react-icons/ci";
import SortSelect from "./sort";
import Filters from "./filters";
import DailyProductCard from "@/components/daily-product-card/daily-product-card";

type Props = {
  categories: { id: number; displayName: string }[];
  products: any[];
};

export default function ProductsClient({ categories, products }: Props) {
  const [filterIsOpen, setFilterIsOpen] = useState(false);

  return (
    <div className="container m-auto">
      <header className="flex justify-between mb-4">
        <button
          onClick={() => setFilterIsOpen((v) => !v)}
          className="flex items-center border-2 border-black px-4 py-1 hover:bg-light-myBrown hover:text-light-myWhite hover:border-light-myBrown"
        >
          <CiFilter className="text-[20px] ml-1" />
          فیلتر
        </button>

        <SortSelect />
      </header>

      <main className="flex">
        {/* Sidebar filters */}
        <div
          className={`${
            filterIsOpen ? "w-[280px] p-2 pe-4" : "w-[0] p-0"
          } overflow-hidden transition-all duration-300`}
        >
          <Filters categories={categories} />
        </div>

        {/* ✅ همان کارت روزانه؛ آخرین تنوع هر محصول از قبل مرتب شده */}
        <div className="flex-1 flex min-w-0 flex-col gap-3">
          {products.map((p) => (
            <DailyProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>
    </div>
  );
}
