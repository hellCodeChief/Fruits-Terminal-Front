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
    <Link href={href} className="block w-full px-3 py-3">
      {text}
    </Link>
  );
}

// ✅ زیر lg ربع‌دایره؛ از lg به بعد لینک‌ها در منوی کاربر هدر هستند
export default function AdminCorner() {
  const user = useSelector((state: RootState) => state.user.userInfo);
  const names = permissionNames(user);
  const god = isGod(user);

  const items = [];
  if (god || names.has("product:create")) {
    items.push({
      key: "addProduct",
      label: menuLink("/dashboard/product", "product"),
    });
  }
  if (god || names.has("dailyProduct:create")) {
    items.push({
      key: "addDailyProduct",
      label: menuLink("/dashboard/daily-product", "daily product"),
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
      placement="bottomRight"
      autoAdjustOverflow={false}
      trigger={["click"]}
      overlayClassName="z-[9999]"
      // ✅ فهرست کمی پایین‌تر از دکمه؛ فاصله بیشتر بین گزینه‌ها
      dropdownRender={(menu) => (
        <div className="mt-3 w-44 -translate-y-[calc(100%-3rem)] rounded-2xl rounded-br-none border border-solid border-light-primary bg-light-surface p-2 shadow-md [&_.ant-dropdown-menu]:!m-0 [&_.ant-dropdown-menu]:!flex [&_.ant-dropdown-menu]:!min-w-0 [&_.ant-dropdown-menu]:!w-full [&_.ant-dropdown-menu]:!flex-col [&_.ant-dropdown-menu]:!gap-3 [&_.ant-dropdown-menu]:!bg-transparent [&_.ant-dropdown-menu]:!p-0 [&_.ant-dropdown-menu]:!shadow-none [&_.ant-dropdown-menu-item]:!p-0">
          {menu}
        </div>
      )}
    >
      <button
        type="button"
        aria-label="مدیریت"
        className="absolute right-0 top-0 z-50 flex aspect-square w-1/4 -translate-y-full flex-col items-center justify-center gap-1.5 overflow-hidden rounded-tl-full border-b-2 border-solid border-light-surface bg-light-primary p-0 text-[13px] leading-[1.2] text-white lg:hidden"
      >
        {/* ✅ آیکون و برچسب وسط ربع، مثل دکمه‌های نوار */}
        <AppstoreOutlined className="text-2xl" />
        مدیریت
      </button>
    </Dropdown>
  );
}
