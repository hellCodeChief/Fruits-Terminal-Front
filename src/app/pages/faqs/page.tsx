"use client";
import { TfiYoutube } from "react-icons/tfi";
import { IoIosArrowBack } from "react-icons/io";
import { LiaFacebookF } from "react-icons/lia";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa6";
import { Input, Space, Button } from "antd";

import React, { useRef, useState } from "react";

import type { CollapseProps } from "antd";
import { Collapse } from "antd";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
const items: CollapseProps["items"] = [
  {
    key: "1",
    label: "تحویل درب منزل چقدر طول می کشد؟",
    children: (
      <p className="text-[15px] font-normal">
        ما برای ارسال اکثر سفارش‌های خود در بریتانیا از Royal Mail و DHL استفاده
        می‌کنیم. شرکت Euro Car Parts این حق را برای خود محفوظ می‌دارد که در
        شرایط خاص، در صورت منطقی‌تر بودن، از روش ارسال جایگزین استفاده کند.
      </p>
    ),
  },
  {
    key: "2",
    label: "برای ارسال از چه پیکی استفاده می کنید؟",
    children: (
      <p className="text-[15px] font-normal">
        ما برای ارسال اکثر سفارش‌های خود در بریتانیا از Royal Mail و DHL استفاده
        می‌کنیم. شرکت Euro Car Parts این حق را برای خود محفوظ می‌دارد که در
        شرایط خاص، در صورت منطقی‌تر بودن، از روش ارسال جایگزین استفاده کند.
      </p>
    ),
  },
  {
    key: "4",
    label:
      "چرا برای ارسال سفارش من هزینه دریافت شده در حالی که گفته شده ارسال استاندارد رایگان است؟",
    children: (
      <p className="text-[15px] font-normal">
        ما برای ارسال اکثر سفارش‌های خود در بریتانیا از Royal Mail و DHL استفاده
        می‌کنیم. شرکت Euro Car Parts این حق را برای خود محفوظ می‌دارد که در
        شرایط خاص، در صورت منطقی‌تر بودن، از روش ارسال جایگزین استفاده کند.
      </p>
    ),
  },
  {
    key: "5",
    label: "ایمیلی برای ارسال سفارش / تأیید سفارش دریافت نکرده‌ام.",
    children: (
      <p className="text-[15px] font-normal">
        ما برای ارسال اکثر سفارش‌های خود در بریتانیا از Royal Mail و DHL استفاده
        می‌کنیم. شرکت Euro Car Parts این حق را برای خود محفوظ می‌دارد که در
        شرایط خاص، در صورت منطقی‌تر بودن، از روش ارسال جایگزین استفاده کند.
      </p>
    ),
  },
  {
    key: "6",
    label:
      "چرا در وب‌سایت به ما گفته نمی‌شود که قطعات توسط شعبه تحویل داده خواهند شد؟",
    children: (
      <p className="text-[15px] font-normal">
        ما برای ارسال اکثر سفارش‌های خود در بریتانیا از Royal Mail و DHL استفاده
        می‌کنیم. شرکت Euro Car Parts این حق را برای خود محفوظ می‌دارد که در
        شرایط خاص، در صورت منطقی‌تر بودن، از روش ارسال جایگزین استفاده کند.
      </p>
    ),
  },
  {
    key: "7",
    label: "آیا می‌توانم از فروشگاه محلی تحویل بگیرم؟",
    children: (
      <p className="text-[15px] font-normal">
        ما برای ارسال اکثر سفارش‌های خود در بریتانیا از Royal Mail و DHL استفاده
        می‌کنیم. شرکت Euro Car Parts این حق را برای خود محفوظ می‌دارد که در
        شرایط خاص، در صورت منطقی‌تر بودن، از روش ارسال جایگزین استفاده کند.
      </p>
    ),
  },
  {
    key: "8",
    label: "آیا در آخر هفته تحویل می‌دهید؟",
    children: (
      <p className="text-[15px] font-normal">
        ما برای ارسال اکثر سفارش‌های خود در بریتانیا از Royal Mail و DHL استفاده
        می‌کنیم. شرکت Euro Car Parts این حق را برای خود محفوظ می‌دارد که در
        شرایط خاص، در صورت منطقی‌تر بودن، از روش ارسال جایگزین استفاده کند.
      </p>
    ),
  },
  {
    key: "9",
    label: "آیا می‌توانید تأیید کنید که مرجوعی من را دریافت کرده‌اید؟",
    children: (
      <p className="text-[15px] font-normal">
        ما برای ارسال اکثر سفارش‌های خود در بریتانیا از Royal Mail و DHL استفاده
        می‌کنیم. شرکت Euro Car Parts این حق را برای خود محفوظ می‌دارد که در
        شرایط خاص، در صورت منطقی‌تر بودن، از روش ارسال جایگزین استفاده کند.
      </p>
    ),
  },
  {
    key: "10",
    label: "چقدر طول می‌کشد تا مبلغ بازپرداخت را دریافت کنم؟",
    children: (
      <p className="text-[15px] font-normal">
        ما برای ارسال اکثر سفارش‌های خود در بریتانیا از Royal Mail و DHL استفاده
        می‌کنیم. شرکت Euro Car Parts این حق را برای خود محفوظ می‌دارد که در
        شرایط خاص، در صورت منطقی‌تر بودن، از روش ارسال جایگزین استفاده کند.
      </p>
    ),
  },
  {
    key: "11",
    label: "چه کسی هزینه پست مرجوعی را پرداخت می‌کند؟",
    children: (
      <p className="text-[15px] font-normal">
        ما برای ارسال اکثر سفارش‌های خود در بریتانیا از Royal Mail و DHL استفاده
        می‌کنیم. شرکت Euro Car Parts این حق را برای خود محفوظ می‌دارد که در
        شرایط خاص، در صورت منطقی‌تر بودن، از روش ارسال جایگزین استفاده کند.
      </p>
    ),
  },
  {
    key: "12",
    label: "چرا هزینه اولیه ارسال را بازپرداخت نکرده‌اید؟",
    children: (
      <p className="text-[15px] font-normal">
        ما برای ارسال اکثر سفارش‌های خود در بریتانیا از Royal Mail و DHL استفاده
        می‌کنیم. شرکت Euro Car Parts این حق را برای خود محفوظ می‌دارد که در
        شرایط خاص، در صورت منطقی‌تر بودن، از روش ارسال جایگزین استفاده کند.
      </p>
    ),
  },
  {
    key: "13",
    label:
      "آیا به مشتریان خارج از اتحادیه اروپا تخفیف مالیات بر ارزش افزوده (VAT) ارائه می‌دهید؟",
    children: (
      <p className="text-[15px] font-normal">
        ما برای ارسال اکثر سفارش‌های خود در بریتانیا از Royal Mail و DHL استفاده
        می‌کنیم. شرکت Euro Car Parts این حق را برای خود محفوظ می‌دارد که در
        شرایط خاص، در صورت منطقی‌تر بودن، از روش ارسال جایگزین استفاده کند.
      </p>
    ),
  },
];
export default function aboutUsPage() {
  return (
    <div className="about-us">
      <div className="text-center py-[65px] md:py-[150px] bg-[url(/images/bg_page.jpg)] bg-center bg-cover mb-[65px]">
        <div className="title-page">
          <h2 className=" text-[46px] mb-3">سوالات متداول </h2>
        </div>

        <div className="text-[#212529] pt-[6px] pb-[30px] flex justify-center items-center">
          <a
            href="/"
            title="Back to the frontpage"
            className="text-[#212529] hover:text-light-myBrown "
          >
            خانه
          </a>
          <IoIosArrowBack />
          <strong>سوالات متداول</strong>
        </div>
      </div>
      {/* ----------------------------------------------------------------------------------------- */}

      <div className="container mx-auto font-medium">
        <div className="flex flex-col items-start p-[16px] pb-[40px] mb-[24px] border-b">
          <h3 className="text-[30px] mb-[8px]">#سوالات متداول </h3>
          <p className="mb-0 pt-[14px] text-[15px] font-normal">
            من یک بلوک متن هستم. برای ویرایش این متن روی دکمه ویرایش کلیک کنید.
            لورم ایپسوم متن ساختگی است که برای طراحی و صفحه‌آرایی استفاده
            می‌شود.
          </p>
        </div>
        <Collapse
          defaultActiveKey={["1"]}
          size="large"
          ghost
          items={items}
          expandIcon={({ isActive }) =>
            isActive ? (
              <FiMinus className="text-[18px]" />
            ) : (
              <FiPlus className="text-[18px]" />
            )
          }
        />
      </div>
      {/* ----------------------------------------------------------------------------------------- */}
      <div className="border-t pt-[100px] my-[100px]">
        <div className="container flex flex-row flex-wrap max-w-[1140px] mx-auto px-[20px] xl:px-0 ">
          <div className="w-[100%] flex flex-col items-center justify-center">
            <h2 className="text-[20px] lg:text-[25px] font-medium leading-[40px] pb-[20px] text-center">
              هیچ‌گاه بروزرسانی‌های ما در مورد محصولات جدید و پیشنهادات ویژه را
              از دست ندهید.
            </h2>
            <p className="text-center mt-[22px]">
              آخرین اخبار و بروزرسانی‌ها را دریافت کنید.
            </p>
          </div>
          <form className="flex flex-col items-center justify-center w-[100%] w-[80%] mx-auto mt-[40px]">
            <div className="w-[100%]">
              <Input
                style={{ borderRadius: "0" }}
                variant="outlined"
                className="h-[60px] border-b-2"
                placeholder="ایمیل"
              />
            </div>
            <button
              type="submit"
              className="text-white bg-light-myBrown border-light-myBrown hover:bg-black :border-black font-medium text-md w-[100%] px-5 py-4 mt-[24px] text-center"
            >
              اکنون مشترک شوید
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
