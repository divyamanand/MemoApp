import { createAsyncThunk } from "@reduxjs/toolkit";
// import type { ApiErrorResponse, RegisterPayload, RegisterResponse } from "../../service/Types/authType";
import { api } from "../../service/api/api";
import { useAppSelector } from "@/store/hooks";

export const registerUser = createAsyncThunk(
    "auth/register",
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/api/v1/user/register", payload, {
            headers: { 
                "Content-Type": "application/json" ,
            }
            });
            return data;
        } catch (error) {
            console.log(error)
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
});


export const loginUser = createAsyncThunk(
    "auth/login",
    async (payload, {rejectWithValue}) => {
        try {
            const {data} = await api.post("/api/v1/user/login", payload, {
);
            return data
        } catch (error) {
            console.log(error)
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, {rejectWithValue}) => {
        try {

            const {accessToken} = useAppSelector(state => state.auth)
            const {data} = await api.post("/api/v1/user/logout", {}, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            return data
        } catch (error) {
            console.log(error)
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)