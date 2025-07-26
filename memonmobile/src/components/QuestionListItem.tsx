import React from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';

interface QuestionListItemProps {
  title: string;
  category: string;
  time: string;
  difficultyColor: string; // e.g., 'yellow', 'green'
  completed?: boolean;
}

const QuestionListItem: React.FC<QuestionListItemProps> = ({
  title,
  category,
  time,
  difficultyColor,
  completed,
}) => (
  <Card style={{ opacity: completed ? 0.6 : 1 }}>
    <Card.Content>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 8,
            height: 40,
            backgroundColor: difficultyColor,
            borderRadius: 4,
          }}
        />
        <Text variant="titleMedium">{title}</Text>
      </View>
      <Text>
        {category} - {time}
      </Text>
    </Card.Content>
  </Card>
);

export default QuestionListItem;
