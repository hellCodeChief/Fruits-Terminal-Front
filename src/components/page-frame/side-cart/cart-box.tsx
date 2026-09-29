import { formatNumber } from "@/components/utils/format-number";
import Link from "next/link";
import { RiDeleteBin6Line } from "react-icons/ri";
import { removeItemHelper } from "@/components/utils/helper/basketHelper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface SideCartBoxProps {
  item: any;
}

export default function SideCartBox({ item }: SideCartBoxProps) {
  const dispatch = useDispatch();
  const basket = useSelector((state: RootState) => state.basket.items);
  const handleDelete = async () => {
    await removeItemHelper(basket, item.productVariantId, dispatch);
  };
  return (
    <div className="flex py-3 border-b border-light-textGray2 gap-2">
      <figure className="w-[90px] h-[90px] shrink-0 rounded-lg overflow-hidden border">
        <img
          src={
            item?.productVariant?.files?.length > 0
              ? `${BASE_URL}/files/${item.productVariant.files[0].id}/product-variant`
              : "/temp.jpg"
          }
          className="w-full h-full object-cover object-center"
          alt={item?.productVariant?.name || "product image"}
        />
      </figure>

      <div className="flex flex-col justify-between flex-grow text-sm">
        <Link
          className="font-semibold text-[15px] hover:text-light-myBrown line-clamp-1"
          href={`#`}
        >
          {item?.productVariant?.name || "—"}
        </Link>

        <div className="text-gray-500">
          <span>تعداد:</span>
          <span className="mx-1 font-medium">{item?.quantity ?? 1}</span>
        </div>

        <span className="font-semibold text-[14px]">
          {formatNumber(item?.productVariant.price || 0)} تومان
        </span>
      </div>

      <button
        className="flex justify-center items-center hover:text-light-myBrown text-[18px]"
        onClick={handleDelete}
      >
        <RiDeleteBin6Line />
      </button>
    </div>
  );
}
