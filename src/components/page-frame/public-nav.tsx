"use client";

import {
  AppleFilled,
  AppleOutlined,
  HomeFilled,
  HomeOutlined,
  ShopFilled,
  ShopOutlined,
  ShoppingFilled,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Button, theme } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "خانه", href: "/", icon: HomeOutlined, activeIcon: HomeFilled },
  { label: "حجره", href: "/daily-products", icon: ShopOutlined, activeIcon: ShopFilled },
  { label: "فراورده میوه", href: "/fruit-produce", icon: AppleOutlined, activeIcon: AppleFilled },
  { label: "سفارش خرید", href: "/fruit-order", icon: ShoppingOutlined, activeIcon: ShoppingFilled },
];

function itemIsActive(href: string, pathname: string) {
  return pathname === href;
}

// ✅ زیر lg نوار پایین؛ از lg به بعد همان دکمه‌های زیر هدر. داخل داشبورد نیست
export default function PublicNav() {
  const pathname = usePathname();
  const { token } = theme.useToken();

  if (pathname.startsWith("/dashboard")) return null;

  return (
    <>
      <nav className="hidden w-full flex-wrap gap-2 bg-light-surface p-2 lg:flex">
        {items.map((item) => {
          const active = itemIsActive(item.href, pathname);
          return (
            <Link key={item.href} href={item.href} className="min-w-0 flex-1">
              <Button block type={active ? "primary" : "default"}>
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <nav
        className="fixed inset-x-3 bottom-3 z-40 w-auto bg-light-surface p-1 lg:hidden"
        style={{
          borderRadius: token.borderRadiusLG * 2,
          boxShadow: token.boxShadowSecondary,
        }}
      >
        <div className="flex w-full">
          {items.map((item) => {
            const active = itemIsActive(item.href, pathname);
            const Icon = active ? item.activeIcon : item.icon;
            return (
              <Link key={item.href} href={item.href} className="w-1/4 min-w-0 p-1">
                <Button block type={active ? "primary" : "text"} style={{ height: "auto" }}>
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      fontSize: 11,
                      lineHeight: 1.2,
                    }}
                  >
                    <Icon style={{ fontSize: 20 }} />
                    {item.label}
                  </span>
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
