const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type VitrineCard = {
  id: number;
  productId: number;
  name: string;
  price: number;
  unit: string;
  description: string | null;
  categoryId: number | null;
  categoryName: string | null;
  fileId: string | null;
  createdAt: string;
};

export type VitrineToday = {
  stallName: string;
  date: string;
  notice: string;
  items: VitrineCard[];
};

export type VitrineSuggestion = {
  productId: number;
  name: string;
  price: number | null;
  unit: string | null;
};

export function stallPhone() {
  return (process.env.NEXT_PUBLIC_STALL_PHONE || "").trim();
}

export function photoUrl(fileId: string | null) {
  if (!fileId || !BASE_URL) return null;
  return `${BASE_URL}/files/${fileId}/product`;
}

export function formatToman(price: number) {
  return `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
}

export function whatsAppHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `98${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
}

function errorMessage(data: any, fallback: string) {
  const message = data?.data?.data?.message || data?.message || fallback;
  return Array.isArray(message) ? message[0] : message;
}

export async function getVitrineToday(): Promise<VitrineToday> {
  const res = await fetch(`${BASE_URL}/vitrine/today`, { cache: "no-store" });
  if (!res.ok) throw new Error("ویترین دریافت نشد");
  return res.json();
}

export async function suggestProducts(
  q: string,
  token: string
): Promise<VitrineSuggestion[]> {
  const res = await fetch(
    `${BASE_URL}/vitrine/suggest?q=${encodeURIComponent(q)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function createVitrine(form: FormData, token: string) {
  const res = await fetch(`${BASE_URL}/vitrine`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(errorMessage(data, "ثبت انجام نشد"));
  return data;
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/category`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
