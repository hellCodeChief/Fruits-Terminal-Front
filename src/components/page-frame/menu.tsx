"use client";

import { useEffect, useState } from "react";
// icons import
import { RiFileList2Line } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { RiMenu3Fill } from "react-icons/ri";
import DropDownShop from "./dropdowns/shop";
import DropDownHome from "./dropdowns/home";
import DropDownPages from "./dropdowns/pages";
import Image from "next/image";
import MenuSideContent from "./side-menu";
import Link from "next/link";
import SideBasketContent from "./side-cart";
import { useSelector } from "react-redux";
import { useCheckAuth } from "@/components/utils/hooks/useAuthCheck";
import UserDropdown from "./user-dropdown";
import { RootState } from "@/app/store";
import { getUserOpenBasket } from "../utils/actionsClient";
import { useDispatch } from "react-redux";
import { setBasket } from "@/app/store/basket/basketSlice";
import { Badge } from "antd";

export default function PageFrameMenu() {
  const [menuIsClose, setMenuIsClose] = useState(true);
  const [cartIsClose, setCartIsClose] = useState(true);
  const [backDrop, setBackDrop] = useState(false);
  // const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const basket = useSelector((state: RootState) => state.basket);
  const dispatch = useDispatch();

  useCheckAuth();

  // stop propagation when click on div to react on back drop
  const handleMenuClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const fetchBasket = async () => {
      try {
        const userId = user?.userInfo?.id;
        if (!userId) return;

        const basketArray = await getUserOpenBasket(userId);
        const basket = basketArray[0]; // 👈 مستقیم از همین استفاده کن

        if (!basket) {
          dispatch(setBasket({ id: null, userId, status: "open", items: [] }));
          return;
        }

        // 👇 از basket به‌جای basketData استفاده کن
        dispatch(setBasket(basket));
      } catch (err) {
        console.error("❌ خطا در واکشی سبد:", err);
      }
    };

    fetchBasket();
  }, [user?.userInfo, dispatch]);

  return (
    <>
      <header className="sticky z-50 top-0 bg-light-myWhite w-full">
        {/* ✅ فقط ارتفاع کمتر؛ چیدمان هدر همان است */}
        <div className="c_container m-auto w-full h-[56px] flex justify-between items-center">
          {/* menu btn */}
          <button
            className="block lg:hidden flex-1 md:flex-[3]"
            onClick={() => {
              setMenuIsClose(false);
              setBackDrop(true);
            }}
          >
            <RiMenu3Fill className="text-[32px]" />
          </button>
          {/* logo */}
          <Link
            href={`/`}
            className="h-full flex justify-start items-center flex-[2] lg:flex-[3] flex justify-center lg:justify-start"
          >
            <div className="relative w-[150px] h-[48px]">
              <Image
                fill
                className="object-contain"
                src="/shahbanoo-logo.png"
                alt="logo"
              />
            </div>
          </Link>

          {/* dropdowns */}
          <div className="flex-[3] hidden lg:block">
            <div className="flex justify-center gap-6">
              <Link href={`/products`}>
                <DropDownShop />
              </Link>
              <DropDownHome />
              <DropDownPages />
            </div>
          </div>
          {/* cart icons */}
          <div className="flex-[3] flex justify-end gap-3">
            <button
              className="relative"
              onClick={() => {
                setCartIsClose(false);
                setBackDrop(true);
              }}
            >
              <span style={{ position: "absolute", top: -7, right: -7 }}>
                <Badge count={basket.items.length}></Badge>
              </span>
              <RiFileList2Line className="text-[24px]" />
            </button>
            <button className="">
              <FaRegHeart className="text-[24px]" />
            </button>
            {/* <button className="">
            <FaRegUser className="text-[24px]" />
          </button> */}
            <UserDropdown />
            <button className="">
              <FiSearch className="text-[24px]" />
            </button>
          </div>
        </div>
      </header>

      {/* Dark back drop */}
      <div
        onClick={() => {
          setMenuIsClose(true);
          setCartIsClose(true);
          setBackDrop(false);
        }}
        className={`w-full h-screen duration-300 fixed z-50 top-0 right-0 bg-[#000000c4] ${
          backDrop ? "opacity-1 visible" : "opacity-0 invisible"
        }`}
      ></div>
      {/* menu container */}
      <div
        onClick={handleMenuClick}
        className={`fixed z-50 bg-light-myWhite top-0 h-full w-[70vw] md:w-[50vw] duration-500 ${
          menuIsClose ? "rtl:right-[-70vw]" : "rtl:right-[0]"
        }`}
      >
        <MenuSideContent />
      </div>
      {/* cart container */}
      <div
        onClick={handleMenuClick}
        className={`fixed z-50 bg-light-myWhite top-0 h-full max-w-[400px] w-[70vw] md:w-[50vw] duration-500 ${
          cartIsClose ? "rtl:left-[-70vw]" : "rtl:left-[0]"
        }`}
      >
        <SideBasketContent
          basketData={basket}
          onClose={() => {
            setCartIsClose(true);
            setBackDrop(false);
          }}
        />
      </div>
    </>
  );
}
