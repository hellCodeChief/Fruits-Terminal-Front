"use client";

import { Button } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "خانه", href: "/" },
  { label: "حجره", href: "/#daily-products" },
  { label: "فراورده میوه", href: "/fruit-produce" },
  { label: "سفارش خرید میوه", href: "/fruit-order" },
];

// ✅ چهار دکمهٔ عمومی؛ داخل داشبورد نشان داده نمی‌شود
export default function PublicNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) return null;

  return (
    <nav className="flex w-full flex-wrap gap-2 p-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="w-[calc(50%-0.25rem)] min-w-0 sm:w-auto sm:flex-1"
        >
          <Button block style={{ whiteSpace: "normal", height: "auto" }}>
            {item.label}
          </Button>
        </Link>
      ))}
    </nav>
  );
}
