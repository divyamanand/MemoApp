import React from 'react';
import { Appbar } from 'react-native-paper';
import { StyleProp, ViewStyle } from 'react-native';

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  onBack,
  actions,
  style,
}) => (
  <Appbar.Header style={style}>
    {onBack && <Appbar.BackAction onPress={onBack} />}
    <Appbar.Content title={title} />
    {actions}
  </Appbar.Header>
);

export default AppHeader;
