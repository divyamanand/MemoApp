import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Text,
  useTheme,
  Surface,
  Button as PaperButton,
  ActivityIndicator,
  HelperText,
} from 'react-native-paper';
import TextInputField from '../../components/TextInputField';
import { registerUser } from '@/src/features/auth/authActions';
import { useAppDispatch } from '@/src/store/hooks';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ErrorResponse, RootStackParamList } from '@/src/constants/types';
import { handleError } from '@/src/service/errorService';

export default function RegisterScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (val: string) => /^\S+@\S+\.\S+$/.test(val);

  const isFormValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 6 &&
    confirmPassword.length > 0 &&
    password === confirmPassword &&
    validateEmail(email);

  const getPasswordErrors = () => {
    const errors = [];
    if (password.length > 0 && password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    if (confirmPassword.length > 0 && password !== confirmPassword) {
      errors.push("Passwords don't match");
    }
    return errors;
  };

  const submitForm = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill out all fields');
      return;
    }
    if (!validateEmail(email)) {
      setError('Enter a valid email address');
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await dispatch(
        registerUser({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      ).unwrap();
    } catch (err) {
      const formattedError: ErrorResponse = handleError(err);
      setError(formattedError.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordErrors = getPasswordErrors();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.appTitle, { color: colors.primary }]}>
                StudySmart
              </Text>
              <Text
                style={[styles.subtitle, { color: colors.onSurfaceVariant }]}
              >
                Create your account to start learning
              </Text>
            </View>

            {/* Registration Form */}
            <Surface
              style={[styles.formCard, { backgroundColor: colors.surface }]}
              elevation={1}
            >
              <Text style={[styles.formTitle, { color: colors.onSurface }]}>
                Create Account
              </Text>

              {/* Error Message */}
              {error ? (
                <Surface
                  style={[
                    styles.errorCard,
                    { backgroundColor: colors.errorContainer },
                  ]}
                  elevation={0}
                >
                  <Text
                    style={[
                      styles.errorText,
                      { color: colors.onErrorContainer },
                    ]}
                  >
                    {error}
                  </Text>
                </Surface>
              ) : null}

              {/* Name Field */}
              <View style={styles.inputContainer}>
                <TextInputField
                  label="Full Name"
                  value={name}
                  onChangeText={setName}
                  leftIcon="account"
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>

              {/* Email Field */}
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
                <HelperText
                  type="error"
                  visible={email.length > 0 && !validateEmail(email)}
                >
                  Please enter a valid email address
                </HelperText>
              </View>

              {/* Password Field */}
              <View style={styles.inputContainer}>
                <TextInputField
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  leftIcon="lock"
                  rightIcon={showPassword ? 'eye-off' : 'eye'}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  autoComplete="new-password"
                />
                <HelperText type="info" visible={password.length === 0}>
                  Password must be at least 6 characters
                </HelperText>
              </View>

              {/* Confirm Password Field */}
              <View style={styles.inputContainer}>
                <TextInputField
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  leftIcon="lock-check"
                  rightIcon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onRightIconPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  autoComplete="new-password"
                />
                {passwordErrors.map((errorMsg, index) => (
                  <HelperText key={index} type="error" visible={true}>
                    {errorMsg}
                  </HelperText>
                ))}
              </View>

              {/* Register Button */}
              <PaperButton
                mode="contained"
                onPress={submitForm}
                disabled={!isFormValid || loading}
                loading={loading}
                style={[
                  styles.registerButton,
                  { backgroundColor: colors.primary },
                ]}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </PaperButton>
            </Surface>

            {/* Sign In Section */}
            <Surface
              style={[styles.signinCard, { backgroundColor: colors.surface }]}
              elevation={0}
            >
              <Text
                style={[styles.signinText, { color: colors.onSurfaceVariant }]}
              >
                Already have an account?
              </Text>
              <PaperButton
                mode="outlined"
                onPress={() => navigation.navigate('Login')}
                style={[styles.signinButton, { borderColor: colors.primary }]}
                labelStyle={[styles.signinLabel, { color: colors.primary }]}
              >
                Sign In
              </PaperButton>
            </Surface>

            {/* Loading Overlay */}
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    minHeight: '100%',
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
    textAlign: 'center',
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
  errorCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(211, 47, 47, 0.2)',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  registerButton: {
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
  signinCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  signinText: {
    fontSize: 14,
    fontWeight: '500',
  },
  signinButton: {
    borderRadius: 12,
    borderWidth: 1.5,
  },
  signinLabel: {
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
