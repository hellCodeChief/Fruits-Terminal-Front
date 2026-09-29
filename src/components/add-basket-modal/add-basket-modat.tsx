"use client";

import React, { useEffect, useState } from "react";
import { Modal, InputNumber, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { addToBasketHelper } from "@/components/utils/helper/basketHelper";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AddToBasketModal({
  open,
  setOpen,
  product,
  onAdded,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  product: any;
  onAdded?: (res?: any) => void;
}) {
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // get basket from Redux store
  const basket = useSelector((state: RootState) => state.basket.items);

  useEffect(() => {
    if (open && product?.variants?.length) {
      setSelectedVariant(product.variants[0]);
    }
  }, [open, product]);

  const handleSubmit = async () => {
    if (!selectedVariant) {
      message.warning("یک ورینت انتخاب کنید");
      return;
    }

    try {
      setLoading(true);

      const data = await addToBasketHelper(
        basket,
        selectedVariant,
        quantity,
        dispatch
      );

      message.success("✅ با موفقیت به سبد خرید اضافه شد");
      setOpen(false);
      onAdded?.(data);
    } catch (err) {
      console.error(err);
      message.error("❌ خطا در افزودن محصول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      onOk={handleSubmit}
      title="افزودن به سبد خرید"
      okText="افزودن"
      cancelText="بستن"
      confirmLoading={loading}
      width={600}
      style={{ top: 20 }}
    >
      {!product ? (
        <p>هیچ محصولی انتخاب نشده است.</p>
      ) : (
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-lg">ورینت‌ها:</h3>
          <div className="flex flex-wrap gap-3 max-h-[40vh] overflow-y-auto">
            {product.variants?.map((variant: any) => (
              <div
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                className={`border-2 rounded-md p-3 w-[48%] lg:w-[30%] cursor-pointer transition-all ${
                  selectedVariant?.id === variant.id
                    ? "border-light-myBrown bg-light-myWhite/80"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <img
                  src={
                    variant.files?.[0]
                      ? `${BASE_URL}/files/${variant.files[0].id}/product-variant`
                      : "/temp.jpg"
                  }
                  alt={variant.name}
                  className="w-full h-[100px] object-cover rounded mb-2"
                />
                <p className="font-medium">{variant.name}</p>
                <p className="text-sm text-gray-600">
                  قیمت: {variant.price?.toLocaleString()} ریال
                </p>
              </div>
            ))}
          </div>

          {selectedVariant && (
            <div className="border-t pt-3">
              <h4 className="font-semibold text-light-myBrown mb-2">
                ورینت انتخاب‌شده:
              </h4>
              <p>{selectedVariant.name}</p>
              <p>قیمت: {selectedVariant.price?.toLocaleString()} ریال</p>
              <p>موجودی: {selectedVariant.stock}</p>
              <p>توضیحات: {selectedVariant.desc || "—"}</p>
            </div>
          )}

          <div className="border-t pt-3">
            <label className="block mb-1 text-sm font-medium">تعداد:</label>
            <InputNumber
              min={1}
              value={quantity}
              onChange={(v) => setQuantity(v || 1)}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
