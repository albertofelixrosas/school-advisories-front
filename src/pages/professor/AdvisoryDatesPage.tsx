import { useState, useEffect } from "react"
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
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Fab
} from "@mui/material"
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Event as EventIcon
} from "@mui/icons-material"
import { useNavigate, useParams } from "react-router-dom"
import type { Advisory, AdvisoryDate, Venue } from "../../types/backend.types"

// Mock data - se reemplazará con hooks reales
const mockAdvisory: Advisory = {
  advisory_id: 1,
  max_students: 15,
  professor: {
    user_id: 1,
    name: "Dr. Juan",
    last_name: "García",
    email: "juan.garcia@itson.edu.mx"
  },
  subject_detail: {
    subject_detail_id: 1,
    subject_name: "Cálculo Diferencial",
    schedules: [
      { subject_schedule_id: 1, subject_details_id: 1, day: "MONDAY", start_time: "08:00", end_time: "10:00" },
      { subject_schedule_id: 2, subject_details_id: 1, day: "WEDNESDAY", start_time: "08:00", end_time: "10:00" }
    ]
  },
  schedules: [
    { advisory_schedule_id: 1, day: "MONDAY", begin_time: "10:00", end_time: "11:00" },
    { advisory_schedule_id: 2, day: "WEDNESDAY", begin_time: "10:00", end_time: "11:00" }
  ]
}

const mockAdvisoryDates: AdvisoryDate[] = [
  {
    advisory_date_id: 1,
    advisory_id: 1,
    venue_id: 1,
    topic: "Límites y continuidad",
    date: "2024-02-15T10:00:00Z",
    advisory: mockAdvisory,
    venue: {
      venue_id: 1,
      name: "Aula 201",
      type: "CLASSROOM",
      building: "Edificio A",
      floor: "2do piso"
    },
    attendances: []
  },
  {
    advisory_date_id: 2,
    advisory_id: 1,
    venue_id: 2,
    topic: "Derivadas básicas",
    date: "2024-02-17T10:00:00Z",
    advisory: mockAdvisory,
    venue: {
      venue_id: 2,
      name: "Zoom - Cálculo",
      type: "VIRTUAL",
      url: "https://zoom.us/j/123456789"
    },
    attendances: []
  }
]

const mockVenues: Venue[] = [
  {
    venue_id: 1,
    name: "Aula 201",
    type: "CLASSROOM",
    building: "Edificio A",
    floor: "2do piso"
  },
  {
    venue_id: 2,
    name: "Zoom - Cálculo",
    type: "VIRTUAL",
    url: "https://zoom.us/j/123456789"
  },
  {
    venue_id: 3,
    name: "Oficina 305",
    type: "OFFICE",
    building: "Edificio B",
    floor: "3er piso"
  }
]

const dayNames: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo"
}

const venueTypeNames: Record<string, string> = {
  CLASSROOM: "Aula",
  OFFICE: "Oficina",
  VIRTUAL: "Virtual"
}

const venueTypeColors: Record<string, "default" | "primary" | "secondary" | "error" | "warning" | "info" | "success"> = {
  CLASSROOM: "primary",
  OFFICE: "info",
  VIRTUAL: "success"
}

