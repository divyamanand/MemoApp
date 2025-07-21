import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loginUser } from '@/features/auth/authActions'
import { useNavigation } from '@react-navigation/native'

export default function LoginScreen() {
  const {tokenValid } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigation = useNavigation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (tokenValid) {
      navigation.navigate("Dashboard")
    }
  }, [tokenValid])

  const validateEmail = (val) => /^\S+@\S+\.\S+$/.test(val)

  const submitForm = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address')
      return
    }
    if (!password || password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      await dispatch(loginUser({ email: email.toLowerCase(), password }))
    } catch (error) {
      const errorMessage = error?.message || "Something Went Wrong"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 justify-center items-center bg-white px-4">
      {error && <Text className="text-red-500 mb-2">{error}</Text>}
      <Text>{email}{password}</Text>
      {/* Email */}
      <Text className="font-bold mt-2 mb-1 w-full">Email</Text>
      <TextInput
        className="border border-gray-300 rounded px-3 py-2 mb-2 w-full"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <Text className="font-bold mt-2 mb-1 w-full">Password</Text>
      <TextInput
        className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        className={`rounded-lg p-3 w-full items-center justify-center bg-blue-600 ${loading ? 'opacity-60' : ''}`}
        onPress={submitForm}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="white" />
          : <Text className="text-white font-bold text-lg">Login</Text>
        }
      </Pressable>
    </View>
  )
}
