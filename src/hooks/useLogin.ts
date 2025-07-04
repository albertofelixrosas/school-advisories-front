import { useState } from 'react';
import { useNavigate } from 'react-router';
import { login as loginRequest } from '../services/authService';
import type { LoginRequest } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      const { access_token, refresh_token, username } = await loginRequest(credentials);
      authLogin(access_token, refresh_token, username);
      navigate('/');
    } catch (error) {
      console.error('Error en login:', error);
      toast.error('Usuario o contraseña inválidas');
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};
