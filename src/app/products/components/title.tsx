export default function FilterTitle({ titleText }: { titleText: string }) {
  return (
    <div className="flex justify-center items-center border-r-4 border-black py-2 mt-7 mb-4">
      <span className="whitespace-nowrap mx-3">{titleText}</span>
      <span className="w-full h-[1px] bg-[#e6e6e6]"></span>
    </div>
  );
}
