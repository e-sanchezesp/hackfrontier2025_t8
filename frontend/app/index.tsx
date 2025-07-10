import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function IndexScreen() {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Redirect based on user role
        if (user.role === 'caregiver') {
          router.replace('/(tabs)/cuidador');
        } else {
          // For elderly person, redirect to the main screen
          router.replace('/(tabs)');
        }
      } else {
        // Not authenticated, go to role selection
        router.replace('/auth');
      }
    }
  }, [isAuthenticated, isLoading, user]);

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <ActivityIndicator size="large" color="#FFFFFF" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});