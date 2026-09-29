import Link from "next/link";

export default function BuyNowBtn({ width = "w-full" }: { width?: string }) {
  return (
    <Link
      href="/"
      className={`${width} h-[44px] flex justify-center items-center lg:w-[60%] text-light-myWhite font-semibold bg-black hover:bg-light-myBrown transition-all duration-200`}
    >
      الان بخر
    </Link>
  );
}
