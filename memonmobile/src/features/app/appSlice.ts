import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { loginUser, logoutUser, registerUser } from '../auth/authActions';

interface UserInfo {
  name?: string;
  email?: string;
  token?: string;
  [key: string]: any;
}

interface AppState {
  userInfo: UserInfo;
  tokenValid: boolean;
}

const initialState: AppState = {
  userInfo: {},
  tokenValid: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      state.tokenValid = true;
    },
    resetUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.fulfilled, () => initialState)
      .addMatcher(
        isAnyOf(registerUser.fulfilled, loginUser.fulfilled),
        (state, action: PayloadAction<any>) => {
          state.userInfo = action.payload;
          state.tokenValid = true;
        },
      );
  },
});

export const { setCredentials, resetUser } = appSlice.actions;
export default appSlice.reducer;
