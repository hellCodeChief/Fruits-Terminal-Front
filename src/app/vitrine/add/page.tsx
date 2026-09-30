"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { compressImage } from "../compress-image";
import {
  createVitrine,
  formatToman,
  getCategories,
  suggestProducts,
  VitrineSuggestion,
} from "@/components/utils/vitrineClient";

const UNITS = ["جعبه", "کیسه", "کیلو"] as const;
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function staffAllowed(user: any) {
  if (user?.accountType === "admin") return true;
  const names = (user?.roles || []).map((role: any) =>
    String(role?.name || "")
      .trim()
      .toLowerCase()
  );
  return names.includes("admin") || names.includes("worker");
}

export default function VitrineAddPage() {
  const router = useRouter();
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [token, setToken] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState<(typeof UNITS)[number]>("جعبه");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<VitrineSuggestion[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("access_token") || "";
    if (!stored) {
      router.replace("/account");
      return;
    }
    setToken(stored);
    fetch(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${stored}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          router.replace("/account");
          return;
        }
        const user = await res.json();
        setAllowed(staffAllowed(user));
        setReady(true);
      })
      .catch(() => router.replace("/account"));

    getCategories().then(setCategories).catch(() => setCategories([]));
  }, [router]);

  useEffect(() => {
    if (!token || name.trim().length < 1) {
      setSuggestions([]);
      return;
    }
    const handle = setTimeout(() => {
      suggestProducts(name, token).then(setSuggestions).catch(() => setSuggestions([]));
    }, 250);
    return () => clearTimeout(handle);
  }, [name, token]);

  const previewUrl = useMemo(() => preview, [preview]);

  const onPick = async (list: FileList | null) => {
    const file = list?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      if (preview) URL.revokeObjectURL(preview);
      setPhoto(compressed);
      setPreview(URL.createObjectURL(compressed));
      setSaved(false);
      setErrors((prev) => ({ ...prev, photo: "" }));
    } catch (error: any) {
      setFormError(error?.message || "این تصویر قابل استفاده نیست");
    }
  };

  const clearForm = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(null);
    setPreview("");
    setName("");
    setPrice("");
    setUnit("جعبه");
    setDescription("");
    setCategoryId("");
    setSuggestions([]);
    setErrors({});
    setFormError("");
    if (cameraRef.current) cameraRef.current.value = "";
    if (galleryRef.current) galleryRef.current.value = "";
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!photo) nextErrors.photo = "تصویر را انتخاب کنید";
    if (!name.trim()) nextErrors.name = "نام را وارد کنید";
    if (!price.trim() || !Number(String(price).replace(/[^\d۰-۹٠-٩]/g, ""))) {
      nextErrors.price = "قیمت را وارد کنید";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const form = new FormData();
    form.append("name", name.trim());
    form.append("price", price.trim());
    form.append("unit", unit);
    if (description.trim()) form.append("description", description.trim());
    if (categoryId) form.append("categoryId", categoryId);
    form.append("file", photo as File);

    setSubmitting(true);
    setFormError("");
    try {
      await createVitrine(form, token);
      clearForm();
      setSaved(true);
    } catch (error: any) {
      setFormError(error?.message || "ثبت انجام نشد");
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] text-[#1c1915] p-6">
        <p className="text-center mt-16">در حال بارگذاری</p>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] text-[#1c1915] p-6">
        <p className="text-center mt-16">فقط مدیر یا کارگر می‌تواند در ویترین ثبت کند</p>
        <p className="text-center mt-4">
          <Link href="/vitrine" className="underline">
            مشاهده ویترین
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#1c1915]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold">افزودن به ویترین امروز</h1>
          <Link href="/vitrine" className="text-sm underline">
            ویترین
          </Link>
        </div>

        {saved && (
          <div className="mb-4 rounded-xl bg-[#e7f6ea] px-4 py-3">
            <p className="font-bold">ثبت شد</p>
            <Link href="/vitrine" className="underline text-sm">
              مشاهده ویترین
            </Link>
          </div>
        )}

        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(event) => onPick(event.target.files)}
        />
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => onPick(event.target.files)}
        />

        {!photo && (
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              className="w-full rounded-2xl bg-black text-white py-5 text-lg font-bold"
            >
              دوربین
            </button>
            <button
              type="button"
              onClick={() => galleryRef.current?.click()}
              className="w-full rounded-2xl border border-black py-5 text-lg font-bold"
            >
              گالری
            </button>
            {errors.photo && <p className="text-red-600 text-sm">{errors.photo}</p>}
          </div>
        )}

        {photo && (
          <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
            <div>
              <img
                src={previewUrl}
                alt="پیش‌نمایش"
                className="w-full aspect-[4/3] object-cover rounded-2xl bg-white"
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => cameraRef.current?.click()}
                  className="rounded-xl border border-black py-2 text-sm font-bold"
                >
                  دوربین
                </button>
                <button
                  type="button"
                  onClick={() => galleryRef.current?.click()}
                  className="rounded-xl border border-black py-2 text-sm font-bold"
                >
                  گالری
                </button>
              </div>
            </div>

            <label className="flex flex-col gap-1 relative">
              <span className="text-sm">نام</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-[#d9d1c7] bg-white px-3 py-4 text-2xl"
                autoComplete="off"
              />
              {errors.name && <span className="text-red-600 text-sm">{errors.name}</span>}
              {suggestions.length > 0 && (
                <ul className="absolute top-full inset-x-0 z-10 mt-1 rounded-xl border border-[#d9d1c7] bg-white shadow">
                  {suggestions.map((item) => (
                    <li key={item.productId}>
                      <button
                        type="button"
                        className="w-full text-right px-3 py-3 border-b border-[#f0ebe4] last:border-0"
                        onClick={() => {
                          setName(item.name);
                          setSuggestions([]);
                        }}
                      >
                        <span className="font-bold">{item.name}</span>
                        {item.price != null && (
                          <span className="block text-sm text-[#6b6258]">
                            {formatToman(item.price)}
                            {item.unit ? ` · ${item.unit}` : ""}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm">قیمت (تومان)</span>
              <input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                inputMode="numeric"
                className="w-full rounded-xl border border-[#d9d1c7] bg-white px-3 py-3 text-xl"
              />
              {errors.price && <span className="text-red-600 text-sm">{errors.price}</span>}
            </label>

            <div>
              <p className="text-sm mb-2">واحد</p>
              <div className="grid grid-cols-3 gap-2">
                {UNITS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setUnit(item)}
                    className={`rounded-full py-2 font-bold ${
                      unit === item ? "bg-black text-white" : "bg-white border border-[#d9d1c7]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-sm">توضیحات (اختیاری)</span>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full rounded-xl border border-[#d9d1c7] bg-white px-3 py-3"
              />
            </label>

            {categories.length > 0 && (
              <label className="flex flex-col gap-1">
                <span className="text-sm">دسته‌بندی (اختیاری)</span>
                <select
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className="w-full rounded-xl border border-[#d9d1c7] bg-white px-3 py-3"
                >
                  <option value="">بدون دسته‌بندی</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.displayName || category.slug}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {formError && <p className="text-red-600 text-sm">{formError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-black text-white py-4 text-lg font-bold disabled:opacity-60"
            >
              {submitting ? "در حال ثبت" : "ثبت در ویترین"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
