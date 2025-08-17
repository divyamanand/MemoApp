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
  IconButton,
} from 'react-native-paper';
import TextInputField from '../../components/TextInputField';

type ResetStep = 'email' | 'password';

const ResetPassword = () => {
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');

  const validateEmail = (val: string) => /^\S+@\S+\.\S+$/.test(val);

  const isEmailValid = email.length > 0 && validateEmail(email);
  const isPasswordValid =
    newPassword.length >= 6 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const handleSendOTP = async () => {
    setError('');
    if (!isEmailValid) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      // TODO: Call your send OTP API here
      // await api.sendResetOTP(email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCurrentStep('password');
    } catch (err) {
      setError(`Failed to send OTP. Please try again. ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    if (!isPasswordValid) {
      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters');
      } else if (newPassword !== confirmPassword) {
        setError("Passwords don't match");
      }
      return;
    }

    try {
      setLoading(true);
      // TODO: Call your reset password API here
      // await api.resetPassword(email, newPassword, otp);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Navigate back to login or show success message
    } catch (err) {
      setError(`Failed to reset password. Please try again. ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'password') {
      setCurrentStep('email');
      setError('');
    }
    // TODO: Navigate back to previous screen if on email step
  };

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
              <IconButton
                icon="arrow-left"
                size={24}
                iconColor={colors.onSurface}
                onPress={handleBack}
                style={styles.backButton}
              />
              <Text style={[styles.appTitle, { color: colors.primary }]}>
                Reset Password
              </Text>
              <Text
                style={[styles.subtitle, { color: colors.onSurfaceVariant }]}
              >
                {currentStep === 'email'
                  ? 'Enter your email to receive a One-Time Password (OTP).'
                  : 'Create a new, secure password for your account.'}
              </Text>
            </View>

            {/* Form Card */}
            <Surface
              style={[styles.formCard, { backgroundColor: colors.surface }]}
              elevation={1}
            >
              {currentStep === 'email' ? (
                <>
                  {/* Email Step */}
                  <View style={styles.inputContainer}>
                    <TextInputField
                      label="Email Address"
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

                  <PaperButton
                    mode="contained"
                    onPress={handleSendOTP}
                    disabled={!isEmailValid || loading}
                    loading={loading}
                    style={[
                      styles.actionButton,
                      { backgroundColor: colors.primary },
                    ]}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </PaperButton>
                </>
              ) : (
                <>
                  {/* Password Step */}
                  <View style={styles.inputContainer}>
                    <TextInputField
                      label="New Password"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!showNewPassword}
                      leftIcon="lock"
                      rightIcon={showNewPassword ? 'eye-off' : 'eye'}
                      onRightIconPress={() =>
                        setShowNewPassword(!showNewPassword)
                      }
                      autoComplete="new-password"
                    />
                    <HelperText type="info" visible={newPassword.length === 0}>
                      Password must be at least 6 characters
                    </HelperText>
                    {newPassword.length > 0 && newPassword.length < 6 && (
                      <HelperText type="error" visible={true}>
                        Password is too short
                      </HelperText>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInputField
                      label="Confirm New Password"
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
                    {confirmPassword.length > 0 &&
                      newPassword !== confirmPassword && (
                        <HelperText type="error" visible={true}>
                          {`Passwords don't match`}
                        </HelperText>
                      )}
                  </View>

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

                  <PaperButton
                    mode="contained"
                    onPress={handleResetPassword}
                    disabled={!isPasswordValid || loading}
                    loading={loading}
                    style={[
                      styles.actionButton,
                      { backgroundColor: colors.primary },
                    ]}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                  >
                    {loading ? 'Resetting Password...' : 'Reset Password'}
                  </PaperButton>
                </>
              )}
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
};

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
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: -8,
    top: -8,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  formCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
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
  actionButton: {
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

export default ResetPassword;
