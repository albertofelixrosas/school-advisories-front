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
  IconButton,
  Tooltip
} from "@mui/material"
import {
  Add as AddIcon,
  School as SchoolIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useMySubjects } from "../../hooks/useSubjects"

const formatDay = (day: string) => {
  const days = {
    'MONDAY': 'Lun',
    'TUESDAY': 'Mar', 
    'WEDNESDAY': 'Mié',
    'THURSDAY': 'Jue',
    'FRIDAY': 'Vie',
    'SATURDAY': 'Sáb',
    'SUNDAY': 'Dom'
  }
  return days[day as keyof typeof days] || day
}

export default function SubjectsPage() {
  const navigate = useNavigate()
  const { data: mySubjects, isLoading, error } = useMySubjects()

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Cargando materias...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error al cargar las materias: {(error as Error).message}
      </Alert>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          Mis Materias
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona las materias que tienes asignadas como profesor
        </Typography>
      </Box>

      {/* Statistics Cards */}
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
                  {mySubjects?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Materias Asignadas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                <ScheduleIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {mySubjects?.reduce((total, subject) => 
                    total + (subject.schedules?.length || 0), 0) || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Horarios Activos
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>
                <CalendarIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {mySubjects?.reduce((total, subject) => 
                    total + (subject.advisories?.length || 0), 0) || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Asesorías Programadas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                <PeopleIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {mySubjects?.reduce((total, subject) => 
                    total + (subject.advisories?.reduce((advTotal, advisory) => 
                      advTotal + advisory.max_students, 0) || 0), 0) || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cupos Disponibles
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Actions */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Acciones Rápidas
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/professor/advisories/create")}
            >
              Nueva Asesoría
            </Button>
            <Button
              variant="outlined"
              startIcon={<CalendarIcon />}
              onClick={() => navigate("/professor/schedules")}
            >
              Gestionar Horarios
            </Button>
            <Button
              variant="outlined"
              startIcon={<PeopleIcon />}
              onClick={() => navigate("/professor/advisories")}
            >
              Ver Asesorías
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Subjects Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Lista de Materias
            </Typography>
          </Box>

          {mySubjects && mySubjects.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Materia</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Horarios</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Asesorías</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Estado</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mySubjects.map((subjectDetail) => (
                    <TableRow key={subjectDetail.subject_detail_id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {subjectDetail.subject.subject}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {subjectDetail.subject.subject_id}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {subjectDetail.schedules && subjectDetail.schedules.length > 0 ? (
                            subjectDetail.schedules.map((schedule, index) => (
                              <Chip
                                key={index}
                                size="small"
                                label={`${formatDay(schedule.day)} ${schedule.begin_time}-${schedule.end_time}`}
                                variant="outlined"
                                color="primary"
                              />
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Sin horarios definidos
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={`${subjectDetail.advisories?.length || 0} activas`}
                          color={subjectDetail.advisories && subjectDetail.advisories.length > 0 ? "success" : "default"}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label="Activa"
                          color="success"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/professor/subjects/${subjectDetail.subject_detail_id}`)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Gestionar asesorías">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/professor/advisories?subject=${subjectDetail.subject_detail_id}`)}
                          >
                            <CalendarIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <SchoolIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tienes materias asignadas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Contacta con el administrador para que te asigne materias
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}