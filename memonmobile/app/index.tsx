import { Redirect } from 'expo-router'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logoutUser } from '@/features/auth/authActions'
import { useAccessToken } from '@/hooks/useGetAndRefreshToken'
import { useGetUserDetailsQuery } from '@/service/auth'
import { useRefreshAccessToken } from '@/hooks/useRefreshAccessToken'
import { setCredentials } from '@/features/auth/authSlice'
import { Text } from 'react-native'
import { Provider } from 'react-redux'
import store from '@/store/store'
import { NavigationContainer } from '@react-navigation/native'
import AppNavigator from './navigation/AppNavigator'
import "./global.css"

export default function index() {
  // const { success } = useAppSelector(state => state.auth)
  // const dispatch = useAppDispatch()
  // useAccessToken()
  // useRefreshAccessToken()
  
  // const { data, isSuccess, isError } = useGetUserDetailsQuery(undefined, { skip: !success })

  // useEffect(() => {
  //   if (isError) {
  //     dispatch(logoutUser())
  //   } else if (isSuccess && data) {
  //     dispatch(setCredentials(data))
  //   }
  // }, [data, isError, isSuccess, dispatch])

  // if (isSuccess) {
  //   return <Redirect href="/tabs/home" />
  // }

  // if (isError || !success) {
  //   return <Redirect href="/auth/login" />
  // }

  // return <Text className='justify-center align-middle'>loading</Text>

  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator/>
      </NavigationContainer>
    </Provider>
  )
}
