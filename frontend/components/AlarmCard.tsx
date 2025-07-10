import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Clock, Repeat } from 'lucide-react-native';

interface Alarma {
  id: number;
  titulo: string;
  hora: string;
  frecuencia: string;
  activa: boolean;
}

interface AlarmCardProps {
  alarma: Alarma;
}

export function AlarmCard({ alarma }: AlarmCardProps) {
  const [isEnabled, setIsEnabled] = React.useState(alarma.activa);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Clock size={20} color="#2563EB" />
        </View>
        
        <View style={styles.info}>
          <Text style={styles.title}>{alarma.titulo}</Text>
          <Text style={styles.time}>{alarma.hora}</Text>
          <View style={styles.frequencyContainer}>
            <Repeat size={12} color="#6B7280" />
            <Text style={styles.frequency}>{alarma.frecuencia}</Text>
          </View>
        </View>
        
        <Switch
          trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
          thumbColor={isEnabled ? '#2563EB' : '#F3F4F6'}
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  time: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 4,
  },
  frequencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  frequency: {
    fontSize: 12,
    color: '#6B7280',
  },
});