export default function AdvisoryDatesPage() {
  const navigate = useNavigate()
  const { advisoryId } = useParams<{ advisoryId: string }>()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [advisoryDates, setAdvisoryDates] = useState<AdvisoryDate[]>(mockAdvisoryDates)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedDate, setSelectedDate] = useState<AdvisoryDate | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Form state for creating new dates
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("")
  const [newTopic, setNewTopic] = useState("")
  const [newVenueId, setNewVenueId] = useState<number | "">("")

  useEffect(() => {
    // TODO: Cargar fechas de asesoría desde la API
    console.log("Loading advisory dates for:", advisoryId)
  }, [advisoryId])

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, date: AdvisoryDate) => {
    setAnchorEl(event.currentTarget)
    setSelectedDate(date)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedDate(null)
  }

  const handleEdit = () => {
    if (selectedDate) {
      // TODO: Implementar edición
      console.log("Edit date:", selectedDate.advisory_date_id)
    }
    handleMenuClose()
  }

  const handleViewStudents = () => {
    if (selectedDate) {
      navigate(`/professor/advisory-date-students/${selectedDate.advisory_date_id}`)
    }
    handleMenuClose()
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
    handleMenuClose()
  }

  const handleConfirmDelete = async () => {
    if (selectedDate) {
      try {
        // TODO: Implementar eliminación real
        setAdvisoryDates(prev => prev.filter(d => d.advisory_date_id !== selectedDate.advisory_date_id))
        setDeleteDialogOpen(false)
        setSelectedDate(null)
      } catch {
        setError("Error al eliminar la fecha de asesoría")
      }
    }
  }

  const openCreateDialog = () => {
    setCreateDialogOpen(true)
    setNewDate("")
    setNewTime("")
    setNewTopic("")
    setNewVenueId("")
  }

  const handleCreateDate = async () => {
    if (!newDate || !newTime || !newTopic || !newVenueId) {
      setError("Todos los campos son requeridos")
      return
    }

    try {
      setIsLoading(true)
      
      // TODO: Implementar creación real
      const newAdvisoryDate: AdvisoryDate = {
        advisory_date_id: Date.now(),
        advisory_id: parseInt(advisoryId!),
        venue_id: newVenueId as number,
        topic: newTopic,
        date: `${newDate}T${newTime}:00Z`,
        advisory: mockAdvisory,
        venue: mockVenues.find(v => v.venue_id === newVenueId)!,
        attendances: []
      }

      setAdvisoryDates(prev => [...prev, newAdvisoryDate])
      setCreateDialogOpen(false)
      
    } catch {
      setError("Error al crear la fecha de asesoría")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const weekDay = dayNames[date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()]
    return {
      date: date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      weekDay
    }
  }

  const formatSchedules = (schedules: Advisory["schedules"]) => {
    return schedules.map(schedule => 
      `${dayNames[schedule.day]} ${schedule.begin_time}-${schedule.end_time}`
    ).join(", ")
  }

  if (isLoading && advisoryDates.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/professor/advisories")}
          sx={{ mb: 2 }}
        >
          Volver a Asesorías
        </Button>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          Programar Fechas de Asesoría
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
          {mockAdvisory.subject_detail.subject_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Horarios disponibles: {formatSchedules(mockAdvisory.schedules)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Capacidad máxima: {mockAdvisory.max_students} estudiantes por sesión
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Box 
        sx={{ 
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr 1fr" },
          gap: 3,
          mb: 4
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "primary.main" }}>
              {advisoryDates.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fechas Programadas
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "info.main" }}>
              {advisoryDates.filter(d => new Date(d.date) > new Date()).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Próximas Sesiones
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "success.main" }}>
              {advisoryDates.reduce((sum, d) => sum + d.attendances.length, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Estudiantes Inscritos
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "warning.main" }}>
              {advisoryDates.filter(d => d.venue.type === "VIRTUAL").length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sesiones Virtuales
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Advisory Dates Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Fechas Programadas
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreateDialog}
            >
              Programar Fecha
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Fecha y Hora</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tema</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ubicación</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Inscritos</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Estado</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {advisoryDates.length > 0 ? (
                  advisoryDates.map((date) => {
                    const { date: formattedDate, time, weekDay } = formatDateTime(date.date)
                    const isPast = new Date(date.date) < new Date()
                    
                    return (
                      <TableRow key={date.advisory_date_id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                              {weekDay}, {formattedDate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {time}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {date.topic}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Chip
                              label={venueTypeNames[date.venue.type]}
                              color={venueTypeColors[date.venue.type]}
                              size="small"
                              sx={{ mb: 0.5 }}
                            />
                            <Typography variant="body2">
                              {date.venue.name}
                            </Typography>
                            {date.venue.building && (
                              <Typography variant="caption" color="text.secondary">
                                {date.venue.building} - {date.venue.floor}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${date.attendances.length}/${mockAdvisory.max_students}`}
                            color={date.attendances.length >= mockAdvisory.max_students ? "error" : "default"}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={isPast ? "Realizada" : "Programada"}
                            color={isPast ? "default" : "success"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={(e) => handleMenuClick(e, date)}
                            size="small"
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No hay fechas programadas aún
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<EventIcon />}
                        sx={{ mt: 2 }}
                        onClick={openCreateDialog}
                      >
                        Programar primera fecha
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={openCreateDialog}
      >
        <AddIcon />
      </Fab>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} />
          Editar Fecha
        </MenuItem>
        <MenuItem onClick={handleViewStudents}>
          <PeopleIcon sx={{ mr: 1 }} />
          Ver Estudiantes
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Create Date Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Programar Nueva Fecha</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              fullWidth
              label="Fecha"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().split('T')[0]
              }}
            />
            
            <TextField
              fullWidth
              label="Hora"
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            
            <TextField
              fullWidth
              label="Tema de la Sesión"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Ej: Límites y continuidad"
            />
            
            <FormControl fullWidth>
              <InputLabel>Ubicación</InputLabel>
              <Select
                value={newVenueId}
                onChange={(e) => setNewVenueId(e.target.value as number)}
                label="Ubicación"
              >
                {mockVenues.map((venue) => (
                  <MenuItem key={venue.venue_id} value={venue.venue_id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={venueTypeNames[venue.type]}
                        color={venueTypeColors[venue.type]}
                        size="small"
                      />
                      {venue.name}
                      {venue.building && ` - ${venue.building}`}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreateDate}
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? "Programando..." : "Programar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Eliminar Fecha de Asesoría</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la sesión programada para el tema "{selectedDate?.topic}"?
            Esto también cancelará las inscripciones de los estudiantes.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}