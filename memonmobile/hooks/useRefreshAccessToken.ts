import { useEffect } from "react"
import { useUpdateAccessTokenMutation } from "@/service/auth"
import { setAccessToken } from "@/features/auth/authSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import * as SecureStorage from "expo-secure-store"
import { logoutUser } from "@/features/auth/authActions"

export const useRefreshAccessToken = () => {
  const dispatch = useAppDispatch()
  const [updateAccessToken] = useUpdateAccessTokenMutation()
  const {accessToken} = useAppSelector(state => state.auth)

  useEffect(() => {

    if (!accessToken) return

    const interval = setInterval(async () => {
      try {
        const data = await updateAccessToken().unwrap()
        const newAccessToken = data?.data.accessToken 
        if (newAccessToken) {
          await SecureStorage.setItemAsync("accessToken", newAccessToken)
          dispatch(setAccessToken(newAccessToken))
        }
      } catch (err) {
        dispatch(logoutUser())
      }
    }, 15 * 60 * 1000)

    return () => clearInterval(interval)
  }, [dispatch, updateAccessToken])
}
