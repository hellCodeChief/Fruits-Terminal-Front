"use client";

import {
  createVitrine,
  getAllCategoriesClient,
  suggestVitrineProducts,
} from "@/components/utils/actionsClient";
import { CameraOutlined, PictureOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
  Upload,
  message,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const MAX_EDGE = 1200;

function staffAllowed(user: any) {
  if (user?.accountType === "admin") return true;
  const names = (user?.roles || []).map((role: any) =>
    String(role?.name || "")
      .trim()
      .toLowerCase()
  );
  return names.includes("admin") || names.includes("worker");
}

function formatToman(price: number) {
  return `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
}

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

export default function VitrineAddPage() {
  const router = useRouter();
  const cameraBox = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState<{ label: string; value: number }[]>([]);
  const [options, setOptions] = useState<
    { value: string; label: string; price: number | null }[]
  >([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const name = Form.useWatch("name", form);

  useEffect(() => {
    const stored = localStorage.getItem("access_token") || "";
    if (!stored) {
      router.replace("/account");
      return;
    }
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

    getAllCategoriesClient()
      .then((rows: any[]) =>
        setCategories(
          (Array.isArray(rows) ? rows : []).map((row) => ({
            label: row.displayName,
            value: row.id,
          }))
        )
      )
      .catch(() => setCategories([]));
  }, [router]);

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
  }, [ready, allowed]);

  useEffect(() => {
    const query = String(name || "").trim();
    if (!ready || query.length < 1) {
      setOptions([]);
      return;
    }
    const handle = setTimeout(() => {
      suggestVitrineProducts(query)
        .then((rows: any[]) =>
          setOptions(
            (Array.isArray(rows) ? rows : []).map((row) => ({
              value: row.name,
              price: row.price,
              label: row.price
                ? `${row.name} — ${formatToman(row.price)}`
                : row.name,
            }))
          )
        )
        .catch(() => setOptions([]));
    }, 250);
    return () => clearTimeout(handle);
  }, [name, ready]);

  const onPick = async (file: File) => {
    try {
      const compressed = await compressImage(file);
      if (preview) URL.revokeObjectURL(preview);
      setPhoto(compressed);
      setPreview(URL.createObjectURL(compressed));
      setSaved(false);
    } catch (error: any) {
      message.error(error?.message || "این تصویر قابل استفاده نیست");
    }
    return false;
  };

  const onFinish = async (values: any) => {
    if (!photo) {
      message.error("تصویر را انتخاب کنید");
      return;
    }
    setSaving(true);
    try {
      const body = new FormData();
      body.append("file", photo);
      body.append("name", values.name);
      body.append("price", String(values.price));
      if (values.description) body.append("description", values.description);
      if (values.categoryId) body.append("categoryId", String(values.categoryId));
      await createVitrine(body);
      setSaved(true);
      setPhoto(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview("");
      form.resetFields();
      message.success("ثبت شد");
    } catch (error: any) {
      message.error(error?.message || "ثبت انجام نشد");
    } finally {
      setSaving(false);
    }
  };

  if (!ready) {
    return (
      <Typography.Paragraph style={{ padding: 24, textAlign: "center" }}>
        در حال بارگذاری
      </Typography.Paragraph>
    );
  }

  if (!allowed) {
    return (
      <Typography.Paragraph style={{ padding: 24 }}>
        فقط مدیر یا کارگر می‌تواند در ویترین ثبت کند
      </Typography.Paragraph>
    );
  }

  return (
    <div style={{ padding: 16, maxWidth: 560 }}>
      <Typography.Title level={3}>افزودن به ویترین امروز</Typography.Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
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
          <AutoComplete
            options={options}
            onSelect={(_value, option: { price?: number | null }) => {
              if (option.price) form.setFieldValue("price", option.price);
            }}
          >
            <Input />
          </AutoComplete>
        </Form.Item>

        <Form.Item
          label="قیمت"
          name="price"
          rules={[{ required: true, message: "قیمت را وارد کنید" }]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            addonAfter="تومان"
          />
        </Form.Item>

        <Form.Item label="توضیح" name="description">
          <Input.TextArea rows={3} maxLength={300} />
        </Form.Item>

        <Form.Item label="دسته‌بندی" name="categoryId">
          <Select allowClear options={categories} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>
            ثبت در ویترین
          </Button>
        </Form.Item>
      </Form>

      {saved && (
        <div>
          <Typography.Text>ثبت شد</Typography.Text>
          <div style={{ marginTop: 8 }}>
            <Link href="/vitrine">
              <Button>ویترین امروز</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
