import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Linking, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, MicOff, LogOut, Phone } from 'lucide-react-native';
import { StatusIndicator } from '@/components/StatusIndicator';
import { VoiceButton } from '@/components/VoiceButton';
import { RecordingsList } from '@/components/RecordingsList';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

interface Recording {
  id: string;
  uri: string;
  name: string;
  duration?: number;
  date: Date;
}

export default function ElderlyPersonScreen() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [status, setStatus] = useState('');
  const [transcript, setTranscript] = useState('');
  const [user, setUser] = useState<any>(null);
  const [n8nResponse, setN8nResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lastN8nMessage, setLastN8nMessage] = useState<string | null>(null);
  const { logout, user: authUser } = useAuth();

  useEffect(() => {
    if (n8nResponse && typeof n8nResponse === 'object' && n8nResponse.mensaje) {
      Speech.speak(n8nResponse.mensaje, { language: 'es-MX' });
    } else if (n8nResponse && typeof n8nResponse === 'string') {
      Speech.speak(n8nResponse, { language: 'es-MX' });
    }
  }, [n8nResponse]);

  const handleVoicePress = () => {
    if (isListening) {
      // Stop recording
      setIsListening(false);
      setIsProcessing(true);
      
      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    } else {
      // Start recording
      setIsListening(true);
    }
  };

  const handleRecordingComplete = (recordingUri: string) => {
    const newRecording: Recording = {
      id: Date.now().toString(),
      uri: recordingUri,
      name: `Recording ${recordings.length + 1}`,
      date: new Date(),
    };
    
    setRecordings(prev => [newRecording, ...prev]);
    setIsListening(false);
    setIsProcessing(false);
  };

  const handleDeleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(recording => recording.id !== id));
  };

  const handleEmergencyCall = async () => {
    try {
      const url = 'tel:911';
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open phone app');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to make emergency call');
    }
  };

  const handleFamilyCall = async () => {
    try {
      const url = 'tel:6644795098';
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open phone app');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to call family');
    }
  };

  const getStatusText = () => {
    if (isProcessing) return 'Processing your message...';
    if (isListening) return 'I am listening to you...';
    return 'Tap the button to talk to me';
  };

  const getStatusColor = () => {
    if (isProcessing) return '#F59E0B';
    if (isListening) return '#059669';
    return '#6B7280';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0F9FF', '#E0F2FE', '#F8FAFC']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header with greeting and logout */}
          <View style={styles.header}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{authUser?.name}</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <LogOut size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Main content */}
          <View style={styles.mainContent}>
            {/* Visual status indicator */}
            <StatusIndicator 
              isActive={isListening || isProcessing}
              type={isProcessing ? 'processing' : isListening ? 'listening' : 'ready'}
            />
            
            {/* Main voice button */}
            <VoiceButton 
              isListening={isListening}
              isProcessing={isProcessing}
              onPress={handleVoicePress}
              onRecordingComplete={handleRecordingComplete}
              setStatus={setStatus}
              setTranscript={setTranscript}
              setUser={setUser}
              setN8nResponse={setN8nResponse}
              setLoading={setLoading}
            />
            
            {/* Status text */}
            <View style={styles.statusContainer}>
              <Text style={[styles.statusText, { color: getStatusColor() }]}> 
                {getStatusText()}
              </Text>
              {/* Mostrar resultado de n8n si existe (debug) */}
              {n8nResponse !== null && n8nResponse !== undefined && (
                <View style={{ marginTop: 20, backgroundColor: '#F1F5F9', borderRadius: 12, padding: 16 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2563EB', marginBottom: 8 }}>Resultado del análisis (debug):</Text>
                  <Text style={{ fontSize: 16, color: '#1E293B' }}>
                    {JSON.stringify(n8nResponse, null, 2)}
                  </Text>
                </View>
              )}
              {/* Additional instructions */}
              {!isListening && !isProcessing && (
                <View style={styles.instructionsContainer}>
                  <Text style={styles.instructionText}>
                    You can ask me about:
                  </Text>
                  <View style={styles.suggestionsList}>
                    <Text style={styles.suggestionItem}>• Your health and medications</Text>
                    <Text style={styles.suggestionItem}>• How you feel today</Text>
                    <Text style={styles.suggestionItem}>• Important reminders</Text>
                    <Text style={styles.suggestionItem}>• Calling a family member</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Quick action buttons */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton} onPress={handleFamilyCall}>
              <Phone size={28} color="#FFFFFF" />
              <Text style={styles.quickActionText}>Call Family</Text>
            </TouchableOpacity>
          </View>

          {/* Recordings Section */}
          <View style={styles.recordingsSection}>
            <Text style={styles.recordingsTitle}>Your Recordings</Text>
            <RecordingsList 
              recordings={recordings}
              onDeleteRecording={handleDeleteRecording}
            />
          </View>
        </ScrollView>

        {/* Emergency button - always visible */}
        <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
          <Text style={styles.emergencyText}>🚨</Text>
          <Text style={styles.emergencyLabel}>Emergency</Text>
        </TouchableOpacity>
      </LinearGradient>
      {loading && <ActivityIndicator size="large" color="#2563EB" style={{ position: 'absolute', bottom: 100 }} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120, // Space for emergency button
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  logoutButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    minHeight: height * 0.4,
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  statusText: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 32,
  },
  instructionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    maxWidth: width * 0.85,
  },
  instructionText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
  },
  suggestionsList: {
    alignItems: 'flex-start',
  },
  suggestionItem: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 24,
  },
  quickActions: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    gap: 12,
  },
  quickActionText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  recordingsSection: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
  },
  recordingsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  emergencyButton: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  emergencyText: {
    fontSize: 28,
    marginBottom: 2,
  },
  emergencyLabel: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});