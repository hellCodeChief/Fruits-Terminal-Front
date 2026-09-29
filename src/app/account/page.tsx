"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input, Divider, Form, Button } from "antd";
import RegisterForm from "./register/form";
import LoginForm from "./login/form";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import LoginComponent from "@/components/account/login/login-component";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState<boolean>(false);

  return (
    <div className="container px-4 mx-auto">
      <div className="flex flex-col md:flex-row flex-wrap justify-between">
        {/*  login  and forget password */}
        <div className="flex-1 p-3 pt-[100px]">
          {showForgetPassword ? (
            <div className="flex flex-col items-center">
              <h1 className="text-center fz2 font-bold pb-[50px]">
                رمز عبور خود را بازنشانی کنید
              </h1>
              <form className="flex flex-wrap justify-center w-[100%]">
                <div className="flex items-center flex-nowrap w-full mb-5">
                  <label className="w-[25%] flex-auto text-md font-medium text-gray-900 dark:text-white">
                    شماره همراه
                  </label>
                  <Input
                    style={{ borderRadius: "0" }}
                    className="h-[50px]"
                    placeholder="09xxxxxxxxx شماره همراه"
                  />
                </div>
                <button
                  type="submit"
                  className="text-white bg-black border hover:bg-white hover:text-light-myBrown  hover:border-light-myBrown font-medium text-md w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  ارسال
                </button>
              </form>
              <div className="flex justify-center mt-5">
                <button
                  className="px-3"
                  onClick={() => setShowForgetPassword(false)}
                >
                  لغو
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <h1 className="text-center fz2 font-bold pb-[50px]">ورود</h1>
              <Provider store={store}>
                {/* <LoginForm /> */}
                <LoginComponent />
              </Provider>
              <div className="flex justify-center mt-5">
                <button
                  className="px-3"
                  onClick={() => setShowForgetPassword(true)}
                >
                  فراموشی رمز عبور
                </button>
                <button className="px-3" onClick={() => router.push("/")}>
                  بازگشت به فروشگاه
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="w-[10%] hidden md:block"></div>
        {/*  register  */}
        <div className="flex-1 p-3 pt-[100px]">
          <div className="flex flex-col items-center">
            <h1 className="text-center fz2 font-bold pb-[50px]">عضویت</h1>
            <RegisterForm />
            <div className="flex justify-center mt-5">
              <button className="px-3" onClick={() => router.push("/")}>
                بازگشت به فروشگاه
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
