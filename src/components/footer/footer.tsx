import { FaTwitter, FaDribbble, FaBehance, FaInstagram } from "react-icons/fa";
export default function Footer() {
  return (
    <div className=" bg-light-myGray">
      {/* newsletter component */}
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-[30%]"></div>

        <div className="flex flex-col justify-center items-center lg:w-[40%] py-8">
          {/* <div className="text-[28px] font-semibold">عضویت در خبرنامه</div>
          <p className="pt-3 px-2 text-center font-semibold">
            با عضویت در خبرنامه، ۱۵٪ تخفیف اولین خرید را دریافت کنید. ما فقط
            پیشنهادهای ویژه ارسال می‌کنیم، بدون پیام‌های مزاحم.
          </p>
          <div className="w-full flex justify-center items-center py-4">
            <div className="w-full md:w-[50%] lg:w-full mx-4 flex justify-center items-center border-b-2 border-slate-900">
              <input
                className="w-full p-1 bg-transparent placeholder-slate-400"
                placeholder="آدرس ایمیل خود را وارد کنید"
                type="text"
              />
              <button className="font-bold text-s">عضویت</button>
            </div>
          </div> */}
        </div>

        <div className="lg:w-[30%]"></div>
      </div>
      {/* contentmenu component */}
      <div className="flex flex-wrap-reverse justify-between items-center py-8 px-2">
        <div className="w-full lg:w-[30%] flex justify-center items-center gap-4">
          <a href="" className="flex items-center gap-1 font-medium">
            <FaTwitter size={16} />
            <span>توییتر</span>
          </a>

          <a href="" className="flex items-center gap-1 font-medium">
            <FaDribbble size={16} />
            <span>دریبل</span>
          </a>

          <a href="" className="flex items-center gap-1 font-medium">
            <FaBehance size={16} />
            <span>بیهنس</span>
          </a>

          <a href="" className="flex items-center gap-1 font-medium">
            <FaInstagram size={16} />
            <span>اینستاگرام</span>
          </a>
        </div>

        <div className="w-full lg:w-[40%] my-3 px-2 lg:my-0 flex justify-center items-center">
          <div
            className="w-[200px] h-[200px] enamad-wrapper m-auto"
            dangerouslySetInnerHTML={{
              __html: `
                      <a referrerpolicy="origin" target="_blank"
                        href="https://trustseal.enamad.ir/?id=5340497&Code=nmMRRmMcpHLoikGELdaiifhnHjcrJzX9">
                        <img
                          referrerpolicy="origin"
                          src="https://trustseal.enamad.ir/logo.aspx?id=5340497&Code=nmMRRmMcpHLoikGELdaiifhnHjcrJzX9"
                          alt=""
                          style="cursor:pointer"
                          code="nmMRRmMcpHLoikGELdaiifhnHjcrJzX9"
                        />
                      </a>
                    `,
            }}
          />
          {/* <ul className="flex flex-wrap justify-center items-center">
            <li className="px-2 font-medium">
              <a href="">ژل شست‌وشوی صورت</a>
            </li>
            <li className="px-2 font-medium">
              <a href="">تونیک طراوت‌بخش صورت</a>
            </li>
            <li className="px-2 font-medium">
              <a href="">پالت سایه چشم با تناژ گرم</a>
            </li>
            <li className="px-2 font-medium">
              <a href="">فوم پاک‌کننده صورت</a>
            </li>
            <li className="px-2 font-medium">
              <a href="">رژ لب هلویی</a>
            </li>
            <li className="px-2 font-medium">
              <a href="">تونر صورت گیاهی</a>
            </li>
          </ul> */}
        </div>

        <div className="w-full lg:w-[30%] flex flex-wrap justify-center items-center px-2">
          <span className=" pr-1 font-medium">طراحی و اجرا</span>
          {/* <span className="pr-1 font-medium">By</span> */}
          <span className=" pr-1 font-medium">توسط تیم</span>
          <a
            className=" pr-1 font-medium"
            href="https://github.com/hellCodeChief"
          >
            HellCodeChief
          </a>
        </div>
      </div>
    </div>
  );
}
