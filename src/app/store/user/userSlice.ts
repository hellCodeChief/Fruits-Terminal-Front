import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  accessToken: string | null;
  userInfo: any | null;
}

const initialState: UserState = {
  accessToken: null,
  userInfo: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; userInfo: any }>) {
      state.accessToken = action.payload.token;
      state.userInfo = action.payload.userInfo;
    },
    logout(state) {
      state.accessToken = null;
      state.userInfo = null;
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
