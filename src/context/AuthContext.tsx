import { createContext, useContext, useEffect, useState } from 'react';
import { setAuthToken, setLogoutCallback } from '../api/axios';
import type { LoginResponse } from '../types/auth';

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  login: (data: LoginResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
  username: string | null;
  name: string | null;
  lastName: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    localStorage.getItem('refresh_token'),
  );
  const [username, setUsername] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  const login = (data: LoginResponse) => {
    const {
      access_token: accessToken,
      refresh_token: newRefreshToken,
      username,
      name,
      last_name,
      photo_url,
    } = data;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refresh_token', newRefreshToken);
    localStorage.setItem('username', username);
    localStorage.setItem('name', name);
    localStorage.setItem('last_name', last_name);
    localStorage.setItem('photo_url', photo_url);
    setToken(accessToken);
    setRefreshToken(newRefreshToken);
    setAuthToken(accessToken);
    setUsername(username);
    setName(name);
    setLastName(last_name);
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
    <AuthContext.Provider
      value={{ token, refreshToken, login, logout, isAuthenticated, username, name, lastName }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
