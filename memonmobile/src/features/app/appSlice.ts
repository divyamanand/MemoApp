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
  tags: string[];
  firstLogin: boolean;
}

const initialState: AppState = {
  userInfo: undefined,
  tokenValid: false,
  firstLogin: true,
  tags: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      state.tokenValid = true;
    },
    resetUser: () => ({ ...initialState }),
    addTags: (state, action: PayloadAction<string[]>) => {
      state.tags = [...new Set([...state.tags, ...action.payload])];
    },
    finishOnboarding: (state) => {
      state.firstLogin = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<UserInfo>) => {
          state.userInfo = action.payload;
          state.tokenValid = true;
          state.firstLogin = true;
        },
      )
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<UserInfo>) => {
          state.userInfo = action.payload;
          state.tokenValid = true;
          state.firstLogin = false;
        },
      );
  },
});

export const { setCredentials, resetUser, addTags, finishOnboarding } =
  appSlice.actions;
export default appSlice.reducer;
