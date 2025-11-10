# 🧪 Estrategia de Testing - School Advisories Frontend

> **Enfoque:** Pirámide de testing con enfoque en calidad y mantenibilidad  
> **Stack:** Vitest + React Testing Library + MSW + Playwright

---

## 🎯 FILOSOFÍA DE TESTING

### Principios Fundamentales
1. **Test-Driven Development (TDD)** para funcionalidades críticas
2. **Pirámide de Testing** - Mayor cantidad de unit tests, menos E2E
3. **Testing de Comportamiento** - Probar lo que hace el usuario, no la implementación
4. **Confidence-Driven Testing** - Tests que dan confianza en los deploys
5. **Fast Feedback** - Tests rápidos que se ejecutan frecuentemente

### Estrategia General
```
     /\
    /E2E\      End-to-End (5-10%)
   /______\    Critical user journeys
  /        \
 /Integration\ Integration Tests (15-25%)  
/____________\ Feature flows with API
\            /
 \ Unit     /  Unit Tests (70-80%)
  \________/   Components, hooks, utilities
```

---

## 🏗️ CONFIGURACIÓN DEL ENTORNO DE TESTING

### Stack de Testing
- **Unit Testing:** Vitest + React Testing Library
- **API Mocking:** MSW (Mock Service Worker)  
- **E2E Testing:** Playwright
- **Coverage:** c8 (integrado con Vitest)
- **Fixtures:** Testing Library User Event

### Configuración Base

