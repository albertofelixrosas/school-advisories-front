# 🏛️ Decisiones de Arquitectura - School Advisories Frontend

> **Fecha:** 10 de Noviembre, 2025  
> **Versión:** 1.0  
> **Estado:** Decisiones iniciales aprobadas

---

## 🎯 FILOSOFÍA DE ARQUITECTURA

### Principios Fundamentales
1. **Separation of Concerns** - Cada capa tiene una responsabilidad específica
2. **Type Safety** - TypeScript estricto en todo el proyecto
3. **Performance First** - Optimizaciones desde el diseño inicial
4. **User Experience** - UI/UX como prioridad en todas las decisiones
5. **Maintainability** - Código fácil de leer, modificar y extender

### Enfoque de Desarrollo
- **API-First Development** - Frontend independiente del backend
- **Component-Driven Development** - Componentes reutilizables y testeable
- **Data-Driven UI** - Estados derivados de datos del servidor
- **Progressive Enhancement** - Funcionalidad base + mejoras incrementales

---

## 🏗️ ARQUITECTURA DE CAPAS

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐│
│  │   Pages     │ │ Components  │ │      Layouts        ││
│  │             │ │             │ │                     ││
│  └─────────────┘ └─────────────┘ └─────────────────────┘│
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐│
│  │    Hooks    │ │   Context   │ │      Services       ││
│  │             │ │             │ │                     ││
│  └─────────────┘ └─────────────┘ └─────────────────────┘│
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                     DATA ACCESS LAYER                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐│
│  │ API Client  │ │    Cache    │ │       Types         ││
│  │             │ │ (TanStack)  │ │                     ││
│  └─────────────┘ └─────────────┘ └─────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

---

## 📁 ESTRUCTURA DE DIRECTORIOS

### Decisión: Arquitectura Feature-Based + Domain-Driven

```typescript
src/
├── app/                          # App configuration
│   ├── App.tsx                   # Main App component
│   ├── providers/                # Global providers
│   └── router/                   # Route configuration
├── shared/                       # Shared across domains
│   ├── components/               # Reusable UI components
│   ├── hooks/                    # Generic hooks
│   ├── services/                 # Core services (auth, api)
│   ├── types/                    # Global types
│   ├── utils/                    # Utility functions
│   └── constants/                # App constants
├── features/                     # Feature-based modules
│   ├── auth/                     # Authentication feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── pages/
│   ├── advisories/               # Advisory management
│   ├── dashboard/                # Dashboard feature
│   ├── schedule/                 # Scheduling feature
│   └── admin/                    # Admin panel
├── layouts/                      # Page layouts
└── pages/                        # Route pages (thin wrappers)
```

**Justificación:**
- ✅ Escalabilidad por features
- ✅ Separación clara de responsabilidades
- ✅ Reutilización de componentes shared
- ✅ Testing más fácil por dominio
- ✅ Teams pueden trabajar en features independientes

---

## 🔧 DECISIONES TÉCNICAS

### 1. **Estado Global vs Local**

**Decisión:** Hybrid approach con Context + TanStack Query

```typescript
// Global State (React Context)
- Auth state (user, tokens, permissions)
- Theme settings
- UI preferences (sidebar collapsed, etc.)

// Server State (TanStack Query)
- All API data (advisories, users, schedules)
- Cache management
- Background refetching

// Local State (useState/useReducer)
- Form state
- Modal open/close
- Temporary UI state
```

**Justificación:**
- ✅ Context para datos que cambian poco
- ✅ TanStack Query maneja server state + cache
- ✅ Evita over-engineering con Redux
- ✅ Performance optimizada

### 2. **Manejo de Formularios**

**Decisión:** React Hook Form + Zod

```typescript
// Example pattern
const schema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message too short'),
});

const { register, handleSubmit, formState } = useForm({
  resolver: zodResolver(schema)
});
```

**Justificación:**
- ✅ Performance superior (menos re-renders)
- ✅ Zod para validación type-safe
- ✅ Integración perfecta con TypeScript
- ✅ API simple y declarativa

### 3. **HTTP Client y API Calls**

**Decisión:** Axios + TanStack Query

