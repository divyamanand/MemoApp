import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { loginUser,logoutUser,registerUser } from './authActions';

interface UserInfo {
  name?: string;
  email?: string;
  token?: string;
  [key: string]: any;
}

interface AuthState {
  userInfo: UserInfo;
  tokenValid: boolean;
}

const initialState: AuthState = {
  userInfo: {},
  tokenValid: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      state.tokenValid = true;
    },
    resetUser: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.fulfilled, 
        () => initialState
      )
      .addMatcher(
        isAnyOf(registerUser.fulfilled, loginUser.fulfilled),
        (state, action: PayloadAction<any>) => {
          state.userInfo = action.payload.user;
          state.tokenValid = true;
        }
      )
  },
});

export const { setCredentials, resetUser } = authSlice.actions;
export default authSlice.reducer;
