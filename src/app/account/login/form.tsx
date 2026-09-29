import { login } from "@/components/utils/actionsClient";
import { getUserInfo } from "@/components/utils/actionsClient";
import { Input, Form, Button, message } from "antd";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/app/store/user/userSlice";
import Cookies from "js-cookie";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (values: any) => {
    // setLoading(true);

    try {
      const res = await login(values);

      if (res.access_token) {
        // save access_token in LocalStorage
        localStorage.setItem("access_token", res.access_token);

        const userInfo = await getUserInfo(res.access_token);

        // STATIC permission to test
        // userInfo.permission = [
        //   "product:create",
        //   "product:update",
        //   "product:soft-delete",
        //   "product:hard-delete",
        // ];
        // save userInfo in store
        dispatch(loginSuccess({ token: res.access_token, userInfo: userInfo }));
        // save userInfo in cookie
        Cookies.set("userInfo", JSON.stringify(userInfo));
        Cookies.set("access_token", JSON.stringify(res.access_token));

        message.success("وارد شدید");

        router.push("/");
      }
    } catch (error) {
      console.log("An error occurred while login", error);
    } finally {
      //   setLoading(false);
    }
  };
  return (
    <Form
      onFinish={handleSubmit}
      className="flex flex-wrap justify-center w-[100%]"
      autoComplete="off"
    >
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
            className="h-[50px]"
            style={{ borderRadius: "0" }}
          />
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
          rules={[{ required: true, message: "رمز عبور الزامی است" }]}
        >
          <Input.Password
            placeholder="رمز عبور"
            className="h-[50px]"
            style={{ borderRadius: "0" }}
          />
        </Form.Item>
      </div>

      {/* Submit Button */}
      <Form.Item className="w-full">
        <Button
          htmlType="submit"
          className="text-white bg-black border hover:bg-white hover:text-light-myBrown hover:border-light-myBrown font-medium text-md w-full sm:w-auto px-5 py-2.5 text-center"
        >
          ارسال
        </Button>
      </Form.Item>
    </Form>
  );
}
