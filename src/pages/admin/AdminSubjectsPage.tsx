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
  Avatar,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container
} from "@mui/material"
import {
  Add as AddIcon,
  School as SchoolIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  Assignment as AssignmentIcon
} from "@mui/icons-material"
import { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { 
  useSubjects, 
  useSubjectDetails, 
  useCreateSubject, 
  useUpdateSubject, 
  useDeleteSubject,
  useCreateSubjectDetail,
  useDeleteSubjectDetail
} from "../../hooks/useSubjects"
import type { Subject, CreateSubjectDto } from "../../api/subjects"

interface SubjectDialogProps {
  open: boolean;
  subject?: Subject;
  onClose: () => void;
  onSave: (data: CreateSubjectDto) => void;
}

function SubjectDialog({ open, subject, onClose, onSave }: SubjectDialogProps) {
  const [formData, setFormData] = useState<CreateSubjectDto>({
    subject: subject?.subject || ""
  })

  const handleSave = () => {
    if (formData.subject.trim()) {
      onSave(formData)
      setFormData({ subject: "" })
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {subject ? "Editar Materia" : "Nueva Materia"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nombre de la Materia"
          fullWidth
          variant="outlined"
          value={formData.subject}
          onChange={(e) => setFormData({ subject: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!formData.subject.trim()}
        >
          {subject ? "Actualizar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

interface AssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  onAssign: (subjectId: number, professorId: number) => void;
  subjects: Subject[];
}

function AssignmentDialog({ open, onClose, onAssign, subjects }: AssignmentDialogProps) {
  const [subjectId, setSubjectId] = useState<number | "">("")
  const [professorId, setProfessorId] = useState<number | "">("")

  const handleAssign = () => {
    if (subjectId && professorId) {
      onAssign(Number(subjectId), Number(professorId))
      setSubjectId("")
      setProfessorId("")
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Asignar Materia a Profesor</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>Materia</InputLabel>
          <Select
            value={subjectId}
            label="Materia"
            onChange={(e) => setSubjectId(e.target.value as number)}
          >
            {subjects.map((subject) => (
              <MenuItem key={subject.subject_id} value={subject.subject_id}>
                {subject.subject}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField
          margin="dense"
          label="ID del Profesor"
          type="number"
          fullWidth
          variant="outlined"
          value={professorId}
          onChange={(e) => setProfessorId(Number(e.target.value))}
          helperText="Ingresa el ID del profesor al que deseas asignar la materia"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={handleAssign} 
          variant="contained"
          disabled={!subjectId || !professorId}
        >
          Asignar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function AdminSubjectsPage() {
  // Hooks deben ir al inicio
  const { user } = useAuth()
  const [subjectDialog, setSubjectDialog] = useState<{ open: boolean; subject?: Subject }>({ open: false })
  const [assignmentDialog, setAssignmentDialog] = useState(false)
  
  const { data: subjects, isLoading: subjectsLoading, error: subjectsError } = useSubjects()
  const { data: subjectDetails, isLoading: detailsLoading } = useSubjectDetails()
  
  const createSubjectMutation = useCreateSubject()
  const updateSubjectMutation = useUpdateSubject()
  const deleteSubjectMutation = useDeleteSubject()
  const createAssignmentMutation = useCreateSubjectDetail()
  const deleteAssignmentMutation = useDeleteSubjectDetail()

  // Verificar que el usuario es administrador
  if (user?.role !== 'admin') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          No tienes permisos para acceder a esta página
        </Alert>
      </Container>
    )
  }

  const handleCreateSubject = (data: CreateSubjectDto) => {
    createSubjectMutation.mutate(data)
  }

  const handleUpdateSubject = (data: CreateSubjectDto) => {
    if (subjectDialog.subject) {
      updateSubjectMutation.mutate({
        id: subjectDialog.subject.subject_id,
        data
      })
    }
  }

  const handleDeleteSubject = (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta materia?")) {
      deleteSubjectMutation.mutate(id)
    }
  }

  const handleAssignSubject = (subjectId: number, professorId: number) => {
    createAssignmentMutation.mutate({ subject_id: subjectId, professor_id: professorId })
  }

  const handleDeleteAssignment = (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta asignación?")) {
      deleteAssignmentMutation.mutate(id)
    }
  }

  if (subjectsLoading || detailsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Cargando materias...
        </Typography>
      </Box>
    )
  }

  if (subjectsError) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error al cargar las materias: {(subjectsError as Error).message}
      </Alert>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          Administración de Materias
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona las materias del sistema y sus asignaciones a profesores
        </Typography>
      </Box>

      {/* Statistics Cards */}
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
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                <SchoolIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {subjects?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Materias Registradas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                <AssignmentIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {subjectDetails?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Asignaciones Activas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>
                <PersonAddIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {new Set(subjectDetails?.map(detail => detail.professor_id)).size || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Profesores con Materias
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Actions */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setSubjectDialog({ open: true })}
        >
          Nueva Materia
        </Button>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          onClick={() => setAssignmentDialog(true)}
        >
          Asignar a Profesor
        </Button>
      </Box>

      {/* Subjects Table */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Materias del Sistema
          </Typography>

          {subjects && subjects.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Asignaciones</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subjects.map((subject) => {
                    const assignments = subjectDetails?.filter(detail => 
                      detail.subject_id === subject.subject_id
                    ) || []
                    
                    return (
                      <TableRow key={subject.subject_id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                            {subject.subject_id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {subject.subject}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={`${assignments.length} profesores`}
                            color={assignments.length > 0 ? "success" : "default"}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              onClick={() => setSubjectDialog({ open: true, subject })}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteSubject(subject.subject_id)}
                              disabled={assignments.length > 0}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <SchoolIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay materias registradas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Crea la primera materia del sistema
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setSubjectDialog({ open: true })}
              >
                Nueva Materia
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Assignments Table */}
      {subjectDetails && subjectDetails.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Asignaciones Profesor-Materia
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Profesor</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Materia</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Horarios</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Asesorías</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(() => {
                    const validAssignments = subjectDetails?.filter(assignment => 
                      assignment.professor && assignment.professor.full_name
                    ) || []

                    if (validAssignments.length === 0) {
                      return (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Typography variant="body2" color="text.secondary">
                              No hay asignaciones profesor-materia disponibles
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )
                    }

                    return validAssignments.map((assignment) => (
                      <TableRow key={assignment.subject_detail_id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {assignment.professor.full_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {assignment.professor.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">
                            {assignment.subject.subject}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={`${assignment.schedules?.length || 0} horarios`}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={`${assignment.advisories?.length || 0} asesorías`}
                            color={assignment.advisories && assignment.advisories.length > 0 ? "success" : "default"}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Eliminar asignación">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteAssignment(assignment.subject_detail_id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  })()}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <SubjectDialog
        open={subjectDialog.open}
        subject={subjectDialog.subject}
        onClose={() => setSubjectDialog({ open: false })}
        onSave={subjectDialog.subject ? handleUpdateSubject : handleCreateSubject}
      />

      <AssignmentDialog
        open={assignmentDialog}
        onClose={() => setAssignmentDialog(false)}
        onAssign={handleAssignSubject}
        subjects={subjects || []}
      />
    </Box>
  )
}