"use client";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";

const menuItems = [
  { name: "خانه", url: "#" },
  { name: "خرید", url: "#" },
  { name: "تست", url: "#" },
];

export default function SideContentMenu() {
  const showSubMenu = (_index: number) => {
    const allSub = document.querySelectorAll<HTMLElement>(".sub-menu");
    allSub[_index].style.right = "0";
  };

  const hideSubMenu = (_index: number) => {
    const allSub = document.querySelectorAll<HTMLElement>(".sub-menu");
    allSub[_index].style.right = "100%";
  };

  return (
    <div>
      <Link
        href="/vitrine"
        className="h-[55px] flex items-center font-bold px-3 border-b border-light-textGray2"
      >
        ویترین امروز
      </Link>
      {/* EACH tile of menu */}
      {menuItems.map((item, index) => (
        <div
          key={index}
          className="h-[55px] flex border-b border-light-textGray2"
        >
          <Link
            href={item.url}
            className="flex-[6] flex justify-start items-center font-bold px-3"
          >
            {item.name}
          </Link>
          <button
            onClick={() => showSubMenu(index)}
            className="flex-1 flex justify-center items-center border-light-textGray2 rtl:border-r ltr:border-l"
          >
            <IoIosArrowBack className="ltr:rotate-180" />
          </button>
        </div>
      ))}
      {/* Sub Menu 1 */}
      <div className="sub-menu fz2 bg-light-myWhite border-2 border-red-500 absolute w-full h-full top-0 duration-500 rtl:right-[100%]">
        <button
          className="w-full h-[55px] flex justify-center items-center text-light-myWhite bg-light-myBrown"
          onClick={() => hideSubMenu(0)}
        >
          <IoIosArrowBack className="rtl:rotate-180" />
          <span>بازگشت</span>
        </button>
        <footer>content-1</footer>
      </div>
      <div className="sub-menu fz2 bg-light-myWhite border-2 border-red-500 absolute w-full h-full top-0 duration-500 rtl:right-[100%]">
        <button
          className="w-full h-[55px] flex justify-center items-center text-light-myWhite bg-light-myBrown"
          onClick={() => hideSubMenu(1)}
        >
          <IoIosArrowBack className="rtl:rotate-180" />
          <span>بازگشت</span>
        </button>
        <footer>content-2</footer>
      </div>
      <div className="sub-menu fz2 bg-light-myWhite border-2 border-red-500 absolute w-full h-full top-0 duration-500 rtl:right-[100%]">
        <button
          className="w-full h-[55px] flex justify-center items-center text-light-myWhite bg-light-myBrown"
          onClick={() => hideSubMenu(2)}
        >
          <IoIosArrowBack className="rtl:rotate-180" />
          <span>بازگشت</span>
        </button>
        <footer>content-3</footer>
      </div>
    </div>
  );
}
