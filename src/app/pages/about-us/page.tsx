"use client";

import { IoIosArrowBack } from "react-icons/io";
import { LiaFacebookF } from "react-icons/lia";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa6";
import { Input,Space, Button , Divider } from "antd";

import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import React, { useRef, useState } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules

import { Keyboard, Autoplay,Navigation } from 'swiper/modules';
const ourteam = [
    {
        id:1,
        imgUrl:'/images/ourteam-1-1.jpg',
        fullName:'Adrian Stone',
        work:'Ceo',
        facebook:"#",
        twitter:'#',
        instagram:'#',
        pinterest:"#"
    },
    {
        id:2,
        imgUrl:'/images/ourteam-1-2.jpg',
        fullName:'Ferguson',
        work:'Designer',
        facebook:"#",
        twitter:'#',
        instagram:'#',
        pinterest:"#"
    },
    {
        id:3,
        imgUrl:'/images/ourteam-1-3.jpg',
        fullName:'Saga Norén',
        work:'Developer',
        facebook:"#",
        twitter:'#',
        instagram:'#',
        pinterest:"#"
    },
    {
        id:4,
        imgUrl:'/images/ourteam-1-4.jpg',
        fullName:'Karen Ryan',
        work:'Developer',
        facebook:"#",
        twitter:'#',
        instagram:'#',
        pinterest:"#"
    },

    
]
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

                <h2 className=" text-[46px] mb-3">درباره ما</h2>

                </div>

                <div className="text-[#212529] pt-[6px] pb-[30px] flex justify-center items-center">
                    <a href="/" title="Back to the frontpage" className="text-[#212529] hover:text-light-myBrown ">خانه
                    </a>
                    <IoIosArrowBack />
                    <strong>درباره ما</strong>
                </div>

            </div>
            {/* ----------------------------------------------------------------------------------------- */}

            <div className="container flex flex-row flex-wrap md:flex-nowrap max-w-6xl px-4 mx-auto gap-4">
                
                    <div className="w-[100%] md:w-[50%] px-[15px] pb-[20px] md:pb-[70px]">
                        <Image
                          className="hover:scale-[0.97] transition delay-150 duration-300 ease-in-out"
                          width={1920}
                          height={900}
                          src="/images/about1.1.jpg"
                          alt=""
                        />
                    </div>
                    <div className="px-[15px] pb-[20px] md:pb-[70px] w-[100%] md:w-[50%]  flex flex-col justify-center items-start">
                      
                            <h3 className="text-[30px] mb-[20px]">داستان ما</h3>
                            <p className="before:inline-block before:mb-[2px] before:me-[18px] before:w-[45px] before:h-[2px] before:bg-light-myBrown mb-[16px]">محبوب پراسترس</p>

                            <div className="text-[#969696]">
                                <p className="mb-[16px] text-[15px]">متوس در اینجا حضور دارد، عنصری از آن، همیشه همراه، در حال رشد اما خالص. فضای زندگی آزاد پیش می‌رود. در هر حالتی که هستید، با نفرت یا آرامش، زندگی را تنظیم کنید. حتی در خلوص، با ضرباهنگ لطیف مائوریس، اتحاد وجود دارد.</p>
                                <p className="mb-[16px] text-[15px]">در دنیای گسترده، جایگاه خود را پیدا کن، در آستانه، در فضای زندگی، در لحظه‌ای بی‌پایان، در حقیقتی عادلانه. زندگی متصل است، پیوسته در جریان. در این دنیای پیچیده، طرحی از زندگی شکل می‌گیرد. اجازه بده زندگی، زندگی را در آغوش بگیرد.</p>
                            </div>
                       
                    </div>

            </div>
            {/* ----------------------------------------------------------------------------------------- */}
            <div className="container flex flex-row flex-wrap md:flex-nowrap max-w-6xl px-4 mx-auto gap-4">
                <div className="px-[15px] pb-[20px] md:pb-[70px] w-[100%] md:w-[50%] order-2 md:order-1  flex flex-col justify-center items-start">
                    
                    <h3 className="text-[30px] mb-[20px]">ما که هستیم؟</h3>
                    <p className="before:inline-block before:mb-[2px] before:me-[18px] before:w-[45px] before:h-[2px] before:bg-light-myBrown mb-[16px]">محبوب پراسترس</p>

                    <div className="text-[#969696]">
                        <p className="mb-[16px] text-[15px]">متوس در اینجا حضور دارد، عنصری از آن، همیشه همراه، در حال رشد اما خالص. فضای زندگی آزاد پیش می‌رود. در هر حالتی که هستید، با نفرت یا آرامش، زندگی را تنظیم کنید. حتی در خلوص، با ضرباهنگ لطیف مائوریس، اتحاد وجود دارد.</p>
                        <p className="mb-[16px] text-[15px]">در دنیای گسترده، جایگاه خود را پیدا کن، در آستانه، در فضای زندگی، در لحظه‌ای بی‌پایان، در حقیقتی عادلانه. زندگی متصل است، پیوسته در جریان. در این دنیای پیچیده، طرحی از زندگی شکل می‌گیرد. اجازه بده زندگی، زندگی را در آغوش بگیرد.</p>
                    </div>
                
                 </div> 
                <div className="w-[100%] md:w-[50%] px-[15px] pb-[20px] md:pb-[70px] order-1 md:order-2">
                    <Image
                      className="hover:scale-[0.97] transition delay-150 duration-300 ease-in-out"
                      width={1920}
                      height={900}
                      src="/images/about1.2.jpg"
                      alt=""
                    />
                </div>
            </div>
            {/* ----------------------------------------------------------------------------------------- */}
            <div className="bg-[url(/images/about1.3.jpg)] bg-center bg-cover bg-fixed py-[130px]">
                <div className="container hidden lg:flex justify-center flex-row flex-wrap sm:flex-nowrap max-w-6xl px-4 mx-auto gap-4 text-white">
                    <div className="w-[90%] sm:w-[33%] flex flex-col items-center">
                        <Image
                        className="invert-[1]"
                        width={90}
                        height={90}
                        src="/svg/design.svg"
                        alt=""
                        />
                        <h4 className="pb-[15px] mt-[45px] text-[30px] font-medium">طراحی</h4>
                        <span className="inline-block w-[60px] h-[1px] bg-white  mb-[20px]"></span>
                        <p className="text-center text-[15px] leading-6">متوس در اینجا حضور دارد، عنصری از آن، همیشه همراه. فضای زندگی آزاد پیش می‌رود.</p>
                    </div>
                    <div className="w-[90%] sm:w-[33%] flex flex-col items-center">
                        <Image
                        className="invert-[1]"
                        width={90}
                        height={90}
                        src="/svg/inovation.svg"
                        alt=""
                        />
                        <h4 className="pb-[15px] mt-[45px] text-[30px] font-medium">نوآوری</h4>
                        <span className="inline-block w-[60px] h-[1px] bg-white  mb-[20px]"></span>
                        <p className="text-center text-[15px] leading-6">متوس در اینجا حضور دارد، عنصری از آن، همیشه همراه. فضای زندگی آزاد پیش می‌رود.</p>
                    </div>
                    <div className="w-[90%] sm:w-[33%] flex flex-col items-center">
                        <Image
                        className="invert-[1]"
                        width={90}
                        height={90}
                        src="/svg/journey.svg"
                        alt=""
                        />
                        <h4 className="pb-[15px] mt-[45px] text-[30px] font-medium">سفر</h4>
                        <span className="inline-block w-[60px] h-[1px] bg-white  mb-[20px]"></span>
                        <p className="text-center text-[15px] leading-6">متوس در اینجا حضور دارد، عنصری از آن، همیشه همراه. فضای زندگی آزاد پیش می‌رود.</p>
                    </div>
                </div>
            <div className="lg:hidden">
            <Swiper
                
                slidesPerView={3}
                centeredSlides={false}
                spaceBetween={30}
                loop={true}
                slidesPerGroupSkip={1}
                grabCursor={true}
                keyboard={{
                enabled: true,
                }}
                breakpoints={{
                    300: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                    },
                    500: {
                        slidesPerView: 2,
                        slidesPerGroup: 1,
                    },
                    1024: {
                        slidesPerView: 3,
                        slidesPerGroup: 1,
                    },
                }}
                autoplay={{
                    delay: 4500,
                    disableOnInteraction: false,
                }}
                modules={[Keyboard,Autoplay]}
                className="mySwiper w-[100%]"
            >
            
                    <SwiperSlide>
                    <div className="flex flex-col items-center text-white px-[15px]">
                            <Image
                            className="invert-[1]"
                            width={90}
                            height={90}
                            src="/svg/design.svg"
                            alt=""
                            />
                            <h4 className="pb-[15px] mt-[45px] text-[30px] font-medium">طراحی</h4>
                            <span className="inline-block w-[60px] h-[1px] bg-white  mb-[20px]"></span>
                            <p className="text-center text-[15px] leading-6">متوس در اینجا حضور دارد، عنصری از آن، همیشه همراه. فضای زندگی آزاد پیش می‌رود.</p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                    <div className="flex flex-col items-center text-white px-[15px]">
                            <Image
                            className="invert-[1]"
                            width={90}
                            height={90}
                            src="/svg/inovation.svg"
                            alt=""
                            />
                            <h4 className="pb-[15px] mt-[45px] text-[30px] font-medium">نوآوری</h4>
                            <span className="inline-block w-[60px] h-[1px] bg-white  mb-[20px]"></span>
                            <p className="text-center text-[15px] leading-6">متوس در اینجا حضور دارد، عنصری از آن، همیشه همراه. فضای زندگی آزاد پیش می‌رود.</p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                    <div className="flex flex-col items-center text-white px-[15px]">
                            <Image
                            className="invert-[1]"
                            width={90}
                            height={90}
                            src="/svg/journey.svg"
                            alt=""
                            />
                            <h4 className="pb-[15px] mt-[45px] text-[30px] font-medium">سفر</h4>
                            <span className="inline-block w-[60px] h-[1px] bg-white  mb-[20px]"></span>
                            <p className="text-center text-[15px] leading-6">متوس در اینجا حضور دارد، عنصری از آن، همیشه همراه. فضای زندگی آزاد پیش می‌رود.</p>
                        </div> 
                    </SwiperSlide>
                    
                        
                        
            
                </Swiper>
            </div>
             
           </div>
            {/* ----------------------------------------------------------------------------------------- */}
            <div className="container flex flex-col flex-wrap items-center md:flex-nowrap max-w-6xl px-4 mx-auto gap-4 my-[70px]">
                <div className="text-center title_general">
                    <h3 className="text-[30px] mb-[20px] font-medium">
                    پشت صحنه برندها
                    </h3>
                    <p className="leading-8 mb-[15px]">ما گروهی از رؤیاپردازان همکار هستیم که نوآوری، کنجکاوی و شجاعت در تفکر آزاد را در هر کاری که انجام می‌دهیم، ارج می‌نهیم. ما به کار خود افتخار بی‌حد و اندازه‌ای داریم و با قصد و نیت، عشق را در تار و پود طراحی‌هایمان می‌دوزیم. شاید کوچک باشیم، اما گروهی قدرتمند از افراد بااستعداد هستیم که متعهد به ارائه طراحی‌های شگفت‌انگیز همراه با تصاویری خیره‌کننده هستیم.</p>
                    
                </div>
                <span className="inline-block w-[60px] h-[1px] bg-light-myBrown mb-[20px]"></span>

                <Swiper
               
                    slidesPerView={3}
                    centeredSlides={false}
                    spaceBetween={30}
                    loop={true}
                    slidesPerGroupSkip={1}
                    grabCursor={true}
                    keyboard={{
                    enabled: true,
                    }}
                    breakpoints={{
                        300: {
                            slidesPerView: 1,
                            slidesPerGroup: 1,
                        },
                        500: {
                            slidesPerView: 2,
                            slidesPerGroup: 1,
                        },
                        769: {
                            slidesPerView: 3,
                            slidesPerGroup: 1,
                        },
                    }}
                    autoplay={{
                        delay: 4500,
                        disableOnInteraction: false,
                    }}
                    modules={[Keyboard,Autoplay]}
                    className="mySwiper w-[100%]"
                >
                    {ourteam.map((item) => (
                        <SwiperSlide key={item.id} >
                        <div className="p-[8px] text-center "  >
                            <div className="img_teams">

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
                                    <a href={item.facebook} >
                                    <LiaFacebookF />
                                    </a>
                                </li>
                                <li>
                                    <a href={item.twitter} >
                                    <FaTwitter />
                                    </a>
                                </li>
                                <li>
                                    <a href={item.instagram} >
                                    <FaInstagram />
                                    </a>
                                </li>
                                <li>
                                    <a href={item.pinterest} >
                                    <FaPinterest />
                                    </a>
                                </li>
                                </ul>
                            </div>
                            <div className="info_teams">
                                <h4>
                                <a href="#" className="text-[20px] mb-[12px] font-medium">{item.fullName}</a>
                                
                                </h4>
                                
                                <p className="text-[#969696]">{item.work}</p>
                                
                            </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
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