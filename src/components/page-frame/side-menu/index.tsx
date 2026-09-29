import { RiMenu3Fill } from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { useState } from "react";
import SideContentLogin from "./login";
import SideContentMenu from "./menu";

export default function MenuSideContent() {
  const [isMenu, setIsMenu] = useState(true);
  return (
    <div className="w-full h-full flex flex-col">
      <header className="flex h-[55px]">
        <button
          onClick={() => setIsMenu(true)}
          className={`w-full h-full border flex justify-center items-center duration-300 ${
            isMenu
              ? "bg-light-myBlack text-light-myWhite border-light-myBlack"
              : "bg-light-myWhite text-light-myBlack border-light-textGray2"
          }`}
        >
          <RiMenu3Fill className="text-[24px]" />
          <span className="pb-1 ps-3">منو</span>
        </button>
        <button
          onClick={() => setIsMenu(false)}
          className={`w-full h-full border border-light-textGray2 flex justify-center items-center duration-300 ${
            isMenu
              ? "bg-light-myWhite text-light-myBlack border-light-textGray2"
              : "bg-light-myBlack text-light-myWhite border-light-myBlack"
          }`}
        >
          <FiUser className="text-[24px]" />
          <span className="pb-1 ps-3">ورود</span>
        </button>
      </header>
      <main className="flex-grow relative overflow-hidden">
        {/* SIDE MENU Content */}
        {isMenu && <SideContentMenu />}
        {/* SIDE LOGIN Content */}
        {!isMenu && <SideContentLogin />}
      </main>
    </div>
  );
}
