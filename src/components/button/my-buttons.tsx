import Link from "next/link";

type ButtonProps = {
  text: string;
  href?: string;
  variant?: "style1" | "style2" | "style3";
  width?: string;
};

export default function MyButton({
  text,
  href = "/",
  variant = "style1",
  width = "w-full",
}: ButtonProps) {
  let classes = "";

  switch (variant) {
    case "style1":
      classes =
        "block w-[160px] h-[45px] font-bold text-center leading-[38px] border border-light-myWhite bg-light-myWhite text-light-myBrown hover:text-light-myWhite hover:bg-transparent duration-500";
      break;

    case "style2":
      classes = `${width} h-[55px] flex justify-center items-center lg:w-[60%] text-light-myWhite font-semibold bg-black hover:bg-light-myBrown transition-all duration-200`;
      break;

    case "style3":
      classes = `${width} h-[55px] text-light-myWhite flex justify-center items-center font-semibold bg-light-myBrown hover:bg-black transition-all duration-200`;
      break;

    default:
      break;
  }

  return (
    <Link href={href} className={classes}>
      {text}
    </Link>
  );
}
