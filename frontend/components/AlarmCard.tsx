import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Clock, Repeat } from 'lucide-react-native';

interface Alarm {
  id: number;
  title: string;
  time: string;
  frequency: string;
  active: boolean;
}

interface AlarmCardProps {
  alarm: Alarm;
}

export function AlarmCard({ alarm }: AlarmCardProps) {
  const [isEnabled, setIsEnabled] = React.useState(alarm.active);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Clock size={20} color="#667eea" />
        </View>
        
        <View style={styles.info}>
          <Text style={styles.title}>{alarm.title}</Text>
          <Text style={styles.time}>{alarm.time}</Text>
          <View style={styles.frequencyContainer}>
            <Repeat size={12} color="#6B7280" />
            <Text style={styles.frequency}>{alarm.frequency}</Text>
          </View>
        </View>
        
        <Switch
          trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
          thumbColor={isEnabled ? '#667eea' : '#F3F4F6'}
          ios_backgroundColor="#D1D5DB"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  time: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#667eea',
    marginBottom: 4,
  },
  frequencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  frequency: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});