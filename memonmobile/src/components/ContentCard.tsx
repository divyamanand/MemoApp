import React from 'react';
import { Card } from 'react-native-paper';
import { StyleProp, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ContentCardProps {
  title: string;
  content: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  completed: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  content,
  style,
  completed,
}) => (
  <Card style={style}>
    <Card.Title
      title={title}
      right={() =>
        completed ? (
          <MaterialIcons name="check-circle" size={24} color="green" />
        ) : null
      }
    />
    <Card.Content>{content}</Card.Content>
  </Card>
);

export default ContentCard;
