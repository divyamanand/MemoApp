import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Assuming expo is used; install if needed
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/src/constants/types';
import { getRecommendedTags } from '@/src/service/api/llmapi';
import { useAppDispatch } from '@/src/store/hooks';
import { Chip } from 'react-native-paper';
import { addTags } from '@/src/features/app/appSlice';

const TopicScreen = () => {
  const [topic, setTopic] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleRecommendations = async () => {
    try {
      const data = await getRecommendedTags(topic);
      setTags(data.tags);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  if (tags.length > 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.tagsContainer}>
          <Text style={styles.tagsTitle}>Recommended Tags</Text>
          <Text style={styles.tagsSubtitle}>
            Select tags to customize your learning
          </Text>
          <View style={styles.tagsWrap}>
            {tags.map((tag, index) => {
              const active = selectedTags.includes(tag);
              return (
                <Chip
                  key={index}
                  mode={active ? 'flat' : 'outlined'}
                  selected={active}
                  onPress={() => toggleTag(tag)}
                  style={[
                    styles.tagChip,
                    active && { backgroundColor: '#DCE8FF' },
                  ]}
                  textStyle={{
                    color: active ? '#0E2A6B' : '#44474F',
                    fontSize: 14,
                    fontWeight: '600',
                  }}
                >
                  {tag}
                </Chip>
              );
            })}
          </View>
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={() => {
              dispatch(addTags(selectedTags));
              navigation.navigate('Suggestions');
            }}
          >
            <Text style={styles.proceedText}>
              Proceed with {selectedTags.length} tags
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.questionText}>What would you like to learn</Text>
        <Text style={styles.subText}>
          (write a topic, any exam you're preparing for or anything you're
          learning. Explain us as better as you can for better suggestions.)
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your topic..."
          placeholderTextColor="#999"
          value={topic}
          onChangeText={setTopic}
          autoFocus
          multiline
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRecommendations}>
        <MaterialIcons name="arrow-forward" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  questionText: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1B1B1F',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    color: '#787B82',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    height: 120, // Increased for multiline
    borderWidth: 1,
    borderColor: '#E7EAF0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1B1B1F',
    backgroundColor: '#F6F8FC',
    textAlignVertical: 'top',
  },
  button: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F86F7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  // Tags UI styles
  tagsContainer: {
    padding: 24,
  },
  tagsTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1B1B1F',
    marginBottom: 8,
  },
  tagsSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#787B82',
    marginBottom: 32,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    borderRadius: 16,
  },
  proceedButton: {
    marginTop: 32,
    paddingVertical: 16,
    backgroundColor: '#4F86F7',
    borderRadius: 12,
    alignItems: 'center',
  },
  proceedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default TopicScreen;
