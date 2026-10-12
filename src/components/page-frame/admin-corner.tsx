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

function menuLink(href: string, text: string) {
  return (
    <Link href={href} className="block w-full px-2 py-1">
      {text}
    </Link>
  );
}

// ✅ ربع‌دایره گوشه نوار؛ لینک‌های پنل کاربر هم اینجاست
export default function AdminCorner() {
  const user = useSelector((state: RootState) => state.user.userInfo);
  const names = permissionNames(user);
  const god = isGod(user);

  const items = [];
  if (god || names.has("product:create")) {
    items.push({
      key: "product",
      label: menuLink("/dashboard/product", "محصولات"),
    });
    items.push({
      key: "addProduct",
      label: menuLink("/dashboard/product", "افزودن محصول"),
    });
  }
  if (god || names.has("dailyProduct:create")) {
    items.push({
      key: "daily",
      label: menuLink("/dashboard/daily-product", "حجره"),
    });
    items.push({
      key: "addDailyProduct",
      label: menuLink("/dashboard/daily-product", "افزودن محصول روز"),
    });
  }
  if (god || names.has("category:read")) {
    items.push({
      key: "addCategory",
      label: menuLink("/dashboard/category", "افزودن دسته بندی"),
    });
  }
  if (god || names.has("property:read")) {
    items.push({
      key: "addProperty",
      label: menuLink("/dashboard/property", "افزودن ویژگی"),
    });
  }
  if (god || names.has("role:create")) {
    items.push({
      key: "addRole",
      label: menuLink("/dashboard/role", "افزودن نقش"),
    });
  }
  if (god || names.has("user:role-assign")) {
    items.push({
      key: "addUserRole",
      label: menuLink("/dashboard/user", "کاربران"),
    });
  }

  if (!items.length) return null;

  return (
    <Dropdown
      menu={{ items }}
      placement="topRight"
      trigger={["click"]}
      overlayClassName="z-[9999]"
      // ✅ فهرست گوشه جمع‌وجورتر از منوی کاربر هدر و چسبیده به ربع‌دایره
      dropdownRender={(menu) => (
        <div className="mb-2 w-44 rounded-2xl rounded-br-none border border-solid border-light-primary bg-light-surface p-2 shadow-md [&_.ant-dropdown-menu]:!m-0 [&_.ant-dropdown-menu]:!min-w-0 [&_.ant-dropdown-menu]:!w-full [&_.ant-dropdown-menu]:!bg-transparent [&_.ant-dropdown-menu]:!p-0 [&_.ant-dropdown-menu]:!shadow-none [&_.ant-dropdown-menu-item]:!p-0">
          {menu}
        </div>
      )}
    >
      <button
        type="button"
        aria-label="مدیریت"
        className="absolute right-0 top-0 z-50 flex aspect-square w-1/4 -translate-y-full flex-col items-center justify-center gap-1.5 overflow-hidden rounded-tl-full border-b-2 border-solid border-light-surface bg-light-primary p-0 text-[13px] leading-[1.2] text-white"
      >
        {/* ✅ آیکون و برچسب وسط ربع، مثل دکمه‌های نوار */}
        <AppstoreOutlined className="text-2xl" />
        مدیریت
      </button>
    </Dropdown>
  );
}
