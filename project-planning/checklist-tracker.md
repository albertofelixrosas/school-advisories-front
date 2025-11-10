# ✅ CHECKLIST DE DESARROLLO - School Advisories Frontend

> **📅 Fecha de actualización:** 10 de Noviembre, 2025  
> **👨‍💻 Desarrollador:** Alberto Felix Rosas  
> **🚀 Estado actual:** Fase 1 - Fundación (Día 1)

---

## 🎯 FASE 1: FUNDACIÓN Y AUTENTICACIÓN (Semana 1-2)

### 📅 DÍA 1 - Setup Base y Tipos (10 Nov 2025)

#### 🔄 Tipos y Servicios Base (4 horas)
- [ ] **Copiar tipos del backend**
  - [ ] Copiar `docs/frontend-integration/backend-types.ts` → `src/types/backend.types.ts`
  - [ ] Actualizar exports en `src/types/index.ts`
  - [ ] Verificar imports en archivos existentes

- [ ] **Crear servicios base**
  - [ ] Crear `src/services/auth.service.ts` con métodos JWT
  - [ ] Crear `src/services/advisory.service.ts` con métodos de asesorías
  - [ ] Crear `src/utils/constants.ts` con enums y configuración
  - [ ] Actualizar `src/services/index.ts` con nuevos exports

- [ ] **Setup AuthContext robusto**
  - [ ] Actualizar `src/contexts/AuthContext.tsx` con manejo de roles
  - [ ] Implementar refresh token logic
  - [ ] Agregar interceptors de Axios para tokens
  - [ ] Testing básico de login/logout

#### ✅ Criterios de éxito del Día 1:
- [ ] Tipos del backend integrados y sin errores TypeScript
- [ ] AuthContext funcional con JWT y refresh
- [ ] Login básico funcionando
- [ ] Redirección automática por rol

---

### 📅 DÍA 2 - Layout y Navegación (11 Nov 2025)

#### 🎨 Layout Responsivo (4 horas)
- [ ] **Navbar dinámico**
  - [ ] Crear `src/components/layout/Navbar.tsx` con menú por rol
  - [ ] Implementar logout y profile dropdown
  - [ ] Responsive design con Material-UI
  - [ ] Notificaciones badge counter

- [ ] **Sidebar colapsable**
  - [ ] Actualizar `src/components/layout/Sidebar.tsx`
  - [ ] Menú diferente por UserRole (STUDENT, PROFESSOR, ADMIN)
  - [ ] Estado colapsado/expandido persistente
  - [ ] Icons de Material-UI

- [ ] **ProtectedRoute**
  - [ ] Crear `src/components/auth/ProtectedRoute.tsx`
  - [ ] Validación de roles específicos
  - [ ] Redirección a login si no autenticado
  - [ ] Loading state durante verificación

#### ✅ Criterios de éxito del Día 2:
- [ ] Layout principal responsive y funcional
- [ ] Navegación específica por rol
- [ ] Rutas protegidas funcionando
- [ ] UI/UX profesional con Material-UI

---

### 📅 DÍA 3 - Login y Dashboard Base (12 Nov 2025)

#### 🔐 Sistema de Login (2 horas)
- [ ] **LoginForm completo**
  - [ ] Actualizar `src/pages/auth/LoginPage.tsx`
  - [ ] Validación con Zod schema
  - [ ] Error handling y user feedback
  - [ ] Loading states y disabled buttons

#### 🏠 Dashboard por Rol (6 horas)
- [ ] **StudentDashboard**
  - [ ] Crear `src/pages/student/StudentDashboard.tsx`
  - [ ] Cards: Mis solicitudes, Próximas sesiones, Invitaciones
  - [ ] Quick stats con números
  - [ ] Links a acciones principales

- [ ] **ProfessorDashboard**
  - [ ] Crear `src/pages/professor/ProfessorDashboard.tsx` 
  - [ ] Cards: Solicitudes pendientes, Sesiones del día, Mi disponibilidad
  - [ ] Calendario mini con próximos eventos
  - [ ] Estadísticas personales

- [ ] **AdminDashboard**
  - [ ] Crear `src/pages/admin/AdminDashboard.tsx`
  - [ ] Métricas del sistema (usuarios activos, sesiones)
  - [ ] Gráficos con Chart.js o similar
  - [ ] Links a gestión de usuarios/configuración

#### ✅ Criterios de éxito del Día 3:
- [ ] Login funcional con 3 usuarios de prueba
- [ ] 3 dashboards únicos y funcionales
- [ ] Redirección automática post-login
- [ ] Datos ficticios bien presentados

---

### 📅 DÍA 4-5 - Primer Flujo Funcional (13-14 Nov 2025)

#### 🎯 Solicitud de Asesoría (8 horas)
- [ ] **Form de Solicitud (Estudiante)**
  - [ ] Crear `src/pages/student/RequestAdvisoryPage.tsx`
  - [ ] Selector de materia (dropdown con search)
  - [ ] Selector de profesor por materia
  - [ ] DateTimePicker para horario preferido
  - [ ] Textarea para mensaje/descripción
  - [ ] Validación completa con Zod

