"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Select, message, Button } from "antd";
import { addPropertyClient } from "@/components/utils/actionsClient"; // Assuming this is the client-side action to call your API

const AddPropertyForm = ({
  allProperties,
  refetchProp,
  onSuccess,
  editPropertyData,
  isEdit,
  time,
}: any) => {
  const [loading, setLoading] = useState(false);
  const [isParentShow, setIsParentShow] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const [form] = Form.useForm();

  const propertyTypes = [
    { label: "متن", value: "text" },
    { label: "عدد", value: "number" },
    { label: "درست/غلط", value: "boolean" },
    { label: "تاریخ", value: "date" },
  ];

  useEffect(() => {
    if (isEdit && editPropertyData) {
      form.setFieldsValue({
        Ename: editPropertyData.Ename,
        Fname: editPropertyData.Fname,
        example: editPropertyData.example,
        type: editPropertyData.type,
      });
    } else {
      form.resetFields();
      // form.setFieldsValue({
      //   isParent: true,
      //   isActive: true,
      // });
    }
  }, [time]);

  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      // Call your client function to add the category
      const response = await addPropertyClient(values);
      const resObject = await response.json();

      if (response.ok) {
        // pass created property id to modal
        onSuccess(resObject.id);
        message.success("property added successfully!");
        refetchProp();
      } else {
        console.log("Failed to add property");
      }
    } catch (error) {
      console.log("An error occurred while adding the property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl">
      <Form
        id="addPropertyForm"
        name="add-property"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleSubmit}
        autoComplete="off"
        form={form}
        key={isEdit ? "edit" : "add"}
      >
        <Form.Item
          label="نام انگلیسی"
          name="Ename"
          rules={[{ required: true, message: "نام انگلیسی را وارد کنید!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="نام فارسی"
          name="Fname"
          rules={[{ required: true, message: "نام فارسی را وارد کنید!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="مثال" name="example">
          <Input />
        </Form.Item>

        <Form.Item
          label="نوع"
          name="type"
          rules={[{ required: true, message: "نوع ویژگی را انتخاب کنید!" }]}
        >
          <Select options={propertyTypes} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 12 }}>
          <Button
            disabled={isEdit}
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            افزودن ویژگی
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddPropertyForm;
