"use client";
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Switch,
  message,
  Upload,
} from "antd";
import { addPropertyValueClient } from "@/components/utils/actionsClient";

const AddVariantForm = ({ propertyID, time, refetchProp, onSuccess }: any) => {
  const [loading, setLoading] = useState(false);
  const [props, setprops] = useState([]); // Store selected properties
  const [fileList, setFileList] = useState<any[]>([]);

  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      propertyId: propertyID,
    });
  }, [time]);

  // const handleUploadChange = ({ fileList: newFileList }: any) => {
  //   setFileList(newFileList);
  // };

  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      const response = await addPropertyValueClient(values);

      if (response && response.ok) {
        message.success("property value added successfully!");
        refetchProp();
        onSuccess(propertyID);
      } else {
        console.log("Failed to add property value ");
      }
    } catch (error) {
      console.log("An error occurred while adding the property value", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl">
      <Form
        id="addVariantForm"
        name="add-variant"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 10 }}
        onFinish={handleSubmit}
        autoComplete="off"
        form={form}
      >
        <Form.Item
          label="نام لاتین"
          name="Evalue"
          rules={[{ required: true, message: "Please input the eng text!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="نام فارسی"
          name="Fvalue"
          rules={[{ required: true, message: "Please input the fa text!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="ID"
          name="propertyId"
          rules={[{ required: true }]}
          // style={{ display: "none" }}
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddVariantForm;
