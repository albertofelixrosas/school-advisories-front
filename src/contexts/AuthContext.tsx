import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { authService } from '../services/auth.service';
import type { User, LoginDto, AuthError } from '../types/backend.types';
import { UserRole } from '../types/backend.types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';

// ===== INTERFACES =====
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: AuthError }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_USER'; payload: User };

interface AuthContextValue extends AuthState {
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

// Export type alias for compatibility
export type AuthContextType = AuthContextValue;

// ===== INITIAL STATE =====
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// ===== REDUCER =====
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { 
        ...state, 
        isLoading: true, 
        error: null 
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'SET_LOADING':
      return { 
        ...state, 
        isLoading: action.payload 
      };

    case 'CLEAR_ERROR':
      return { 
        ...state, 
        error: null 
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    default:
      return state;
  }
}

// ===== CONTEXT =====
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ===== PROVIDER =====
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ===== LOGIN =====
  const login = useCallback(async (credentials: LoginDto) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const authResponse = await authService.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: authResponse.user });
      toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Error al iniciar sesión';
      
      // Extract error message from API response
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.message) {
          errorMessage = axiosError.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      const errorObj: AuthError = { message: errorMessage };
      dispatch({ type: 'LOGIN_FAILURE', payload: errorObj });
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  // ===== LOGOUT =====
  const logout = useCallback(() => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
    toast.success(SUCCESS_MESSAGES.LOGOUT_SUCCESS);
  }, []);

  // ===== ROLE CHECKING =====
  const hasRole = useCallback((role: UserRole): boolean => {
    return state.user?.role === role;
  }, [state.user]);

  // ===== PERMISSION CHECKING =====
  const hasPermission = useCallback((permission: string): boolean => {
    if (!state.user) return false;
    return authService.hasPermission(permission);
  }, [state.user]);

  // ===== CLEAR ERROR =====
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // ===== REFRESH USER =====
  const refreshUser = useCallback(async () => {
    try {
      if (!authService.isAuthenticated()) return;
      
      const userProfile = await authService.getProfile();
      dispatch({ type: 'SET_USER', payload: userProfile });
    } catch (error) {
      console.error('Error refreshing user:', error);
      // Si falla, probablemente el token expiró
      logout();
    }
  }, [logout]);

  // ===== INITIALIZE AUTH STATE =====
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Intentar obtener el perfil del usuario con el token existente
          const userProfile = await authService.getProfile();
          dispatch({ type: 'LOGIN_SUCCESS', payload: userProfile });
        } else {
          // No hay token válido
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Si falla la inicialización, limpiar tokens y marcar como no loading
        authService.logout();
        dispatch({ type: 'LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  // ===== AUTO REFRESH TOKEN =====
  useEffect(() => {
    if (!state.isAuthenticated) return;

    // Configurar refresh automático del token cada 45 minutos
    const refreshInterval = setInterval(async () => {
      try {
        await authService.refreshToken();
        await refreshUser();
      } catch (error) {
        console.error('Auto refresh failed:', error);
        logout();
      }
    }, 45 * 60 * 1000); // 45 minutos

    return () => clearInterval(refreshInterval);
  }, [state.isAuthenticated, refreshUser, logout]);

  // ===== CONTEXT VALUE =====
  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    hasRole,
    hasPermission,
    clearError,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ===== HOOK =====
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}