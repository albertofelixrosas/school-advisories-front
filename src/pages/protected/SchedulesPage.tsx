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
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material"
import { Add, Edit, Delete, CalendarMonth } from "@mui/icons-material"
import { useMySchedule, useDeleteSchedule } from "../../hooks/useSchedules"
import ScheduleDialog from "../../components/teacher/ScheduleDialog"
import DeleteConfirmDialog from "../../components/common/DeleteConfirmDialog"
import type { Schedule } from "../../types"

const DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export default function SchedulesPage() {
  const { data: schedules, isLoading, error } = useMySchedule()
  const deleteSchedule = useDeleteSchedule()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)

  const handleEdit = (schedule: Schedule) => {
    setSelectedSchedule(schedule)
    setDialogOpen(true)
  }

  const handleDelete = (schedule: Schedule) => {
    setSelectedSchedule(schedule)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedSchedule) {
      await deleteSchedule.mutateAsync(selectedSchedule.id)
      setDeleteDialogOpen(false)
      setSelectedSchedule(null)
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedSchedule(null)
  }

  // Group schedules by day
  /*
  const schedulesByDay = schedules?.reduce(
    (acc, schedule) => {
      if (!acc[schedule.dayOfWeek]) {
        acc[schedule.dayOfWeek] = []
      }
      acc[schedule.dayOfWeek].push(schedule)
      return acc
    },
    {} as Record<number, Schedule[]>,
  )
  */

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
        Error al cargar el horario. Por favor intenta nuevamente.
      </Alert>
    )
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Mi Horario de Clases
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Define tu horario semanal de clases
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
          Agregar Horario
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Día</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Hora de Inicio</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Hora de Fin</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Salón</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules && schedules.length > 0 ? (
                schedules
                  .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))
                  .map((schedule) => (
                    <TableRow key={schedule.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CalendarMonth fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {DAYS_OF_WEEK[schedule.dayOfWeek]}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={schedule.startTime} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip label={schedule.endTime} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{schedule.room}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleEdit(schedule)} title="Editar">
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(schedule)} title="Eliminar">
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No has definido tu horario aún</Typography>
                    <Button variant="text" onClick={() => setDialogOpen(true)} sx={{ mt: 2 }}>
                      Agregar tu primer horario
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <ScheduleDialog open={dialogOpen} onClose={handleCloseDialog} schedule={selectedSchedule} />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Horario"
        message="¿Estás seguro de que deseas eliminar este horario?"
        isLoading={deleteSchedule.isPending}
      />
    </Box>
  )
}
