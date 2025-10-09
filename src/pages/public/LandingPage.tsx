"use client"

import { Box, Container, Typography, Button, Card, CardContent, useTheme } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { School, Person, AdminPanelSettings } from "@mui/icons-material"

export default function LandingPage() {
  const navigate = useNavigate()
  const theme = useTheme()

  const features = [
    {
      icon: <School sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Para Estudiantes",
      description: "Consulta asesorías disponibles y agenda citas con tus profesores de manera sencilla.",
    },
    {
      icon: <Person sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Para Profesores",
      description: "Registra tus materias, define tu horario y gestiona tus espacios de asesoría.",
    },
    {
      icon: <AdminPanelSettings sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Administración",
      description: "Supervisa y gestiona todas las asesorías y citas del sistema.",
    },
  ]

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          py: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <img src="/logo-itson.png" alt="ITSON" style={{ height: 50 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
                Asesorías Académicas
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={() => navigate("/login")}>
                Iniciar Sesión
              </Button>
              <Button variant="contained" onClick={() => navigate("/register")}>
                Registrarse
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto" }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Sistema de Asesorías Académicas ITSON
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                opacity: 0.95,
                fontWeight: 400,
                fontSize: { xs: "1.1rem", md: "1.5rem" },
              }}
            >
              Conecta estudiantes y profesores para mejorar el aprendizaje a través de asesorías personalizadas
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/register")}
              sx={{
                bgcolor: "white",
                color: "primary.main",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                "&:hover": {
                  bgcolor: "grey.100",
                },
              }}
            >
              Comenzar Ahora
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            mb: 6,
            fontWeight: 700,
            color: "text.primary",
          }}
        >
          ¿Cómo funciona?
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 4,
          }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                p: 3,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-8px)",
                },
              }}
            >
              <Box sx={{ mb: 2 }}>{feature.icon}</Box>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: "background.paper", py: 8, borderTop: 1, borderColor: "divider" }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
              ¿Listo para comenzar?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
              Únete a nuestra comunidad académica y mejora tu experiencia de aprendizaje
            </Typography>
            <Button variant="contained" size="large" onClick={() => navigate("/register")} sx={{ px: 4, py: 1.5 }}>
              Crear Cuenta Gratis
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: "background.default",
          py: 4,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
            © 2025 ITSON Universidad. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
