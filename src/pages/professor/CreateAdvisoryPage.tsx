import { useState } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Stepper,
  Step,
  StepLabel
} from "@mui/material"
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import type { SubjectDetails } from "../../types/backend.types"

// Mock data - reemplazar con hook real
const mockSubjects: SubjectDetails[] = [
  {
    subject_detail_id: 1,
    subject_id: 1,
    professor_id: 1,
    subject: { subject_id: 1, subject: "Cálculo Diferencial" },
    professor: { user_id: 1, name: "Dr. Juan", last_name: "García", email: "juan.garcia@itson.edu.mx" },
    schedules: [
      { subject_schedule_id: 1, subject_details_id: 1, day: "MONDAY", start_time: "08:00", end_time: "10:00" },
      { subject_schedule_id: 2, subject_details_id: 1, day: "WEDNESDAY", start_time: "08:00", end_time: "10:00" }
    ]
  },
  {
    subject_detail_id: 2,
    subject_id: 2,
    professor_id: 1,
    subject: { subject_id: 2, subject: "Álgebra Lineal" },
    professor: { user_id: 1, name: "Dr. Juan", last_name: "García", email: "juan.garcia@itson.edu.mx" },
    schedules: [
      { subject_schedule_id: 3, subject_details_id: 2, day: "TUESDAY", start_time: "14:00", end_time: "16:00" },
      { subject_schedule_id: 4, subject_details_id: 2, day: "THURSDAY", start_time: "14:00", end_time: "16:00" }
    ]
  },
  {
    subject_detail_id: 3,
    subject_id: 3,
    professor_id: 1,
    subject: { subject_id: 3, subject: "Programación Web" },
    professor: { user_id: 1, name: "Dr. Juan", last_name: "García", email: "juan.garcia@itson.edu.mx" },
    schedules: [
      { subject_schedule_id: 5, subject_details_id: 3, day: "FRIDAY", start_time: "10:00", end_time: "12:00" }
    ]
  }
]

interface AdvisorySchedule {
  day: string
  begin_time: string
  end_time: string
}

const dayOptions = [
  { value: "MONDAY", label: "Lunes" },
  { value: "TUESDAY", label: "Martes" },
  { value: "WEDNESDAY", label: "Miércoles" },
  { value: "THURSDAY", label: "Jueves" },
  { value: "FRIDAY", label: "Viernes" },
  { value: "SATURDAY", label: "Sábado" }
]

const timeOptions = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
]

