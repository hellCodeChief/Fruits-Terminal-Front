import { addToBasketClient } from "@/components/utils/actionsClient";
import { setBasket } from "@/app/store/basket/basketSlice";

// پاک‌سازی ساختار
export const normalizeItems = (items) =>
  (items || []).map((item) => ({
    productVariantId: item.productVariantId,
    quantity: item.quantity,
  }));

/**
 * 🛒 Add to basket
 */
export const addToBasketHelper = async (
  basket,
  selectedVariant,
  quantity,
  dispatch
) => {
  const current = normalizeItems(basket);

  const exists = current.find((i) => i.productVariantId === selectedVariant.id);

  let finalItems;

  if (exists) {
    finalItems = current.map((i) =>
      i.productVariantId === selectedVariant.id
        ? { ...i, quantity: i.quantity + quantity }
        : i
    );
  } else {
    finalItems = [
      ...current,
      { productVariantId: selectedVariant.id, quantity },
    ];
  }

  // ارسال به بک‌اند
  const res = await addToBasketClient(finalItems);
  const data = await res.json();

  // آپدیت ریداکس
  dispatch(setBasket(data));

  return data;
};

/**
 * ➕ Increase
 */
export const increaseItemHelper = async (basket, variantId, dispatch) => {
  const current = normalizeItems(basket);

  const finalItems = current.map((i) =>
    i.productVariantId === variantId ? { ...i, quantity: i.quantity + 1 } : i
  );

  const res = await addToBasketClient(finalItems);
  const data = await res.json();

  dispatch(setBasket(data));
  return data;
};

/**
 * ➖ Decrease
 */
export const decreaseItemHelper = async (basket, variantId, dispatch) => {
  const current = normalizeItems(basket);

  // آیتم موردنظر را پیدا کن
  const target = current.find((i) => i.productVariantId === variantId);

  // اگر آیتم نبود یا quantity === 1 بود → هیچ کاری نکن
  if (!target || target.quantity === 1) {
    return current;
  }

  const finalItems = current
    .map((i) =>
      i.productVariantId === variantId ? { ...i, quantity: i.quantity - 1 } : i
    )
    .filter((i) => i.quantity > 0); // فقط برای اطمینان

  const res = await addToBasketClient(finalItems);
  const data = await res.json();

  dispatch(setBasket(data));
  return data;
};

/**
 * ❌ Remove item
 */
export const removeItemHelper = async (basket, variantId, dispatch) => {
  const current = normalizeItems(basket);

  const finalItems = current.filter((i) => i.productVariantId !== variantId);

  const res = await addToBasketClient(finalItems);
  const data = await res.json();

  dispatch(setBasket(data));
  return data;
};
