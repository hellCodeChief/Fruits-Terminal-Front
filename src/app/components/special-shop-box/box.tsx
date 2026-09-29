"use client";
import BuyBtn from "@/components/button/buy-btn";
import MyButton from "@/components/button/my-buttons";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Box({ item }: any) {
  const fileId = item?.files?.[0]?.id;
  const imageUrl = fileId
    ? `${BASE_URL}/files/${fileId}/category`
    : "/temp.jpg"; // تصویر جایگزین در صورت نبود فایل
  return (
    <div
      className={`relative w-full md:w-[49%] max-h-[520px] h-[60vw] md:h-[35vw] mb-3 lg:mb-4 bg-cover bg-center`}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />
      {/* Content */}
      <div className="absolute flex flex-col justify-center items-center w-[calc(100%-25px)] h-[calc(100%-25px)] border             border-light-myWhite top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <h3 className="fz5 font-bold text-light-myWhite">{item.displayName}</h3>
        <p className="fz1 text-light-textGray2 my-4">{item.desc}</p>
        <MyButton
          variant="style1"
          text="خرید"
          href={`/products?byCategory=${item.id}`}
          width="w-1/2"
        />
      </div>
    </div>
  );
}
