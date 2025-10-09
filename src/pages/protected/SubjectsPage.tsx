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
} from "@mui/material"
import { Add, Edit, Delete } from "@mui/icons-material"
import { useMySubjects, useDeleteSubject } from "../../hooks/useSubjects"
import SubjectDialog from "../../components/teacher/SubjectDialog"
import DeleteConfirmDialog from "../../components/common/DeleteConfirmDialog"
import type { Subject } from "../../types"

export default function SubjectsPage() {
  const { data: subjects, isLoading, error } = useMySubjects()
  const deleteSubject = useDeleteSubject()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject)
    setDialogOpen(true)
  }

  const handleDelete = (subject: Subject) => {
    setSelectedSubject(subject)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedSubject) {
      await deleteSubject.mutateAsync(selectedSubject.id)
      setDeleteDialogOpen(false)
      setSelectedSubject(null)
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedSubject(null)
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
        Error al cargar las materias. Por favor intenta nuevamente.
      </Alert>
    )
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Mis Materias
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona las materias que impartes
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
          Agregar Materia
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Código</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nombre de la Materia</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Asesorías Activas</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subjects && subjects.length > 0 ? (
                subjects.map((subject) => (
                  <TableRow key={subject.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: "monospace" }}>
                        {subject.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {subject.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {subject.advisoriesCount || 0} asesorías
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEdit(subject)} title="Editar">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(subject)} title="Eliminar">
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No has agregado materias aún</Typography>
                    <Button variant="text" onClick={() => setDialogOpen(true)} sx={{ mt: 2 }}>
                      Agregar tu primera materia
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <SubjectDialog open={dialogOpen} onClose={handleCloseDialog} subject={selectedSubject} />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Materia"
        message="¿Estás seguro de que deseas eliminar esta materia? Todas las asesorías asociadas también serán eliminadas."
        isLoading={deleteSubject.isPending}
      />
    </Box>
  )
}
