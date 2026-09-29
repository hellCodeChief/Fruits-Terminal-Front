import Link from "next/link";

export default function AddToCardBtn({ width = "w-full" }: { width?: string }) {
  return (
    <Link
      href="/"
      className={`${width} h-[55px] text-light-myWhite flex justify-center items-center font-semibold bg-light-myBrown hover:bg-black transition-all duration-200`}
    >
      اضافه کردن به سبد خرید
    </Link>
  );
}
