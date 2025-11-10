"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Home,
  CalendarMonth,
  School,
  Person,
  MenuBook,
  Schedule,
  AdminPanelSettings,
  Dashboard,
  Event,
  AccountTree,
  Settings,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const drawerWidth = 240;

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [
    {
      text: "Inicio",
      icon: <Home />,
      path: "/home",
      roles: ["student", "professor", "admin"],
    },

    // Student menu items
    {
      text: "Mis Citas",
      icon: <CalendarMonth />,
      path: "/appointments",
      roles: ["student"],
    },
    {
      text: "Asesorías Disponibles",
      icon: <School />,
      path: "/advisories",
      roles: ["student"],
    },
    {
      text: "Profesores",
      icon: <Person />,
      path: "/teachers",
      roles: ["student", "admin"],
    },

    // Professor menu items
    {
      text: "Dashboard Profesor",
      icon: <Dashboard />,
      path: "/professor/dashboard",
      roles: ["professor"],
    },
    {
      text: "Gestionar Materias",
      icon: <MenuBook />,
      path: "/professor/subjects",
      roles: ["professor"],
    },
    {
      text: "Mis Asesorías",
      icon: <Event />,
      path: "/professor/advisories",
      roles: ["professor"],
    },
    {
      text: "Mi Horario",
      icon: <Schedule />,
      path: "/professor/schedules",
      roles: ["professor"],
    },

    // Admin menu items
    {
      text: "Panel Admin",
      icon: <AdminPanelSettings />,
      path: "/admin/dashboard",
      roles: ["admin"],
    },
    {
      text: "Gestión de Materias",
      icon: <AccountTree />,
      path: "/admin/subjects",
      roles: ["admin"],
    },
    {
      text: "Gestión de Usuarios",
      icon: <Settings />,
      path: "/admin/users",
      roles: ["admin"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || "student")
  );

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawer = (
    <>
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {filteredMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "primary.contrastText",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color:
                      location.pathname === item.path
                        ? "inherit"
                        : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "background.paper",
              borderRight: 1,
              borderColor: "divider",
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "background.paper",
              borderRight: 1,
              borderColor: "divider",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
}
