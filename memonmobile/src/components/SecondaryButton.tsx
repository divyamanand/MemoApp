import React from 'react';
import { Button, useTheme } from 'react-native-paper';

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: string;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  label,
  onPress,
  icon,
}) => {
  const { colors } = useTheme();
  return (
    <Button
      mode="outlined"
      onPress={onPress}
      icon={icon}
      style={{ borderColor: colors.primary }}
    >
      {label}
    </Button>
  );
};

export default SecondaryButton;
