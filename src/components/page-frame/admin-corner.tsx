"use client";

import { AppstoreOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

function permissionNames(user: any) {
  const list = user?.roles?.[0]?.permissions || [];
  return new Set(list.map((item: { name: string }) => item.name));
}

function isGod(user: any) {
  return (
    user?.email?.toLowerCase() === process.env.NEXT_PUBLIC_GOD_ADMIN_GMAIL?.toLowerCase() &&
    user?.phone?.trim() === process.env.NEXT_PUBLIC_GOD_ADMIN_NUMBER?.trim()
  );
}

// ✅ زیر lg دایره روی نوار؛ از lg به بعد لینک‌ها در منوی کاربر هدر هستند
export default function AdminCorner() {
  const user = useSelector((state: RootState) => state.user.userInfo);
  const names = permissionNames(user);
  const god = isGod(user);

  const links: { key: string; href: string; label: string }[] = [];
  // ✅ افزودن بار اول فهرست است
  if (god || names.has("dailyProduct:create")) {
    links.push({ key: "addDailyProduct", href: "/dashboard/daily-product", label: "افزودن بار" });
  }
  if (god || names.has("product:create")) {
    links.push({ key: "addProduct", href: "/dashboard/product", label: "افزودن محصول" });
  }
  if (god || names.has("category:read")) {
    links.push({ key: "addCategory", href: "/dashboard/category", label: "افزودن دسته بندی" });
  }
  if (god || names.has("property:read")) {
    links.push({ key: "addProperty", href: "/dashboard/property", label: "افزودن ویژگی" });
  }
  if (god || names.has("role:create")) {
    links.push({ key: "addRole", href: "/dashboard/role", label: "افزودن نقش" });
  }
  if (god || names.has("user:role-assign")) {
    links.push({ key: "addUserRole", href: "/dashboard/user", label: "کاربران" });
  }

  if (!links.length) return null;

  return (
    <Dropdown
      trigger={["click"]}
      placement="topRight"
      overlayClassName="z-[9999] !bg-transparent !p-0 !shadow-none"
      // ✅ هر گزینه کارت جدا بالای دایره است، نه یک پنل به‌هم‌چسبیده
      dropdownRender={() => (
        <div className="mb-3 flex flex-col items-end gap-3">
          {links.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-2xl bg-light-surface px-4 py-3 text-sm text-neutral-800 shadow-md"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    >
      <button
        type="button"
        aria-label="مدیریت"
        className="absolute right-2 top-0 z-50 flex h-20 w-20 -translate-y-[85%] flex-col items-center justify-center gap-0.5 rounded-full bg-light-primary p-0 text-[13px] leading-tight text-white shadow-md lg:hidden"
      >
        {/* ✅ دایره کامل، نشسته روی گوشه راست نوار */}
        <AppstoreOutlined className="text-2xl" />
        مدیریت
      </button>
    </Dropdown>
  );
}
