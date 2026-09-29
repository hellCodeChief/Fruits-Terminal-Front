import LoginComponent from "@/components/account/login/login-component";
import { Input, Divider } from "antd";
import Link from "next/link";

export default function SideContentLogin() {
  return (
    <>
      <div className="px-4 py-5 flex flex-col gap-4">
        <LoginComponent />
        {/* <Input
          style={{ borderRadius: "0" }}
          className="h-[50px]"
          placeholder="09xxxxxxxxx شماره همراه"
        />
        <Input.Password
          style={{ borderRadius: "0" }}
          className="h-[50px]"
          placeholder="رمز عبور"
        />
        <a href="#">رمز عبور خود را فراموش کرده اید ؟</a>
        <button className="w-full h-[40px] bg-light-myBlack text-light-myWhite">
          ورود
        </button> */}
      </div>
      <Divider style={{ borderColor: "#e4e4e4" }} plain>
        یا
      </Divider>
      <Link href="/account">
        <button className="w-full font-bold mt-4">ثبت نام</button>
      </Link>
    </>
  );
}
