# 🛠️ Guía de Implementación - School Advisories Frontend

> **Para:** Alberto Felix Rosas  
> **Fecha:** 10 de Noviembre, 2025  
> **Propósito:** Guía paso a paso para implementar cada feature del frontend

---

## 🎯 CÓMO USAR ESTA GUÍA

### Estructura de cada sección:
1. **📋 Checklist** - Tareas específicas con checkboxes
2. **🔧 Comandos** - Comandos exactos para copiar/pegar  
3. **📝 Código** - Snippets listos para usar
4. **✅ Validación** - Cómo verificar que funciona
5. **🚨 Troubleshooting** - Solución a problemas comunes

### Convenciones:
- `📁 Archivo nuevo` - Crear archivo desde cero
- `✏️ Modificar` - Editar archivo existente  
- `🔧 Comando` - Ejecutar en terminal
- `✅ Verificar` - Comprobar funcionamiento

---

## 📅 DÍA 1: TIPOS Y SERVICIOS BASE

### 📋 Checklist del Día 1
- [ ] Copiar tipos del backend
- [ ] Crear servicios base (auth, advisory)
- [ ] Configurar constantes del proyecto
- [ ] Actualizar AuthContext con JWT
- [ ] Setup interceptors de Axios

### 🔧 Paso 1: Copiar tipos del backend

```bash
# 📁 Crear archivo de tipos del backend
cp docs/frontend-integration/backend-types.ts src/types/backend.types.ts
```

**📝 Actualizar src/types/index.ts:**
```typescript
// ✏️ Modificar src/types/index.ts
export * from './api.types';
export * from './auth.types'; 
export * from './user.types';
export * from './backend.types'; // 📁 Nueva línea
```

### 🔧 Paso 2: Crear servicios base

**📁 Crear src/services/auth.service.ts:**
```typescript
import axios from 'axios';
import { LoginCredentials, AuthResponse, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class AuthService {
  private tokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/auth/login`,
      credentials
    );
    
    if (response.data.accessToken) {
      localStorage.setItem(this.tokenKey, response.data.accessToken);
      localStorage.setItem(this.refreshTokenKey, response.data.refreshToken);
    }
    
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post<AuthResponse>(
      `${API_URL}/auth/refresh`,
      { refreshToken }
    );

    if (response.data.accessToken) {
      localStorage.setItem(this.tokenKey, response.data.accessToken);
      localStorage.setItem(this.refreshTokenKey, response.data.refreshToken);
    }

    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await axios.get<User>(`${API_URL}/auth/profile`);
    return response.data;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = new AuthService();
```

**📁 Crear src/services/advisory.service.ts:**
```typescript
import { apiClient } from './api.client';
import { 
  AdvisoryRequest, 
  AdvisoryRequestStatus,
  CreateAdvisoryRequestDto,
  Advisory,
  CreateDirectSessionDto
} from '../types/backend.types';

class AdvisoryService {
  // Solicitudes de asesoría
  async createRequest(data: CreateAdvisoryRequestDto): Promise<AdvisoryRequest> {
    const response = await apiClient.post<AdvisoryRequest>('/advisory-requests', data);
    return response.data;
  }

  async getMyRequests(): Promise<AdvisoryRequest[]> {
    const response = await apiClient.get<AdvisoryRequest[]>('/advisory-requests/my-requests');
    return response.data;
  }

  async getPendingRequests(): Promise<AdvisoryRequest[]> {
    const response = await apiClient.get<AdvisoryRequest[]>('/advisory-requests/pending');
    return response.data;
  }

  async approveRequest(
    requestId: string, 
    response: string
  ): Promise<AdvisoryRequest> {
    const res = await apiClient.patch<AdvisoryRequest>(
      `/advisory-requests/${requestId}/approve`,
      { response }
    );
    return res.data;
  }

  async rejectRequest(
    requestId: string, 
    reason: string
  ): Promise<AdvisoryRequest> {
    const res = await apiClient.patch<AdvisoryRequest>(
      `/advisory-requests/${requestId}/reject`,
      { reason }
    );
    return res.data;
  }

  // Sesiones de asesoría
  async createDirectSession(data: CreateDirectSessionDto): Promise<Advisory> {
    const response = await apiClient.post<Advisory>('/advisories/direct-session', data);
    return response.data;
  }

