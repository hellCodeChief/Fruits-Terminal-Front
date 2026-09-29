"use client";
import React, { useRef } from "react";
import { Carousel } from "antd";
import type { CarouselRef } from "antd/lib/carousel";
import { RiArrowLeftWideLine, RiArrowRightWideLine } from "react-icons/ri";
import Image from "next/image";

export default function LandingCarousel() {
  const carouselRef = useRef<CarouselRef>(null);

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  // Function to go to the previous slide
  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  return (
    <div className="relative">
      {/* NEXT BTN */}
      <div
        onClick={handleNext}
        className="h-[30%] flex items-center absolute z-10 top-[50%] translate-y-[-50%] rtl:left-[50px] ltr:right-[50px] ltr:rotate-180 cursor-pointer duration-200 hover:scale-[130%]"
      >
        <RiArrowLeftWideLine className="text-[60px] text-light-myWhite" />
      </div>
      {/* PREV BTN */}
      <div
        onClick={handlePrev}
        className="h-[30%] flex items-center absolute z-10 top-[50%] translate-y-[-50%] ltr:left-[50px] rtl:right-[50px] ltr:rotate-180 cursor-pointer duration-200 hover:scale-[130%]"
      >
        <RiArrowRightWideLine className="text-[60px] text-light-myWhite" />
      </div>
      <Carousel
        ref={carouselRef}
        autoplay
        autoplaySpeed={3000}
        infinite
        className="w-full h-max"
      >
        <div className="h-[450px]">
          <Image
            className="w-full h-full object-cover object-center"
            width={1920}
            height={900}
            src="/slider1.png"
            alt=""
          />
        </div>
        <div className="h-[450px]">
          <Image
            className="w-full h-full object-cover object-center"
            width={1920}
            height={900}
            src="/slider2.png"
            alt=""
          />
        </div>
        <div className="h-[450px]">
          <Image
            className="w-full h-full object-cover object-center"
            width={1920}
            height={900}
            src="/slider3.png"
            alt=""
          />
        </div>
        <div className="h-[450px]">
          <Image
            className="w-full h-full object-cover object-center"
            width={1920}
            height={900}
            src="/slider4.png"
            alt=""
          />
        </div>
      </Carousel>
    </div>
  );
}
