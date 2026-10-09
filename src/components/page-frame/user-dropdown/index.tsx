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

  // -------------------------
  // اگر کاربر لاگین شده بود
  // -------------------------
  const userPermission = user?.roles?.[0]?.permissions || [];

  const isGodUser =
    user?.email?.toLowerCase() ===
      process.env.NEXT_PUBLIC_GOD_ADMIN_GMAIL?.toLowerCase() &&
    user?.phone?.trim() === process.env.NEXT_PUBLIC_GOD_ADMIN_NUMBER?.trim();

  function hasPermission(permissions: { name: string }[], target: string) {
    return permissions.some((p) => p.name === target);
  }

  const items: MenuProps["items"] = [];

  // ✅ هر لینک فقط با مجوز ساخت همان جدول
  if (isGodUser || hasPermission(userPermission, "product:create")) {
    items.push({
      key: "addProduct",
      label: <Link href="/dashboard/product">افزودن محصول</Link>,
    });
  }

  if (isGodUser || hasPermission(userPermission, "dailyProduct:create")) {
    items.push({
      key: "addDailyProduct",
      label: <Link href="/dashboard/daily-product">افزودن محصول روز</Link>,
    });
  }

  if (isGodUser || hasPermission(userPermission, "category:read")) {
    items.push({
      key: "addCategory",
      label: <Link href="/dashboard/category">افزودن دسته بندی</Link>,
    });
  }

  if (isGodUser || hasPermission(userPermission, "property:read")) {
    items.push({
      key: "addProperty",
      label: <Link href="/dashboard/property">افزودن ویژگی</Link>,
    });
  }

  if (isGodUser || hasPermission(userPermission, "role:create")) {
    items.push({
      key: "addRole",
      label: <Link href="/dashboard/role">افزودن نقش</Link>,
    });
  }

  if (isGodUser || hasPermission(userPermission, "user:role-assign")) {
    items.push({
      key: "addUserRole",
      label: <Link href="/dashboard/user">کاربران</Link>,
    });
  }

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
