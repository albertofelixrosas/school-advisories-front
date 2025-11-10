# 🤖 Prompts Optimizados para GitHub Copilot

> **Propósito:** Maximizar la efectividad de GitHub Copilot con prompts específicos para este proyecto  
> **Contexto:** School Advisories Frontend - React + TypeScript + Material-UI

---

## 🎯 PROMPTS POR CATEGORÍA

### 🔐 AUTENTICACIÓN Y USUARIOS

**Para AuthContext:**
```typescript
// ✅ EXCELENTE PROMPT:
"Create a React AuthContext with JWT token management using the User and UserRole types from backend.types.ts, including login, logout, hasRole, and hasPermission methods with proper TypeScript typing"

// ✅ PARA PROTECTED ROUTES:
"Build a ProtectedRoute component using React Router that checks UserRole from backend.types.ts and redirects based on role: STUDENT to /dashboard, PROFESSOR to /dashboard, ADMIN to /admin/dashboard"

// ✅ PARA LOGIN FORM:
"Generate a Material-UI login form using React Hook Form with Zod validation, including email and password fields, proper error handling, and integration with AuthContext login method"
```

**Ejemplo específico:**
```typescript
// Copilot prompt: "Create login form with MUI and RHF for User from backend.types.ts"
```

---

### 🏠 DASHBOARD Y NAVEGACIÓN

**Para Dashboard por Rol:**
```typescript
// ✅ STUDENT DASHBOARD:
"Create a StudentDashboard component using Material-UI Grid and Cards, showing: pending advisory requests count, upcoming sessions this week, recent invitations, and quick action buttons based on NAVIGATION_ITEMS.STUDENT from constants.ts"

// ✅ PROFESSOR DASHBOARD:
"Build a ProfessorDashboard with MUI Cards displaying: pending requests to review, today's sessions with time, this week's availability slots, and statistics using AdvisoryRequest and Advisory types from backend.types.ts"

// ✅ ADMIN DASHBOARD:
"Generate an AdminDashboard with metrics cards showing total users by UserRole, monthly advisory statistics, and quick management links using Material-UI DataGrid for recent activity"
```

**Prompt con contexto específico:**
```typescript
// Copilot prompt: "Create responsive dashboard for PROFESSOR role using Advisory and AdvisoryRequest from backend.types.ts with MUI Cards and Charts"
```

---

### 📋 FORMULARIOS Y CRUD

**Para Solicitud de Asesoría:**
```typescript
// ✅ FORMULARIO DE SOLICITUD:
"Create a RequestAdvisoryForm component using React Hook Form, Zod validation, and Material-UI with fields: subject (Autocomplete), professor (Select based on subject), preferredDateTime (DateTimePicker), message (TextField multiline) based on CreateAdvisoryRequestDto from backend.types.ts"

// ✅ APROBACIÓN DE SOLICITUDES:
"Build an ApprovalDialog component with MUI Dialog containing AdvisoryRequest details, response TextField for professor feedback, and approve/reject buttons using the AdvisoryRequestStatus enum from backend.types.ts"

// ✅ LISTA CON FILTROS:
"Generate a filterable list component using MUI DataGrid with AdvisoryRequest data, status chips using AdvisoryRequestStatus colors from constants.ts, and action buttons for approve/reject"
```

---

### 📅 CALENDARIO Y SESIONES

**Para Sistema de Calendario:**
```typescript
// ✅ CALENDARIO DE SESIONES:
"Create a SessionCalendar component using MUI DatePicker and FullCalendar, displaying Advisory sessions with different colors by AdvisoryStatus from backend.types.ts, and click handler to show session details"

// ✅ CREAR SESIÓN DIRECTA:
"Build a CreateDirectSessionForm using React Hook Form with fields: date (DatePicker), startTime/endTime (TimePicker), venue (Select), topic (TextField), maxStudents (number), based on CreateDirectSessionDto from backend.types.ts"

// ✅ DISPONIBILIDAD SEMANAL:
"Generate a ProfessorAvailabilityForm with weekly time slots grid using MUI Grid, time pickers for start/end times, and checkboxes for each day of the week based on ProfessorAvailability type"
```

---

### 🔔 NOTIFICACIONES E INVITACIONES

