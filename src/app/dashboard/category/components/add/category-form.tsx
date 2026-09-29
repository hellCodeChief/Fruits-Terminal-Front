"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Upload, Select, Switch, message, Button } from "antd";
import {
  addCategoryClient,
  editCategoryClient,
  getAllPropertyClient,
  uploadImage,
} from "@/components/utils/actionsClient"; // Assuming this is the client-side action to call your API
import { UploadOutlined } from "@ant-design/icons";
import { authFetch } from "@/components/utils/helper/authFetch";

const { Option } = Select;

const AddCategoryForm = ({
  setOpen,
  allCategories,
  refetchCat,
  isEdit,
  editCategoryData,
  time,
}: any) => {
  const [loading, setLoading] = useState(false);
  const [isParentShow, setIsParentShow] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [propertyOptions, setPropertyOptions] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProperties = async () => {
      let data = await getAllPropertyClient();
      data = data.map((prop: any) => ({
        label: `${prop.Fname} (${prop.Ename})`,
        value: prop.id,
      }));
      setPropertyOptions(data || []);
    };

    fetchProperties();
  }, [time]);

  // form control
  useEffect(() => {
    setFileList([]);
    if (isEdit && editCategoryData) {
      form.setFieldsValue({
        displayName: editCategoryData.displayName,
        desc: editCategoryData.desc,
        slug: editCategoryData.slug,
        isParent: editCategoryData.isParent,
        isActive: editCategoryData.isActive,
        propertyIds:
          editCategoryData.properties?.map((prop: any) => prop.id) || [],
        parentId: editCategoryData.parentId || null,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        isParent: true,
        isActive: true,
      });
    }
  }, [time]);

  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      if (isEdit && editCategoryData) {
        //
        // update
        await editCategoryClient(editCategoryData.id, values);
        message.success("ویرایش با موفقیت انجام شد");
        refetchCat();
      } else {
        // add

        const response = await addCategoryClient(values);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "افزودن دسته‌بندی با خطا مواجه شد");
        }

        const res = await response.json();

        // updoad(just in add)
        if (fileList.length > 0) {
          const formData = new FormData();
          const file = fileList[0].originFileObj;
          formData.append("file", file);

          try {
            await uploadImage(res.id, "category", formData);
          } catch (error) {
            console.warn("آپلود تصویر با خطا مواجه شد:", error);
            message.warning("افزودن انجام شد، اما آپلود تصویر موفق نبود");
          }
        }

        message.success("دسته‌بندی با موفقیت اضافه شد");
        refetchCat();
        setOpen(false);
      }
    } catch (error: any) {
      console.error("خطا در فرم دسته‌بندی:", error);
      console.log(error?.message || "عملیات با خطا مواجه شد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl">
      <Form
        form={form}
        id="addCategoryForm"
        name="add-category"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 10 }}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="نام دسنه بندی"
          name="displayName"
          rules={[
            { required: true, message: "Please input the category name!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="توضیحات"
          name="desc"
          rules={[
            {
              required: true,
              message: "Please input the category description!",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="اسم منحصر به فرد"
          name="slug"
          rules={[{ required: true, message: "Please input the slug!" }]}
        >
          <Input />
        </Form.Item>

        {isEdit ? (
          // فقط برای نمایش وضعیت isParent در حالت ویرایش
          <Form.Item label="دسته بندی اصلی">
            <Switch checked={form.getFieldValue("isParent")} disabled />
          </Form.Item>
        ) : (
          // فقط در حالت افزودن، قابل تغییر باشد
          <Form.Item
            label="دسته بندی اصلی"
            name="isParent"
            valuePropName="checked"
          >
            <Switch
              defaultChecked
              onChange={() => setIsParentShow(!isParentShow)}
            />
          </Form.Item>
        )}

        <Form.Item label="فعال" name="isActive" valuePropName="checked">
          <Switch defaultChecked />
        </Form.Item>

        <Form.Item
          label="Property ID"
          name="propertyIds"
          rules={[
            { required: true, message: "Please select at least one property!" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select properties"
            options={propertyOptions}
            allowClear
          />
        </Form.Item>

        {!isEdit && (
          <Form.Item label="تصویر دسته‌بندی">
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

        {isParentShow && (
          <Form.Item label="Parent Category" name="parentId">
            <Select placeholder="Select parent category">
              {allCategories.map((cat: any) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.displayName} {cat.id}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default AddCategoryForm;
