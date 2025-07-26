import React from 'react';
import { IconButton as PaperIconButton, useTheme } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

interface IconButtonProps {
  icon: IconSource;
  onPress: () => void;
  iconColor?: string; // Renamed for clarity to match Paper's prop
  size?: number;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  iconColor,
  size = 24,
}) => {
  const { colors } = useTheme();
  return (
    <PaperIconButton
      icon={icon}
      onPress={onPress}
      iconColor={iconColor || colors.primary} // Use 'iconColor' instead of 'color'
      size={size}
    />
  );
};

export default IconButton;
