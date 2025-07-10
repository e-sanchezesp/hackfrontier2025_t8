import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';

export type UserRole = 'cuidador' | 'adulto_mayor';

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
    // Simular verificación de sesión existente
    const checkAuthState = async () => {
      try {
        // Aquí normalmente verificarías un token guardado
        // Por ahora simulamos que no hay sesión activa
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
      // Simulación de autenticación
      // En una app real, aquí harías la llamada a tu API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulamos usuarios de prueba
      const mockUsers = {
        'cuidador@test.com': { name: 'María González', role: 'cuidador' as UserRole },
        'adulto@test.com': { name: 'Roberto Martínez', role: 'adulto_mayor' as UserRole },
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
        
        // Redirigir según el rol
        if (role === 'cuidador') {
          router.replace('/(tabs)/cuidador');
        } else {
          router.replace('/(tabs)/');
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