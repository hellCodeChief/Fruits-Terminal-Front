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

export default function SimpleAdd({
  categories,
  onSaved,
}: {
  categories: { id: number; displayName: string }[];
  onSaved: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [form] = Form.useForm();
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [guide, setGuide] = useState({ side: 0, x: 0, y: 0 });

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
    setGuide({ side: 0, x: 0, y: 0 });
  };

  useEffect(() => stopCamera, []);

  useEffect(() => {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!cameraOpen || !video || !stream) return;
    video.srcObject = stream;
    video.play().catch(() => {});
  }, [cameraOpen]);

  useEffect(() => {
    if (!cameraOpen) return;
    const video = videoRef.current;
    if (!video) return;
    // ✅ اندازه مربع راهنما برابر ضلع کوتاه تصویر زنده
    const measure = () => {
      const width = video.offsetWidth;
      const height = video.offsetHeight;
      const side = Math.min(width, height);
      setGuide({
        side,
        x: (width - side) / 2,
        y: (height - side) / 2,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(video);
    video.addEventListener("loadeddata", measure);
    return () => {
      observer.disconnect();
      video.removeEventListener("loadeddata", measure);
    };
  }, [cameraOpen]);

  const showPhoto = (file: File) => {
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ دوربین زنده با راهنمای مربع؛ اگر بسته باشد گالری می‌ماند
  const openCamera = async () => {
    // ✅ دوربین فقط روی localhost یا https
    if (!window.isSecureContext || !navigator.mediaDevices) {
      message.error("دوربین فقط روی localhost یا https باز می‌شود");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      stopCamera();
      streamRef.current = stream;
      setCameraOpen(true);
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      if (name === "NotAllowedError") {
        message.error("اجازه دوربین در مرورگر داده نشده");
      } else if (name === "NotFoundError") {
        message.error("دوربینی پیدا نشد");
      } else {
        message.error("دوربین باز نشد");
      }
    }
  };

  const captureFrame = async () => {
    const video = videoRef.current;
    if (!video?.videoWidth) {
      message.error("تصویر دوربین آماده نیست");
      return;
    }
    try {
      const file = await squareWebp(video, video.videoWidth, video.videoHeight);
      showPhoto(file);
      stopCamera();
    } catch (error: any) {
      message.error(error?.message || "این تصویر قابل استفاده نیست");
    }
  };

  const onPick = async (file: File) => {
    try {
      const compressed = await compressImage(file);
      showPhoto(compressed);
      stopCamera();
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
      style={{ maxWidth: 560 }}
    >
      <Form.Item label="تصویر">
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={<CameraOutlined />} onClick={openCamera}>
            دوربین
          </Button>
          <Upload
            accept="image/*"
            maxCount={1}
            showUploadList={false}
            beforeUpload={onPick}
          >
            <Button icon={<PictureOutlined />}>گالری</Button>
          </Upload>
        </div>
        {cameraOpen && (
          <div style={{ marginTop: 12 }}>
            <div ref={frameRef} style={{ position: "relative" }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: "100%", display: "block" }}
              />
              {guide.side > 0 && (
                <div
                  style={{
                    position: "absolute",
                    left: guide.x,
                    top: guide.y,
                    width: guide.side,
                    height: guide.side,
                    boxSizing: "border-box",
                    border: "3px solid #fff",
                    boxShadow: "0 0 0 999px rgba(0,0,0,0.55)",
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>
            <Button type="primary" onClick={captureFrame} style={{ marginTop: 8 }}>
              گرفتن عکس
            </Button>
          </div>
        )}
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
