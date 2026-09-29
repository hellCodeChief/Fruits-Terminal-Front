"use client";

import { Form, Input, Button, message } from "antd";
import { login, getUserInfo } from "@/components/utils/actionsClient";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/app/store/user/userSlice";
import Cookies from "js-cookie";

export default function LoginComponent() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (values: any) => {
    try {
      const res = await login(values);

      if (!res.access_token) return;

      // save token
      localStorage.setItem("access_token", res.access_token);

      const userInfo = await getUserInfo(res.access_token);

      dispatch(loginSuccess({ token: res.access_token, userInfo }));

      Cookies.set("userInfo", JSON.stringify(userInfo));
      Cookies.set("access_token", res.access_token);

      message.success("وارد شدید");

      router.push("/");
    } catch (err) {
      console.log("Login error:", err);
      message.error("مشکلی پیش آمد");
    }
  };

  return (
    <Form
      onFinish={handleSubmit}
      className="flex flex-col gap-4"
      autoComplete="off"
    >
      <Form.Item
        name="phone"
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
          className="h-[50px]"
          style={{ borderRadius: "0" }}
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "رمز عبور الزامی است" }]}
      >
        <Input.Password
          placeholder="رمز عبور"
          className="h-[50px]"
          style={{ borderRadius: "0" }}
        />
      </Form.Item>

      <Button
        htmlType="submit"
        className="w-full h-[40px] bg-light-myBlack text-light-myWhite"
      >
        ورود
      </Button>
    </Form>
  );
}