export default function CreateAdvisoryPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form state
  const [selectedSubject, setSelectedSubject] = useState<number | "">("")
  const [maxStudents, setMaxStudents] = useState("")
  const [schedules, setSchedules] = useState<AdvisorySchedule[]>([
    { day: "", begin_time: "", end_time: "" }
  ])

  const selectedSubjectData = mockSubjects.find(s => s.subject_detail_id === selectedSubject)

  const addSchedule = () => {
    setSchedules([...schedules, { day: "", begin_time: "", end_time: "" }])
  }

  const removeSchedule = (index: number) => {
    if (schedules.length > 1) {
      setSchedules(schedules.filter((_, i) => i !== index))
    }
  }

  const updateSchedule = (index: number, field: keyof AdvisorySchedule, value: string) => {
    const newSchedules = [...schedules]
    newSchedules[index] = { ...newSchedules[index], [field]: value }
    setSchedules(newSchedules)
  }

  const validateForm = () => {
    if (!selectedSubject) {
      setError("Debes seleccionar una materia")
      return false
    }
    
    if (!maxStudents || parseInt(maxStudents) <= 0) {
      setError("El número máximo de estudiantes debe ser mayor a 0")
      return false
    }

    if (schedules.some(s => !s.day || !s.begin_time || !s.end_time)) {
      setError("Todos los horarios deben estar completos")
      return false
    }

    // Verificar que los horarios no se traslapen con las clases regulares
    if (selectedSubjectData) {
      for (const advisorySchedule of schedules) {
        for (const classSchedule of selectedSubjectData.schedules) {
          if (advisorySchedule.day === classSchedule.day) {
            const advisoryStart = advisorySchedule.begin_time
            const advisoryEnd = advisorySchedule.end_time
            const classStart = classSchedule.start_time
            const classEnd = classSchedule.end_time
            
            // Verificar traslape de horarios
            if (
              (advisoryStart >= classStart && advisoryStart < classEnd) ||
              (advisoryEnd > classStart && advisoryEnd <= classEnd) ||
              (advisoryStart <= classStart && advisoryEnd >= classEnd)
            ) {
              setError(`El horario de asesoría del ${dayOptions.find(d => d.value === advisorySchedule.day)?.label} se traslapa con la clase regular`)
              return false
            }
          }
        }
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // TODO: Implementar llamada real al API
      const advisoryData = {
        subject_detail_id: selectedSubject,
        max_students: parseInt(maxStudents),
        schedules: schedules
      }

      console.log("Creating advisory:", advisoryData)
      
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess("Asesoría creada exitosamente")
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/professor/advisories")
      }, 2000)
      
    } catch {
      setError("Error al crear la asesoría. Por favor intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
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
          Crear Nueva Asesoría
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configura una nueva asesoría para una de tus materias
        </Typography>
      </Box>

      {/* Progress Stepper */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stepper activeStep={0} sx={{ mb: 2 }}>
            <Step>
              <StepLabel>Información Básica</StepLabel>
            </Step>
            <Step>
              <StepLabel>Horarios</StepLabel>
            </Step>
            <Step>
              <StepLabel>Confirmación</StepLabel>
            </Step>
          </Stepper>
        </CardContent>
      </Card>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Box 
          sx={{ 
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
            gap: 3
          }}
        >
          {/* Basic Information */}
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Información Básica
                </Typography>

                <Box 
                  sx={{ 
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 3
                  }}
                >
                  <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
                    <FormControl fullWidth required>
                      <InputLabel>Materia</InputLabel>
                      <Select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value as number)}
                        label="Materia"
                      >
                        {mockSubjects.map((subject) => (
                          <MenuItem key={subject.subject_detail_id} value={subject.subject_detail_id}>
                            {subject.subject.subject}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box>
                    <TextField
                      fullWidth
                      required
                      label="Número Máximo de Estudiantes"
                      type="number"
                      value={maxStudents}
                      onChange={(e) => setMaxStudents(e.target.value)}
                      inputProps={{ min: 1, max: 50 }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Schedules Section */}
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Horarios de Asesoría
                </Typography>

                {schedules.map((schedule, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Horario {index + 1}
                      </Typography>
                      {schedules.length > 1 && (
                        <Button
                          size="small"
                          color="error"
                          onClick={() => removeSchedule(index)}
                          startIcon={<DeleteIcon />}
                        >
                          Eliminar
                        </Button>
                      )}
                    </Box>

                    <Box 
                      sx={{ 
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                        gap: 2
                      }}
                    >
                      <FormControl fullWidth required>
                        <InputLabel>Día</InputLabel>
                        <Select
                          value={schedule.day}
                          onChange={(e) => updateSchedule(index, "day", e.target.value)}
                          label="Día"
                        >
                          {dayOptions.map((day) => (
                            <MenuItem key={day.value} value={day.value}>
                              {day.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth required>
                        <InputLabel>Hora Inicio</InputLabel>
                        <Select
                          value={schedule.begin_time}
                          onChange={(e) => updateSchedule(index, "begin_time", e.target.value)}
                          label="Hora Inicio"
                        >
                          {timeOptions.map((time) => (
                            <MenuItem key={time} value={time}>
                              {time}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth required>
                        <InputLabel>Hora Final</InputLabel>
                        <Select
                          value={schedule.end_time}
                          onChange={(e) => updateSchedule(index, "end_time", e.target.value)}
                          label="Hora Final"
                        >
                          {timeOptions.map((time) => (
                            <MenuItem key={time} value={time}>
                              {time}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Card>
                ))}

                <Button
                  startIcon={<AddIcon />}
                  onClick={addSchedule}
                  variant="outlined"
                  sx={{ mb: 3 }}
                >
                  Agregar Horario
                </Button>

                {/* Form Actions */}
                <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/professor/advisories")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={isLoading}
                  >
                    {isLoading ? "Creando..." : "Crear Asesoría"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Subject Preview */}
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Vista Previa
                </Typography>

                {selectedSubjectData ? (
                  <>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                      {selectedSubjectData.subject.subject}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Horarios de Clases Regulares:
                    </Typography>
                    
                    {selectedSubjectData.schedules.map((schedule, index) => (
                      <Chip
                        key={index}
                        label={`${dayOptions.find(d => d.value === schedule.day)?.label} ${schedule.start_time}-${schedule.end_time}`}
                        size="small"
                        sx={{ mb: 1, mr: 1 }}
                      />
                    ))}

                    {maxStudents && (
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                          Capacidad: {maxStudents} estudiantes
                        </Typography>
                      </>
                    )}

                    {schedules.some(s => s.day && s.begin_time && s.end_time) && (
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                          Horarios de Asesoría:
                        </Typography>
                        {schedules
                          .filter(s => s.day && s.begin_time && s.end_time)
                          .map((schedule, index) => (
                          <Chip
                            key={index}
                            label={`${dayOptions.find(d => d.value === schedule.day)?.label} ${schedule.begin_time}-${schedule.end_time}`}
                            color="primary"
                            size="small"
                            sx={{ mb: 1, mr: 1 }}
                          />
                        ))}
                      </>
                    )}
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Selecciona una materia para ver la vista previa
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </form>
    </Box>
  )
}