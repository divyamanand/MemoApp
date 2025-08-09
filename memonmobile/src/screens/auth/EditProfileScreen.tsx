import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  Surface,
  IconButton,
  Button as PaperButton,
  ActivityIndicator,
  HelperText,
} from 'react-native-paper';
import TextInputField from '../../components/TextInputField';

interface ProfileData {
  name: string;
  email: string;
  password: string;
}

interface EditingState {
  name: boolean;
  email: boolean;
  password: boolean;
}

const EditProfileScreen = () => {
  const { colors } = useTheme();
  
  // Profile data state
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Alex Morgan',
    email: 'alex.morgan@email.com',
    password: '••••••••••',
  });

  // Editing states for each field
  const [editing, setEditing] = useState<EditingState>({
    name: false,
    email: false,
    password: false,
  });

  // Temporary values while editing
  const [tempValues, setTempValues] = useState<ProfileData>({ ...profileData });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Partial<ProfileData>>({});

  const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);
  
  const handleEdit = (field: keyof EditingState) => {
    setEditing(prev => ({ ...prev, [field]: true }));
    setTempValues({ ...profileData });
    setErrors({});
    setSuccessMessage('');
  };

  const handleCancel = (field: keyof EditingState) => {
    setEditing(prev => ({ ...prev, [field]: false }));
    setTempValues({ ...profileData });
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSave = async (field: keyof EditingState) => {
    setErrors({});
    
    // Validation
    if (field === 'name' && tempValues.name.trim().length < 2) {
      setErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }));
      return;
    }
    
    if (field === 'email' && !validateEmail(tempValues.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    }
    
    if (field === 'password' && tempValues.password.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      return;
    }

    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update profile data
      setProfileData(prev => ({ ...prev, [field]: tempValues[field] }));
      setEditing(prev => ({ ...prev, [field]: false }));
      setSuccessMessage('Your profile has been updated.');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      setErrors(prev => ({ ...prev, [field]: `Failed to update. Please try again. ${error}` }));
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    field: keyof ProfileData,
    label: string,
    icon: string,
    isPassword = false
  ) => {
    const isEditing = editing[field];
    const value = isEditing ? tempValues[field] : profileData[field];
    const error = errors[field];

    return (
      <View style={styles.fieldContainer}>
        <Text style={[styles.fieldLabel, { color: colors.onSurface }]}>{label}</Text>
        
        {!isEditing ? (
          <View style={styles.displayRow}>
            <Text style={[styles.fieldValue, { color: colors.onSurfaceVariant }]}>
              {isPassword ? '••••••••••' : value}
            </Text>
            <PaperButton
              mode="text"
              onPress={() => handleEdit(field)}
              labelStyle={[styles.editButtonLabel, { color: colors.primary }]}
              style={styles.editButton}
            >
              Edit
            </PaperButton>
          </View>
        ) : (
          <View style={styles.editContainer}>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <TextInputField
                  label={label}
                  value={tempValues[field]}
                  onChangeText={(text) => setTempValues(prev => ({ ...prev, [field]: text }))}
                  leftIcon={icon}
                  secureTextEntry={isPassword && !showPassword}
                  rightIcon={isPassword ? (showPassword ? "eye-off" : "eye") : undefined}
                  onRightIconPress={isPassword ? () => setShowPassword(!showPassword) : undefined}
                  keyboardType={field === 'email' ? 'email-address' : 'default'}
                  autoCapitalize={field === 'email' ? 'none' : field === 'name' ? 'words' : 'none'}
                />
                {error && (
                  <HelperText type="error" visible={true}>
                    {error}
                  </HelperText>
                )}
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <PaperButton
                mode="outlined"
                onPress={() => handleCancel(field)}
                style={[styles.cancelButton, { borderColor: colors.outline }]}
                labelStyle={{ color: colors.onSurfaceVariant }}
                disabled={loading}
              >
                Cancel
              </PaperButton>
              <PaperButton
                mode="contained"
                onPress={() => handleSave(field)}
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                labelStyle={{ fontWeight: '700' }}
                loading={loading}
                disabled={loading}
              >
                {field === 'password' ? 'Save Password' : 'Save'}
              </PaperButton>
            </View>
          </View>
        )}
        
        {field !== 'password' && <View style={[styles.divider, { backgroundColor: colors.outline }]} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Surface style={[styles.header, { backgroundColor: colors.surface }]} elevation={0}>
        <IconButton
          icon="close"
          size={24}
          iconColor={colors.onSurface}
          onPress={() => {
            // TODO: Navigate back
          }}
        />
        <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </Surface>

      <ScrollView contentContainerStyle={styles.content}>
        {successMessage ? (
          <Surface style={[styles.successCard, { backgroundColor: '#E7F7EE' }]} elevation={0}>
            <Text style={[styles.successText, { color: '#1E7F4B' }]}>Success!</Text>
            <Text style={[styles.successMessage, { color: '#1E7F4B' }]}>{successMessage}</Text>
          </Surface>
        ) : null}

        <Surface style={[styles.formCard, { backgroundColor: colors.surface }]} elevation={1}>
          {renderField('name', 'Name', 'account')}
          {renderField('email', 'Email', 'email')}
          {renderField('password', 'Password', 'lock', true)}
        </Surface>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  successCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CDECDC',
  },
  successText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  successMessage: {
    fontSize: 14,
    fontWeight: '500',
  },
  formCard: {
    borderRadius: 16,
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  displayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 40,
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  editButton: {
    marginLeft: 12,
  },
  editButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  editContainer: {
    gap: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  inputWrapper: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  cancelButton: {
    borderRadius: 12,
    borderWidth: 1.5,
  },
  saveButton: {
    borderRadius: 12,
  },
  divider: {
    height: 1,
    marginTop: 16,
    opacity: 0.2,
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

export default EditProfileScreen;
