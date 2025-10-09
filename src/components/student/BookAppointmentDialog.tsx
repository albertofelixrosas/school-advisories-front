"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  Divider,
  Alert,
} from "@mui/material"
import { VideoCall, LocationOn, Person, School, CalendarMonth, AccessTime } from "@mui/icons-material"
import { useCreateAppointment } from "../../hooks/useAppointments"
import type { Advisory } from "../../types"

interface BookAppointmentDialogProps {
  open: boolean
  onClose: () => void
  advisory: Advisory
}

const DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export default function BookAppointmentDialog({ open, onClose, advisory }: BookAppointmentDialogProps) {
  const [date, setDate] = useState("")
  const [notes, setNotes] = useState("")
  const createAppointment = useCreateAppointment()

  const handleSubmit = async () => {
    if (!date) {
      return
    }

    await createAppointment.mutateAsync({
      advisoryId: advisory.id,
      date,
      notes,
    })

    onClose()
    setDate("")
    setNotes("")
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Agendar Asesoría</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <School color="primary" />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {advisory.subject?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {advisory.subject?.code}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Person color="action" />
            <Typography variant="body2">{advisory.teacher?.name}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <CalendarMonth color="action" />
            <Typography variant="body2">{DAYS_OF_WEEK[advisory.dayOfWeek]}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <AccessTime color="action" />
            <Typography variant="body2">
              {advisory.startTime} - {advisory.endTime}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            {advisory.roomType === "virtual" ? <VideoCall color="action" /> : <LocationOn color="action" />}
            <Chip
              label={advisory.roomType === "virtual" ? "Virtual" : "Presencial"}
              size="small"
              color={advisory.roomType === "virtual" ? "primary" : "secondary"}
              variant="outlined"
            />
            {advisory.room && (
              <Typography variant="body2" color="text.secondary">
                {advisory.room}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Alert severity="info" sx={{ mb: 3 }}>
          Selecciona la fecha específica en la que deseas tomar la asesoría
        </Alert>

        <TextField
          fullWidth
          label="Fecha de la asesoría"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mb: 2 }}
          required
        />

        <TextField
          fullWidth
          label="Notas adicionales (opcional)"
          multiline
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe brevemente el tema que deseas abordar en la asesoría..."
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={createAppointment.isPending}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!date || createAppointment.isPending}>
          {createAppointment.isPending ? "Agendando..." : "Confirmar Cita"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
