import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Heart, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function RoleSelectionScreen() {
  const handleRoleSelection = (role: 'caregiver' | 'elderly_person') => {
    router.push({
      pathname: '/auth/login',
      params: { role }
    });
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
          {/* Logo and title */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Heart size={48} color="#FFFFFF" strokeWidth={2} />
            </View>
            <Text style={styles.title}>CUIDA+</Text>
            <Text style={styles.subtitle}>
              Care and wellness for elderly people
            </Text>
          </View>

          {/* Main question */}
          <View style={styles.questionContainer}>
            <Text style={styles.question}>Who are you?</Text>
            <Text style={styles.questionSubtext}>
              Select your role to continue
            </Text>
          </View>

          {/* Role selection buttons */}
          <View style={styles.rolesContainer}>
            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => handleRoleSelection('elderly_person')}
              activeOpacity={0.8}
            >
              <View style={styles.roleIconContainer}>
                <Heart size={32} color="#667eea" strokeWidth={2} />
              </View>
              <Text style={styles.roleTitle}>Elderly Person</Text>
              <Text style={styles.roleDescription}>
                Access your personal care and wellness assistant
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => handleRoleSelection('caregiver')}
              activeOpacity={0.8}
            >
              <View style={styles.roleIconContainer}>
                <Users size={32} color="#667eea" strokeWidth={2} />
              </View>
              <Text style={styles.roleTitle}>Caregiver</Text>
              <Text style={styles.roleDescription}>
                Monitor and manage care for elderly people
              </Text>
            </TouchableOpacity>
          </View>

          {/* Additional information */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account? Contact your administrator
            </Text>
          </View>
        </ScrollView>
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
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: height * 0.04,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: height * 0.04,
  },
  question: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  questionSubtext: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  rolesContainer: {
    gap: 16,
    marginBottom: height * 0.04,
  },
  roleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  roleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  roleDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});