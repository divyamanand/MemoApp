import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../service/api/api";
import * as SecureStorage from "expo-secure-store";
import { useResponse } from "@/hooks/useResponse";


const authHandler = async (endpoint: string, payload: any, rejectWithValue: any) => {
  try {
    const response = await api.post(endpoint, payload);
    const { data } = useResponse(response);

    const { accessToken, refreshToken, ...userInfo } = data;

    await SecureStorage.setItemAsync("accessToken", accessToken);
    await SecureStorage.setItemAsync("refreshToken", refreshToken);

    return { accessToken, ...userInfo };
  } catch (error) {
    return rejectWithValue(error);
  }
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    return authHandler("/api/v1/user/login", payload, rejectWithValue);
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    return authHandler("/api/v1/user/register", payload, rejectWithValue);
  }
);



export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/user/logout", {});
      await SecureStorage.deleteItemAsync("accessToken");
      await SecureStorage.deleteItemAsync("refreshToken")
      return response.data;
    } catch (error) {

      return rejectWithValue(error);
    }
  }
);
