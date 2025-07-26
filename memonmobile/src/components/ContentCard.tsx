import React from 'react';
import { Card } from 'react-native-paper';
import { StyleProp, ViewStyle } from 'react-native';

interface ContentCardProps {
  title: string;
  content: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ContentCard: React.FC<ContentCardProps> = ({ title, content, style }) => (
  <Card style={style}>
    <Card.Title title={title} />
    <Card.Content>{content}</Card.Content>
  </Card>
);

export default ContentCard;
