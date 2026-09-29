import { formatNumber } from "@/components/utils/format-number";
import { IoCloseSharp } from "react-icons/io5";
import SideCartBox from "./cart-box";
import Link from "next/link";

export default function SideBasketContent({
  basketData,
  onClose,
}: {
  basketData: any;
  onClose: () => void;
}) {
  return (
    <div className="w-full h-full relative flex flex-col justify-between bg-light-bgGray">
      <div className="h-[45px] flex justify-center items-center">
        <button
          onClick={onClose}
          className="text-[35px] h-full w-[45px] flex justify-center items-center border border-light-textGray2 border-t-0"
        >
          <IoCloseSharp />
        </button>
        <span className="text-[20px] h-full flex-grow flex justify-center items-center font-bold border border-light-textGray2 border-t-0 border-l-0 border-r-0">
          سبد خرید
        </span>
        <span className="text-[20] h-full w-[45px] flex justify-center items-center font-bold border border-light-textGray2 border-t-0">
          1
        </span>
      </div>
      {/* Cart List (content) */}
      <main className="flex-grow px-3 h-full overflow-auto">
        {basketData.items ? (
          basketData.items.map((item: any, index: any) => (
            <SideCartBox key={index} item={item} />
          ))
        ) : (
          <div>سبد خالی است</div>
        )}
      </main>
      {/* <footer className="absolute w-full bottom-1 left-0"> */}
      <footer className="">
        {/* total price */}
        <div className="h-[59px] flex justify-between items-center px-4">
          <span className="text-[20px] font-bold">جمع کل:</span>
          <span className="text-[20px] font-bold text-light-myBrown">
            {formatNumber(100000)} ریال
          </span>
        </div>
        {/* VIEW & CHECKOUT btns */}
        <div className="flex">
          <button className="h-[59px] w-1/2 bg-[#2a2a2a] text-light-myWhite hover:bg-light-myBrown duration-300">
            <Link
              href="/basket"
              className="block w-full h-full flex justify-center items-center"
            >
              مشاهده سبد خرید
            </Link>
          </button>
          <button className="h-[59px] w-1/2 bg-black text-light-myWhite hover:bg-light-myBrown duration-300">
            پرداخت
          </button>
        </div>
      </footer>
    </div>
  );
}
