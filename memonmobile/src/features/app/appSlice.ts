import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { loginUser, logoutUser, registerUser } from '../auth/authActions';

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  password?: string;

  k_vals: {
    hard: number;
    medium: number;
    easy: number;
    [key: string]: number;
  };

  c_vals: {
    hard: number;
    medium: number;
    easy: number;
    [key: string]: number;
  };

  iterations: {
    hard: number;
    medium: number;
    easy: number;
    [key: string]: number;
  };

  streakCount: number;

  lastPOTDDate?: string;

  currentPOTD: {
    questionId: string;
    assignedAt: string;
    completed: boolean;
  };

  refreshToken?: string;

  createdAt: string;
  updatedAt: string;
}

interface AppState {
  userInfo?: UserInfo;
  tokenValid: boolean;
}

const initialState: AppState = {
  userInfo: undefined,
  tokenValid: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserInfo>) => {
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
        (state, action: PayloadAction<UserInfo>) => {
          state.userInfo = action.payload;
          state.tokenValid = true;
        },
      );
  },
});

export const { setCredentials, resetUser } = appSlice.actions;
export default appSlice.reducer;
