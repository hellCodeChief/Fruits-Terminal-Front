// app/(routes)/products/products-client.tsx
"use client";

import { useSelector } from "react-redux";
import BasketTableCard from "./basket-table-card";
import { RootState } from "@/app/store";
import MyButton from "@/components/button/my-buttons";
import { Divider } from "antd";
import { formatNumber } from "@/components/utils/format-number";

export default function BasketClient() {
  const basketData = useSelector((state: RootState) => state.basket);
  return (
    <div className="c_container">
      {/* my custom table  */}
      <div className="">
        <header className="hidden md:block">
          <div className="flex">
            <div className="border w-5/12  flex justify-center items-center">
              مشخصات محصول
            </div>
            <div className="border w-2/12  flex justify-center items-center">
              قیمت
            </div>
            <div className="border w-2/12  flex justify-center items-center">
              تعداد
            </div>
            <div className="border w-2/12  flex justify-center items-center">
              جمع مبلغ
            </div>
            <div className="border w-1/12  flex justify-center items-center">
              5
            </div>
          </div>
        </header>
        <main className="pb-[70px]">
          {basketData.items ? (
            basketData.items.map((item: any, index: any) => (
              <BasketTableCard key={index} item={item} />
            ))
          ) : (
            <div>سبد خالی است</div>
          )}
        </main>
        <footer className="border-4 pt-5 border-light-myGray w-full bg-white fixed bottom-0 right-0">
          <div className="flex w-full md:w-1/2">
            <span className="w-1/2 lg:w-1/3">قیمت کل سبد خرید</span>
            <span className="w-1/2 text-end font-bold lg:w-1/3">
              {formatNumber(basketData.finalAmount)}
            </span>
          </div>
          <div className="px-3">
            <Divider style={{ borderColor: "#cccccc" }} plain></Divider>
          </div>
          <div className="flex gap-2">
            <MyButton
              variant="style3"
              text="ادامه خرید"
              width="w-1/2"
              href="/products"
            />
            <MyButton
              variant="style2"
              text="نهایی کردن خرید"
              width="w-1/2"
              href={`/basket/checkout/${basketData.id}`}
            />
          </div>
        </footer>
      </div>
    </div>
  );
}
