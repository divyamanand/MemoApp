import axios from "axios"

export const api = axios.create({
    baseURL: process.env.EXPO__PUBLIC_SERVER,
})