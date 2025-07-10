import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, MicOff, LogOut, Phone, Heart, AlertTriangle } from 'lucide-react-native';
import { StatusIndicator } from '@/components/StatusIndicator';
import { VoiceButton } from '@/components/VoiceButton';
import { RecordingsList } from '@/components/RecordingsList';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

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
  const { logout, user } = useAuth();

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
    if (isListening) return '#FFFFFF';
    return '#FFFFFF';
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
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header with greeting and logout */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Heart size={32} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{user?.name}</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <LogOut size={24} color="#FFFFFF" />
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
            />
            
            {/* Status text */}
            <View style={styles.statusContainer}>
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {getStatusText()}
              </Text>
              
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
              <Phone size={28} color="#667eea" />
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
          <AlertTriangle size={28} color="#FFFFFF" />
          <Text style={styles.emergencyLabel}>Emergency</Text>
        </TouchableOpacity>
      </LinearGradient>
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
    paddingHorizontal: 24,
    paddingBottom: 120, // Space for emergency button
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingContainer: {
    flex: 1,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    maxWidth: width * 0.85,
  },
  instructionText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
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
    backgroundColor: '#FFFFFF',
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
    color: '#667eea',
  },
  recordingsSection: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
  },
  recordingsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
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
    gap: 4,
  },
  emergencyLabel: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});