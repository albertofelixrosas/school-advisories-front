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
import { useDashboard } from "../../hooks/useDashboard"
import type { Advisory, AdvisoryDate } from "../../types/auth.types"

// Utility function for date formatting

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
  const { user, isLoading } = useAuth()
  const { 
    professorData, 
    professorStats, 
    isLoaded: dashboardLoaded 
  } = useDashboard()

  const isLoadingData = isLoading || !dashboardLoaded

  if (isLoadingData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Cargando dashboard...
        </Typography>
      </Box>
    )
  }

  if (!professorStats) {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        No se pudieron cargar los datos del dashboard. Verifica tu conexión.
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
          Bienvenido, {user?.name} {user?.last_name}
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
                  {professorStats.active_advisories_count}
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
                  {professorStats.upcoming_sessions_count}
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
                  {professorStats.total_students_enrolled}
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
                  {professorStats.completed_sessions_count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sesiones Completadas
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
                {professorData && professorData.active_advisories?.length > 0 ? (
                  professorData.active_advisories.slice(0, 3).map((advisory: Advisory) => (
                    <Paper 
                      key={advisory.advisory_id || Math.random()} 
                      sx={{ p: 2, border: 1, borderColor: "divider" }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        {advisory.subject_detail?.subject_name || advisory.subject_name || "Asesoría"}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                        <Chip
                          size="small"
                          label={`Max: ${advisory.max_students || 0} estudiantes`}
                          variant="outlined"
                        />
                        <Chip
                          size="small"
                          label={`${advisory.schedules?.length || 0} horarios`}
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Horarios: {advisory.schedules?.map((s) => `${s.day} ${s.begin_time}-${s.end_time}`).join(", ") || "No definido"}
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No hay asesorías disponibles
                  </Typography>
                )}
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
                    {professorData && professorData.upcoming_advisory_dates?.length > 0 ? (
                      professorData.upcoming_advisory_dates.slice(0, 5).map((date: AdvisoryDate) => (
                        <TableRow key={date.advisory_date_id || Math.random()}>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(date.date || date.created_at || new Date().toISOString())}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {date.topic || date.subject_name || "Sesión"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={date.venue?.name || date.location || "Por definir"}
                              color={date.venue?.type === "VIRTUAL" || date.type === "VIRTUAL" ? "primary" : "default"}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {date.attendances?.length || date.enrolled_count || 0}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                            No hay fechas próximas programadas
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
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