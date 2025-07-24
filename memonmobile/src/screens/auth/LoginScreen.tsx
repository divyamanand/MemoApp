import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { loginUser } from '@/src/features/auth/authActions';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { ErrorResponse } from '@/src/constants/types';
import { handleError } from '@/src/service/errorService';

type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export default function LoginScreen() {
  const { tokenValid } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (tokenValid) {
      navigation.navigate('Dashboard');
    }
  }, [tokenValid, navigation]);

  const validateEmail = (val: string): boolean => /^\S+@\S+\.\S+$/.test(val);

  const submitForm = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await dispatch(
        loginUser({ email: email.toLowerCase(), password }),
      ).unwrap();
    } catch (err: any) {
      const formattedError: ErrorResponse = handleError(err);
      setError(formattedError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-4">
      {error && <Text className="text-red-500 mb-2">{error}</Text>}

      <Text className="font-bold mt-2 mb-1 w-full">Email</Text>
      <TextInput
        className="border border-gray-300 rounded px-3 py-2 mb-2 w-full"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

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
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold text-lg">Login</Text>
        )}
      </Pressable>
    </View>
  );
}
