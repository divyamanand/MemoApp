import React from 'react';
import { Card, Text } from 'react-native-paper';

interface ProgressCardProps {
  label: string;
  value: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ label, value }) => (
  <Card style={{ flex: 1, padding: 16, backgroundColor: '#f0f2f4' }}>
    <Card.Content>
      <Text style={{ fontSize: 14, fontWeight: '500', color: '#637588' }}>
        {label}
      </Text>
      <Text style={{ fontSize: 32, fontWeight: 'bold' }}>{value}</Text>
    </Card.Content>
  </Card>
);

export default ProgressCard;
