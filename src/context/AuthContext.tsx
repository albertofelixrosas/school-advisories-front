import { createContext, useContext, useEffect, useState } from 'react';
import { setAuthToken, setLogoutCallback } from '../api/axios';

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    localStorage.getItem('refresh_token'),
  );

  const login = (accessToken: string, newRefreshToken: string) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refresh_token', newRefreshToken);
    setToken(accessToken);
    setRefreshToken(newRefreshToken);
    setAuthToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setRefreshToken(null);
    setAuthToken(null);
  };

  const isAuthenticated = !!token;

  useEffect(() => {
    setAuthToken(token);
    setRefreshToken(refreshToken);
    setLogoutCallback(logout);
  }, [token, refreshToken]);

  useEffect(() => {
    if (!token) {
      //navigate('/login'); // redirige si se queda sin token
      console.error('Aquí debería dirigirte al login');
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, refreshToken, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
