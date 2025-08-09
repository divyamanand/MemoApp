import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  useTheme,
  Surface,
  Button as PaperButton,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import TextInputField from '../../components/TextInputField';
import { useAppDispatch } from '@/src/store/hooks';
import { loginUser } from '@/src/features/auth/authActions';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/src/constants/types';

const LoginScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Add proper typing
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    try {
      setLoading(true);
      await dispatch(loginUser({ email, password }));
    } catch (error) {
      console.log('Login Failed', error);
      // TODO: Show toast notification
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email.length > 0 && password.length > 0;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.appTitle, { color: colors.primary }]}>
              StudySmart
            </Text>
            <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
              Sign in to continue learning
            </Text>
          </View>

          {/* Login Form */}
          <Surface
            style={[styles.formCard, { backgroundColor: colors.surface }]}
            elevation={1}
          >
            <Text style={[styles.formTitle, { color: colors.onSurface }]}>
              Welcome Back
            </Text>

            <View style={styles.inputContainer}>
              <TextInputField
                label="Email"
                value={email}
                onChangeText={setEmail}
                leftIcon="email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInputField
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                leftIcon="lock"
                rightIcon={showPassword ? 'eye-off' : 'eye'}
                onRightIconPress={() => setShowPassword(!showPassword)}
                autoComplete="password"
              />
            </View>

            <PaperButton
              mode="contained"
              onPress={handleLogin}
              disabled={!isFormValid || loading}
              loading={loading}
              style={[styles.loginButton, { backgroundColor: colors.primary }]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </PaperButton>

            {/* Forgot Password */}
            <PaperButton
              mode="text"
              onPress={() => {
                // TODO: Navigate to forgot password
              }}
              style={styles.forgotButton}
              labelStyle={[styles.forgotLabel, { color: colors.primary }]}
            >
              Forgot Password?
            </PaperButton>
          </Surface>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <Divider
              style={[styles.divider, { backgroundColor: colors.outline }]}
            />
            <Text
              style={[styles.dividerText, { color: colors.onSurfaceVariant }]}
            >
              OR
            </Text>
            <Divider
              style={[styles.divider, { backgroundColor: colors.outline }]}
            />
          </View>

          {/* Sign Up Section */}
          <Surface
            style={[styles.signupCard, { backgroundColor: colors.surface }]}
            elevation={0}
          >
            <Text
              style={[styles.signupText, { color: colors.onSurfaceVariant }]}
            >
              {`Don't have an account?`}
            </Text>
            <PaperButton
              mode="outlined"
              onPress={() => navigation.navigate('Register')} // This should now work
              style={[styles.signupButton, { borderColor: colors.primary }]}
              labelStyle={[styles.signupLabel, { color: colors.primary }]}
            >
              Create Account
            </PaperButton>
          </Surface>

          {/* Loading Overlay */}
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  formCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 12,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  forgotButton: {
    alignSelf: 'center',
  },
  forgotLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
  },
  signupCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  signupText: {
    fontSize: 14,
    fontWeight: '500',
  },
  signupButton: {
    borderRadius: 12,
    borderWidth: 1.5,
  },
  signupLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default LoginScreen;
