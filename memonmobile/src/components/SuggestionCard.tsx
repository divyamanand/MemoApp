// src/components/SuggestionCard.tsx
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, Button, useTheme, MD3Theme } from 'react-native-paper';

type SuggestionCardProps = {
  /** Title shown on top of the card */
  questionName: string;
  /** Optional longer text under the title */
  description?: string;
  /** Callback when the user taps the button */
  onAddToPractice?: () => void;
  /** Disable the button (optional) */
  disabled?: boolean;
};

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  questionName,
  description,
  onAddToPractice,
  disabled,
}) => {
  const theme = useTheme<MD3Theme>();
  const [added, setAdded] = useState(false);

  const handlePress = async () => {
    await onAddToPractice?.();
    setAdded(true);
  };

  return (
    <Card mode="contained" style={styles.card} testID="suggestion-card">
      <Card.Content>
        <Text
          variant="titleMedium"
          style={[styles.title, { color: theme.colors.onSurface }]}
        >
          {questionName}
        </Text>

        {description ? (
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {description}
          </Text>
        ) : null}
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <Button
          mode="contained"
          onPress={handlePress}
          disabled={disabled || added}
          contentStyle={styles.buttonContent}
          style={[
            styles.button,
            added && { backgroundColor: theme.colors.primary },
          ]}
          labelStyle={{ textTransform: 'none' }} // Keep text case as-is
        >
          {added ? 'Added' : 'Add to Practice'}
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    elevation: 1, // harmonises with your elevation palette
  },
  title: {
    marginBottom: 4,
  },
  actions: {
    justifyContent: 'flex-end',
    paddingRight: 8,
    paddingBottom: 8,
  },
  button: {
    borderRadius: 50, // pill-shaped
  },
  buttonContent: {
    paddingHorizontal: 12,
  },
});

export default SuggestionCard;
