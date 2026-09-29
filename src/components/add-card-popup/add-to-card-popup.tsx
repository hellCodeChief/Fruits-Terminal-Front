import { TiTick } from "react-icons/ti";


function CartModal() {
    return (
        <div className="bg-black/45 z-[100] bottom-0 top-0 left-0 right-0 fixed w-full h-screen flex justify-center items-center">
            <div className="w-[700px] grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_1fr] bg-white">
                <div className="border-2 border-green-400 flex justify-center">
                    Right Top
                </div>
                <div className="border-2 border-green-400 flex justify-center">
                    <div className="border-2 border-orange-300 w-full flex justify-evenly items-center px-8">
                        <p className="text-light-redColor font-normal">با موفقیت به سبد خرید اضافه شد</p>
                        <TiTick className="text-light-redColor"/>
                    </div>
                </div>
                <div className="border-2 border-green-400 md:col-span-2 flex justify-center">
                    Bottom 
                </div>
            </div>
        </div>
    );
}

export default CartModal;