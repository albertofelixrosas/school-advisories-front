import { useState } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Paper
} from "@mui/material"
import {
  Add as AddIcon,
  School as SchoolIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

// Mock data - esto se reemplazará con hooks reales
const mockAdvisories = [
  {
    advisory_id: 1,
    max_students: 15,
    subject_detail: {
      subject_detail_id: 1,
      subject_name: "Cálculo Diferencial",
      schedules: []
    },
    schedules: [
      { day: "MONDAY", begin_time: "10:00", end_time: "11:00" },
      { day: "WEDNESDAY", begin_time: "10:00", end_time: "11:00" }
    ]
  }
]

const mockAdvisoryDates = [
  {
    advisory_date_id: 1,
    topic: "Repaso de Derivadas",
    date: "2025-10-15T10:00:00.000Z",
    venue: { name: "Aula 201", type: "CLASSROOM" },
    attendances: [{ attended: false }, { attended: false }, { attended: false }]
  }
]

const mockStats = {
  totalAdvisories: 3,
  totalDates: 8,
  totalStudents: 24,
  upcomingDates: 5
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  })
}

export default function ProfessorDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading] = useState(false)
  const [error] = useState(null)

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
        Error al cargar el dashboard. Por favor intenta nuevamente.
      </Alert>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          Dashboard del Profesor
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bienvenido, {user?.full_name || user?.name} {user?.last_name}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box 
        sx={{ 
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: 3,
          mb: 4
        }}
      >
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                <SchoolIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {mockStats.totalAdvisories}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Asesorías Activas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                <EventIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {mockStats.upcomingDates}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fechas Próximas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>
                <PeopleIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {mockStats.totalStudents}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Estudiantes Inscritos
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                <ScheduleIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {mockStats.totalDates}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fechas Programadas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Actions */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Acciones Rápidas
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/professor/create-advisory")}
            >
              Nueva Asesoría
            </Button>
            <Button
              variant="outlined"
              startIcon={<EventIcon />}
              onClick={() => navigate("/professor/advisory-dates")}
            >
              Programar Fecha
            </Button>
            <Button
              variant="outlined"
              startIcon={<PeopleIcon />}
              onClick={() => navigate("/professor/attendance")}
            >
              Marcar Asistencia
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box 
        sx={{ 
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 3
        }}
      >
        {/* Mis Asesorías */}
        <Box>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Mis Asesorías
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate("/professor/advisories")}
                >
                  Ver todas
                </Button>
              </Box>
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {mockAdvisories.map((advisory) => (
                  <Paper 
                    key={advisory.advisory_id} 
                    sx={{ p: 2, border: 1, borderColor: "divider" }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {advisory.subject_detail.subject_name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                      <Chip
                        size="small"
                        label={`Max: ${advisory.max_students} estudiantes`}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label={`${advisory.schedules.length} horarios`}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Horarios: {advisory.schedules.map(s => `${s.day} ${s.begin_time}-${s.end_time}`).join(", ")}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Próximas Fechas */}
        <Box>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Próximas Fechas
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate("/professor/advisory-dates")}
                >
                  Ver todas
                </Button>
              </Box>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Tema</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Ubicación</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Inscritos</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockAdvisoryDates.map((date) => (
                      <TableRow key={date.advisory_date_id}>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(date.date)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {date.topic}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={date.venue.name}
                            color={date.venue.type === "VIRTUAL" ? "primary" : "default"}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {date.attendances.length}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}