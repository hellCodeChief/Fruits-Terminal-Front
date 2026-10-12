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

  // ✅ زیر lg فقط خروج؛ از lg به بعد همان لینک‌های مدیریت اینجاست
  const userPermission = user?.roles?.[0]?.permissions || [];
  const isGodUser =
    user?.email?.toLowerCase() === process.env.NEXT_PUBLIC_GOD_ADMIN_GMAIL?.toLowerCase() &&
    user?.phone?.trim() === process.env.NEXT_PUBLIC_GOD_ADMIN_NUMBER?.trim();
  const can = (name: string) => isGodUser || userPermission.some((item: { name: string }) => item.name === name);

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

  const items: MenuProps["items"] = [];
  if (can("product:create")) {
    items.push({
      key: "addProduct",
      className: "max-lg:hidden",
      label: <Link href="/dashboard/product">product</Link>,
    });
  }
  if (can("dailyProduct:create")) {
    items.push({
      key: "addDailyProduct",
      className: "max-lg:hidden",
      label: <Link href="/dashboard/daily-product">daily product</Link>,
    });
  }
  if (can("category:read")) {
    items.push({
      key: "addCategory",
      className: "max-lg:hidden",
      label: <Link href="/dashboard/category">افزودن دسته بندی</Link>,
    });
  }
  if (can("property:read")) {
    items.push({
      key: "addProperty",
      className: "max-lg:hidden",
      label: <Link href="/dashboard/property">افزودن ویژگی</Link>,
    });
  }
  if (can("role:create")) {
    items.push({
      key: "addRole",
      className: "max-lg:hidden",
      label: <Link href="/dashboard/role">افزودن نقش</Link>,
    });
  }
  if (can("user:role-assign")) {
    items.push({
      key: "addUserRole",
      className: "max-lg:hidden",
      label: <Link href="/dashboard/user">کاربران</Link>,
    });
  }
  items.push({
    key: "logout",
    label: (
      <button className="w-full text-right" onClick={logoutHandler}>
        خروج
      </button>
    ),
  });

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
