import React from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import { Card, IconButton, Button} from 'react-native-paper';
import { Revision } from '../constants/types';

interface QuestionCardProps {
  title: string;
  content: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  upcominRevisions: Revision[];
  revisionHistory?: Revision[];
  onEdit?: () => void;
  onDelete?: () => void;
  onIncrease?: () => void;
  onDecrease?: () => void;
  tags?: string[];
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  title,
  content,
  style,
  onEdit,
  onDelete,
  onIncrease,
  onDecrease,
  tags = [],
}) => (
  <Card style={style}>
    <Card.Title title={title} />
    <Card.Content>
      {content}

      {tags.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
          {tags.map((tag, idx) => (
            <Button
              key={idx}
              mode="outlined"
              compact
              style={{
                marginRight: 6,
                marginBottom: 6,
                borderRadius: 16,
              }}
              labelStyle={{ fontSize: 12 }}
            >
              {tag}
            </Button>
          ))}
        </View>
      )}
    </Card.Content>

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 8 }}>
      <Button icon="pencil" mode="outlined" onPress={onEdit}>
        Edit
      </Button>
      <Button icon="delete" mode="outlined" onPress={onDelete}>
        Delete
      </Button>
      <IconButton icon="plus" onPress={onIncrease} />
      <IconButton icon="minus" onPress={onDecrease} />
    </View>
  </Card>
);

export default QuestionCard;
