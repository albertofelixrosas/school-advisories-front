"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Card,
  Avatar,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Chip,
  Button,
} from "@mui/material"
import { Search, Email, School } from "@mui/icons-material"
import { useTeachers } from "../../hooks/useTeachers"
import { useNavigate } from "react-router-dom"

export default function TeachersPage() {
  const { data: teachers, isLoading, error } = useTeachers()
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const filteredTeachers = teachers?.filter((teacher) => teacher.name.toLowerCase().includes(searchTerm.toLowerCase()))

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error al cargar los profesores. Por favor intenta nuevamente.
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        Directorio de Profesores
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Encuentra profesores y consulta sus asesorías disponibles
      </Typography>

      <Card sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar profesor por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Card>

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
        {filteredTeachers && filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <Card
              key={teacher.user_id}
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  src={teacher.photo_url || undefined}
                  sx={{
                    width: 64,
                    height: 64,
                    mr: 2,
                    bgcolor: "primary.main",
                  }}
                >
                  {teacher.name.charAt(0)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {teacher.name}
                  </Typography>
                  <Chip label="Profesor" size="small" color="primary" variant="outlined" />
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Email fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {teacher.email}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <School fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {/* TODO: agregar subjectsCount al tipo User o calcularlo */}
                  0 materias
                </Typography>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate(`/advisories?teacher=${teacher.user_id}`)}
                sx={{ mt: "auto" }}
              >
                Ver Asesorías
              </Button>
            </Card>
          ))
        ) : (
          <Card sx={{ p: 4, textAlign: "center", gridColumn: "1 / -1" }}>
            <Typography color="text.secondary">No se encontraron profesores</Typography>
          </Card>
        )}
      </Box>
    </Box>
  )
}
