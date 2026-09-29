"use client";

import { formatPriceNumber } from "@/components/utils/helper/formatPrice";
import CheckoutCard from "./checkout-card";

export default function CheckoutBlock({ data }: { data: any }) {
  const totalQuantity = data.details.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );
  return (
    <div className="bg-light-myGray">
      <div>
        {data.details.map((item: any, index: any) => (
          <CheckoutCard item={item} key={index} />
        ))}
      </div>
      <div>
        <div className="flex justify-between px-4 pb-1">
          <span className="">تعداد اقلام:</span>
          <span className="">{totalQuantity} مورد</span>
        </div>
        <div className="flex justify-between px-4 pb-1">
          <span className="">مبلغ کل قبل از تخفیف و مالیات:</span>
          <span className="">{formatPriceNumber(data.subtotalAmount)}</span>
        </div>
        <div className="flex justify-between px-4 pb-1">
          <span className="">مالیات:</span>
          <span className="">٪{data.totalTax}</span>
        </div>
        <div className="flex justify-between px-4 pb-1">
          <span className="">تخفیف:</span>
          <span className="">٪{data.totalDiscount}</span>
        </div>
        <div className="flex justify-between p-4">
          <span className="font-bold text-[20px]">مبلغ کل:</span>
          <span className="">{formatPriceNumber(data.finalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