```typescript
// API Client pattern
class ApiClient {
  private axios: AxiosInstance;
  
  constructor() {
    this.axios = axios.create({
      baseURL: process.env.VITE_API_URL,
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // Request interceptor (auth tokens)
    // Response interceptor (error handling)
  }
}
```

**Justificación:**
- ✅ Axios: HTTP client maduro y feature-rich
- ✅ Interceptors para auth y error handling
- ✅ TanStack Query: Cache, background sync, optimistic updates
- ✅ Type-safe con TypeScript

### 4. **Autenticación y Autorización**

**Decisión:** JWT + Refresh Token + Role-Based Access Control

```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Route protection
<ProtectedRoute 
  allowedRoles={[UserRole.PROFESSOR]} 
  fallback={<UnauthorizedPage />}
>
  <ProfessorDashboard />
</ProtectedRoute>
```

**Features:**
- ✅ Automatic token refresh
- ✅ Role-based route protection
- ✅ Automatic logout on token expiry
- ✅ Remember me functionality

### 5. **UI/UX Framework**

**Decisión:** Material-UI (MUI) v5 + Custom Theme

```typescript
// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Professional blue
    },
    secondary: {
      main: '#dc004e', // Accent color
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
  },
});
```

**Justificación:**
- ✅ Component library maduro y completo
- ✅ Excellent TypeScript support
- ✅ Accessibility built-in (WCAG 2.1)
- ✅ Professional design system
- ✅ Responsive by default

### 6. **Data Fetching Strategy**

**Decisión:** TanStack Query con Optimistic Updates

```typescript
// Custom hook pattern
export function useAdvisoryRequests() {
  return useQuery({
    queryKey: ['advisory-requests'],
    queryFn: () => advisoryApi.getRequests(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Mutation with optimistic update
export function useApproveRequest() {
  return useMutation({
    mutationFn: advisoryApi.approveRequest,
    onMutate: async (requestId) => {
      // Optimistic update
      await queryClient.cancelQueries(['advisory-requests']);
      // ... update logic
    },
  });
}
```

**Features:**
- ✅ Automatic background refetching
- ✅ Optimistic updates for better UX
- ✅ Error handling with retry logic
- ✅ Cache invalidation strategies

---

## 🎨 PATRONES DE DISEÑO

### 1. **Component Composition Pattern**

```typescript
// Flexible composition over inheritance
<Modal>
  <Modal.Header>
    <Modal.Title>Approve Request</Modal.Title>
    <Modal.CloseButton />
  </Modal.Header>
  <Modal.Body>
    <ApprovalForm requestId={requestId} />
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Approve</Button>
  </Modal.Footer>
</Modal>
```

### 2. **Custom Hook Pattern**

```typescript
// Encapsulate business logic in hooks
export function useRequestApproval(requestId: string) {
  const approve = useApproveRequest();
  const reject = useRejectRequest();
  
  const handleApprove = useCallback((data: ApprovalData) => {
    approve.mutate({ requestId, ...data });
  }, [requestId, approve]);
  
  return {
    approve: handleApprove,
    reject: (reason: string) => reject.mutate({ requestId, reason }),
    isLoading: approve.isLoading || reject.isLoading,
  };
}
```

### 3. **Provider Pattern**

