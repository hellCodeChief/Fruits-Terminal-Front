"use client";

import { Dropdown, MenuProps } from "antd";
import { FaRegUser } from "react-icons/fa";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { logout as logoutRedux } from "@/app/store/user/userSlice";
import { setBasket } from "@/app/store/basket/basketSlice";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { logoutRequest } from "@/components/utils/actionsClient";

const UserDropdown = () => {
  const user = useSelector((state: RootState) => state.user.userInfo);

  const dispatch = useDispatch(); // ← اضافه شد
  const router = useRouter(); // ← اضافه شد

  // اگر یوزر لاگین نیست → فقط یک آیتم ورود
  if (!user) {
    const guestItems: MenuProps["items"] = [
      {
        key: "login",
        label: <Link href="/account">ورود</Link>,
      },
    ];

    return (
      <Dropdown
        menu={{ items: guestItems }}
        placement="bottomLeft"
        trigger={["click"]}
        overlayClassName="z-[9999]"
      >
        <button className="p-2 rounded-full hover:bg-gray-100">
          <FaRegUser className="text-[24px]" />
        </button>
      </Dropdown>
    );
  }

  // ✅ پنل کاربر فقط خروج؛ بقیه لینک‌ها روی دکمه مدیریت هستند
  const logoutHandler = async () => {
    try {
      await logoutRequest(); // صدا زدن API بک

      Cookies.remove("userInfo");
      Cookies.remove("access_token");

      localStorage.removeItem("access_token");

      dispatch(logoutRedux()); // حذف یوزر از استور

      dispatch(
        setBasket({ id: null, userId: null, status: "open", items: [] })
      ); // ریست سبد خرید

      router.push("/account"); // انتقال به صفحه ورود
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: (
        <button className="w-full text-right" onClick={logoutHandler}>
          خروج
        </button>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      placement="bottomLeft"
      trigger={["click"]}
      overlayClassName="z-[9999]"
    >
      <button className="p-2 rounded-full hover:bg-gray-100">
        <FaRegUser className="text-[24px]" />
      </button>
    </Dropdown>
  );
};

export default UserDropdown;
