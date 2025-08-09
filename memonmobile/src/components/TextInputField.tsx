// In your TextInputField component file
import React from 'react';
import { KeyboardTypeOptions } from 'react-native';
import { TextInput } from 'react-native-paper';

interface TextInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  secureTextEntry?: boolean;
  // Add these missing props:
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  value,
  onChangeText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoComplete,
  ...otherProps
}) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoComplete={autoComplete}
      left={leftIcon ? <TextInput.Icon icon={leftIcon} /> : undefined}
      right={
        rightIcon ? (
          <TextInput.Icon icon={rightIcon} onPress={onRightIconPress} />
        ) : undefined
      }
      {...otherProps}
    />
  );
};

export default TextInputField;