**📁 vitest.config.ts:**
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    deps: {
      inline: ['@mui/material', '@emotion/react'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
```

**📁 src/test/setup.ts:**
```typescript
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';

// Setup MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};
```

---

## 🔧 TESTING UTILITIES

### Test Utils para React

**📁 src/test/utils.tsx:**
```typescript
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext';
import { User, UserRole } from '../types/backend.types';

// Mock theme para tests
const testTheme = createTheme();

// Mock user para tests
export const mockStudent: User = {
  id: '1',
  email: 'student@test.com',
  name: 'Test Student',
  role: UserRole.STUDENT,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockProfessor: User = {
  id: '2', 
  email: 'professor@test.com',
  name: 'Test Professor',
  role: UserRole.PROFESSOR,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockAdmin: User = {
  id: '3',
  email: 'admin@test.com', 
  name: 'Test Admin',
  role: UserRole.ADMIN,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

interface TestProvidersProps {
  children: React.ReactNode;
  user?: User | null;
  queryClient?: QueryClient;
}

export function TestProviders({ 
  children, 
  user = mockStudent,
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  }),
}: TestProvidersProps) {
  // Mock AuthContext value
  const mockAuthValue = {
    user,
    isAuthenticated: !!user,
    isLoading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    hasRole: vi.fn((role: UserRole) => user?.role === role),
    hasPermission: vi.fn(() => true),
    clearError: vi.fn(),
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={testTheme}>
        <BrowserRouter>
          <AuthContext.Provider value={mockAuthValue}>
            {children}
          </AuthContext.Provider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  user?: User | null;
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { user, queryClient, ...renderOptions } = options;

  return render(ui, {
    wrapper: ({ children }) => (
      <TestProviders user={user} queryClient={queryClient}>
        {children}
      </TestProviders>
    ),
    ...renderOptions,
  });
}

// Re-export everything
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
```

### MSW Setup

**📁 src/test/mocks/handlers.ts:**
```typescript
import { rest } from 'msw';
import { AdvisoryRequest, AdvisoryRequestStatus, User, UserRole } from '../../types/backend.types';

const API_URL = 'http://localhost:3000';

export const mockAdvisoryRequests: AdvisoryRequest[] = [
  {
    id: '1',
    studentId: '1',
    professorId: '2',
    subjectId: 'math-101',
    message: 'Need help with calculus',
    preferredDateTime: new Date().toISOString(),
    status: AdvisoryRequestStatus.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Más mock data...
];

export const handlers = [
  // Auth endpoints
  rest.post(`${API_URL}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: UserRole.STUDENT,
        },
      })
    );
  }),

  rest.get(`${API_URL}/auth/profile`, (req, res, ctx) => {
    const token = req.headers.get('Authorization');
    if (!token) {
      return res(ctx.status(401), ctx.json({ message: 'Unauthorized' }));
    }

    return res(
      ctx.status(200),
      ctx.json({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.STUDENT,
      })
    );
  }),

  // Advisory Requests endpoints
  rest.get(`${API_URL}/advisory-requests/my-requests`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockAdvisoryRequests)
    );
  }),

  rest.post(`${API_URL}/advisory-requests`, (req, res, ctx) => {
    const newRequest = {
      id: Date.now().toString(),
      ...req.body,
      status: AdvisoryRequestStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return res(
      ctx.status(201),
      ctx.json(newRequest)
    );
  }),

  rest.patch(`${API_URL}/advisory-requests/:id/approve`, (req, res, ctx) => {
    const { id } = req.params;
    const request = mockAdvisoryRequests.find(r => r.id === id);
    
    if (!request) {
      return res(ctx.status(404), ctx.json({ message: 'Request not found' }));
    }

    const updatedRequest = {
      ...request,
      status: AdvisoryRequestStatus.APPROVED,
      professorResponse: req.body.response,
      updatedAt: new Date().toISOString(),
    };

    return res(ctx.status(200), ctx.json(updatedRequest));
  }),

  // Error scenarios para testing
  rest.get(`${API_URL}/advisory-requests/error`, (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ message: 'Internal server error' })
    );
  }),
];
```

**📁 src/test/mocks/server.ts:**
```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

---

## 🧪 UNIT TESTING PATTERNS

### Testing Components

**Ejemplo: RequestAdvisoryForm.test.tsx:**
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockStudent } from '../test/utils';
import RequestAdvisoryForm from './RequestAdvisoryForm';

describe('RequestAdvisoryForm', () => {
  const mockOnSubmit = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form fields correctly', () => {
    renderWithProviders(<RequestAdvisoryForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/professor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preferred date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RequestAdvisoryForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/subject is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RequestAdvisoryForm onSubmit={mockOnSubmit} />);

    // Fill form
    await user.selectOptions(screen.getByLabelText(/subject/i), 'Math 101');
    await user.selectOptions(screen.getByLabelText(/professor/i), 'prof-1');
    await user.type(screen.getByLabelText(/message/i), 'Need help with calculus');
    
    // Submit
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        subjectId: 'Math 101',
        professorId: 'prof-1',
        message: 'Need help with calculus',
        preferredDateTime: expect.any(String),
      });
    });
  });

  it('should handle submission errors', async () => {
    const user = userEvent.setup();
    const mockOnSubmitError = vi.fn().mockRejectedValue(
      new Error('Network error')
    );
    
    renderWithProviders(<RequestAdvisoryForm onSubmit={mockOnSubmitError} />);

    // Fill and submit form
    await user.selectOptions(screen.getByLabelText(/subject/i), 'Math 101');
    await user.type(screen.getByLabelText(/message/i), 'Test message');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });
});
```

### Testing Custom Hooks

**Ejemplo: useAdvisoryRequests.test.ts:**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { TestProviders } from '../test/utils';
import { useAdvisoryRequests } from './useAdvisoryRequests';
import { server } from '../test/mocks/server';
import { rest } from 'msw';

describe('useAdvisoryRequests', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    
    return ({ children }: { children: React.ReactNode }) => (
      <TestProviders queryClient={queryClient}>{children}</TestProviders>
    );
  };

  it('should fetch advisory requests successfully', async () => {
    const { result } = renderHook(() => useAdvisoryRequests(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeDefined();
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    // Override MSW handler para simular error
    server.use(
      rest.get('*/advisory-requests/my-requests', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Server error' }));
      })
    );

    const { result } = renderHook(() => useAdvisoryRequests(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
  });

  it('should create advisory request successfully', async () => {
    const { result } = renderHook(() => useAdvisoryRequests(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const requestData = {
      subjectId: 'math-101',
      professorId: 'prof-1',
      message: 'Need help',
      preferredDateTime: new Date().toISOString(),
    };

    act(() => {
      result.current.createRequest.mutate(requestData);
    });

    await waitFor(() => 
      expect(result.current.createRequest.isSuccess).toBe(true)
    );

    expect(result.current.createRequest.data).toBeDefined();
  });
});
```

### Testing Services

**Ejemplo: advisoryService.test.ts:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { advisoryService } from './advisory.service';
import { AdvisoryRequestStatus } from '../types/backend.types';
import { server } from '../test/mocks/server';

describe('AdvisoryService', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('should create advisory request', async () => {
    const requestData = {
      subjectId: 'math-101',
      professorId: 'prof-1', 
      message: 'Need help with calculus',
      preferredDateTime: new Date().toISOString(),
    };

    const result = await advisoryService.createRequest(requestData);

    expect(result).toMatchObject({
      id: expect.any(String),
      status: AdvisoryRequestStatus.PENDING,
      ...requestData,
    });
  });

  it('should get user advisory requests', async () => {
    const requests = await advisoryService.getMyRequests();

    expect(Array.isArray(requests)).toBe(true);
    expect(requests.length).toBeGreaterThan(0);
    expect(requests[0]).toMatchObject({
      id: expect.any(String),
      status: expect.any(String),
      message: expect.any(String),
    });
  });

  it('should approve advisory request', async () => {
    const requestId = '1';
    const response = 'Approved for tomorrow';

    const result = await advisoryService.approveRequest(requestId, response);

    expect(result.status).toBe(AdvisoryRequestStatus.APPROVED);
    expect(result.professorResponse).toBe(response);
  });
});
```

---

## 🔗 INTEGRATION TESTING

### Testing Complete Flows

**Ejemplo: AdvisoryRequestFlow.test.tsx:**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockStudent, mockProfessor } from '../test/utils';
import { App } from '../App';

describe('Advisory Request Flow', () => {
  it('should allow student to request advisory and professor to approve', async () => {
    const user = userEvent.setup();
    
    // Render app as student
    renderWithProviders(<App />, { user: mockStudent });

    // Navigate to request page
    await user.click(screen.getByRole('link', { name: /request advisory/i }));

    // Fill request form
    await user.selectOptions(screen.getByLabelText(/subject/i), 'Math 101');
    await user.selectOptions(screen.getByLabelText(/professor/i), 'prof-1');
    await user.type(
      screen.getByLabelText(/message/i), 
      'Need help with integration by parts'
    );

    // Submit request
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/request submitted/i)).toBeInTheDocument();
    });

    // Switch to professor view
    renderWithProviders(<App />, { user: mockProfessor });

    // Navigate to pending requests
    await user.click(screen.getByRole('link', { name: /pending requests/i }));

    // Find the request
    await waitFor(() => {
      expect(screen.getByText(/integration by parts/i)).toBeInTheDocument();
    });

    // Approve request
    await user.click(screen.getByRole('button', { name: /approve/i }));
    await user.type(
      screen.getByLabelText(/response/i), 
      'Approved. Meet me tomorrow at 2 PM'
    );
    await user.click(screen.getByRole('button', { name: /confirm approval/i }));

    // Verify approval
    await waitFor(() => {
      expect(screen.getByText(/request approved/i)).toBeInTheDocument();
    });
  });
});
```

---

## 🎭 E2E TESTING WITH PLAYWRIGHT

### Setup de Playwright

**📁 playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

**📁 e2e/auth.spec.ts:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login as student and access dashboard', async ({ page }) => {
    await page.goto('/');

    // Should redirect to login
    await expect(page).toHaveURL('/login');

    // Fill login form
    await page.fill('[data-testid="email"]', 'student@test.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Student Dashboard');

    // Should show student-specific navigation
    await expect(page.locator('[data-testid="nav-request-advisory"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-my-requests"]')).toBeVisible();
  });

  test('should prevent unauthorized access to professor pages', async ({ page }) => {
    // Login as student
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'student@test.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Try to access professor page
    await page.goto('/pending-requests');

    // Should redirect to unauthorized or student dashboard
    await expect(page).toHaveURL('/dashboard');
  });
});
```

**📁 e2e/advisory-flow.spec.ts:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Advisory Request Flow', () => {
  test('should complete full advisory request flow', async ({ page }) => {
    // Login as student
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'student@test.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Navigate to request form
    await page.click('[data-testid="nav-request-advisory"]');
    await expect(page).toHaveURL('/request-advisory');

    // Fill form
    await page.selectOption('[data-testid="subject-select"]', 'Math 101');
    await page.selectOption('[data-testid="professor-select"]', 'prof-1');
    await page.fill('[data-testid="message-input"]', 'Need help with calculus');

    // Submit
    await page.click('[data-testid="submit-button"]');

    // Verify success
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

    // Logout and login as professor
    await page.click('[data-testid="logout-button"]');
    await page.fill('[data-testid="email"]', 'professor@test.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Go to pending requests
    await page.click('[data-testid="nav-pending-requests"]');

    // Find and approve request
    const requestCard = page.locator('[data-testid="request-card"]').first();
    await expect(requestCard).toContainText('Need help with calculus');
    
    await requestCard.locator('[data-testid="approve-button"]').click();
    await page.fill('[data-testid="response-input"]', 'Approved for tomorrow');
    await page.click('[data-testid="confirm-approve-button"]');

    // Verify approval
    await expect(page.locator('[data-testid="approval-success"]')).toBeVisible();
  });
});
```

---

## 📊 COVERAGE Y CALIDAD

### Coverage Targets

```typescript
// Target coverage percentages
const coverageTargets = {
  statements: 80,
  branches: 80, 
  functions: 80,
  lines: 80,
};

// Archivos críticos que requieren >90% coverage
const criticalFiles = [
  'src/contexts/AuthContext.tsx',
  'src/services/auth.service.ts',
  'src/hooks/useAdvisoryRequests.ts',
  'src/components/auth/ProtectedRoute.tsx',
];
```

### Quality Gates

**📁 package.json scripts:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test:run && npm run test:e2e"
  }
}
```

---

## 🚨 TROUBLESHOOTING TESTING

### Problemas Comunes

**Material-UI Testing Issues:**
```typescript
// Error: Cannot read property 'breakpoints' of undefined
// Solución: Wrap con ThemeProvider en tests
```

**TanStack Query Testing:**
```typescript
// Error: Query client not found
// Solución: Usar QueryClientProvider con mock client
```

**MSW Handler Issues:**
```typescript
// Error: Request not intercepted
// Solución: Verificar URL patterns y setup correcto
```

### Debug Helpers

**📁 src/test/debug.ts:**
```typescript
export const debugQuery = (queryClient: QueryClient, key: string) => {
  console.log('Query state:', queryClient.getQueryState(key));
  console.log('Query data:', queryClient.getQueryData(key));
};

export const debugComponent = (component: ReactWrapper) => {
  console.log('Component debug:', component.debug());
};
```

---

## 🔄 CI/CD INTEGRATION

### GitHub Actions

**📁 .github/workflows/test.yml:**
```yaml
name: Test Suite

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run unit tests
        run: npm run test:coverage
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        
      - name: Install Playwright
        run: npx playwright install
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Upload E2E results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

**📝 Nota:** Esta estrategia de testing está diseñada para crecer con el proyecto y asegurar calidad desde el día uno.