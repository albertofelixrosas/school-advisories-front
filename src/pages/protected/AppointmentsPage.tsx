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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from "@mui/material"
import { CalendarMonth, Cancel, CheckCircle, Pending, Delete } from "@mui/icons-material"
import { useMyAppointments, useCancelAppointment } from "../../hooks/useAppointments"
import type { Appointment } from "../../types"

// const DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export default function AppointmentsPage() {
  const { data: appointments, isLoading, error } = useMyAppointments()
  const cancelAppointment = useCancelAppointment()
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [tabValue, setTabValue] = useState(0)

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setCancelDialogOpen(true)
  }

  const handleConfirmCancel = async () => {
    if (selectedAppointment) {
      await cancelAppointment.mutateAsync(selectedAppointment.id)
      setCancelDialogOpen(false)
      setSelectedAppointment(null)
    }
  }

  const getStatusChip = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Chip icon={<CheckCircle />} label="Confirmada" color="success" size="small" />
      case "pending":
        return <Chip icon={<Pending />} label="Pendiente" color="warning" size="small" />
      case "cancelled":
        return <Chip icon={<Cancel />} label="Cancelada" color="error" size="small" />
      default:
        return <Chip label={status} size="small" />
    }
  }

  const filteredAppointments = appointments?.filter((apt) => {
    if (tabValue === 0) return apt.status !== "cancelled"
    if (tabValue === 1) return apt.status === "confirmed"
    if (tabValue === 2) return apt.status === "pending"
    if (tabValue === 3) return apt.status === "cancelled"
    return true
  })

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
        Error al cargar tus citas. Por favor intenta nuevamente.
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        Mis Citas
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Gestiona tus asesorías programadas
      </Typography>

      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Activas" />
          <Tab label="Confirmadas" />
          <Tab label="Pendientes" />
          <Tab label="Canceladas" />
        </Tabs>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Materia</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Profesor</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Horario</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ubicación</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments && filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarMonth fontSize="small" color="action" />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {new Date(appointment.date).toLocaleDateString("es-MX", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {appointment.advisory?.subject?.name || "N/A"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appointment.advisory?.subject?.code || ""}
                      </Typography>
                    </TableCell>
                    <TableCell>{appointment.advisory?.teacher?.name || "N/A"}</TableCell>
                    <TableCell>
                      {appointment.advisory?.startTime} - {appointment.advisory?.endTime}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.advisory?.roomType === "virtual" ? "Virtual" : "Presencial"}
                        size="small"
                        variant="outlined"
                      />
                      {appointment.advisory?.room && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          {appointment.advisory.room}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{getStatusChip(appointment.status)}</TableCell>
                    <TableCell align="right">
                      {appointment.status !== "cancelled" && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleCancelClick(appointment)}
                          title="Cancelar cita"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No tienes citas en esta categoría</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancelar Cita</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)} disabled={cancelAppointment.isPending}>
            No, mantener
          </Button>
          <Button
            onClick={handleConfirmCancel}
            color="error"
            variant="contained"
            disabled={cancelAppointment.isPending}
          >
            {cancelAppointment.isPending ? "Cancelando..." : "Sí, cancelar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