**Para Sistema de Invitaciones:**
```typescript
// ✅ LISTA DE INVITACIONES:
"Create a StudentInvitationsList component using MUI List with StudentInvitation items from backend.types.ts, showing session details, accept/decline buttons, and invitation status chips with appropriate colors"

// ✅ INVITAR ESTUDIANTES:
"Build an InviteStudentsDialog with MUI Autocomplete for student selection, TextField for invitation message, and batch invite functionality using StudentInvitation type from backend.types.ts"

// ✅ CENTRO DE NOTIFICACIONES:
"Generate a NotificationCenter component with MUI List showing notifications history, mark as read functionality, and different notification types with icons based on notification content"
```

---

### 👥 ADMINISTRACIÓN

**Para Gestión de Usuarios:**
```typescript
// ✅ USER MANAGEMENT:
"Create an AdminUserManagement page with MUI DataGrid showing User entities from backend.types.ts, CRUD operations (create, edit, delete, activate/deactivate), role assignment, and filtering by UserRole"

// ✅ SUBJECT MANAGEMENT:
"Build a SubjectManagement component with MUI DataGrid for Subject entities, CRUD operations, professor assignment functionality, and integration with SubjectDetails from backend.types.ts"

// ✅ VENUE MANAGEMENT:
"Generate a VenueManagement page using MUI components for Venue CRUD operations, capacity management, and venue booking calendar integration"
```

---

### 📊 HOOKS PERSONALIZADOS

**Para TanStack Query Hooks:**
```typescript
// ✅ ADVISORY REQUESTS HOOK:
"Create a useAdvisoryRequests custom hook using TanStack Query with methods: createRequest (useMutation), getMyRequests (useQuery), approveRequest (useMutation with optimistic updates), based on AdvisoryRequest type from backend.types.ts"

// ✅ SESSIONS HOOK:
"Build a useAdvisorySessions hook with TanStack Query including: getMySessions, createDirectSession, inviteStudents mutations, and proper cache invalidation using Advisory type from backend.types.ts"

// ✅ AVAILABILITY HOOK:
"Generate a useProfessorAvailability hook for managing professor time slots with queries and mutations for ProfessorAvailability from backend.types.ts, including weekly view helpers"
```

---

## 🚀 PROMPTS AVANZADOS

### Context-Aware Prompts

**Usar referencias específicas:**
```typescript
// 🔥 SUPER EFECTIVO:
"Based on the ER diagram showing Advisory -> AdvisoryDate -> AdvisoryAttendance relationships, create a SessionAttendanceForm component using MUI CheckboxGroup for marking student attendance with AdvisoryAttendance status enum"

// 🔥 CON CASOS DE USO:
"Following use case UC-03 'Professor Approves Advisory Request' from the UML diagrams, implement the approval flow component with proper state management and user feedback using Material-UI Stepper"

// 🔥 CON API REFERENCE:
"Using the POST /advisory-requests endpoint from backend-api-reference.md, create a form submission handler with proper error handling, loading states, and success feedback using React Hook Form"
```

### Component Generation Prompts

**Para componentes complejos:**
```typescript
// ✅ COMPONENTE COMPLETO:
"Create a complete AdvisoryRequestCard component using Material-UI Card, showing AdvisoryRequest data from backend.types.ts with status chip, action buttons for professor approval, student details section, and responsive design for mobile/desktop"

// ✅ CON ESTADO Y EFECTOS:
"Build a SessionDetailsModal with MUI Dialog that fetches Advisory details using TanStack Query, displays participants list, attendance status, and provides action buttons based on user role from AuthContext"

// ✅ CON INTEGRACIÓN COMPLETA:
"Generate a complete RequestAdvisoryPage with form submission, success/error handling, loading states, navigation after submission, and integration with useAdvisoryRequests hook"
```

---

## 🎨 PROMPTS PARA UI/UX

### Material-UI Específicos

**Para layouts responsivos:**
```typescript
// ✅ RESPONSIVE GRID:
"Create a responsive MUI Grid layout for dashboard cards that shows 1 column on mobile, 2 on tablet, and 3 on desktop, with proper spacing and consistent card heights"

// ✅ DATA TABLE:
"Build a MUI DataGrid for AdvisoryRequest data with sortable columns, filtering by status, pagination, row selection, and custom action column with approve/reject buttons"

// ✅ FORMULARIO COMPLEJO:
"Design a multi-step MUI form using Stepper component for creating advisory sessions with validation on each step and summary before submission"
```

### Temas y Estilos

**Para theming:**
```typescript
// ✅ CUSTOM THEME:
"Create a Material-UI theme configuration for school advisories app with professional blue primary color, proper typography scale, and custom component overrides for buttons and cards"

// ✅ STYLED COMPONENTS:
"Generate styled MUI components for status chips using the STATUS_COLORS from constants.ts with proper contrast and accessibility"
```

