import { Input, Button } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  increaseItemHelper,
  decreaseItemHelper,
  removeItemHelper,
} from "@/components/utils/helper/basketHelper";
import { formatNumber } from "@/components/utils/format-number";

type BasketItem = any;

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function BasketTableCard({ item }: { item: BasketItem }) {
  const dispatch = useDispatch();
  const basket = useSelector((state: RootState) => state.basket.items);

  const handleIncrease = async () => {
    await increaseItemHelper(basket, item.productVariantId, dispatch);
  };

  const handleDecrease = async () => {
    await decreaseItemHelper(basket, item.productVariantId, dispatch);
  };

  const handleDelete = async () => {
    await removeItemHelper(basket, item.productVariantId, dispatch);
  };
  return (
    <div>
      <div className="flex flex-wrap border p-2">
        {/* 1 bLOCK */}
        <div className="w-full flex flex-row md:flex-row-reverse justify-between md:justify-end md:w-5/12 items-between">
          <div className="flex flex-col justify-between">
            <div className="block md:hidden font-bold">مشخصات محصول:</div>
            <div className="flex flex-col justify-center md:ms-3">
              <span className="text-light-textGray1">
                {item.productVariant.name}
              </span>
              {/* <span>{item.productVariant.desc}</span> */}
            </div>
          </div>
          <figure className="border w-[100px] h-[100px]">
            <img
              src={
                item?.productVariant?.files?.length > 0
                  ? `${BASE_URL}/files/${item.productVariant.files[0].id}/product-variant`
                  : "/temp.jpg"
              }
              className="w-full h-full object-cover"
              alt={item?.productVariant?.name || "product image"}
            />
          </figure>
        </div>
        {/* 2 bLOCK */}
        <div className="w-full flex justify-between md:justify-center items-center md:w-2/12">
          <span className="block md:hidden text-light-textGray1">قیمت:</span>
          <span className="text-light-textGray1">
            {formatNumber(item.productVariant.price)}
          </span>
        </div>
        {/* 3 bLOCK */}
        <div className="w-full flex justify-between md:justify-center items-center md:w-2/12">
          <span className="block md:hidden">تعداد:</span>
          <div className="w-1/6 md:w-2/3 flex flex-row-reverse items-stretch">
            <Input
              value={item.quantity}
              readOnly
              className="w-16 text-center"
              style={{ borderRadius: 0 }}
            />

            <div className="flex flex-col min-w-[40px] mid:min-w-[80px]">
              <Button
                type="default"
                icon={<PlusOutlined />}
                className="rounded-none flex-1 text-lg"
                style={{ borderRadius: 0, padding: 0, width: "100%" }}
                onClick={handleIncrease}
              />
              <Button
                type="default"
                icon={<MinusOutlined />}
                className="rounded-none flex-1 text-lg"
                style={{ borderRadius: 0, padding: 0, width: "100%" }}
                onClick={handleDecrease}
              />
            </div>
          </div>
        </div>
        {/* 4 bLOCK */}
        <div className="w-full flex justify-between md:justify-center items-center md:w-2/12">
          <span className="block md:hidden text-light-textGray1">
            جمع قیمت:
          </span>
          <span className="text-light-textGray1">
            {formatNumber(item.rowTotal)}
          </span>
        </div>
        {/* 5 bLOCK */}
        <div className="w-full flex justify-center items-center md:w-1/12">
          <button
            className="flex justify-center items-center hover:text-light-myBrown text-[18px]"
            onClick={handleDelete}
          >
            <RiDeleteBin6Line />
          </button>
        </div>
      </div>
    </div>
  );
}
