"use client";

import { Card, Modal } from "antd";
import { ReactNode, useEffect, useRef, useState } from "react";

export type DailyFile = { id: number; usage?: string };

export type DailyVariant = {
  id?: number;
  price?: number | string | null;
  createdAt?: string;
  desc?: string | null;
  minOrder?: number | string | null;
  files?: DailyFile[];
};

export type DailyProduct = {
  slug?: string;
  desc?: string | null;
  files?: DailyFile[];
  variants?: DailyVariant[];
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ✅ تازه‌ترین تنوع با تاریخ؛ قیمت و عکس همان تنوع
export function latestDailyVariant(product?: DailyProduct | null) {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  return variants.reduce<DailyVariant | undefined>((latest, item) => {
    if (!latest) return item;
    const latestTime = Date.parse(latest.createdAt || "") || latest.id || 0;
    const itemTime = Date.parse(item.createdAt || "") || item.id || 0;
    return itemTime >= latestTime ? item : latest;
  }, undefined);
}

// ✅ ترتیب با تاریخ تازه‌ترین تنوع
export function variantSortTime(product?: DailyProduct | null) {
  const createdAt = latestDailyVariant(product)?.createdAt;
  const variantTime = Date.parse(createdAt || "");
  if (createdAt && !Number.isNaN(variantTime)) return variantTime;
  return 0;
}

function newestFile(files?: DailyFile[]) {
  if (!files?.length) return null;
  return files.reduce((best, file) => (file.id > best.id ? file : best));
}

function dailyImageUrl(product?: DailyProduct | null) {
  const variantFile = newestFile(latestDailyVariant(product)?.files);
  const file = variantFile || newestFile(product?.files);
  if (!file) return null;
  // ✅ usage روی فایل؛ حجره daily-product است و کاتالوگ همان product
  const usage = file.usage || (variantFile ? "product-variant" : "product");
  return `${BASE_URL}/files/${file.id}/${usage}`;
}

// ✅ تاریخ محلی ایران با تقویم جلالی؛ بدون کتابخانه تاریخ
function jalaliDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("fa-IR", {
    calendar: "persian",
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function priceText(price?: number | string | null) {
  if (price === undefined || price === null || price === "") return "—";
  return `${price} ریال`;
}

function minOrderText(amount?: number | string | null) {
  if (amount === undefined || amount === null || amount === "") return "—";
  return `${amount} کیلو`;
}

// ✅ توضیح اگر از یک ردیف بلندتر باشد، بقیه در مودال
function DescriptionRow({ text }: { text: string }) {
  const lineRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    setOverflow(line.scrollWidth > line.clientWidth + 1);
  }, [text]);

  return (
    <>
      <div className="mt-1 flex min-w-0 items-center gap-2">
        <span ref={lineRef} className="min-w-0 flex-1 truncate">
          توضیحات: {text}
        </span>
        {overflow && (
          <button type="button" className="shrink-0" onClick={() => setOpen(true)}>
            بیشتر…
          </button>
        )}
      </div>
      <Modal open={open} title="توضیحات" footer={null} onCancel={() => setOpen(false)}>
        {text}
      </Modal>
    </>
  );
}

// ✅ کارت روزانه مشترک: عکس مربع، نام، قیمت ریال، تاریخ، حداقل سفارش
export default function DailyProductCard({
  product,
  extra,
}: {
  product: DailyProduct;
  extra?: ReactNode;
}) {
  const variant = latestDailyVariant(product);
  const src = dailyImageUrl(product);
  const dateText = jalaliDate(variant?.createdAt);

  return (
    <Card
      size="small"
      // ✅ سایه و حاشیه کم تا کارت از صفحه سفید جدا شود
      className="w-full min-w-0 max-w-full overflow-hidden !border !border-neutral-200 shadow-sm"
      styles={{ body: { padding: 0 } }}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="block aspect-square w-full min-w-0 max-w-full object-cover"
        />
      ) : (
        <div className="flex aspect-square w-full min-w-0 max-w-full items-center justify-center bg-light-myGray text-xs">
          بدون تصویر
        </div>
      )}
      <div className="min-w-0 p-3">
        <div className="min-w-0 break-words">{product.slug}</div>
        <div className="min-w-0 font-bold">قیمت: {priceText(variant?.price)}</div>
        <div className="min-w-0">{dateText || "—"}</div>
        <div className="min-w-0">حداقل سفارش: {minOrderText(variant?.minOrder)}</div>
        <DescriptionRow text={variant?.desc || product.desc || ""} />
        {extra}
      </div>
    </Card>
  );
}
