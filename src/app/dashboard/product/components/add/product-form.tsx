"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Switch, message, Upload } from "antd";
import {
  addProductClient,
  editProductClient,
  uploadImage,
} from "@/components/utils/actionsClient";
import { UploadOutlined } from "@ant-design/icons";

const AddProductForm = ({
  allProducts,
  allCategories,
  refetchProduct,
  editProductData,
  onSuccess,
  isEdit,
  time,
}: any) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [form] = Form.useForm();

  const formattedCategories = allCategories.map((category: any) => ({
    label: category.displayName,
    value: category.id,
  }));

  useEffect(() => {
    if (isEdit && editProductData) {
      form.setFieldsValue({
        title: editProductData.title,
        slug: editProductData.slug,
        isActive: editProductData.isActive,
        categoryIds: editProductData.categories?.map((cat: any) => cat.id),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        isActive: true,
      });
    }
  }, [time]);

  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  // ✅ تابع استخراج آیدی دسته‌ها + والدها
  const getCategoryIdsWithParents = (
    selectedIds: number[],
    allCategories: any[]
  ): number[] => {
    const finalIds = new Set<number>();

    selectedIds.forEach((id) => {
      const category = allCategories.find((cat: any) => cat.id === id);
      if (category) {
        finalIds.add(category.id);
        if (Array.isArray(category.childCategories)) {
          category.childCategories.forEach((rel: any) => {
            if (rel.parentId) {
              finalIds.add(rel.parentId);
            }
          });
        }
      }
    });

    return Array.from(finalIds);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      // ✅ جایگزینی categoryIds با والدها
      const fullCategoryIds = getCategoryIdsWithParents(
        values.categoryIds || [],
        allCategories
      );

      const payload = {
        ...values,
        categoryIds: fullCategoryIds,
      };

      if (isEdit && editProductData) {
        await editProductClient(payload, editProductData.id);
        message.success("ویرایش با موفقیت انجام شد");
        refetchProduct();
      } else {
        const response = await addProductClient(payload);
        const res = await response.json();

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "افزودن محصول با خطا مواجه شد");
        }

        if (fileList.length > 0) {
          const formData = new FormData();
          const file = fileList[0].originFileObj;
          formData.append("file", file);

          try {
            await uploadImage(res.id, "product", formData);
          } catch (error) {
            console.warn("آپلود تصویر با خطا مواجه شد:", error);
            message.warning("افزودن انجام شد، اما آپلود تصویر موفق نبود");
          }
        }

        message.success("محصول با موفقیت اضافه شد");
        onSuccess(res.id, res.slug);
        refetchProduct();
      }
    } catch (error: any) {
      console.error("خطا در فرم محصول:", error);
      console.log(error?.message || "عملیات با خطا مواجه شد");
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
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 10 }}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="نام محصول"
          name="slug"
          rules={[{ required: true, message: "نام محصول را وارد کنید!" }]}
        >
          <Input />
        </Form.Item>

        {!isEdit && (
          <Form.Item
            label="دسته بندی ها"
            name="categoryIds"
            rules={[
              { required: true, message: "حداقل یک دسته‌بندی را انتخاب کنید!" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="انتخاب دسته‌بندی"
              options={formattedCategories}
              allowClear
            />
          </Form.Item>
        )}

        <Form.Item label="فعال" name="isActive" valuePropName="checked">
          <Switch defaultChecked />
        </Form.Item>

        {!isEdit && (
          <Form.Item label="تصویر محصول">
            <Upload
              listType="picture"
              beforeUpload={() => false}
              fileList={fileList}
              onChange={handleUploadChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>انتخاب تصویر</Button>
            </Upload>
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? "ویرایش محصول" : "ثبت محصول"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProductForm;
