"use client";
import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { ShoppingBasket } from "lucide-react";
import {
  faHeart as solidHeart,
  // faCartShopping,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { imgSrcCreator } from "../utils/helper/imgSrcCreator";
import { formatPriceNumber } from "../utils/helper/formatPrice";
import AddToBasketModal from "../add-basket-modal/add-basket-modat";

export default function ProductCard({
  fullWidth = false,
  item,
}: {
  fullWidth?: boolean;
  item: any;
}) {
  const singleProductData = () => {
    return {
      ...item,
      files: Array.isArray(item?.files)
        ? item.files.map((y: any) => ({
            ...y,
            fileUrl: imgSrcCreator(y.id, "product"),
          }))
        : [],
      variants: Array.isArray(item?.variants)
        ? item.variants.map((x: any) => ({
            ...x,
            files: Array.isArray(x.files)
              ? x.files.map((y: any) => ({
                  ...y,
                  fileUrl: imgSrcCreator(y.id, "product-variant"),
                }))
              : [],
          }))
        : [],
    };
  };

  const rewriteData = singleProductData();

  const [isSelectedHeart, setIsSelectedHeart] = useState(false);
  const [currentImage, setCurrentImage] = useState(
    (Array.isArray(rewriteData?.files) && rewriteData.files[0]?.fileUrl) ||
      "/temp.jpg"
  );
  const [currentVariant, setCurrentVariant] = useState(
    (Array.isArray(item?.variants) && item.variants[0]) || null
  );

  const handleToggle = () => {
    setIsSelectedHeart(!isSelectedHeart);
  };

  const [basketModalOpen, setBasketModalOpen] = useState(false);

  return (
    <div
      className={`group py-4 cursor-pointer ${
        fullWidth
          ? "w-full"
          : "w-3/5 m-auto sm:m-0 sm:w-[40vw] md:w-[36vw] lg:w-[31vw] xl:w-[23vw]"
      }`}
    >
      <Link
        className="relative inline-block overflow-hidden w-full h-[60vw] sm:h-[40vw] md:h-[35vw] lg:h-[30vw] xl:h-[23vw]"
        href={`/products/${rewriteData?.id}`}
      >
        <Image
          fill
          src={currentImage}
          alt={rewriteData?.slug || "product image"}
          className="object-cover"
          sizes="(max-width: 1000px) 400px,
                  (min-width: 1001px) 300px,"
          onError={() => setCurrentImage("/temp.jpg")}
        />
        <div
          className={`flex-col justify-center items-center absolute w-[50px] duration-300 top-[50%] translate-y-[-50%] ease-in rtl:left-[5px] ltr:right-[5px] lg:rtl:left-[-50px] lg:ltr:right-[-50px] rtl:group-hover:left-[5px] ltr:group-hover:right-[5px]`}
        >
          {/* 1st actions btn */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleToggle();
            }}
            className={`w-[50px] h-[50px] cursor-pointer rounded-full my-2 flex items-center justify-center hover:bg-light-myBrown transition duration-300 ease-in ${
              isSelectedHeart
                ? "bg-light-myWhite text-light-myBrown hover:text-light-myWhite"
                : "text-light-myBlack bg-light-myWhite hover:text-light-myWhite"
            }`}
          >
            <input
              type="checkbox"
              checked={isSelectedHeart}
              onChange={handleToggle}
              className="hidden"
            />
            <FontAwesomeIcon
              className={`text-[20px] font-thin`}
              icon={isSelectedHeart ? solidHeart : faHeart}
              width={25}
              height={25}
            />
          </div>
          {/* 2nd actions btn */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setBasketModalOpen(true);
            }}
            className="w-[50px] h-[50px] cursor-pointer rounded-full my-2 flex items-center justify-center text-light-myBlack bg-light-myWhite hover:bg-light-myBrown transition duration-75 hover:text-light-myWhite"
          >
            <ShoppingBasket className="w-6 h-6" />
          </div>
          {/* 3rd actions btn */}
          <div className="w-[50px] h-[50px] cursor-pointer rounded-full my-2 flex items-center justify-center text-light-myBlack bg-light-myWhite hover:bg-light-myBrown transition duration-75 hover:text-light-myWhite">
            <FontAwesomeIcon
              className="text-[20px] font-thin"
              icon={faMagnifyingGlass}
              width={25}
              height={25}
            />
          </div>
        </div>
      </Link>
      <section className="">
        <div className="font-medium mt-[4px]">{rewriteData?.slug}</div>
        <div className="mt-0.5 text-light-myBrown font-bold">
          {currentVariant?.price ? formatPriceNumber(currentVariant?.price) : 0}{" "}
          ریال
        </div>
        <div className="flex gap-2 justify-start mt-4">
          {/* main pic */}
          {Array.isArray(rewriteData?.files) &&
            rewriteData.files.map((file: any, index: any) => (
              <button
                key={`v-${index}`}
                onClick={() => {
                  setCurrentImage(file.fileUrl || "/temp.jpg");
                }}
                className={`w-8 h-8 border-2 ${
                  currentImage === file.fileUrl
                    ? "border-light-myBrown"
                    : "border-gray-300"
                } overflow-hidden`}
              >
                <Image
                  src={file.fileUrl || "/temp.jpg"}
                  alt={`Thumbnail ${index + 1}`}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </button>
            ))}

          {/* variants pic */}
          {Array.isArray(rewriteData?.variants) &&
            rewriteData.variants.map(
              (variant: any, index: any) =>
                Array.isArray(variant.files) &&
                variant.files.map((file: any, index1: any) => (
                  <button
                    key={`v-${index}-f-${index1}`}
                    onClick={() => {
                      setCurrentImage(file.fileUrl || "/temp.jpg");
                      setCurrentVariant(variant);
                    }}
                    className={`w-8 h-8 border-2 ${
                      currentImage === file.fileUrl
                        ? "border-light-myBrown"
                        : "border-gray-300"
                    } overflow-hidden`}
                  >
                    <Image
                      src={file.fileUrl || "/temp.jpg"}
                      alt={`Thumbnail ${index + 1}`}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </button>
                ))
            )}
        </div>
      </section>
      <footer></footer>

      <AddToBasketModal
        open={basketModalOpen}
        setOpen={setBasketModalOpen}
        product={rewriteData}
        onAdded={(res) => console.log("✅ Added to basket:", res)}
      />
    </div>
  );
}
