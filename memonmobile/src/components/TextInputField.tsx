import React, { useState } from 'react';
import { TextInput, useTheme } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

interface TextInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  leftIcon?: IconSource;
  rightIcon?: IconSource;
  onRightIconPress?: () => void;
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  leftIcon,
  rightIcon,
  onRightIconPress,
}) => {
  const { colors } = useTheme();
  const [secure, setSecure] = useState(secureTextEntry);

  const toggleSecure = () => {
    setSecure(!secure);
    onRightIconPress?.();
  };

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secure}
      left={leftIcon ? <TextInput.Icon icon={leftIcon} /> : null}
      right={
        rightIcon ? (
          <TextInput.Icon icon={rightIcon} onPress={toggleSecure} />
        ) : null
      }
      theme={{ colors: { primary: colors.primary } }}
    />
  );
};

export default TextInputField;
