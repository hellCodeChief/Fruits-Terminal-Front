import { Typography } from "antd";

// ✅ هنوز سفارش خریدی نیست؛ فقط عنوان
export default function FruitOrderPage() {
  return (
    <main className="w-full p-4">
      <Typography.Title level={2}>سفارش خرید میوه</Typography.Title>
    </main>
  );
}
