import { useState } from "react";
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
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Fab,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMyAdvisories, useDeleteAdvisory } from "../../hooks/useAdvisories";
// import { useMySubjects } from "../../hooks/useSubjects"
import type { Advisory } from "../../api/advisories";

const dayNames: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

export default function ProfessorAdvisoriesPage() {
  const navigate = useNavigate();

  // Usar hooks reales para obtener datos
  const { data: advisories, isLoading, error } = useMyAdvisories();
  // const { data: mySubjects } = useMySubjects()
  const deleteAdvisoryMutation = useDeleteAdvisory();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAdvisory, setSelectedAdvisory] = useState<Advisory | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    advisory: Advisory
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedAdvisory(advisory);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAdvisory(null);
  };

  const handleEdit = () => {
    if (selectedAdvisory) {
      navigate(`/professor/edit-advisory/${selectedAdvisory.advisory_id}`);
    }
    handleMenuClose();
  };

  const handleScheduleDates = () => {
    if (selectedAdvisory) {
      navigate(`/professor/advisory-dates/${selectedAdvisory.advisory_id}`);
    }
    handleMenuClose();
  };

  const handleViewStudents = () => {
    if (selectedAdvisory) {
      navigate(`/professor/advisory-students/${selectedAdvisory.advisory_id}`);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    if (selectedAdvisory) {
      deleteAdvisoryMutation.mutate(selectedAdvisory.advisory_id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedAdvisory(null);
        },
      });
    }
  };

  const formatSchedules = (schedules: Advisory["schedules"]) => {
    return schedules
      .map(
        (schedule) =>
          `${dayNames[schedule.day]} ${schedule.begin_time}-${
            schedule.end_time
          }`
      )
      .join(", ");
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error al cargar las asesorías. Por favor intenta nuevamente.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          Mis Asesorías
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona las asesorías que has creado para tus materias
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
          gap: 3,
          mb: 4,
        }}
      >
        <Card>
          <CardContent>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "primary.main" }}
            >
              {advisories?.length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Asesorías Creadas
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "success.main" }}
            >
              {advisories?.reduce(
                (sum: number, advisory: Advisory) =>
                  sum + advisory.max_students,
                0
              ) || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Capacidad Total
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "info.main" }}
            >
              {advisories?.reduce(
                (sum: number, advisory: Advisory) =>
                  sum + advisory.schedules.length,
                0
              ) || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Horarios Disponibles
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Advisories Table */}
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Lista de Asesorías
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/professor/create-advisory")}
            >
              Nueva Asesoría
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Materia</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Horarios</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Max. Estudiantes
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Fechas Programadas
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Estado
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {advisories && advisories.length > 0 ? (
                  advisories.map((advisory) => (
                    <TableRow key={advisory.advisory_id} hover>
                      <TableCell>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 500 }}
                        >
                          {advisory.subject_detail.subject_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {advisory.advisory_id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatSchedules(advisory.schedules)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={advisory.max_students}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label="0" // TODO: Calcular fechas reales
                          color="default"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label="Activa" color="success" size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => handleMenuClick(e, advisory)}
                          size="small"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No tienes asesorías creadas aún
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        sx={{ mt: 2 }}
                        onClick={() => navigate("/professor/create-advisory")}
                      >
                        Crear tu primera asesoría
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => navigate("/professor/create-advisory")}
      >
        <AddIcon />
      </Fab>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} />
          Editar Asesoría
        </MenuItem>
        <MenuItem onClick={handleScheduleDates}>
          <EventIcon sx={{ mr: 1 }} />
          Programar Fechas
        </MenuItem>
        <MenuItem onClick={handleViewStudents}>
          <PeopleIcon sx={{ mr: 1 }} />
          Ver Estudiantes
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Eliminar Asesoría</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar la asesoría de "
            {selectedAdvisory?.subject_detail.subject_name}"? Esta acción
            eliminará también todas las fechas programadas y no se puede
            deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
