import Link from "next/link";

export default function BuyBtn() {
  return (
    <Link
      href="/"
      className="block w-[160px] h-[45px] font-bold text-center leading-[38px] border border-light-myWhite bg-light-myWhite text-light-myBrown hover:text-light-myWhite hover:bg-transparent duration-500"
    >
      خرید
    </Link>
  );
}
