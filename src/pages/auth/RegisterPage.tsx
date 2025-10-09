"use client"

import { useNavigate, Link as RouterLink } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  CircularProgress,
} from "@mui/material"
import { Visibility, VisibilityOff, Email, Lock, Person, School, Work, AdminPanelSettings } from "@mui/icons-material"
import { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { registerSchema, type RegisterFormData } from "../../schemas/auth.schema"

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      role: "student",
      password: "",
      confirmPassword: "",
    },
  })

  const selectedRole = watch("role")

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null)
      await registerUser(data.username, data.email, data.password, data.name, data.role)
      navigate("/home")
    } catch {
      setError("Error al crear la cuenta. Por favor intenta nuevamente.")
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "student":
        return <School />
      case "professor":
        return <Work />
      case "admin":
        return <AdminPanelSettings />
      default:
        return <Person />
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "student":
        return "Busca y agenda asesorías con profesores"
      case "professor":
        return "Ofrece asesorías y gestiona tu horario"
      case "admin":
        return "Administra el sistema completo"
      default:
        return ""
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        py: 4,
        bgcolor: "background.default",
      }}
    >
      <Card sx={{ maxWidth: 520, width: "100%", mx: 2 }}>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <img src="/logo-itson.png" alt="ITSON" style={{ height: 70, marginBottom: 24 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
              Crear Cuenta
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Regístrate para acceder al sistema de asesorías
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Nombre Completo"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  margin="normal"
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Nombre de Usuario"
                  error={!!errors.username}
                  helperText={errors.username?.message || "Solo letras, números, puntos, guiones y guiones bajos"}
                  margin="normal"
                  autoComplete="username"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Correo Electrónico"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message || "Usa tu correo @itson.edu.mx o Gmail"}
                  margin="normal"
                  autoComplete="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.role}>
                  <InputLabel>Tipo de Usuario</InputLabel>
                  <Select
                    {...field}
                    label="Tipo de Usuario"
                    startAdornment={<InputAdornment position="start">{getRoleIcon(field.value)}</InputAdornment>}
                  >
                    <MenuItem value="student">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <School fontSize="small" />
                        Estudiante
                      </Box>
                    </MenuItem>
                                        <MenuItem value="professor">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <School color="primary" />
                        Profesor
                      </Box>
                    </MenuItem>
                    <MenuItem value="admin">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AdminPanelSettings fontSize="small" />
                        Administrador
                      </Box>
                    </MenuItem>
                  </Select>
                  {errors.role ? (
                    <FormHelperText>{errors.role.message}</FormHelperText>
                  ) : (
                    <FormHelperText>{getRoleDescription(selectedRole)}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  error={!!errors.password}
                  helperText={errors.password?.message || "Mínimo 6 caracteres"}
                  margin="normal"
                  autoComplete="new-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" tabIndex={-1}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Confirmar Contraseña"
                  type={showPassword ? "text" : "password"}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  margin="normal"
                  autoComplete="new-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                position: "relative",
              }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={24} sx={{ position: "absolute" }} />
                  <span style={{ opacity: 0 }}>Creando cuenta...</span>
                </>
              ) : (
                "Crear Cuenta"
              )}
            </Button>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                ¿Ya tienes cuenta?{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Inicia sesión aquí
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
