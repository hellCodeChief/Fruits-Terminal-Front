import { Input, Form, Button, message } from "antd";
import { register } from "@/components/utils/actionsClient";
import { useState } from "react";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    // setLoading(true);

    try {
      const res = await register(values);
      message.success("ثبت انجام شد");
    } catch (error) {
      console.log("An error occurred while register", error);
    } finally {
      //   setLoading(false);
    }
  };
  return (
    <Form
      onFinish={handleSubmit}
      layout="vertical"
      autoComplete="off"
      className="flex flex-wrap justify-center w-full max-w-xl mx-auto"
    >
      {/* First Name */}
      <div className="flex items-center flex-nowrap w-full mb-5">
        <label className="w-[25%] flex-auto text-md font-medium text-gray-900 dark:text-white">
          نام
        </label>
        <Form.Item name="firstName" className="w-[75%] mb-0">
          <Input placeholder="نام" className="h-[50px] rounded-none" />
        </Form.Item>
      </div>

      {/* Last Name */}
      <div className="flex items-center flex-nowrap w-full mb-5">
        <label className="w-[25%] flex-auto text-md font-medium text-gray-900 dark:text-white">
          نام خانوادگی
        </label>
        <Form.Item name="lastName" className="w-[75%] mb-0">
          <Input placeholder="نام خانوادگی" className="h-[50px] rounded-none" />
        </Form.Item>
      </div>

      {/* Mobile */}
      <div className="flex items-center flex-nowrap w-full mb-5">
        <label className="w-[25%] flex-auto text-md font-medium text-gray-900 dark:text-white">
          شماره همراه
        </label>
        <Form.Item
          name="phone"
          className="w-[75%] mb-0"
          rules={[
            { required: true, message: "شماره همراه الزامی است" },
            {
              pattern: /^09\d{9}$/,
              message: "شماره موبایل باید با 09 شروع شود و 11 رقم باشد",
            },
          ]}
        >
          <Input
            placeholder="09xxxxxxxxx شماره همراه"
            className="h-[50px] rounded-none"
          />
        </Form.Item>
      </div>
      {/* address */}
      <div className="flex items-center flex-nowrap w-full mb-5">
        <label className="w-[25%] flex-auto text-md font-medium text-gray-900 dark:text-white">
          آدرس
        </label>
        <Form.Item name="address" className="w-[75%] mb-0">
          <Input placeholder="آدرس" className="h-[50px] rounded-none" />
        </Form.Item>
      </div>

      {/* Password */}
      <div className="flex items-center flex-nowrap w-full mb-5">
        <label className="w-[25%] text-md font-medium text-gray-900 dark:text-white">
          گذرواژه
        </label>
        <Form.Item
          name="password"
          className="w-[75%] mb-0"
          rules={[
            {
              min: 6,
              message: "رمز عبور باید حداقل ۶ کاراکتر باشد",
            },
          ]}
        >
          <Input.Password
            placeholder="رمز عبور"
            className="h-[50px] rounded-none"
          />
        </Form.Item>
      </div>

      {/* Submit Button */}
      <Form.Item className="w-full">
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="text-white bg-black border border-black hover:bg-white hover:text-light-myBrown hover:border-light-myBrown font-medium text-md w-full sm:w-auto px-5 py-2.5 text-center rounded-none"
        >
          ثبت
        </Button>
      </Form.Item>
    </Form>
  );
}
