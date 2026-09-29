import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import wishlistReducer from "./wishlist/wishlistSlice";
import basketReducer from "./basket/basketSlice";

import { loginSuccess, logout } from "./user/userSlice";
// import { addToWishlist, removeFromWishlist } from './wishlist/wishlistSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    whishlits: wishlistReducer,
    basket: basketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ✅ Explicit re-exports
// export { loginSuccess, logout, addToWishlist, removeFromWishlist };
export { loginSuccess, logout };
