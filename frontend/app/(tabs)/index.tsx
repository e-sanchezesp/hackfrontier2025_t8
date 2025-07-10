import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, MicOff, LogOut, Phone } from 'lucide-react-native';
import { StatusIndicator } from '@/components/StatusIndicator';
import { VoiceButton } from '@/components/VoiceButton';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function ElderlyPersonScreen() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
              <Text style={styles.userName}>{user?.name}</Text>
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
            <TouchableOpacity style={styles.quickActionButton}>
              <Phone size={28} color="#FFFFFF" />
              <Text style={styles.quickActionText}>Call Family</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Emergency button - always visible */}
        <TouchableOpacity style={styles.emergencyButton}>
          <Text style={styles.emergencyText}>🚨</Text>
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
    paddingBottom: 120, // Espacio para el botón de emergencia
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
    minHeight: height * 0.6,
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