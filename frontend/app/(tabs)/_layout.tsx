import { Tabs } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Heart } from 'lucide-react-native';

export default function TabsLayout() {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
        },
        tabBarStyle: {
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 2,
          borderTopColor: '#E5E7EB',
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: user?.role === 'adulto_mayor' ? 'Mi Asistente' : 'Adulto Mayor',
          tabBarIcon: ({ size, color }) => (
            <Heart size={size} color={color} />
          ),
          href: user?.role === 'cuidador' ? null : '/',
        }}
      />
      <Tabs.Screen
        name="cuidador"
        options={{
          title: 'Panel Cuidador',
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} />
          ),
          href: user?.role === 'cuidador' ? '/cuidador' : null,
        }}
      />
    </Tabs>
  );
}