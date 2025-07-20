import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Login Data:', data);
    // dispatch login or call API here
  };

  return (
    <View className="flex-1 px-4 py-6 bg-white">
      <Text className="text-lg font-semibold mb-2">Email</Text>
      <Controller
        control={control}
        name="email"
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'Email is invalid',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-1"
            placeholder="Enter email"
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && <Text className="text-red-500 mb-3">{errors.email.message}</Text>}

      <Text className="text-lg font-semibold mb-2">Password</Text>
      <Controller
        control={control}
        name="password"
        rules={{ required: 'Password is required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-1"
            placeholder="Enter password"
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.password && <Text className="text-red-500 mb-3">{errors.password.message}</Text>}

      <Pressable
        className="bg-blue-600 rounded-lg py-3 mt-4"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white text-center font-semibold">Login</Text>
      </Pressable>
    </View>
  );
};

export default Login;
