import type React from "react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../contexts";
import type {
  User,
  UserRole,
  LoginDto,
  AuthError,
  DashboardData,
} from "../types/backend.types";
import { authService } from "../services/auth.service";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Estado principal
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [error, setError] = useState<AuthError | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  // Estado calculado
  const isAuthenticated = Boolean(user && token);

  // Inicialización al cargar la aplicación
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = authService.getStoredToken();
      const storedRefreshToken = authService.getStoredRefreshToken();
      const storedUser = localStorage.getItem("user");

      if (storedToken && authService.isTokenValid() && storedUser) {
        // Restaurar sesión válida
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        setUser(JSON.parse(storedUser));

        // Restaurar datos del dashboard si existen
        const storedDashboardData = localStorage.getItem("dashboard_data");
        if (storedDashboardData) {
          setDashboardData(JSON.parse(storedDashboardData));
        }

        console.log("🔄 Sesión restaurada desde localStorage");
      } else {
        // Limpiar tokens inválidos
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        localStorage.removeItem("dashboard_data");
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Función de login real
  const login = async (credentials: LoginDto) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authService.login(credentials);

      // Usar datos del backend
      setUser(response.user);
      setToken(response.accessToken);
      setRefreshToken(response.refreshToken || null);
      // dashboardData no está en AuthResponse por ahora

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(response.user));
      // localStorage.setItem("dashboard_data", JSON.stringify(response.dashboard_data))

      toast.success(`¡Bienvenido ${response.user.name}!`);
    } catch (err: unknown) {
      console.log("❌ Error de login:", err);
      const authError: AuthError = {
        message: err instanceof Error ? err.message : "Error al iniciar sesión",
        statusCode: 401,
      };
      setError(authError);
      toast.error(authError.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Función de registro
  const register = async (
    username: string,
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => {
    try {
      setError(null);
      setIsLoading(true);

      // TODO: Implementar llamada real al backend cuando esté disponible
      console.log("🔐 Registro solicitado:", { username, email, name, role });

      // Por ahora, mostrar mensaje de que no está implementado
      const authError: AuthError = {
        message:
          "El registro de usuarios no está implementado. Contacta al administrador.",
        statusCode: 501,
      };
      setError(authError);
      toast.error(authError.message);
    } catch (err: unknown) {
      const authError: AuthError = {
        message: err instanceof Error ? err.message : "Error al crear cuenta",
        statusCode: 400,
      };
      setError(authError);
      toast.error(authError.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      // TODO: Activar cuando el backend esté listo
      // await authService.logout()
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      setError(null);
      setDashboardData(null);
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("dashboard_data");
      toast.success("Sesión cerrada");
    }
  };

  // Función para refrescar tokens
  const refreshTokens = async () => {
    try {
      const storedRefreshToken = authService.getStoredRefreshToken();

      if (!storedRefreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await authService.refreshToken();

      // Actualizar token en estado
      setToken(response.accessToken);

      console.log("🔄 Tokens refrescados");
    } catch (err) {
      console.error("Error al refrescar tokens:", err);
      await logout(); // Cerrar sesión si no se pueden refrescar los tokens
    }
  };

  // Limpiar errores
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        // Estado
        user,
        isAuthenticated,
        isLoading,
        token,
        refreshToken,
        error,
        dashboardData,

        // Métodos
        login,
        register,
        logout,
        refreshTokens,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
