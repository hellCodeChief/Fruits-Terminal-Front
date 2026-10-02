"use client";

import { useState } from "react";
import { CiFilter } from "react-icons/ci";
import SortSelect from "./sort";
import Filters from "./filters";
import ProductCard from "@/components/product-card/product-card";

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

        {/* Products */}
        <div className="flex-1 flex flex-wrap justify-between gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} item={p} preferLatest />
          ))}
        </div>
      </main>
    </div>
  );
}
