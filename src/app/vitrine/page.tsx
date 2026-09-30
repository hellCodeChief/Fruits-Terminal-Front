"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  formatToman,
  getVitrineToday,
  photoUrl,
  stallPhone,
  VitrineToday,
  whatsAppHref,
} from "@/components/utils/vitrineClient";

export default function VitrinePage() {
  const [data, setData] = useState<VitrineToday | null>(null);
  const [failed, setFailed] = useState(false);
  const phone = stallPhone();

  useEffect(() => {
    getVitrineToday()
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#1c1915] pb-28">
      <header className="px-4 pt-6 pb-4 max-w-5xl mx-auto">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">{data?.stallName || "حجره"}</h1>
            <p className="mt-1 text-sm text-[#6b6258]">{data?.date || ""}</p>
          </div>
          <Link
            href="/vitrine/add"
            className="shrink-0 rounded-full bg-black text-white px-4 py-2 text-sm font-bold"
          >
            افزودن
          </Link>
        </div>
        <p className="mt-4 text-sm leading-7">
          حداقل یک جعبه · خرید خرد نداریم · پیکاپ از میدان
        </p>
      </header>

      <section className="px-4 max-w-5xl mx-auto">
        {!data && !failed && (
          <p className="py-16 text-center text-[#6b6258]">در حال بارگذاری</p>
        )}
        {failed && (
          <p className="py-16 text-center">ویترین دریافت نشد</p>
        )}
        {data && data.items.length === 0 && (
          <p className="py-16 text-center text-lg">
            هنوز برای امروز چیزی ثبت نشده
          </p>
        )}
        {data && data.items.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.items.map((item) => {
              const src = photoUrl(item.fileId);
              return (
                <li
                  key={item.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  {src ? (
                    <img
                      src={src}
                      alt={item.name}
                      className="w-full aspect-[4/3] object-cover bg-[#ece7e0]"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-[#ece7e0]" />
                  )}
                  <div className="p-4">
                    <h2 className="text-xl font-bold">{item.name}</h2>
                    <p className="mt-1 text-lg">
                      {formatToman(item.price)} · {item.unit}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {phone && (
        <div className="fixed bottom-0 inset-x-0 border-t border-[#e4ddd4] bg-white">
          <div className="max-w-5xl mx-auto grid grid-cols-2">
            <a
              href={`tel:${phone}`}
              className="py-4 text-center font-bold border-l border-[#e4ddd4]"
            >
              تماس
            </a>
            <a
              href={whatsAppHref(phone)}
              className="py-4 text-center font-bold"
            >
              واتساپ
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
