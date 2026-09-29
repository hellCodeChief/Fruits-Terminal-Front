"use client";
import { TfiYoutube } from "react-icons/tfi";
import { IoIosArrowBack } from "react-icons/io";
import { LiaFacebookF } from "react-icons/lia";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa6";
import { Input,Space, Button  } from "antd";
const { TextArea } = Input;
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import React, { useRef, useState } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules

import { Keyboard, Autoplay,Navigation } from 'swiper/modules';

const instagram = [
    {
        id:1,
        imgUrl:'/images/instagram1.jpg',
        href:'https://www.instagram.com/'
    },
    {
        id:2,
        imgUrl:'/images/instagram2.jpg',
        href:'https://www.instagram.com/'
    },
    {
        id:3,
        imgUrl:'/images/instagram3.jpg',
        href:'https://www.instagram.com/'
    },
    {
        id:4,
        imgUrl:'/images/instagram4.jpg',
        href:'https://www.instagram.com/'
    },
    {
        id:5,
        imgUrl:'/images/instagram5.jpg',
        href:'https://www.instagram.com/'
    },
    {
        id:6,
        imgUrl:'/images/instagram6.jpg',
        href:'https://www.instagram.com/'
    },
    {
        id:7,
        imgUrl:'/images/instagram7.jpg',
        href:'https://www.instagram.com/'
    },
]
export default function aboutUsPage() {

    return( 
        <div className="about-us">
           <div className="text-center py-[65px] md:py-[150px] bg-[url(/images/bg_page.jpg)] bg-center bg-cover mb-[65px]">
                <div className="title-page">

                <h2 className=" text-[46px] mb-3">تماس با ما</h2>

                </div>

                <div className="text-[#212529] pt-[6px] pb-[30px] flex justify-center items-center">
                    <a href="/" title="Back to the frontpage" className="text-[#212529] hover:text-light-myBrown ">خانه
                    </a>
                    <IoIosArrowBack />
                    <strong>تماس با ما</strong>
                </div>

            </div>
            {/* ----------------------------------------------------------------------------------------- */}
            <div className="container  max-w-6xl px-4 xl:px-0 mx-auto">
                <div className="flex flex-row flex-wrap md:flex-nowrap  bg-[#f7f7f7]">
                    <div className="lg:w-[80%] md:w-[90%] m-auto text-center">
                        <div className="flex flex-col items-center py-[30px] px:px-[10px] md:px-[60px]">
                            <h2 className="tracking-[1px] text-[16px] font-medium uppercase pb-[30px]">اطلاعات تماس</h2>
                            <span className="inline-block w-[80px] h-[1px] bg-light-myBrown mb-[35px]"></span>
                            <div className="text-[#969696]">
                            <p className="mb-[16px]">ما محصولی را از دفتر مرکزی شرکت خود در شهر نیویورک نمی فروشیم. اگر می خواهید بازدید کنید، لطفاً ابتدا با تیم خدمات مشتری ما تماس بگیرید.

                            </p>
                            <p className="mb-[16px]">1201 برادوی<br/>
                            سوئیت 600</p>
                            </div>
                            <div className="mt-[60px] mb-[20px]">
                            <a href="mailto:help@example.com" className="text-[20px] md:text-[36px] border-b-2 border-black">help@example.com</a>
                            </div>
                            <div className="flex flex-col items-center">
                            <h2  className="tracking-[1px] font-medium text-[15px] uppercase pb-[30px]">ما را دنبال کنید
                            </h2>
                            <span className="inline-block w-[80px] h-[1px] bg-light-myBrown mb-[35px]"></span>
                            <ul className="flex justify-center items-center mb-[16px]">
                                <li className="px-[5px]">
                                    <a href="" className="inline-flex justify-center items-center w-[45px] h-[45px] border rounded-[50%] text-[27px]"><FaTwitter/></a>
                                </li>
                                <li className="px-[5px]">
                                    <a href="" className="inline-flex justify-center items-center w-[45px] h-[45px] border rounded-[50%] text-[27px]"><FaInstagram/></a>
                                </li>
                                <li className="px-[5px]">
                                    <a href="" className="inline-flex justify-center items-center w-[45px] h-[45px] border rounded-[50%] text-[27px]"><LiaFacebookF/></a>
                                </li>
                                <li className="px-[5px]">
                                    <a href="" className="inline-flex justify-center items-center w-[45px] h-[45px] border rounded-[50%] text-[27px]"><TfiYoutube/></a>
                                </li>
                            </ul>

                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* ----------------------------------------------------------------------------------------- */}
            <div className="container flex flex-row flex-wrap max-w-6xl mx-auto px-[20px] xl:px-0 my-[50px]">
                <div className="w-[100%] flex flex-col items-center justify-center">
                    <h2 className="text-[25px] lg:text-[30px] pb-[20px] test-center">فرم تماس
                    با ما</h2>
                    <span className="inline-block w-[80px] h-[1px] bg-light-myBrown mb-[35px]"></span>
                </div>
                <form className="flex flex-wrap justify-center w-[100%]">
                
                
                    <div className="md:w-[50%] flex flex-col items-start  w-full mb-5 md:pe-[15px]">
                        <label className="w-[25%] flex-auto text-md font-medium text-gray-900 dark:text-white mr-[10px] mb-[15px] after:content-['*'] after:text-red-500 after:ps-[3px]">نام</label>
                        <Input
                        style={{ borderRadius: "0" }}
                        className="h-[60px]"
                        placeholder="نام"
                        />
                    </div> 
                    <div className="md:w-[50%] flex flex-col items-start  w-full mb-5 md:ps-[15px]">
                        <label className="w-[25%] text-md font-medium text-gray-900 dark:text-white mr-[10px] mb-[15px] after:content-['*'] after:text-red-500 after:ps-[3px]">ایمیل</label>
                        <Input
                        style={{ borderRadius: "0" }}
                        className="h-[60px]"
                        placeholder="ایمیل"
                        />

                    </div> 
                    <div className="flex flex-col items-start  w-full mb-5">
                        <label className="w-[25%] text-md font-medium text-gray-900 dark:text-white mr-[10px] mb-[15px] after:content-['*'] after:text-red-500 after:ps-[3px]">پیام شما</label>
                        <TextArea
                        showCount
                        maxLength={100}
                        placeholder="پیام شما"
                        style={{ height: 120 ,  borderRadius: "0"  }}
                        />

                    </div> 
                    <button type="submit" className="text-white bg-black border hover:bg-white hover:text-light-myBrowhover:border-light-myBrown font-medium text-md w-full sm:w-auto px-5 py-4 text-center">ارسال کنید
                    </button>
                </form>
            </div>
            {/* ----------------------------------------------------------------------------------------- */}

            <div className="section-newsletter-v1 py-[120px] bg-[#222222]" >
                <div className="container flex flex-row flex-wrap md:flex-nowrap max-w-6xl px-4 mx-auto">
                    <div className="w-[100%] flex flex-row flex-wrap lg:flex-nowrap items-center"> 
                        <div className="w-[100%] lg:w-[50%]">
                            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start align-center">
                                <Image
                                className=""
                                width={64}
                                height={64}
                                src="/svg/email_newsletter_bg.svg"
                                alt=""
                                />
                                <div className="flex  flex-col items-center md:items-start md:border-s md:ps-[25px] md:ms-[25px]">
                                    <h3 className="title_heading mb-0 text-[#fff] text-[20px] lg:text-[26px]">
                                        <strong>خبرنامه ما! </strong>
                                    </h3>
                                    <p className="mb-0 pt-[5px] text-[#fff] text-[14px] md:text-[15px] lg:text-[18px]" >
                                    فقط یک ثانیه طول می کشد تا اولین کسی باشید که       
                                    <br/>
                                    آخرین اخبار ما را پیدا می کند.
                                    </p>
                                
                                </div>
                            </div>
                        </div>

                        <div className="w-[80%] mx-[auto] lg:w-[50%] mt-[30px] lg:mt-[18px]">
                            <div className="">          
                                <form className="needs-validation form-inline" action="//myshopify.us12.list-manage.com/subscribe/post?u=9ade7b39da179308b891bd263&amp;id=e9dbec7f92" method="post">
                                    <Space.Compact className="w-[100%]">
                                        <Input size="large" defaultValue="آدرس ایمیل شما..." />
                                        <Button size="large" color="default" variant="solid">ارسال کنید
                                        </Button>
                                    </Space.Compact>           
                                </form>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
            {/* ----------------------------------------------------------------------------------------- */}
            <div className="about-instagram">
            <div className="block-title">
                <h3 className="title_insta">ما را در اینستاگرام دنبال کنید
                </h3>
            </div>
            <Swiper
               watchSlidesProgress={true}
               breakpoints={{
                400: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
                769: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                },
                1024: {
                    slidesPerView: 4,
                    slidesPerGroup: 1,
                },
                1200: {
                    slidesPerView: 5,
                    slidesPerGroup: 1,
                },
                1600: {
                    slidesPerView: 6,
                    slidesPerGroup: 1,
                },
               }}
               navigation={true}
               modules={[Keyboard,Navigation]}
               className="mySwiper w-[100%]"
           >
               {instagram.map((item) => (
                   <SwiperSlide key={item.id} >
                   <div className="text-center W-100"   >
                       <div className="hover-images">

                           <a href="#" title="">
                           <Image
                               className="w-100 img-fluid lazyloaded"
                               width={1920}
                               height={900}
                               src={item.imgUrl}
                               alt=""
                               />                  
                           </a>
                           <ul className="social-link">
                           <li>
                               <a href={item.href} >
                               <FaInstagram />
                               </a>
                           </li>
                           </ul>
                       </div>
                    
                       </div>
                   </SwiperSlide>
               ))}
           </Swiper>
            </div>
        </div>
    )
}