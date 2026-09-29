"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Select } from "antd";
import {
  addRoleClient,
  // updateRoleClient,
} from "@/components/utils/actionsClient";

const AddRoleForm = ({
  isEdit,
  editRoleData,
  allPermissions,
  refetchRoles,
}: any) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && editRoleData) {
      form.setFieldsValue({
        name: editRoleData.name,
        color: editRoleData.color || "",
        permissionIds: editRoleData.permissions?.map((p: any) => p.id),
      });
    } else {
      form.resetFields();
    }
  }, [editRoleData]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // if (isEdit) {
      //   response = await updateRoleClient(editRoleData.id, values);
      // } else {
      const response = await addRoleClient(values);
      // }
      const resObject = await response.json();

      if (response.ok) {
        message.success("نقش با موفقیت ذخیره شد");
        refetchRoles();
      } else {
        message.error(resObject.message || "خطا در ذخیره نقش");
      }
    } catch (error) {
      console.error(error);
      message.error("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      id="addRoleForm"
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      autoComplete="off"
    >
      <Form.Item
        label="نام نقش"
        name="name"
        rules={[{ required: true, message: "لطفاً نام نقش را وارد کنید" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="رنگ (اختیاری)" name="color">
        <Input />
      </Form.Item>

      <Form.Item
        label="مجوزها"
        name="permissionIds"
        rules={[{ required: true, message: "حداقل یک مجوز را انتخاب کنید" }]}
      >
        <Select
          mode="multiple"
          allowClear
          placeholder="انتخاب مجوزها"
          options={
            allPermissions?.map((permission: any) => ({
              label: permission.name,
              value: permission.id,
            })) || []
          }
        />
      </Form.Item>

      {/* دکمه مخفی برای حالت فراخوانی submit از والد */}
      <Form.Item className="hidden">
        <Button type="primary" htmlType="submit" loading={loading}>
          ذخیره
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddRoleForm;
