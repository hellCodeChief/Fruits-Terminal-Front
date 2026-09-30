"use client";

import {
  addProductClient,
  addProductVariantClient,
  uploadImage,
} from "@/components/utils/actionsClient";
import { CameraOutlined, PictureOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
} from "antd";
import { useEffect, useRef, useState } from "react";

const MAX_EDGE = 1200;

async function compressImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("این تصویر قابل استفاده نیست");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.7)
  );
  if (!blob) throw new Error("این تصویر قابل استفاده نیست");
  return new File([blob], "photo.jpg", { type: "image/jpeg" });
}

function errorText(data: any, fallback: string) {
  const messageText = data?.data?.data?.message || data?.message || fallback;
  return Array.isArray(messageText) ? messageText[0] : messageText;
}

export default function SimpleAdd({
  categories,
  onSaved,
}: {
  categories: { id: number; displayName: string }[];
  onSaved: () => void;
}) {
  const cameraBox = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const node = cameraBox.current;
    if (!node) return;
    const apply = () => {
      node.querySelectorAll("input[type=file]").forEach((input) => {
        input.setAttribute("capture", "environment");
        input.setAttribute("accept", "image/*");
      });
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(node, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const onPick = async (file: File) => {
    try {
      const compressed = await compressImage(file);
      if (preview) URL.revokeObjectURL(preview);
      setPhoto(compressed);
      setPreview(URL.createObjectURL(compressed));
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
    setSaving(true);
    try {
      const productRes = await addProductClient({
        slug: values.name.trim(),
        categoryIds: values.categoryId ? [values.categoryId] : [],
        isActive: true,
      });
      const product = await productRes.json().catch(() => ({}));
      if (!productRes.ok || !product?.id) {
        throw new Error(errorText(product, "ثبت انجام نشد"));
      }

      const variantRes = await addProductVariantClient({
        variants: [
          {
            name: values.name.trim(),
            slug: `p${Date.now().toString(36)}`,
            stock: 0,
            desc: values.description?.trim() || "",
            isActive: true,
            isDefault: true,
            price: Number(values.price),
            productId: product.id,
            props: [],
          },
        ],
      });
      if (!variantRes.ok) {
        const variantBody = await variantRes.json().catch(() => ({}));
        throw new Error(errorText(variantBody, "ثبت قیمت انجام نشد"));
      }

      const body = new FormData();
      body.append("file", photo);
      await uploadImage(product.id, "product", body);

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
      style={{ maxWidth: 560, marginBottom: 24 }}
    >
      <Form.Item label="تصویر">
        <div style={{ display: "flex", gap: 8 }}>
          <div ref={cameraBox}>
            <Upload
              accept="image/*"
              maxCount={1}
              showUploadList={false}
              beforeUpload={onPick}
            >
              <Button icon={<CameraOutlined />}>دوربین</Button>
            </Upload>
          </div>
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
          <img
            alt=""
            src={preview}
            style={{ marginTop: 12, width: "100%", maxHeight: 240, objectFit: "cover" }}
          />
        )}
      </Form.Item>

      <Form.Item
        label="نام"
        name="name"
        rules={[{ required: true, message: "نام را وارد کنید" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="قیمت"
        name="price"
        rules={[{ required: true, message: "قیمت را وارد کنید" }]}
      >
        <InputNumber min={1} style={{ width: "100%" }} addonAfter="تومان" />
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
