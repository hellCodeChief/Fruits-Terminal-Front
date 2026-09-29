"use client";
import React, { useEffect, useRef, useState } from "react";
import { Form, Input, InputNumber, Button, message } from "antd";
import { CameraOutlined, UploadOutlined } from "@ant-design/icons";
import {
  addProductClient,
  editProductClient,
} from "@/components/utils/actionsClient";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const saleVariant = (product: any) => {
  if (!Array.isArray(product?.variants) || product.variants.length === 0) {
    return null;
  }
  return (
    product.variants.find(
      (variant: any) => variant.id === product.defaultVariantId
    ) || product.variants[0]
  );
};

const existingImageUrl = (product: any) => {
  const file = product?.files?.[0];
  if (!file?.id) return "";
  return `${BASE_URL}/files/${file.id}/product`;
};

const AddProductForm = ({
  refetchProduct,
  editProductData,
  onSuccess,
  isEdit,
  time,
}: any) => {
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [form] = Form.useForm();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const savedImage = isEdit ? existingImageUrl(editProductData) : "";

  useEffect(() => {
    setPhotoFile(null);
    if (isEdit && editProductData) {
      const variant = saleVariant(editProductData);
      const image = existingImageUrl(editProductData);
      setPreviewUrl(image);
      form.setFieldsValue({
        name: variant?.name || editProductData.slug || "",
        price:
          variant?.price !== undefined && variant?.price !== null && variant?.price !== ""
            ? Number(variant.price)
            : undefined,
        description: variant?.desc || "",
        image: image || undefined,
      });
    } else {
      setPreviewUrl("");
      form.resetFields();
    }
  }, [time, isEdit, editProductData, form]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const looksLikePhoto = (file: File) => {
    if (file.type.startsWith("image/")) return true;
    return /\.(heic|heif|jpe?g|png|webp|gif|bmp|avif|jfif)$/i.test(file.name);
  };

  const handlePhotoPicked = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!looksLikePhoto(file)) {
      message.error("لطفا یک عکس از گالری یا دوربین انتخاب کنید");
      return;
    }

    setPreviewUrl((current) => {
      if (current.startsWith("blob:")) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
    setPhotoFile(file);
    form.setFieldsValue({ image: file.name });
    form.validateFields(["image"]).catch(() => undefined);
  };

  const handleSubmit = async (values: any) => {
    if (!photoFile && !savedImage) {
      form.setFields([
        { name: "image", errors: ["تصویر محصول را انتخاب کنید"] },
      ]);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", String(values.price));
      if (isEdit || values.description) {
        formData.append("description", values.description || "");
      }
      if (photoFile) formData.append("file", photoFile);

      const response =
        isEdit && editProductData
          ? await editProductClient(formData, editProductData.id)
          : await addProductClient(formData);

      const raw = await response.text();
      if (!response.ok) {
        let messageText = "عملیات با خطا مواجه شد";
        try {
          const parsed = JSON.parse(raw);
          messageText = parsed.message || messageText;
          if (Array.isArray(parsed.message)) messageText = parsed.message.join("، ");
        } catch {
          if (raw) messageText = raw;
        }
        throw new Error(messageText);
      }

      message.success(
        isEdit ? "ویرایش با موفقیت انجام شد" : "محصول با موفقیت اضافه شد"
      );
      refetchProduct();
      onSuccess();
    } catch (error: any) {
      message.error(error?.message || "عملیات با خطا مواجه شد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl">
      <Form
        form={form}
        id="addProductForm"
        name="add-product"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="تصویر محصول"
          name="image"
          required={!savedImage}
          rules={[
            {
              validator: async (_, value) => {
                if (value || savedImage || photoFile) return;
                throw new Error("تصویر محصول را انتخاب کنید");
              },
            },
          ]}
        >
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*,.heic,.heif"
              onChange={handlePhotoPicked}
              style={{ display: "none" }}
              aria-label="انتخاب تصویر از گالری"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*,.heic,.heif"
              capture="environment"
              onChange={handlePhotoPicked}
              style={{ display: "none" }}
              aria-label="گرفتن عکس با دوربین"
            />
            <Button
              icon={<UploadOutlined />}
              onClick={() => galleryInputRef.current?.click()}
            >
              انتخاب از گالری
            </Button>
            <Button
              icon={<CameraOutlined />}
              onClick={() => cameraInputRef.current?.click()}
            >
              گرفتن عکس
            </Button>
          </div>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="پیش‌نمایش محصول"
              style={{
                marginTop: 12,
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          ) : null}
        </Form.Item>

        <Form.Item
          label="نام محصول"
          name="name"
          rules={[{ required: true, message: "نام محصول را وارد کنید" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="قیمت"
          name="price"
          rules={[
            { required: true, message: "قیمت را وارد کنید" },
            {
              validator: async (_, value) => {
                if (value === undefined || value === null || value === "") return;
                if (Number(value) < 0) throw new Error("قیمت نمی‌تواند منفی باشد");
              },
            },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="توضیحات (اختیاری)" name="description">
          <Input.TextArea rows={3} placeholder="اختیاری" />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 14, offset: 8 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? "ویرایش محصول" : "ثبت محصول"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProductForm;
