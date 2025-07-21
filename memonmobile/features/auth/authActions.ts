import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../service/api/api";
import * as SecureStorage from "expo-secure-store";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/v1/user/register", payload);
      const accessToken = data?.data.accessToken;
      await SecureStorage.setItemAsync("accessToken", accessToken);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/v1/user/login", payload);
      console.log(data)
      const accessToken = data?.data.accessToken;
      await SecureStorage.setItemAsync("accessToken", accessToken);
      return data;
    } catch (error) {
      console.log(error);
      // return rejectWithValue(error);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/v1/user/logout", {});
      await SecureStorage.deleteItemAsync("accessToken");
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);
