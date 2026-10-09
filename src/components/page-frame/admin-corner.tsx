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

// ✅ ربع‌دایره گوشه نوار؛ فقط برای رفتن به دو داشبورد
export default function AdminCorner() {
  const user = useSelector((state: RootState) => state.user.userInfo);
  const names = permissionNames(user);
  const god = isGod(user);
  const canProduct = god || names.has("product:create");
  const canDaily = god || names.has("dailyProduct:create");

  if (!canProduct && !canDaily) return null;

  const items = [];
  if (canProduct) {
    items.push({
      key: "product",
      label: <Link href="/dashboard/product">محصولات</Link>,
    });
  }
  if (canDaily) {
    items.push({
      key: "daily",
      label: <Link href="/dashboard/daily-product">حجره</Link>,
    });
  }

  return (
    <Dropdown menu={{ items }} placement="topRight" trigger={["click"]} overlayClassName="z-[9999]">
      <button
        type="button"
        aria-label="مدیریت"
        className="absolute right-0 top-0 z-50 flex aspect-square w-1/4 -translate-y-full items-center justify-center rounded-tl-full border-b-2 border-solid border-light-surface bg-light-primary text-white"
      >
        <AppstoreOutlined className="text-2xl" />
      </button>
    </Dropdown>
  );
}
