"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { checkoutBasketClient } from "@/components/utils/actionsClient";
import CheckoutBlock from "./checkout-block";
import MyButton from "@/components/button/my-buttons";

export default function CheckoutClient() {
  const { basketId } = useParams(); // 👈 گرفتن basketId از URL
  const [checkoutData, setCheckoutData] = useState(null);

  useEffect(() => {
    const doCheckout = async () => {
      if (!basketId) return;

      try {
        const res = await checkoutBasketClient(basketId);

        setCheckoutData(res);
      } catch (err) {
        console.error("❌ Error checking out basket:", err);
      }
    };

    doCheckout();
  }, [basketId]);

  if (!checkoutData) return <div>Loading...</div>;

  return (
    <div className="c_container flex flex-wrap">
      <div className="w-full md:w-1/2">
        <CheckoutBlock data={checkoutData} />
      </div>
      <div className="w-full md:w-1/2"></div>
      <div className="w-full flex gap-2 bg-white fixed bottom-0 right-0">
        <MyButton variant="style2" text="پرداخت" width="w-1/2" href={``} />
        <MyButton
          variant="style3"
          text="بازگشت به سبد خرید"
          width="w-1/2"
          href={`/basket`}
        />
      </div>
    </div>
  );
}
