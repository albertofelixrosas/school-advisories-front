"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
} from "@mui/material"
import { useCreateSchedule, useUpdateSchedule } from "../../hooks/useSchedules"
import type { Schedule } from "../../types"

const DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

const scheduleSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().min(1, "La hora de inicio es requerida"),
  endTime: z.string().min(1, "La hora de fin es requerida"),
  room: z.string().min(1, "El salón es requerido"),
})

type ScheduleFormData = z.infer<typeof scheduleSchema>

interface ScheduleDialogProps {
  open: boolean
  onClose: () => void
  schedule: Schedule | null
}

export default function ScheduleDialog({ open, onClose, schedule }: ScheduleDialogProps) {
  const createSchedule = useCreateSchedule()
  const updateSchedule = useUpdateSchedule()
  const isEditing = !!schedule

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      dayOfWeek: 1,
      startTime: "",
      endTime: "",
      room: "",
    },
  })

  useEffect(() => {
    if (schedule) {
      reset({
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        room: schedule.room,
      })
    } else {
      reset({
        dayOfWeek: 1,
        startTime: "",
        endTime: "",
        room: "",
      })
    }
  }, [schedule, reset])

  const onSubmit = async (data: ScheduleFormData) => {
    if (isEditing && schedule) {
      await updateSchedule.mutateAsync({ id: schedule.id, data })
    } else {
      await createSchedule.mutateAsync(data)
    }
    onClose()
    reset()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? "Editar Horario" : "Agregar Horario"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="dayOfWeek"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal" error={!!errors.dayOfWeek}>
                <InputLabel>Día de la Semana</InputLabel>
                <Select {...field} label="Día de la Semana">
                  {DAYS_OF_WEEK.map((day, index) => (
                    <MenuItem key={index} value={index}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
                {errors.dayOfWeek && <FormHelperText>{errors.dayOfWeek.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
            }}
          >
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Hora de Inicio"
                  type="time"
                  error={!!errors.startTime}
                  helperText={errors.startTime?.message}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Hora de Fin"
                  type="time"
                  error={!!errors.endTime}
                  helperText={errors.endTime?.message}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          </Box>

          <Controller
            name="room"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Salón"
                error={!!errors.room}
                helperText={errors.room?.message || "Ej: Edificio A, Salón 101"}
                margin="normal"
              />
            )}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