- [ ] **Lista de Solicitudes Pendientes (Profesor)**
  - [ ] Crear `src/pages/professor/PendingRequestsPage.tsx`
  - [ ] DataGrid con filtros por status
  - [ ] Modal de aprobación con respuesta
  - [ ] Modal de rechazo con razón
  - [ ] Refresh automático de datos

- [ ] **Hooks personalizados**
  - [ ] Crear `src/hooks/useAdvisoryRequests.ts`
  - [ ] Implementar con TanStack Query
  - [ ] CRUD completo: create, approve, reject, list
  - [ ] Cache y optimistic updates

#### 📡 Integración con API
- [ ] **Endpoints funcionando**
  - [ ] `POST /advisory-requests` (crear solicitud)
  - [ ] `GET /advisory-requests/pending` (profesor)
  - [ ] `GET /advisory-requests/my-requests` (estudiante)
  - [ ] `PATCH /advisory-requests/:id/approve`
  - [ ] `PATCH /advisory-requests/:id/reject`

#### ✅ Criterios de éxito del Día 4-5:
- [ ] Flujo completo funcional: solicitar → aprobar/rechazar
- [ ] Estados en tiempo real sin refresh manual
- [ ] Validaciones robustas en formularios
- [ ] Error handling completo
- [ ] UI/UX intuitiva y responsiva

---

## 🎯 FASE 2: FUNCIONALIDAD CORE (Semana 2)

### 📅 DÍA 6-7 - Gestión de Solicitudes Completa
- [ ] CRUD completo de advisory requests
- [ ] Estados visuales con Material-UI Chips
- [ ] Filtros avanzados y búsqueda
- [ ] Paginación y sorting

### 📅 DÍA 8-9 - Sistema de Sesiones
- [ ] Crear sesión directa (profesor)
- [ ] Calendario de sesiones con Material-UI
- [ ] Gestión de venues y capacidad
- [ ] Lista de mis sesiones (estudiante)

### 📅 DÍA 10 - Disponibilidad de Profesores
- [ ] Form de disponibilidad recurrente
- [ ] Vista de horarios disponibles
- [ ] Integración con calendario principal
- [ ] Máximo estudiantes por slot

---

## 🎯 FASE 3: FEATURES AVANZADOS (Semana 3)

### 📅 DÍA 11-12 - Sistema de Invitaciones
- [ ] Invitar estudiantes a sesiones
- [ ] Responder invitaciones (accept/decline)
- [ ] Seguimiento de respuestas en tiempo real

### 📅 DÍA 13-14 - Control de Asistencia
- [ ] Marcar asistencia durante sesión
- [ ] Estados: PRESENT, ABSENT, LATE
- [ ] Completar sesión con resumen

### 📅 DÍA 15 - Administración
- [ ] UserManagement con DataGrid
- [ ] CRUD de subjects y venues
- [ ] Asignación profesor-materia

---

## 🎯 FASE 4: POLISH Y TESTING (Semana 4)

### 📅 DÍA 16-17 - Notificaciones
- [ ] NotificationCenter con historial
- [ ] Toast notifications en tiempo real
- [ ] Preferencias de usuario

### 📅 DÍA 18-19 - Testing y QA
- [ ] Tests unitarios con Vitest
- [ ] Tests de integración key flows
- [ ] Error boundaries y loading states

### 📅 DÍA 20 - Deployment Ready
- [ ] Environment variables
- [ ] Build optimization
- [ ] Documentation update

---

## 📊 PROGRESO GENERAL

**Fase 1:** ⬜ 0% (0/5 días completados)  
**Fase 2:** ⬜ 0% (0/5 días completados)  
**Fase 3:** ⬜ 0% (0/5 días completados)  
**Fase 4:** ⬜ 0% (0/5 días completados)  

**PROGRESO TOTAL:** 0% (0/20 días completados)

---

## 🚨 BLOQUEADORES Y NOTAS

### Bloqueadores Actuales:
- [ ] Ninguno identificado

### Decisiones Pendientes:
- [ ] ¿Usar React Hook Form o Formik para forms complejos?
- [ ] ¿Implementar dark mode desde el inicio?
- [ ] ¿Usar React Query DevTools en desarrollo?

### Notas Importantes:
- ✅ Documentación backend completa y suficiente
- ✅ Diagramas ER y UML disponibles
- ✅ API endpoints documentados (83 endpoints)
- ✅ Tipos TypeScript del backend listos

---

## 🔄 INSTRUCCIONES DE USO

1. **Marcar tareas completadas** cambiando `[ ]` por `[x]`
2. **Actualizar fecha** en cada sesión de trabajo
3. **Agregar notas** en la sección correspondiente
4. **Reportar bloqueadores** inmediatamente
5. **Actualizar progreso general** al final del día

**💡 Tip:** Revisa este checklist al inicio y final de cada día de trabajo.