  async getProfessorAdvisories(professorId: string): Promise<Advisory[]> {
    const response = await apiClient.get<Advisory[]>(`/advisories/professor/${professorId}`);
    return response.data;
  }

  async getStudentAdvisories(): Promise<Advisory[]> {
    const response = await apiClient.get<Advisory[]>('/advisories/student/my-advisories');
    return response.data;
  }
}

export const advisoryService = new AdvisoryService();
```

### 🔧 Paso 3: Configurar constantes

**📁 Crear src/utils/constants.ts:**
```typescript
import { UserRole, AdvisoryRequestStatus, AdvisoryStatus } from '../types/backend.types';

export const USER_ROLES = {
  STUDENT: UserRole.STUDENT,
  PROFESSOR: UserRole.PROFESSOR,  
  ADMIN: UserRole.ADMIN,
} as const;

export const REQUEST_STATUS = {
  PENDING: AdvisoryRequestStatus.PENDING,
  APPROVED: AdvisoryRequestStatus.APPROVED,
  REJECTED: AdvisoryRequestStatus.REJECTED,
  EXPIRED: AdvisoryRequestStatus.EXPIRED,
} as const;

export const ADVISORY_STATUS = {
  SCHEDULED: AdvisoryStatus.SCHEDULED,
  IN_PROGRESS: AdvisoryStatus.IN_PROGRESS,
  COMPLETED: AdvisoryStatus.COMPLETED,
  CANCELLED: AdvisoryStatus.CANCELLED,
} as const;

export const NAVIGATION_ITEMS = {
  STUDENT: [
    { label: 'Dashboard', path: '/dashboard', icon: 'Dashboard' },
    { label: 'Request Advisory', path: '/request-advisory', icon: 'Add' },
    { label: 'My Requests', path: '/my-requests', icon: 'Assignment' },
    { label: 'My Sessions', path: '/my-sessions', icon: 'Event' },
    { label: 'Invitations', path: '/invitations', icon: 'Mail' },
  ],
  PROFESSOR: [
    { label: 'Dashboard', path: '/dashboard', icon: 'Dashboard' },
    { label: 'Pending Requests', path: '/pending-requests', icon: 'Pending' },
    { label: 'My Sessions', path: '/professor-sessions', icon: 'Event' },
    { label: 'Create Session', path: '/create-session', icon: 'Add' },
    { label: 'My Availability', path: '/availability', icon: 'Schedule' },
  ],
  ADMIN: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'Dashboard' },
    { label: 'Users', path: '/admin/users', icon: 'People' },
    { label: 'Subjects', path: '/admin/subjects', icon: 'Book' },
    { label: 'Venues', path: '/admin/venues', icon: 'Room' },
    { label: 'Reports', path: '/admin/reports', icon: 'Analytics' },
  ],
} as const;

