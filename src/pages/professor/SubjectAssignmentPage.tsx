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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  Alert
} from "@mui/material"
import {
  Add as AddIcon,
  School as SchoolIcon,
  Schedule as ScheduleIcon,
  Delete as DeleteIcon
} from "@mui/icons-material"
import { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { 
  useSubjects, 
  useMySubjects, 
  useCreateSubjectDetail,
  useDeleteSubjectDetail 
} from "../../hooks/useSubjects"
import type { Subject, CreateSubjectDetailDto } from "../../api/subjects"

// Importar test de conexión (solo en desarrollo)
import "../../utils/backend-connection-test"

interface AssignSubjectDialogProps {
  open: boolean;
  onClose: () => void;
  availableSubjects: Subject[];
}

function AssignSubjectDialog({ open, onClose, availableSubjects }: AssignSubjectDialogProps) {
  const [selectedSubject, setSelectedSubject] = useState<number | "">("")
  const [schedules, setSchedules] = useState<Array<{
    day: string;
    start_time: string;
    end_time: string;
  }>>([])
  
  const { user } = useAuth()
  const createAssignmentMutation = useCreateSubjectDetail()

  const days = [
    { value: "MONDAY", label: "Lunes" },
    { value: "TUESDAY", label: "Martes" },
    { value: "WEDNESDAY", label: "Miércoles" },
    { value: "THURSDAY", label: "Jueves" },
    { value: "FRIDAY", label: "Viernes" },
    { value: "SATURDAY", label: "Sábado" }
  ]

  const handleAddSchedule = () => {
    setSchedules([...schedules, { day: "MONDAY", start_time: "08:00", end_time: "09:00" }])
  }

  const handleScheduleChange = (index: number, field: keyof typeof schedules[0], value: string) => {
    const newSchedules = [...schedules]
    newSchedules[index] = { ...newSchedules[index], [field]: value }
    setSchedules(newSchedules)
  }

  const handleRemoveSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index))
  }

  const handleAssign = () => {
    if (selectedSubject && user?.user_id) {
      const assignmentData: CreateSubjectDetailDto = {
        subject_id: Number(selectedSubject),
        professor_id: user.user_id,
        schedules: schedules.map(schedule => ({
          day: schedule.day,
          start_time: schedule.start_time,
          end_time: schedule.end_time
        }))
      }
      
      createAssignmentMutation.mutate(assignmentData, {
        onSuccess: () => {
          setSelectedSubject("")
          setSchedules([])
          onClose()
        }
      })
    }
  }

  const resetForm = () => {
    setSelectedSubject("")
    setSchedules([])
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Asignarme una Materia</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>Seleccionar Materia</InputLabel>
          <Select
            value={selectedSubject}
            label="Seleccionar Materia"
            onChange={(e) => setSelectedSubject(e.target.value as number)}
          >
            {availableSubjects.map((subject) => (
              <MenuItem key={subject.subject_id} value={subject.subject_id}>
                {subject.subject}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6">Horarios (Opcional)</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddSchedule}
            size="small"
          >
            Agregar Horario
          </Button>
        </Box>

        {schedules.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Puedes agregar horarios ahora o hacerlo más tarde desde la gestión de horarios.
          </Alert>
        )}

        {schedules.map((schedule, index) => (
          <Card key={index} sx={{ mb: 2, p: 2 }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
              <Box sx={{ minWidth: 150 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Día</InputLabel>
                  <Select
                    value={schedule.day}
                    label="Día"
                    onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                  >
                    {days.map((day) => (
                      <MenuItem key={day.value} value={day.value}>
                        {day.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: 120 }}>
                <TextField
                  type="time"
                  label="Hora Inicio"
                  size="small"
                  fullWidth
                  value={schedule.start_time}
                  onChange={(e) => handleScheduleChange(index, 'start_time', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ minWidth: 120 }}>
                <TextField
                  type="time"
                  label="Hora Fin"
                  size="small"
                  fullWidth
                  value={schedule.end_time}
                  onChange={(e) => handleScheduleChange(index, 'end_time', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box>
                <Button
                  onClick={() => handleRemoveSchedule(index)}
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                >
                  Eliminar
                </Button>
              </Box>
            </Box>
          </Card>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { resetForm(); onClose(); }}>Cancelar</Button>
        <Button 
          onClick={handleAssign} 
          variant="contained"
          disabled={!selectedSubject || createAssignmentMutation.isPending}
        >
          {createAssignmentMutation.isPending ? "Asignando..." : "Asignar Materia"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function ProfessorSubjectAssignmentPage() {
  const [assignDialog, setAssignDialog] = useState(false)
  
  const { data: allSubjects, isLoading: subjectsLoading, error: subjectsError } = useSubjects()
  const { data: mySubjects, isLoading: mySubjectsLoading, error: mySubjectsError } = useMySubjects()
  const deleteAssignmentMutation = useDeleteSubjectDetail()

  // Función para traducir días
  const translateDay = (day: string) => {
    const dayMap: { [key: string]: string } = {
      "MONDAY": "Lunes",
      "TUESDAY": "Martes", 
      "WEDNESDAY": "Miércoles",
      "THURSDAY": "Jueves",
      "FRIDAY": "Viernes",
      "SATURDAY": "Sábado",
      "SUNDAY": "Domingo"
    }
    return dayMap[day] || day
  }

  // Filtrar materias disponibles (que no tenga asignadas)
  const availableSubjects = allSubjects?.filter(subject => 
    !mySubjects?.some(mySubject => mySubject.subject_id === subject.subject_id)
  ) || []

  const handleDeleteAssignment = (subjectDetailId: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta asignación?")) {
      deleteAssignmentMutation.mutate(subjectDetailId)
    }
  }

  if (subjectsLoading || mySubjectsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <Typography>Cargando materias...</Typography>
      </Box>
    )
  }

  if (subjectsError || mySubjectsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al cargar las materias. 
          {subjectsError && ` Error del catálogo: ${(subjectsError as Error).message}`}
          {mySubjectsError && ` Error de mis materias: ${(mySubjectsError as Error).message}`}
        </Alert>
        <Button 
          variant="outlined" 
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          Gestión de Mis Materias
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Selecciona las materias que impartes y configura tus horarios
        </Typography>
      </Box>

      {/* Statistics */}
      <Box 
        sx={{ 
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
          gap: 3,
          mb: 4
        }}
      >
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <SchoolIcon sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ScheduleIcon sx={{ fontSize: 40, color: "success.main", mr: 2 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {mySubjects?.reduce((total, subject) => 
                    total + (subject.schedules?.length || 0), 0) || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Horarios Configurados
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AddIcon sx={{ fontSize: 40, color: "info.main", mr: 2 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {availableSubjects.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Materias Disponibles
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Actions */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAssignDialog(true)}
          disabled={availableSubjects.length === 0}
        >
          Asignarme una Materia
        </Button>
        
        {availableSubjects.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Ya tienes todas las materias disponibles asignadas
          </Typography>
        )}
      </Box>

      {/* My Subjects Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Mis Materias Asignadas
          </Typography>

          {mySubjects && mySubjects.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Materia</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Horarios</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Asesorías</TableCell>
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
                        {subjectDetail.schedules && subjectDetail.schedules.length > 0 ? (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {subjectDetail.schedules.map((schedule, index) => (
                              <Chip
                                key={index}
                                size="small"
                                label={`${translateDay(schedule.day)} ${schedule.start_time}-${schedule.end_time}`}
                                variant="outlined"
                                color="primary"
                              />
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sin horarios configurados
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={`${subjectDetail.advisories?.length || 0} asesorías`}
                          color={subjectDetail.advisories && subjectDetail.advisories.length > 0 ? "success" : "default"}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          onClick={() => handleDeleteAssignment(subjectDetail.subject_detail_id)}
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                        >
                          Eliminar
                        </Button>
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
                Selecciona las materias que impartes del catálogo disponible
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAssignDialog(true)}
                disabled={availableSubjects.length === 0}
              >
                Asignarme una Materia
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Assignment Dialog */}
      <AssignSubjectDialog
        open={assignDialog}
        onClose={() => setAssignDialog(false)}
        availableSubjects={availableSubjects}
      />
    </Box>
  )
}