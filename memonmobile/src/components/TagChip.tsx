import React from 'react';
import { Chip, useTheme } from 'react-native-paper';

interface TagChipProps {
  label: string;
  color?: string; // e.g., 'green', 'yellow'
}

const TagChip: React.FC<TagChipProps> = ({ label, color = 'blue' }) => {
  const { colors } = useTheme();
  const bgColor =
    color === 'green'
      ? 'green'
      : color === 'yellow'
        ? 'yellow'
        : colors.primary;
  return <Chip style={{ backgroundColor: bgColor }}>{label}</Chip>;
};

export default TagChip;
