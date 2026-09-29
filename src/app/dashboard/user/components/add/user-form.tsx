"use client";
import React, { useEffect, useState } from "react";
import { Form, Select, Button, message } from "antd";
import { assignUserRoleClient } from "@/components/utils/actionsClient";

const UserRoleForm = ({ editUserData, allRoles, refetchUsers }: any) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editUserData) {
      form.setFieldsValue({
        roleId: editUserData.roles?.[0]?.id || null, // فقط نقش اول انتخاب‌شده رو تنظیم می‌کنیم
      });
    } else {
      form.resetFields();
    }
  }, [editUserData]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await assignUserRoleClient(
        { roleId: [values.roleId] }, // ارسال به صورت آرایه
        editUserData.id // ارسال id از prop
      );
      const result = await response.json();

      if (response.ok) {
        message.success("نقش با موفقیت اختصاص داده شد");
        refetchUsers?.();
      } else {
        message.error(result.message || "خطا در اختصاص نقش");
      }
    } catch (error) {
      message.error("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      id="assignUserRoleForm"
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      autoComplete="off"
    >
      <Form.Item
        label="انتخاب نقش"
        name="roleId"
        rules={[{ required: true, message: "لطفا یک نقش انتخاب کنید" }]}
      >
        <Select
          placeholder="نقش را انتخاب کنید"
          options={
            allRoles?.map((role: any) => ({
              label: role.name,
              value: role.id,
            })) || []
          }
        />
      </Form.Item>

      {/* دکمه پنهان برای ارسال از والد */}
      <Form.Item className="hidden">
        <Button type="primary" htmlType="submit" loading={loading}>
          ذخیره
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserRoleForm;