export const STATUS_COLORS = {
  [REQUEST_STATUS.PENDING]: 'warning',
  [REQUEST_STATUS.APPROVED]: 'success', 
  [REQUEST_STATUS.REJECTED]: 'error',
  [REQUEST_STATUS.EXPIRED]: 'default',
  
  [ADVISORY_STATUS.SCHEDULED]: 'info',
  [ADVISORY_STATUS.IN_PROGRESS]: 'warning',
  [ADVISORY_STATUS.COMPLETED]: 'success',
  [ADVISORY_STATUS.CANCELLED]: 'error',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh', 
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
  },
  ADVISORY_REQUESTS: {
    CREATE: '/advisory-requests',
    MY_REQUESTS: '/advisory-requests/my-requests',
    PENDING: '/advisory-requests/pending',
    APPROVE: (id: string) => `/advisory-requests/${id}/approve`,
    REJECT: (id: string) => `/advisory-requests/${id}/reject`,
  },
  ADVISORIES: {
    DIRECT_SESSION: '/advisories/direct-session',
    PROFESSOR: (id: string) => `/advisories/professor/${id}`,
    STUDENT_SESSIONS: '/advisories/student/my-advisories',
  },
} as const;
```

### 🔧 Paso 4: Actualizar AuthContext

**✏️ Modificar src/contexts/AuthContext.tsx:**
```typescript
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { User, UserRole } from '../types/backend.types';
import { authService } from '../services/auth.service';
import { toast } from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
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
      return { ...state, isLoading: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const authResponse = await authService.login({ email, password });
      const userProfile = await authService.getProfile();
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: userProfile });
      toast.success(`Welcome back, ${userProfile.name}!`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  }, []);

  const hasRole = useCallback((role: UserRole): boolean => {
    return state.user?.role === role;
  }, [state.user]);

  const hasPermission = useCallback((permission: string): boolean => {
    // Implementar lógica de permisos basada en roles
    if (!state.user) return false;
    
    // Ejemplo: Admin tiene todos los permisos
    if (state.user.role === UserRole.ADMIN) return true;
    
    // Aquí podrías implementar lógica más compleja
    return false;
  }, [state.user]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userProfile = await authService.getProfile();
          dispatch({ type: 'LOGIN_SUCCESS', payload: userProfile });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        authService.logout(); // Limpiar tokens inválidos
        dispatch({ type: 'LOGOUT' });
      }
    };

    checkAuth();
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    hasRole,
    hasPermission,
    clearError,
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
```

### 🔧 Paso 5: Configurar interceptors de Axios

**✏️ Modificar src/lib/axios.ts:**
```typescript
import axios, { AxiosError, AxiosResponse } from 'axios';
import { authService } from '../services/auth.service';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Crear instancia de axios
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Agregar token de autorización
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Manejar errores y refresh token
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const original = error.config;

    // Si el error es 401 y no es en la ruta de login
    if (error.response?.status === 401 && !original?.url?.includes('/auth/login')) {
      try {
        // Intentar renovar el token
        await authService.refreshToken();
        
        // Reintentar la petición original con el nuevo token
        const newToken = authService.getAccessToken();
        if (newToken && original) {
          original.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(original);
        }
      } catch (refreshError) {
        // Si falla el refresh, desloguear
        authService.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Manejo de otros errores
    switch (error.response?.status) {
      case 403:
        toast.error('You do not have permission to perform this action');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        if (error.message === 'Network Error') {
          toast.error('Network error. Check your connection.');
        }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

### ✅ Validación del Día 1

**🔧 Comandos de verificación:**
```bash
# Verificar que no hay errores de TypeScript
npm run type-check

# Verificar que el proyecto compila
npm run build

# Iniciar desarrollo
npm run dev
```

**✅ Checklist de validación:**
- [ ] No hay errores de TypeScript en la consola
- [ ] El proyecto compila sin errores
- [ ] Los tipos del backend están disponibles
- [ ] AuthContext está funcionando (verificar en React DevTools)
- [ ] Los interceptors de Axios están configurados

**🚨 Troubleshooting común:**
- **Error de imports:** Verificar paths relativos en los imports
- **Tipos no encontrados:** Asegurar que backend.types.ts está bien exportado
- **CORS error:** Verificar que VITE_API_URL está configurado correctamente

---

## 📅 DÍA 2: LAYOUT Y NAVEGACIÓN

### 📋 Checklist del Día 2
- [ ] Actualizar Navbar con menú dinámico
- [ ] Crear Sidebar responsive
- [ ] Implementar ProtectedRoute 
- [ ] Configurar navegación por roles
- [ ] Testing básico de componentes

### 🔧 Paso 1: Actualizar Navbar

**✏️ Modificar src/components/layout/Navbar.tsx:**
```typescript
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Notifications,
  Logout,
  Settings,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export function Navbar({ onMenuToggle, isMenuOpen }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  if (!user) return null;

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.primary.main,
      }}
    >
      <Toolbar>
        {/* Menu toggle para mobile/tablet */}
        <IconButton
          color="inherit"
          aria-label="toggle menu"
          onClick={onMenuToggle}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo y título */}
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 1,
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/dashboard')}
        >
          School Advisories
        </Typography>

        {/* Rol del usuario */}
        <Box sx={{ display: { xs: 'none', sm: 'block' }, mr: 2 }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
          </Typography>
        </Box>

        {/* Notificaciones */}
        <IconButton
          color="inherit"
          aria-label="notifications"
          onClick={handleNotificationsOpen}
          sx={{ mr: 1 }}
        >
          <Badge badgeContent={3} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        {/* Menú de perfil */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="large"
            aria-label="account menu"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar
              alt={user.name}
              src={user.profileImage}
              sx={{ width: 32, height: 32 }}
            >
              {user.name.charAt(0)}
            </Avatar>
          </IconButton>

          {!isMobile && (
            <Typography variant="body2" sx={{ ml: 1, opacity: 0.9 }}>
              {user.name}
            </Typography>
          )}
        </Box>

        {/* Menú desplegable de perfil */}
        <Menu
          anchorEl={anchorEl}
          id="primary-search-account-menu"
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleProfile}>
            <AccountCircle sx={{ mr: 1 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={() => navigate('/settings')}>
            <Settings sx={{ mr: 1 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>

        {/* Menú de notificaciones */}
        <Menu
          anchorEl={notificationsAnchor}
          keepMounted
          open={Boolean(notificationsAnchor)}
          onClose={handleNotificationsClose}
        >
          <MenuItem onClick={handleNotificationsClose}>
            No new notifications
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
```

### 🔧 Paso 2: Actualizar Sidebar

**✏️ Modificar src/components/layout/Sidebar.tsx:**
```typescript
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
  Collapse,
} from '@mui/material';
import {
  Dashboard,
  Add,
  Assignment,
  Event,
  Mail,
  Pending,
  Schedule,
  People,
  Book,
  Room,
  Analytics,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { NAVIGATION_ITEMS, USER_ROLES } from '../../utils/constants';

const DRAWER_WIDTH = 280;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const iconMap = {
  Dashboard,
  Add,
  Assignment,
  Event,
  Mail,
  Pending,
  Schedule,
  People,
  Book,
  Room,
  Analytics,
} as const;

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  if (!user) return null;

  const navigationItems = NAVIGATION_ITEMS[user.role] || [];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleExpandClick = (item: string) => {
    setExpandedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const isSelected = (path: string) => {
    return location.pathname === path;
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent /> : <Dashboard />;
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      <Divider />
      
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List>
          {navigationItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={isSelected(item.path)}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected(item.path) 
                      ? theme.palette.primary.contrastText 
                      : 'inherit',
                  }}
                >
                  {getIcon(item.icon)}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: isSelected(item.path) ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Información del usuario en la parte inferior */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <ListItemText
          primary={user.name}
          secondary={user.email}
          primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
          secondaryTypographyProps={{ variant: 'caption' }}
        />
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
```

### 🔧 Paso 3: Crear ProtectedRoute

**📁 Crear src/components/auth/ProtectedRoute.tsx:**
```typescript
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/backend.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requireAuth = true,
  fallback,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Si requiere autenticación y no está autenticado
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si no requiere autenticación, mostrar contenido
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Verificar roles permitidos
  if (allowedRoles && user) {
    if (!allowedRoles.includes(user.role)) {
      // Si hay fallback personalizado, mostrarlo
      if (fallback) {
        return <>{fallback}</>;
      }
      
      // Redireccionar según el rol del usuario
      const redirectPath = getRoleBasedPath(user.role);
      return <Navigate to={redirectPath} replace />;
    }
  }

  // Usuario autorizado, mostrar contenido
  return <>{children}</>;
}

// Función helper para obtener la ruta por defecto según el rol
function getRoleBasedPath(role: UserRole): string {
  switch (role) {
    case UserRole.STUDENT:
      return '/dashboard';
    case UserRole.PROFESSOR:
      return '/dashboard';
    case UserRole.ADMIN:
      return '/admin/dashboard';
    default:
      return '/dashboard';
  }
}

// Componente para páginas de error de autorización
export function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      p={3}
    >
      <Typography variant="h4" gutterBottom color="error">
        Access Denied
      </Typography>
      <Typography variant="body1" gutterBottom>
        You do not have permission to access this page.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate(getRoleBasedPath(user?.role || UserRole.STUDENT))}
        sx={{ mt: 2 }}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
}
```

### ✅ Validación del Día 2

**🔧 Comandos de verificación:**
```bash
# Iniciar desarrollo y probar
npm run dev

# Verificar responsive design
# Abrir DevTools → Toggle device emulation
```

**✅ Checklist de validación:**
- [ ] Navbar se muestra correctamente en mobile y desktop
- [ ] Sidebar se oculta/muestra correctamente
- [ ] Menú de navegación cambia según el rol del usuario
- [ ] ProtectedRoute redirige usuarios no autorizados
- [ ] Layout es responsive en móvil y tablet
- [ ] Iconos y estilos se muestran correctamente

---

**📝 Nota:** Esta guía continúa con los días restantes. ¿Te gustaría que complete los días 3-5 ahora, o prefieres implementar estos primeros pasos primero?