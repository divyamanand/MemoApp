import React from 'react';
import { Surface, Text } from 'react-native-paper';

interface QuoteProps {
  text: string;
  author: string;
}

const Quote: React.FC<QuoteProps> = ({ text, author }) => (
  <Surface
    style={{
      padding: 16,
      borderRadius: 12,
      backgroundColor: 'rgba(0,128,128,0.1)',
      alignItems: 'center',
    }}
  >
    <Text
      style={{ fontSize: 14, color: 'teal', textAlign: 'center' }}
    >{`"${text}" - ${author}`}</Text>
  </Surface>
);

export default Quote;
