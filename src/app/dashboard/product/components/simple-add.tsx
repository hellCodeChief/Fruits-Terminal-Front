"use client";

import {
  addProductClient,
  addProductVariantClient,
  editProductClient,
  editProductVariantBatchClient,
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
  Switch,
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

type KnownVariant = {
  id?: number;
  price?: number | string;
  createdAt?: string;
  desc?: string;
  files?: { id: number }[];
};

type KnownProduct = {
  id: number;
  slug: string;
  isActive?: boolean;
  categories?: { id: number }[];
  files?: { id: number }[];
  variants?: KnownVariant[];
};

// ✅ فاصله اضافه و ی/ک عربی با فارسی یکی حساب می‌شوند
function normalizeName(value: string) {
  return value
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .trim();
}

// ✅ هر محصول یک ردیف؛ متن تایپ‌شده اگر همان محصول باشد گزینه اضافه نمی‌شود
function suggestionProducts(products: KnownProduct[]) {
  const seen = new Set<string>();
  const unique: KnownProduct[] = [];
  for (const product of Array.isArray(products) ? products : []) {
    const name = normalizeName(product.slug || "");
    if (!name || seen.has(name)) continue;
    seen.add(name);
    unique.push(product);
  }
  return unique;
}

function latestVariant(product: KnownProduct) {
  const variants = Array.isArray(product.variants) ? product.variants : [];
  return variants.reduce<KnownVariant | undefined>((best, item) => {
    if (!best) return item;
    const bestTime = Date.parse(best.createdAt || "") || best.id || 0;
    const itemTime = Date.parse(item.createdAt || "") || item.id || 0;
    return itemTime >= bestTime ? item : best;
  }, undefined);
}

function latestPrice(product: KnownProduct) {
  return latestVariant(product)?.price;
}

function newestFile(files?: { id: number }[]) {
  if (!files?.length) return null;
  return files.reduce((best, file) => (file.id > best.id ? file : best));
}

// ✅ عکس نشان‌داده‌شده: فایل تنوع اگر هست، وگرنه فایل محصول؛ جدیدترین id
function existingImage(product: KnownProduct) {
  const variantFile = newestFile(latestVariant(product)?.files);
  const file = variantFile || newestFile(product.files);
  if (!file) return "";
  const usage = variantFile ? "product-variant" : "product";
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${file.id}/${usage}`;
}

export default function SimpleAdd({
  categories,
  products,
  onSaved,
  editing,
}: {
  categories: { id: number; displayName: string }[];
  products: KnownProduct[];
  onSaved: () => void;
  editing?: KnownProduct | null;
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
    isActive?: boolean;
  }) => {
    if (!editing && !photo) {
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

      // ✅ ویرایش همان محصول است: نام، قیمت ریال، توضیح، دسته، فعال، و عکس در صورت انتخاب
      if (editing) {
        const active = values.isActive !== false;
        const productRes = await editProductClient(
          {
            slug: name,
            isActive: active,
            categoryIds: values.categoryId ? [values.categoryId] : [],
          },
          editing.id
        );
        const productBody = await productRes.json().catch(() => null);
        if (!productRes.ok) {
          throw new Error(errorText(productBody, "ویرایش انجام نشد"));
        }

        const current = latestVariant(editing);
        let photoTarget = current?.id;
        let photoUsage: "product" | "product-variant" = photoTarget
          ? "product-variant"
          : "product";
        if (photoTarget) {
          const variantRes = await editProductVariantBatchClient({
            variants: [
              {
                id: photoTarget,
                name,
                desc: values.description?.trim() || "",
                price: Number(values.price),
                isActive: active,
                productId: editing.id,
              },
            ],
          });
          const variantBody = await variantRes.json().catch(() => null);
          if (!variantRes.ok) {
            throw new Error(errorText(variantBody, "ویرایش قیمت انجام نشد"));
          }
        } else {
          const variantRes = await addProductVariantClient({
            variants: [{ ...variantPayload, isActive: active, productId: editing.id }],
          });
          const created = await variantRes.json().catch(() => null);
          photoTarget = Array.isArray(created) ? created[0]?.id : created?.id;
          photoUsage = photoTarget ? "product-variant" : "product";
          if (!variantRes.ok || !photoTarget) {
            throw new Error(errorText(created, "ثبت قیمت انجام نشد"));
          }
        }

        if (photo) {
          const body = new FormData();
          body.append("file", photo);
          await uploadImage(photoTarget || editing.id, photoUsage, body);
        }

        form.resetFields();
        if (preview) URL.revokeObjectURL(preview);
        setPreview("");
        setPhoto(null);
        message.success("ویرایش شد");
        onSaved();
        return;
      }

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

  const current = editing ? latestVariant(editing) : undefined;
  const currentPrice = current?.price;
  const shownPhoto = preview || (editing ? existingImage(editing) : "");

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      style={{ maxWidth: 560 }}
      initialValues={
        editing
          ? {
              name: editing.slug,
              price:
                currentPrice === undefined ||
                currentPrice === null ||
                currentPrice === ""
                  ? undefined
                  : Number(currentPrice),
              description: current?.desc || "",
              categoryId: editing.categories?.[0]?.id,
              isActive: editing.isActive !== false,
            }
          : undefined
      }
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
        {shownPhoto && (
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
              src={shownPhoto}
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
          options={suggestionProducts(products).map((product) => {
            const price = latestPrice(product);
            const priceText =
              price === undefined || price === null || price === ""
                ? ""
                : `${price} ریال`;
            return {
              key: product.id,
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

      {editing && (
        <Form.Item label="فعال" name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={saving}>
          {editing ? "ویرایش" : "ثبت"}
        </Button>
      </Form.Item>
    </Form>
  );
}
