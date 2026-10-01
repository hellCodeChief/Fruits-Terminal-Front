"use client";

import {
  addProductClient,
  addProductVariantClient,
  uploadImage,
} from "@/components/utils/actionsClient";
import { CameraOutlined, PictureOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
} from "antd";
import { useState } from "react";

const MAX_EDGE = 1200;

// ✅ برش وسط به مربع، بدون کشیدن، و خروجی وب‌پی
async function squareWebp(
  source: CanvasImageSource,
  width: number,
  height: number
): Promise<File> {
  const side = Math.min(width, height);
  const sx = (width - side) / 2;
  const sy = (height - side) / 2;
  const canvasSide = side > MAX_EDGE ? MAX_EDGE : side;
  const canvas = document.createElement("canvas");
  canvas.width = canvasSide;
  canvas.height = canvasSide;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("این تصویر قابل استفاده نیست");
  context.drawImage(source, sx, sy, side, side, 0, 0, canvasSide, canvasSide);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.8)
  );
  if (!blob) throw new Error("این تصویر قابل استفاده نیست");
  return new File([blob], "photo.webp", { type: "image/webp" });
}

async function compressImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });
  try {
    return await squareWebp(bitmap, bitmap.width, bitmap.height);
  } finally {
    bitmap.close();
  }
}

function errorText(data: any, fallback: string) {
  const messageText = data?.data?.data?.message || data?.message || fallback;
  return Array.isArray(messageText) ? messageText[0] : messageText;
}

type KnownProduct = {
  id: number;
  slug: string;
  variants?: {
    id?: number;
    price?: number | string;
    createdAt?: string;
  }[];
};

// ✅ فاصله اضافه و ی/ک عربی با فارسی یکی حساب می‌شوند
function normalizeName(value: string) {
  return value
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .trim();
}

function latestPrice(product: KnownProduct) {
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const latest = variants.reduce<(typeof variants)[number] | undefined>(
    (best, item) => {
      if (!best) return item;
      const bestTime = Date.parse(best.createdAt || "") || best.id || 0;
      const itemTime = Date.parse(item.createdAt || "") || item.id || 0;
      return itemTime >= bestTime ? item : best;
    },
    undefined
  );
  return latest?.price;
}

export default function SimpleAdd({
  categories,
  products,
  onSaved,
}: {
  categories: { id: number; displayName: string }[];
  products: KnownProduct[];
  onSaved: () => void;
}) {
  const [form] = Form.useForm();
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  const showPhoto = (file: File) => {
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const onPick = async (file: File) => {
    try {
      const compressed = await compressImage(file);
      showPhoto(compressed);
    } catch (error: any) {
      message.error(error?.message || "این تصویر قابل استفاده نیست");
    }
    return false;
  };

  const onFinish = async (values: {
    name: string;
    price: number;
    description?: string;
    categoryId?: number;
  }) => {
    if (!photo) {
      message.error("تصویر را انتخاب کنید");
      return;
    }
    const name = values.name.trim();
    const existing = (Array.isArray(products) ? products : []).find(
      (product) => normalizeName(product.slug || "") === normalizeName(name)
    );
    setSaving(true);
    try {
      const variantPayload = {
        name,
        slug: `p${Date.now().toString(36)}`,
        stock: 0,
        desc: values.description?.trim() || "",
        isActive: true,
        isDefault: true,
        price: Number(values.price),
        props: [],
      };

      // ✅ نام تکراری فقط تنوع جدید می‌سازد؛ تنوع‌های قبلی می‌مانند
      if (existing) {
        const variantRes = await addProductVariantClient({
          variants: [{ ...variantPayload, productId: existing.id }],
        });
        const created = await variantRes.json().catch(() => null);
        const variantId = Array.isArray(created) ? created[0]?.id : created?.id;
        if (!variantRes.ok || !variantId) {
          throw new Error(errorText(created, "ثبت قیمت انجام نشد"));
        }
        const body = new FormData();
        body.append("file", photo);
        await uploadImage(variantId, "product-variant", body);
      } else {
        const productRes = await addProductClient({
          slug: name,
          categoryIds: values.categoryId ? [values.categoryId] : [],
          isActive: true,
        });
        const product = await productRes.json().catch(() => ({}));
        if (!productRes.ok || !product?.id) {
          throw new Error(errorText(product, "ثبت انجام نشد"));
        }

        const variantRes = await addProductVariantClient({
          variants: [{ ...variantPayload, productId: product.id }],
        });
        if (!variantRes.ok) {
          const variantBody = await variantRes.json().catch(() => ({}));
          throw new Error(errorText(variantBody, "ثبت قیمت انجام نشد"));
        }

        const body = new FormData();
        body.append("file", photo);
        await uploadImage(product.id, "product", body);
      }

      form.resetFields();
      if (preview) URL.revokeObjectURL(preview);
      setPreview("");
      setPhoto(null);
      message.success("ثبت شد");
      onSaved();
    } catch (error: any) {
      message.error(error?.message || "ثبت انجام نشد");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      style={{ maxWidth: 560 }}
    >
      <Form.Item label="تصویر">
        <div style={{ display: "flex", gap: 8 }}>
          {/* ✅ دوربین گوشی با capture؛ روی http هم اپ دوربین باز می‌شود */}
          <Upload
            accept="image/*"
            capture="environment"
            maxCount={1}
            showUploadList={false}
            beforeUpload={onPick}
          >
            <Button icon={<CameraOutlined />}>دوربین</Button>
          </Upload>
          <Upload
            accept="image/*"
            maxCount={1}
            showUploadList={false}
            beforeUpload={onPick}
          >
            <Button icon={<PictureOutlined />}>گالری</Button>
          </Upload>
        </div>
        {preview && (
          <div
            style={{
              marginTop: 12,
              width: "100%",
              maxWidth: 240,
              aspectRatio: "1 / 1",
            }}
          >
            <img
              alt=""
              src={preview}
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </div>
        )}
      </Form.Item>

      <Form.Item
        label="نام"
        name="name"
        rules={[{ required: true, message: "نام را وارد کنید" }]}
      >
        {/* ✅ پیشنهاد از اسلاگ محصولات؛ قیمت ریال همان عدد ذخیره‌شده */}
        <AutoComplete
          style={{ width: "100%" }}
          options={(Array.isArray(products) ? products : [])
            .filter((product) => product.slug)
            .map((product) => {
              const price = latestPrice(product);
              const priceText =
                price === undefined || price === null || price === ""
                  ? ""
                  : `${price} ریال`;
              return {
                value: product.slug,
                label: (
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <span>{product.slug}</span>
                    <span>{priceText}</span>
                  </span>
                ),
              };
            })}
          filterOption={(input, option) =>
            normalizeName(String(option?.value ?? "")).includes(normalizeName(input))
          }
        />
      </Form.Item>

      <Form.Item
        label="قیمت"
        name="price"
        rules={[{ required: true, message: "قیمت را وارد کنید" }]}
      >
        {/* ✅ قیمت به ریال؛ همان عددی که وارد می‌شود ذخیره و نشان داده می‌شود */}
        <InputNumber min={1} style={{ width: "100%" }} addonAfter="ریال" />
      </Form.Item>

      <Form.Item label="توضیح" name="description">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item label="دسته‌بندی" name="categoryId">
        <Select
          allowClear
          options={(Array.isArray(categories) ? categories : []).map((category) => ({
            label: category.displayName,
            value: category.id,
          }))}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={saving}>
          ثبت
        </Button>
      </Form.Item>
    </Form>
  );
}
