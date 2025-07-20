import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

const Register = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    // Call your API or dispatch action here
  };

  return (
    <View className="flex-1 px-4 py-6 bg-white">
      <Text className="text-lg font-semibold mb-2">Name</Text>
      <Controller
        control={control}
        name="name"
        rules={{ required: 'Name is required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-1"
            placeholder="Enter name"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.name && <Text className="text-red-500 mb-3">{errors.name.message}</Text>}

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
        rules={{
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Minimum 6 characters',
          },
        }}
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
        <Text className="text-white text-center font-semibold">Register</Text>
      </Pressable>
    </View>
  );
};

export default Register;
