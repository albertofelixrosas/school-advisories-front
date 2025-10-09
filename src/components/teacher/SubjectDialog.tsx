"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material"
import { useCreateSubject, useUpdateSubject } from "../../hooks/useSubjects"
import type { Subject } from "../../types"

const subjectSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").min(3, "El nombre debe tener al menos 3 caracteres"),
  code: z
    .string()
    .min(1, "El código es requerido")
    .min(2, "El código debe tener al menos 2 caracteres")
    .max(20, "El código es demasiado largo"),
})

type SubjectFormData = z.infer<typeof subjectSchema>

interface SubjectDialogProps {
  open: boolean
  onClose: () => void
  subject: Subject | null
}

export default function SubjectDialog({ open, onClose, subject }: SubjectDialogProps) {
  const createSubject = useCreateSubject()
  const updateSubject = useUpdateSubject()
  const isEditing = !!subject

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  })

  useEffect(() => {
    if (subject) {
      reset({
        name: subject.name,
        code: subject.code,
      })
    } else {
      reset({
        name: "",
        code: "",
      })
    }
  }, [subject, reset])

  const onSubmit = async (data: SubjectFormData) => {
    if (isEditing && subject) {
      await updateSubject.mutateAsync({ id: subject.id, data })
    } else {
      await createSubject.mutateAsync(data)
    }
    onClose()
    reset()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? "Editar Materia" : "Agregar Materia"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Código de la Materia"
                error={!!errors.code}
                helperText={errors.code?.message || "Ej: MAT101, FIS202"}
                margin="normal"
                autoFocus
              />
            )}
          />
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Nombre de la Materia"
                error={!!errors.name}
                helperText={errors.name?.message}
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
