import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';

export type UserRole = 'caregiver' | 'elderly_person';

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate existing session verification
    const checkAuthState = async () => {
      try {
        // Here you would normally verify a saved token
        // For now we simulate that there's no active session
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Authentication simulation
      // In a real app, you would make a call to your API here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock test users
      const mockUsers = {
        'caregiver@test.com': { name: 'Maria Gonzalez', role: 'caregiver' as UserRole },
        'elderly@test.com': { name: 'Robert Martinez', role: 'elderly_person' as UserRole },
      };
      
      const mockUser = mockUsers[email as keyof typeof mockUsers];
      
      if (mockUser && password === '123456' && mockUser.role === role) {
        const userData: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          role,
          name: mockUser.name,
        };
        
        setUser(userData);
        setIsLoading(false);
        
        // Redirect based on role
        if (role === 'caregiver') {
          router.replace('/(tabs)/cuidador');
        } else {
          router.replace('/(tabs)');
        }
        
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    router.replace('/auth');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}