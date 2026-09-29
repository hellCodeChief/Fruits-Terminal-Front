
import React from "react";
import Slider from "react-slick";
import ProductCard from "../product-card/product-card";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "#cea08a" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "#cea08a" }}
      onClick={onClick}
    />
  );
}

export default function SlickSlider() {
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "0",
    slidesToShow: 4,
    speed: 500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <Slider {...settings}>
      <div className="px-1">
        <ProductCard fullWidth='true' />
      </div>
      <div className="px-1">
        <ProductCard fullWidth='true' />
      </div>
      <div className="px-1">
        <ProductCard fullWidth='true' />
      </div>
      <div className="px-1">
        <ProductCard fullWidth='true' />
      </div>
      <div className="px-1">
        <ProductCard fullWidth='true' />
      </div>
      <div className="px-1">
        <ProductCard fullWidth='true' />
      </div>
    </Slider>
  );
}
