import React from 'react';
import {
  TextInput,
  TextInputProps as PaperTextInputProps,
} from 'react-native-paper';

interface TextInputFieldProps extends PaperTextInputProps {
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  leftIcon,
  rightIcon,
  onRightIconPress,
  ...props
}) => {
  return (
    <TextInput
      {...props}
      left={leftIcon ? <TextInput.Icon icon={leftIcon} /> : undefined}
      right={
        rightIcon ? (
          <TextInput.Icon icon={rightIcon} onPress={onRightIconPress} />
        ) : undefined
      }
    />
  );
};

export default TextInputField;
