import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    // Inicializar el token desde sessionStorage al cargar
    return sessionStorage.getItem('token');
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Inicializar el estado de autenticación basado en la existencia del token
    return !!sessionStorage.getItem('token');
  });

  // Función para manejar el login
  const login = (newToken: string) => {
    sessionStorage.setItem('token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  // Función para manejar el logout
  const logout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
  };

  // Valor del contexto que será proporcionado
  const value = {
    isAuthenticated,
    login,
    logout,
    token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
