"use client"

import { Box, Typography, Card, CardContent } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { CalendarMonth, School, Schedule } from "@mui/icons-material"

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const getQuickActions = () => {
    switch (user?.role) {
      case "student":
        return [
          {
            title: "Ver Asesorías",
            description: "Explora las asesorías disponibles",
            icon: <School sx={{ fontSize: 48 }} />,
            path: "/advisories",
          },
          {
            title: "Mis Citas",
            description: "Revisa tus citas programadas",
            icon: <CalendarMonth sx={{ fontSize: 48 }} />,
            path: "/appointments",
          },
        ]
      case "teacher":
        return [
          {
            title: "Mis Materias",
            description: "Gestiona las materias que impartes",
            icon: <School sx={{ fontSize: 48 }} />,
            path: "/subjects",
          },
          {
            title: "Mi Horario",
            description: "Define tu disponibilidad para asesorías",
            icon: <Schedule sx={{ fontSize: 48 }} />,
            path: "/schedules",
          },
        ]
      default:
        return []
    }
  }

  const quickActions = getQuickActions()

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        Bienvenido, {user?.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {user?.role === "student" && "Encuentra y agenda asesorías con tus profesores"}
        {user?.role === "teacher" && "Gestiona tus materias y horarios de asesoría"}
        {user?.role === "admin" && "Panel de administración del sistema"}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {quickActions.map((action, index) => (
          <Card
            key={index}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
              },
            }}
            onClick={() => navigate(action.path)}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 4 }}>
              <Box sx={{ color: "primary.main", mb: 2 }}>{action.icon}</Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                {action.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {action.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}
