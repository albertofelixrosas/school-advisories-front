import { useAuth as useAuthContext } from '../contexts/AuthContext';
import { UserRole } from '../types/backend.types';

// Re-export del hook principal para compatibilidad
export { useAuth } from '../contexts/AuthContext';

// ===== ROLE-BASED HOOKS =====
export function useIsStudent() {
  const { hasRole } = useAuthContext();
  return hasRole(UserRole.STUDENT);
}

export function useIsProfessor() {
  const { hasRole } = useAuthContext();
  return hasRole(UserRole.PROFESSOR);
}

export function useIsAdmin() {
  const { hasRole } = useAuthContext();
  return hasRole(UserRole.ADMIN);
}

// ===== PERMISSION HOOK =====
export function usePermission(permission: string) {
  const { hasPermission } = useAuthContext();
  return hasPermission(permission);
}

// ===== CONVENIENCE HOOKS =====
export function useUserRole() {
  const { user } = useAuthContext();
  return user?.role || null;
}

export function useUserName() {
  const { user } = useAuthContext();
  return user?.name || '';
}

export function useUserId() {
  const { user } = useAuthContext();
  return user?.user_id || null;
}
