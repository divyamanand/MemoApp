import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme, Text, Chip, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface PracticeCardProps {
  title: string;
  tags?: string[];
  difficulty?: string;
  description?: string;
  estimateTime?: string;
  onMarkDone?: () => void;
  onStartTimer?: () => void;
  onInfoPress?: () => void; // New prop for info button
  style?: ViewStyle;
  titleColor?: string;
  subtitleColor?: string;
  accentColor?: string;
  chipColor?: string;
}

const PracticeCard: React.FC<PracticeCardProps> = ({
  title,
  tags = [],
  difficulty,
  description,
  estimateTime,
  onMarkDone,
  onStartTimer,
  onInfoPress, // New prop
  style,
  titleColor,
  subtitleColor,
  accentColor,
  chipColor,
}) => {
  const { colors } = useTheme();

  // Use the passed colors or fall back to theme colors
  const finalTitleColor = titleColor || colors.onSurface;
  const finalSubtitleColor = subtitleColor || colors.onSurfaceVariant;
  const finalAccentColor = accentColor || colors.primary;
  const finalChipColor = chipColor || colors.primaryContainer;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }, style]}>
      {/* Header: Title and info icon */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: finalTitleColor }]}>{title}</Text>
        <IconButton
          icon="information-outline"
          size={20}
          iconColor={finalSubtitleColor}
          onPress={onInfoPress}
          style={styles.infoButton}
        />
      </View>

      {/* Tags and difficulty */}
      <View style={styles.tagsContainer}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            compact
            style={[
              styles.chip,
              { backgroundColor: finalChipColor, borderRadius: 14 },
              tag === difficulty
                ? { backgroundColor: colors.tertiaryContainer }
                : {},
            ]}
            textStyle={[
              {
                color: tag === difficulty ? colors.tertiary : finalAccentColor,
                fontWeight: '600',
                fontSize: 13,
              },
            ]}
          >
            {tag}
          </Chip>
        ))}
        {difficulty && !tags.includes(difficulty) && (
          <Chip
            compact
            style={[
              styles.chip,
              {
                backgroundColor: colors.tertiaryContainer,
                borderRadius: 14,
                marginLeft: 6,
              },
            ]}
            textStyle={[
              { color: colors.tertiary, fontWeight: '700', fontSize: 13 },
            ]}
          >
            {difficulty}
          </Chip>
        )}
      </View>

      {/* Description */}
      <Text style={[styles.description, { color: finalSubtitleColor }]}>
        {description ||
          'A detailed description of the question would appear here, providing context and necessary information for the user to solve it.'}
      </Text>

      {/* AI estimate time */}
      {estimateTime && (
        <View style={styles.estimateContainer}>
          <MaterialIcons name="smart-toy" size={16} color={finalAccentColor} />
          <Text style={[styles.estimateText, { color: finalAccentColor }]}>
            AI estimate: {estimateTime}
          </Text>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={onMarkDone}
          style={[styles.button, { backgroundColor: colors.surfaceVariant }]}
        >
          <Text style={[styles.buttonText, { color: colors.onSurface }]}>
            Mark as Done
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onStartTimer}
          style={[
            styles.button,
            styles.startTimerButton,
            { backgroundColor: finalAccentColor },
          ]}
        >
          <MaterialIcons name="timer" size={16} color="#fff" />
          <Text
            style={[
              styles.buttonText,
              styles.startTimerText,
              { color: '#fff' },
            ]}
          >
            {' '}
            Start Timer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontWeight: '800', fontSize: 17, flex: 1 },
  infoButton: {
    margin: 0,
    width: 32,
    height: 32,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: { marginRight: 8, height: 28, paddingHorizontal: 0 },
  description: { fontSize: 14, marginTop: 13 },
  estimateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 6,
  },
  estimateText: { fontSize: 13, fontWeight: '600' },
  buttonsContainer: { flexDirection: 'row', marginTop: 18, gap: 16 },
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  startTimerButton: {},
  buttonText: { fontWeight: '700', fontSize: 15, color: '#374151' },
  startTimerText: { color: '#fff' },
});

export default PracticeCard;
