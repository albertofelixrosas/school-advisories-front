"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material"
import { Search, VideoCall, LocationOn, CalendarMonth } from "@mui/icons-material"
import { useAdvisories } from "../../hooks/useAdvisories"
import BookAppointmentDialog from "../../components/student/BookAppointmentDialog"
import type { Advisory } from "../../types"

const DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export default function AdvisoriesPage() {
  const { data: advisories, isLoading, error } = useAdvisories()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDay, setFilterDay] = useState<number | "all">("all")
  const [filterType, setFilterType] = useState<"all" | "virtual" | "presencial">("all")
  const [selectedAdvisory, setSelectedAdvisory] = useState<Advisory | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredAdvisories = advisories?.filter((advisory) => {
    const matchesSearch = searchTerm === "" || advisory.subject?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDay = filterDay === "all" || advisory.dayOfWeek === filterDay
    const matchesType = filterType === "all" || advisory.roomType === filterType
    return matchesSearch && matchesDay && matchesType
  })

  const handleBookClick = (advisory: Advisory) => {
    setSelectedAdvisory(advisory)
    setDialogOpen(true)
  }

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
        Error al cargar las asesorías. Por favor intenta nuevamente.
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        Asesorías Disponibles
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Explora y agenda asesorías con tus profesores
      </Typography>

      {/* Filters */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            placeholder="Buscar por materia..."
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
          <FormControl fullWidth>
            <InputLabel>Día de la semana</InputLabel>
            <Select
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value as number | "all")}
              label="Día de la semana"
            >
              <MenuItem value="all">Todos los días</MenuItem>
              {DAYS_OF_WEEK.map((day, index) => (
                <MenuItem key={index} value={index}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Tipo de asesoría</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "all" | "virtual" | "presencial")}
              label="Tipo de asesoría"
            >
              <MenuItem value="all">Todas</MenuItem>
              <MenuItem value="virtual">Virtual</MenuItem>
              <MenuItem value="presencial">Presencial</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>

      {/* Advisories Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Materia</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Profesor</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Día</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Horario</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ubicación</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Cupo</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Acción
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAdvisories && filteredAdvisories.length > 0 ? (
                filteredAdvisories.map((advisory) => (
                  <TableRow key={advisory.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {advisory.subject?.name || "N/A"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {advisory.subject?.code || ""}
                      </Typography>
                    </TableCell>
                    <TableCell>{advisory.teacher?.name || "N/A"}</TableCell>
                    <TableCell>{DAYS_OF_WEEK[advisory.dayOfWeek]}</TableCell>
                    <TableCell>
                      {advisory.startTime} - {advisory.endTime}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={advisory.roomType === "virtual" ? <VideoCall /> : <LocationOn />}
                        label={advisory.roomType === "virtual" ? "Virtual" : "Presencial"}
                        size="small"
                        color={advisory.roomType === "virtual" ? "primary" : "secondary"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{advisory.room || "Por definir"}</TableCell>
                    <TableCell>
                      <Chip label={`${advisory.currentStudents || 0}/${advisory.maxStudents}`} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<CalendarMonth />}
                        onClick={() => handleBookClick(advisory)}
                        disabled={(advisory.currentStudents || 0) >= advisory.maxStudents}
                      >
                        Agendar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No se encontraron asesorías disponibles</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Book Appointment Dialog */}
      {selectedAdvisory && (
        <BookAppointmentDialog open={dialogOpen} onClose={() => setDialogOpen(false)} advisory={selectedAdvisory} />
      )}
    </Box>
  )
}
