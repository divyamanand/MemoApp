import React from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';

interface QuestionListItemProps {
  title: string;
  // category: string;
  // time: string;
  difficulty: 'easy' | 'medium' | 'hard'; // better typing
}

const QuestionListItem: React.FC<QuestionListItemProps> = ({
  title,
  // category,
  // time,
  difficulty,
}) => {
  const difficultyColor =
    difficulty === 'easy'
      ? 'green'
      : difficulty === 'medium'
        ? 'yellow'
        : 'red';

  return (
    <Card style={{ marginBottom: 10 }}>
      <Card.Content>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 8,
              height: 40,
              backgroundColor: difficultyColor,
              borderRadius: 4,
              marginRight: 10,
            }}
          />
          <Text variant="titleMedium">{title}</Text>
        </View>
        {/* <Text>
          {category} - {time}
        </Text> */}
      </Card.Content>
    </Card>
  );
};

export default QuestionListItem;
