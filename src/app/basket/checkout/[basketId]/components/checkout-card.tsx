import { formatPriceNumber } from "@/components/utils/helper/formatPrice";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CheckoutCard({ item }: { item: any }) {
  return (
    <div className="flex items-stretch p-4">
      <figure className="border w-[64px] h-[64px] bg-light-myWhite p-[2px] rounded-[10px] relative me-3">
        {/* counter span */}
        <span className="absolute top-[-8px] right-[-8px] flex justify-center items-center rounded-md w-[22px] h-[22px] text-white bg-black">
          {item?.quantity}
        </span>
        <img
          src={
            item?.productVariant?.files?.length > 0
              ? `${BASE_URL}/files/${item.productVariant.files[0].id}/product-variant`
              : "/temp.jpg"
          }
          className="w-full h-full object-cover rounded-[10px]"
          alt={item?.productVariant?.name || "product image"}
        />
      </figure>
      <div className="flex flex-1 flex-col justify-center">
        <span className="flex justify-between">
          <span>{item?.productVariant?.name}</span>
          <span>{formatPriceNumber(item.rowTotal)}</span>
        </span>
        <span className="text-light-textGray1">-</span>
      </div>
      {/* <div>Qty: {item.quantity}</div> */}
    </div>
  );
}
