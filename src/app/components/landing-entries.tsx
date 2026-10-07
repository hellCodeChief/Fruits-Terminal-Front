"use client";

import { Card, Image, Typography } from "antd";
import Link from "next/link";

const tiles = [
  {
    title: "میوه‌های روز",
    href: "#daily-products",
    src: "/landing/daily-fruits.png",
  },
  {
    title: "محصولات میوه",
    href: "/products",
    src: "/landing/fruit-products.png",
  },
  {
    title: "سفارش میوه برای مراسم",
    href: "",
    src: "/landing/ceremony-order.png",
  },
];

function EntryTile({
  title,
  href,
  src,
}: {
  title: string;
  href: string;
  src: string;
}) {
  const card = (
    <Card className="w-full">
      <Image alt="" src={src} preview={false} width="100%" />
      <Typography.Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
        {title}
      </Typography.Title>
    </Card>
  );

  if (!href) {
    return <div className="w-full p-2 md:w-1/3">{card}</div>;
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} className="block w-full p-2 md:w-1/3">
        {card}
      </a>
    );
  }

  return (
    <Link href={href} className="block w-full p-2 md:w-1/3">
      {card}
    </Link>
  );
}

// ✅ سه ورودی بزرگ، یک ردیف در صفحه عریض و زیر هم در گوشی
export default function LandingEntries() {
  return (
    <div className="mt-4 flex w-full flex-col gap-4 md:flex-row">
      {tiles.map((tile) => (
        <EntryTile key={tile.title} {...tile} />
      ))}
    </div>
  );
}
