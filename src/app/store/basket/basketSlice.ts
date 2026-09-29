import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductSnapshot {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: string;
  discountPercentage: number;
  calculatedDiscount: string;
  stock: number;
  productId: number;
  desc: string;
  isActive: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface BasketItem {
  id: string;
  basketId: string;
  productVariantId: number;
  quantity: number;
  unitPriceAtAdd: string;
  priceLockedUntil: string | null;
  snapshot: ProductSnapshot;
}

interface BasketState {
  id: string | null;
  userId: string | null;
  status: string | null;
  items: BasketItem[];
  loading: boolean;
  finalAmount: number;
}

const initialState: BasketState = {
  id: null,
  userId: null,
  status: null,
  items: [],
  loading: false,
  finalAmount: 0,
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setBasket(state, action: PayloadAction<Partial<BasketState>>) {
      // مثلاً وقتی کل سبد رو از سرور می‌گیریم
      return { ...state, ...action.payload };
    },
    setItems(state, action: PayloadAction<BasketItem[]>) {
      state.items = action.payload;
    },
    addItem(state, action: PayloadAction<BasketItem>) {
      const existing = state.items.find(
        (i) => i.productVariantId === action.payload.productVariantId
      );
      if (existing) {
        existing.quantity = action.payload.quantity; // یا += بسته به رفتار بک
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearBasket(state) {
      state.id = null;
      state.items = [];
      state.status = null;
      state.userId = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const {
  setBasket,
  setItems,
  addItem,
  removeItem,
  clearBasket,
  setLoading,
} = basketSlice.actions;

export default basketSlice.reducer;
