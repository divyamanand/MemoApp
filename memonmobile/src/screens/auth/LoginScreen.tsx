import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import TextInputField from '../../components/TextInputField';
import PrimaryButton from '../../components/PrimaryButton';
import Divider from '../../components/Divider';
import { useAppDispatch } from '@/src/store/hooks';
import { loginUser } from '@/src/features/auth/authActions';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      setLoading(true);
      await dispatch(loginUser({ email, password }));
    } catch (error) {
      console.log('login Failed', error);
      // raise toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider>
      <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
          StudySmart
        </Text>
        <TextInputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          leftIcon="email"
        />
        <TextInputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon="lock"
          rightIcon="eye"
          onRightIconPress={() => {}}
        />
        <PrimaryButton label="Login" onPress={handleLogin} />
        <Divider />
        <Text
          style={{ textAlign: 'center' }}
        >{`Don't have an account? Sign Up`}</Text>
      </View>
    </PaperProvider>
  );
};

export default LoginScreen;
