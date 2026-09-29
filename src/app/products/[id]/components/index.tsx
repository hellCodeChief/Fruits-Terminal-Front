"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import SinglePageTabSelector from "./tabs";
import { PiAirplaneTiltLight } from "react-icons/pi";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { RiVerifiedBadgeLine } from "react-icons/ri";
import { BsShieldCheck } from "react-icons/bs";
import SlickSlider from "@/components/slick-slider/";
import FooterProducts from "@/components/footer-products/footerProducts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";

import "swiper/css/free-mode";
import { formatPriceNumber } from "@/components/utils/helper/formatPrice";
import MyButton from "@/components/button/my-buttons";

export default function SingleProductClient({ item }: any) {
  const firstVariant = item?.variants?.[0] || null;

  const [selectedColor, setSelectedColor] = useState("yellow");
  const [loading, setLoading] = useState(true);

  const [currentVariant, setCurrentVariant] = useState(firstVariant);
  const [currentImage, setCurrentImage] = useState(
    firstVariant?.files?.[0]?.fileUrl || item?.files?.[0]?.fileUrl || "",
  );

  const [selectedThumbnail, setSelectedThumbnail] = useState<{
    variantId?: number;
    fileUrl: string;
  }>({
    variantId: firstVariant?.id,
    fileUrl:
      firstVariant?.files?.[0]?.fileUrl || item?.files?.[0]?.fileUrl || "",
  });
  const [isSelectedHeart, setIsSelectedHeart] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(5);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // 1024px = lg breakpoint
    };

    // بررسی اولیه هنگام لود
    checkScreenSize();

    // افزودن event listener برای تغییر سایز
    window.addEventListener("resize", checkScreenSize);

    // تمیز کردن event listener
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (item) {
      setLoading(false); // وقتی item آماده شد
    }
  }, [item]);

  const colors = [
    { name: "yellow", hex: "bg-yellow-400" },
    { name: "red", hex: "bg-red-400" },
  ];
  const [quantity, SetQuantity] = useState(1);

  const handleToggle = () => {
    setIsSelectedHeart(!isSelectedHeart);
  };

  return (
    // single page parent
    <div className="container mx-auto px-3">
      {/* product card */}
      <div className="container m-auto flex flex-wrap">
        {/* product content */}
        <div className="w-full lg:w-7/12 xl:w-6/12 flex flex-col lg:flex-row">
          <div className="w-full lg:w-[17%] h-[50vh] h-auto lg:h-[500px] xl:h-[550px] 2xl:h-[620px] pt-3 lg:pt-0 lg:pl-3 order-2 lg:order-1">
            <Swiper
              className="h-full mySwiper"
              modules={[FreeMode]}
              direction={isLargeScreen ? "vertical" : "horizontal"}
              freeMode={true}
              slidesPerView={isLargeScreen ? 5 : 3}
              spaceBetween={0}
              breakpoints={{
                499: { slidesPerView: 4 },
                640: { slidesPerView: 4 },
                768: { slidesPerView: 4.5 },
              }}
            >
              {/* عکس‌های اصلی محصول */}
              {item?.files?.map((file: any, index: number) => (
                <SwiperSlide key={`main-${index}`}>
                  <button
                    onClick={() => {
                      setCurrentImage(file.fileUrl);
                      setCurrentVariant(firstVariant);
                      setSelectedThumbnail({ fileUrl: file.fileUrl });
                    }}
                    className={`border-2 rounded-lg
                                ${
                                  selectedThumbnail.fileUrl === file.fileUrl &&
                                  selectedThumbnail.variantId === undefined
                                    ? "border-light-myBrown"
                                    : "border-gray-50"
                                } overflow-hidden aspect-square relative w-full`}
                  >
                    <Image
                      src={file.fileUrl || "/temp.jpg"}
                      alt={`Main Image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="object-cover w-full h-full"
                    />
                  </button>
                </SwiperSlide>
              ))}
              {/* عکس‌های variant */}
              {item?.variants?.map((variant: any, index: any) => {
                const filesToShow = variant?.files?.length
                  ? variant.files
                  : [{ fileUrl: "/temp.jpg" }];

                return filesToShow.map((file: any, index1: any) => (
                  <SwiperSlide key={`v-${index}-f-${index1}`}>
                    <button
                      onClick={() => {
                        setCurrentImage(file.fileUrl);
                        setCurrentVariant(variant);
                        setSelectedThumbnail({
                          variantId: variant.id,
                          fileUrl: file.fileUrl,
                        });
                      }}
                      className={`border-2 rounded-lg
                                ${
                                  selectedThumbnail.fileUrl === file.fileUrl &&
                                  selectedThumbnail.variantId === variant.id
                                    ? "border-light-myBrown"
                                    : "border-gray-50"
                                } overflow-hidden aspect-square relative w-full`}
                    >
                      <Image
                        src={file.fileUrl || "/temp.jpg"}
                        alt={`Thumbnail ${index1 + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="object-cover w-full h-full"
                      />
                    </button>
                  </SwiperSlide>
                ));
              })}
            </Swiper>
          </div>
          <div className="relative aspect-square w-full lg:w-[83%] lg:h-[500px] xl:h-[550px] 2xl:h-[620px] order-1 lg:order-2">
            <Image
              className="w-full h-full object-cover"
              fill
              src={currentImage || "/temp.jpg"}
              alt=""
            />
            {currentImage}
          </div>
        </div>

        <div className="w-full lg:w-5/12 xl:w-6/12 ps-0 lg:ps-16 md:ps-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-semibold">{item.slug}</div>
            <div
              onClick={handleToggle} // Handle click to toggle state
              className={`w-[50px] h-[50px] cursor-pointer rounded-full my-2 flex items-center justify-center border border-light-myGray  hover:bg-light-myBrown transition duration-300 ease-in ${
                isSelectedHeart
                  ? "bg-light-myWhite text-light-myBrown hover:text-light-myWhite"
                  : "text-light-myBlack bg-light-myWhite hover:text-light-myWhite"
              }`}
            >
              {/* Hidden Checkbox */}
              <input
                type="checkbox"
                checked={isSelectedHeart}
                onChange={handleToggle} // Keep the state in sync
                className="hidden"
              />
              <FontAwesomeIcon
                className={`text-[20px] font-thin`}
                icon={isSelectedHeart ? solidHeart : faHeart}
                width={25}
                height={25}
              />
            </div>
          </div>
          <h3>{currentVariant?.name}</h3>
          <div className="text-l font-normal mt-2 ">
            {formatPriceNumber(currentVariant?.price)} ریال
          </div>
          <div className="mt-14 border border-b-light-textGray2/5"></div>
          <p className="mt-6 text-light-textGray1">{currentVariant?.desc}</p>
          <div>{/* count component */}</div>
          {/* extra link button component */}
          <div className="w-full mt-8 flex justify-start">
            <div className="w-full xl:w-[70%] flex justify-between items-center">
              <a
                className="text-xs px-2 xl:text-sm xl:px-0 font-semibold text-light-myBlack hover:text-light-myBrown "
                href=""
              >
                راهنمای سایز
              </a>
              <a
                className="text-xs px-2 xl:text-sm xl:px-0 font-semibold text-light-myBlack hover:text-light-myBrown "
                href=""
              >
                تحویل و برگشت
              </a>
              <a
                className="text-xs px-2 xl:text-sm xl:px-0 font-semibold text-light-myBlack hover:text-light-myBrown "
                href=""
              >
                یک سوال بپرسید
              </a>
            </div>
          </div>
          {/* switch color component */}
          <div className="mt-8">
            <div className="w-[50%] flex items-center">
              <div className="w-[12%] border-0 border-b border-b-black">
                <p className="mb-1">رنگ</p>
              </div>

              <div className="flex mr-6">
                {colors.map((color) => (
                  <button
                    key={color?.name}
                    className={`w-6 h-6 rounded-full ${
                      color.hex
                    } transition-all duration-200 mx-1 ${
                      selectedColor === color?.name
                        ? "ring-1 ring-slate-300"
                        : "ring-0"
                    } border-2 border-white`}
                    onClick={() => setSelectedColor(color.name)}
                  ></button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex w-full mx-auto gap-2">
            {/* Quantity Selector */}
            <div className="h-[55px] flex items-center border-2 border-gray-200 flex-[1]">
              <div className="flex flex-col border-l-2 border-gray-200 h-full">
                <button
                  className="h-1/2 px-2 text-sm text-gray-800 hover:text-light-myBrown flex items-center justify-center border-b-2 border-gray-200"
                  onClick={() => SetQuantity((prev) => prev + 1)}
                >
                  ▲
                </button>
                <button
                  className="h-1/2 px-2 text-sm text-gray-800 hover:text-light-myBrown disabled:opacity-50 flex items-center justify-center"
                  onClick={() => SetQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  ▼
                </button>
              </div>
              <div className="px-3 text-lg font-medium text-center w-full">
                {quantity}
              </div>
            </div>

            {/* Add to Cart Button */}
            <MyButton
              variant="style3"
              text="اضافه کردن به سبد خرید"
              href="/cart"
              width="flex-[4]"
            />
          </div>
          <div className="my-6 flex w-full">
            {/* buy now button */}
            <MyButton
              variant="style2"
              text="الان بخر"
              width="w-1/2"
              href="/checkout"
            />
          </div>
          <div className="border border-b-light-textGray2/5"></div>
        </div>
      </div>

      {/* Featured Icon */}
      <div className="container m-auto grid grid-cols-1 px-2 lg:px-0 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
        <div className="flex flex-col justify-center items-center px-5 py-4 border border-light-textGray1/20">
          <BsShieldCheck className="text-4xl text-light-myBrown" />
          <p className="mt-4 text-sm tracking-widest">100% SECRUE CHECKOUT</p>
        </div>
        <div className="flex flex-col justify-center items-center px-5 py-4 border border-light-textGray1/20">
          <RiVerifiedBadgeLine className="text-4xl text-light-myBrown" />
          <p className="mt-4 text-sm tracking-widest">24 MONTH WARRANTY</p>
        </div>
        <div className="flex flex-col justify-center items-center px-5 py-4 border border-light-textGray1/20">
          <MdOutlineFeaturedPlayList className="text-4xl text-light-myBrown" />
          <p className="mt-4 text-sm tracking-widest">FREE 60-DAY RETURNS</p>
        </div>
        <div className="flex flex-col justify-center items-center px-5 py-4 border border-light-textGray1/20">
          <PiAirplaneTiltLight className="text-4xl text-light-myBrown" />
          <p className="mt-4 text-sm tracking-widest">WORLDWIDE SHIPPING</p>
        </div>
      </div>

      <SinglePageTabSelector />
      <div className="px-[60px]">
        <SlickSlider />
      </div>

      <FooterProducts />

      {/* <AddCartPopup /> */}
    </div>
  );
}