```typescript
// Context providers for shared state
export function AuthProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  const login = useCallback(async (credentials: LoginCredentials) => {
    // Login logic
  }, []);
  
  const value = useMemo(() => ({
    ...state,
    login,
    logout,
  }), [state, login]);
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 4. **Error Boundary Pattern**

```typescript
// Graceful error handling
<ErrorBoundary fallback={<ErrorFallback />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</ErrorBoundary>
```

---

## 🚨 ERROR HANDLING STRATEGY

### 1. **API Error Handling**

```typescript
// Centralized error handling
class ApiErrorHandler {
  static handle(error: AxiosError) {
    switch (error.response?.status) {
      case 401:
        // Redirect to login
        authService.logout();
        break;
      case 403:
        // Show unauthorized message
        toast.error('You do not have permission');
        break;
      case 500:
        // Show generic error
        toast.error('Server error. Please try again.');
        break;
    }
  }
}
```

### 2. **User-Friendly Error Messages**

```typescript
const ERROR_MESSAGES = {
  'ADVISORY_REQUEST_ALREADY_EXISTS': 
    'You already have a pending request for this subject',
  'PROFESSOR_NOT_AVAILABLE': 
    'Professor is not available at the selected time',
  'SESSION_FULL': 
    'This session is already at maximum capacity',
} as const;
```

### 3. **Error Recovery**

```typescript
// Retry mechanisms
export function useRetryableQuery<T>(
  queryKey: QueryKey,
  queryFn: QueryFunction<T>
) {
  return useQuery({
    queryKey,
    queryFn,
    retry: (failureCount, error) => {
      // Retry up to 3 times for network errors
      return failureCount < 3 && isNetworkError(error);
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
```

---

## 🔐 SECURITY CONSIDERATIONS

### 1. **Authentication Security**

- ✅ JWT tokens stored in memory (not localStorage)
- ✅ Refresh token in httpOnly cookie
- ✅ Automatic token rotation
- ✅ CSRF protection for state-changing operations

### 2. **Route Protection**

```typescript
// Multi-level protection
<ProtectedRoute 
  requireAuth={true}
  allowedRoles={[UserRole.PROFESSOR]}
  requiredPermissions={['MANAGE_ADVISORIES']}
>
  <ProfessorAdvisories />
</ProtectedRoute>
```

### 3. **Input Validation**

- ✅ Client-side validation with Zod schemas
- ✅ XSS prevention with DOMPurify
- ✅ File upload validation (size, type)
- ✅ SQL injection prevention (server validates)

---

## 📱 RESPONSIVE DESIGN STRATEGY

### Breakpoint System
```typescript
const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '900px', 
  lg: '1200px',
  xl: '1536px',
} as const;

// Mobile-first approach
const useResponsive = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  
  return { isMobile, isTablet };
};
```

### Progressive Enhancement
1. **Mobile First** - Base styles for mobile
2. **Progressive Enhancement** - Add features for larger screens
3. **Touch Optimization** - Touch-friendly interactions
4. **Performance** - Code splitting by screen size

---

## 🧪 TESTING ARCHITECTURE

### 1. **Testing Pyramid**

```
     /\
    /E2E\      End-to-End (10%)
   /______\    
  /        \
 /Integration\ Integration Tests (20%)
/____________\
\            /
 \ Unit     /  Unit Tests (70%)
  \________/
```

### 2. **Testing Tools Stack**

- **Unit Tests:** Vitest + React Testing Library
- **Integration:** Testing Library + MSW (Mock Service Worker)
- **E2E:** Playwright (critical paths only)
- **Visual:** Chromatic / Storybook (if needed)

### 3. **Testing Patterns**

```typescript
// Test structure pattern
describe('AdvisoryRequestForm', () => {
  it('should submit valid request', async () => {
    // Arrange
    render(<AdvisoryRequestForm />, { wrapper: TestWrapper });
    
    // Act
    await user.type(screen.getByLabelText(/subject/i), 'Mathematics');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    // Assert
    expect(mockSubmit).toHaveBeenCalledWith({
      subject: 'Mathematics',
      // ...
    });
  });
});
```

---

## 📊 PERFORMANCE STRATEGY

### 1. **Code Splitting**

```typescript
// Route-based splitting
const ProfessorDashboard = lazy(() => import('./pages/ProfessorDashboard'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

// Component-based splitting
const HeavyChart = lazy(() => import('./components/HeavyChart'));
```

### 2. **Optimization Techniques**

- ✅ **React.memo** for expensive components
- ✅ **useMemo** for expensive calculations
- ✅ **useCallback** for stable function references
- ✅ **Virtual scrolling** for large lists
- ✅ **Image optimization** with next-gen formats

### 3. **Bundle Optimization**

```typescript
// Vite configuration
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@mui/material', '@mui/icons-material'],
          forms: ['react-hook-form', 'zod'],
        },
      },
    },
  },
});
```

---

## 🔄 STATE MANAGEMENT DECISIONS

### Global State Architecture

```typescript
// 1. Authentication Context (Global)
interface AuthContextValue {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
}

// 2. Theme Context (Global)
interface ThemeContextValue {
  mode: 'light' | 'dark';
  toggleMode: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

// 3. Server State (TanStack Query)
// All API data managed by React Query
// Automatic caching, background sync, optimistic updates
```

---

**📝 Nota:** Este documento se actualiza conforme evolucionan las decisiones arquitectónicas del proyecto.