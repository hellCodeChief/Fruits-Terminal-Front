"use client";

import { AppstoreOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
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

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [box, setBox] = useState<{ width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const home = buttonRef.current?.closest("nav")?.querySelector("a button");
    if (!home) return;
    const apply = () => {
      const rect = home.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      setBox({ width: rect.width, height: rect.height });
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(home);
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [canProduct, canDaily]);

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
        ref={buttonRef}
        type="button"
        aria-label="مدیریت"
        // ✅ هم‌اندازه دکمه خانه؛ ربع بالا-چپ و گوشه راست نوار
        className="absolute right-0 top-0 z-50 flex h-14 w-14 -translate-y-full items-end justify-end rounded-tl-full bg-light-primary pe-3 pb-3 text-white"
        style={box ? { width: box.width, height: box.height } : undefined}
      >
        <AppstoreOutlined style={{ fontSize: 24 }} />
      </button>
    </Dropdown>
  );
}