---

## 🔧 PROMPTS PARA SERVICIOS Y LÓGICA

### API Integration

**Para servicios:**
```typescript
// ✅ API SERVICE:
"Create an advisoryService class with methods for all AdvisoryRequest CRUD operations using the API endpoints from backend-api-reference.md, with proper TypeScript typing and error handling"

// ✅ QUERY HOOKS:
"Build TanStack Query hooks for advisory management with proper cache keys, optimistic updates for approve/reject actions, and background refetching for real-time updates"
```

### Error Handling

**Para manejo de errores:**
```typescript
// ✅ ERROR BOUNDARY:
"Create a React Error Boundary component with Material-UI error display, retry functionality, and different fallback UIs for network errors vs application errors"

// ✅ TOAST SYSTEM:
"Build a centralized toast notification system using react-hot-toast with different styles for success/error/warning based on API response patterns"
```

---

## 🧪 PROMPTS PARA TESTING

### Unit Tests

**Para testing de componentes:**
```typescript
// ✅ COMPONENT TESTS:
"Write comprehensive tests for RequestAdvisoryForm component using React Testing Library, testing form validation, submission, error states, and user interactions"

// ✅ HOOK TESTS:
"Create tests for useAdvisoryRequests custom hook using TanStack Query testing utilities, mocking API calls and testing optimistic updates"

// ✅ INTEGRATION TESTS:
"Build integration tests for the complete advisory request flow from form submission to approval notification using MSW for API mocking"
```

---

## 📱 PROMPTS PARA RESPONSIVE DESIGN

### Mobile-First

**Para diseño móvil:**
```typescript
// ✅ MOBILE OPTIMIZED:
"Create a mobile-first AdvisoryRequestCard component with collapsible details, touch-friendly buttons, and optimized layout for small screens using Material-UI responsive utilities"

// ✅ ADAPTIVE NAVIGATION:
"Build a responsive navigation system that shows sidebar on desktop, bottom navigation on mobile, and appropriate drawer behavior on tablet"
```

---

## 🚨 PROMPTS PARA DEBUGGING

### Problem-Solving

**Para resolver problemas:**
```typescript
// ✅ DEBUG PROMPT:
"Help debug this TypeScript error in my useAdvisoryRequests hook where the AdvisoryRequest type from backend.types.ts is not being recognized properly in TanStack Query"

// ✅ PERFORMANCE:
"Optimize this Material-UI DataGrid component that's rendering slowly with 100+ AdvisoryRequest items, including virtualization and proper memoization"

// ✅ STATE MANAGEMENT:
"Fix this React state synchronization issue where the AuthContext user state is not updating consistently across components after login"
```

---

## 💡 MEJORES PRÁCTICAS PARA COPILOT

### 🎯 Estructura del Prompt Ideal

```typescript
// FORMATO EFECTIVO:
"[Action] + [Component Type] + [Technology Stack] + [Data Types] + [Specific Requirements]"

// EJEMPLO:
"Create a React component using Material-UI DataGrid displaying AdvisoryRequest data from backend.types.ts with sorting, filtering by status, and action buttons for approve/reject"
```

### 🔥 Tips para Máxima Efectividad

1. **Mencionar archivos específicos:** `"using backend.types.ts"`, `"from constants.ts"`
2. **Referenciar diagramas:** `"following the ER diagram"`, `"based on use case UC-05"`  
3. **Incluir stack técnico:** `"using Material-UI and React Hook Form"`
4. **Especificar tipos:** `"with AdvisoryRequest and User types"`
5. **Mencionar patrones:** `"using TanStack Query optimistic updates"`

### ⚡ Prompts de Alto Rendimiento

**Para generar código completo:**
```typescript
// 🚀 PROMPT COMPLETO:
"Create a complete AdvisoryManagement feature including: RequestAdvisoryForm with Zod validation, AdvisoryRequestsList with MUI DataGrid, useAdvisoryRequests hook with TanStack Query, and integration with AuthContext for role-based permissions, using types from backend.types.ts"
```

**Para troubleshooting:**
```typescript
// 🔧 DEBUGGING:
"Fix the TypeScript compilation errors in this component that uses AdvisoryRequest from backend.types.ts with Material-UI DataGrid, focusing on proper type definitions and prop passing"
```

---

**📝 Nota:** Estos prompts están optimizados específicamente para el contexto de tu proyecto. Actualízalos según evolucione tu código base.