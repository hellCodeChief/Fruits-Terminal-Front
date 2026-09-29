export default function PromotionBox() {
  return (
    <div className="flex justify-evenly md:justify-between flex-wrap md:flex-nowrap gap-4 py-6">
      <div className="w-[300px] h-[200px] flex flex-col items-center border border-[#DFDFDF]">
        <span className="text-[65px] font-bold text-light-myBrown">1</span>
        <h4 className="font-bold text-[18px]">ارسال سریع</h4>
        <p className="text-light-textGray1 text-[16px]">ارسال به سراسر کشور</p>
        <p className="text-light-textGray1 text-[14px]">
          در کوتاه‌ترین زمان ممکن
        </p>
      </div>

      <div className="w-[300px] h-[200px] flex flex-col items-center border border-[#DFDFDF]">
        <span className="text-[65px] font-bold text-light-myBrown">2</span>
        <h4 className="font-bold text-[18px]">۱۰۰٪ طبیعی </h4>
        <p className="text-light-textGray1 text-[16px]">
          بدون مواد مضر شیمیایی
        </p>
        <p className="text-light-textGray1 text-[14px]">مناسب انواع پوست</p>
      </div>

      <div className="w-[300px] h-[200px] flex flex-col items-center border border-[#DFDFDF]">
        <span className="text-[65px] font-bold text-light-myBrown">3</span>
        <h4 className="font-bold text-[18px]">تولید تخصصی</h4>
        <p className="text-light-textGray1 text-[16px]">با دقت و کیفیت بالا</p>
        <p className="text-light-textGray1 text-[14px]">
          مطابق استانداردهای بهداشتی
        </p>
      </div>

      <div className="w-[300px] h-[200px] flex flex-col items-center border border-[#DFDFDF]">
        <span className="text-[65px] font-bold text-light-myBrown">4</span>
        <h4 className="font-bold text-[18px]">گزیده‌ای از برندهای معتبر</h4>
        <p className="text-light-textGray1 text-[16px]">تضمین کیفیت و اصالت</p>
        <p className="text-light-textGray1 text-[14px]">
          محصولات منتخب و تأییدشده
        </p>
      </div>
    </div>
  );
}
