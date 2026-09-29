import Image from "next/image";
import { BiLogoTelegram } from "react-icons/bi";

export default function FooterProducts() {
  return (
    <div className="bg-light-myGray border border-light-textGray1/20">
      <div className="container m-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center md:items-start relative pt-10 pb-16 px-2 lg:px-2 xl:px-12">
          <Image
            className="object-cover"
            width={130}
            height={130}
            src="/shahbanoo-logo.png"
            alt=""
            objectFit="cover"
          ></Image>
          <p className="text-sm mt-6">
            در خبرنامه ما مشترک شوید و دریافت کنید تخفیف 30% بگیرید
          </p>
          <div className="w-[80%] md:w-[90%] lg:w-[90%] flex items-center relative mt-6">
            <input
              className="w-full h-[40px] border-none focus:ring-0 outline-none 
                  rtl:pl-[50px] rtl:pr-[10px] ltr:pr-[50px] ltr:pl-[10px] placeholder:text-sm"
              type="text"
              placeholder="آدرس ایمیل شما"
            />
            <button
              className="h-full w-[40px] absolute top-0 rtl:left-0 ltr:right-0 
                    flex justify-center items-center bg-black hover:bg-light-myBrown transition-all duration-300"
            >
              <BiLogoTelegram className="text-xl text-white" />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-start rtl:border-r ltr:border-l space-y-2 pt-10 pb-[72px] px-2 lg:px-2 xl:px-12">
          <p className="font-semibold">مراقب از مشتری</p>
          <div className="w-8 border-b border-black"></div>
          <div className="pt-5">
            <div>
              <a href="">صفحه بندی</a>
            </div>
            <div>
              <a href="">صفحه بندی</a>
            </div>
            <div>
              <a href="">صفحه بندی</a>
            </div>
            <div>
              <a href="">صفحه بندی</a>
            </div>
            <div>
              <a href="">صفحه بندی</a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-start rtl:border-r ltr:border-l space-y-2 pt-10 pb-[72px] px-2 lg:px-2 xl:px-12">
          <p className="font-semibold">مراقب از مشتری</p>
          <div className="w-8 border-b border-black"></div>
          <div className="pt-5">
            <div>
              <a href="">صفحه بندی</a>
            </div>
            <div>
              <a href="">صفحه بندی</a>
            </div>
            <div>
              <a href="">صفحه بندی</a>
            </div>
            <div>
              <a href="">صفحه بندی</a>
            </div>
            <div>
              <a href="">صفحه بندی</a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-start rtl:border-r ltr:border-l space-y-2 pt-10 pb-[72px] px-2 lg:px-2 xl:px-12">
          <p className="font-semibold">مراقب از مشتری</p>
          <div className="w-8 border-b border-black"></div>
          <div className="pt-5">
            <div>
              <a href="">صفحه بندی</a>
            </div>
            <div>
              <a href="">صفحه بندی</a>
            </div>
            <div>
              <a href="">صفحه بندی</a>
            </div>
            <div>
              <a href="">صفحه بندی</a>
            </div>
            <div>
              <a href="">صفحه بندی</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
