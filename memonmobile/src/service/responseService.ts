import { AxiosResponse } from "axios"
import { ApiResponse } from "../constants/types"

export const handleApiResponse = (res: AxiosResponse): ApiResponse => {
  return {
    statusCode: res.status,
    data: res.data?.data ?? {},
    message: res.data?.message ?? res.statusText ?? "Response received",
    success: res.data?.success ?? true
  }
}
