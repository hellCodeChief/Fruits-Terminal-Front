import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  accessToken: string | null;
  userInfo: any | null;
}

const initialState: UserState = {
  accessToken: null,
  userInfo: null,
};

const whishlistSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; user: any }>) {
      state.accessToken = action.payload.token;
      state.userInfo = action.payload.user;
    },
    logout(state) {
      state.accessToken = null;
      state.userInfo = null;
    },
  },
});

export const { loginSuccess, logout } = whishlistSlice.actions;
export default whishlistSlice.reducer;