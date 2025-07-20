import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native'
import { registerUser } from '@/features/auth/authActions'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export default function Register() {
  const { loading, userInfo, error, success } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()

  // Local state for all fields:
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (userInfo) console.log(userInfo)
    if (success) {
      Alert.alert('Success', 'Registration successful')
    }
  }, [userInfo, success])

  const validateEmail = val => /^\S+@\S+\.\S+$/.test(val)

  const submitForm = () => {
    // Required fields check
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all fields')
      return
    }
    // Email format
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Enter a valid email address')
      return
    }
    // Password match
    if (password !== confirmPassword) {
      Alert.alert('Error', "Passwords don't match")
      return
    }
    // Password length
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }
    dispatch(registerUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password
    }))
  }

  return (
    <View className="flex-1 justify-center items-center bg-white px-4">
      {error && <Text className="text-red-500 mb-2">{error.message}</Text>}

      {/* Name */}
      <Text className="font-bold mt-2 mb-1 w-full">Name</Text>
      <TextInput
        className="border border-gray-300 rounded px-3 py-2 mb-2 w-full"
        placeholder="Name"
        autoCapitalize="words"
        value={name}
        onChangeText={setName}
      />

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
        className="border border-gray-300 rounded px-3 py-2 mb-2 w-full"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Confirm Password */}
      <Text className="font-bold mt-2 mb-1 w-full">Confirm Password</Text>
      <TextInput
        className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Pressable
        className={`rounded-lg p-3 w-full items-center justify-center bg-blue-600 ${loading ? 'opacity-60' : ''}`}
        onPress={submitForm}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="white" />
          : <Text className="text-white font-bold text-lg">Register</Text>
        }
      </Pressable>
    </View>
  )
}
