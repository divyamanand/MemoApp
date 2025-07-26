import React from 'react';
import { Button, useTheme } from 'react-native-paper';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  icon,
}) => {
  const { colors } = useTheme();
  return (
    <Button
      mode="contained"
      onPress={onPress}
      icon={icon}
      style={{ backgroundColor: colors.primary }}
    >
      {label}
    </Button>
  );
};

export default PrimaryButton;
