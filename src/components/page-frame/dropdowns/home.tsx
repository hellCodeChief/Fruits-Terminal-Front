export default function DropDownHome() {
  return (
    <button className="relative group fz1 font-bold">
      خانه
      <div className="w-[500px] h-[300px] bg-yellow-500 absolute cursor-default top-[200%] left-[50%] translate-x-[-50%] opacity-0 transition-all invisible duration-300 ease-in-out group-hover:opacity-100 group-hover:top-[100%] group-hover:visible"></div>
    </button>
  );
}
