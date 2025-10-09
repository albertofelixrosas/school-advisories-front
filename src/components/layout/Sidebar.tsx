"use client"

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
} from "@mui/material"
import { Home, CalendarMonth, School, Person, MenuBook, Schedule, AdminPanelSettings } from "@mui/icons-material"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const drawerWidth = 240

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const menuItems = [
    { text: "Inicio", icon: <Home />, path: "/home", roles: ["student", "teacher", "admin"] },
    { text: "Mis Citas", icon: <CalendarMonth />, path: "/appointments", roles: ["student"] },
    { text: "Asesorías Disponibles", icon: <School />, path: "/advisories", roles: ["student"] },
    { text: "Profesores", icon: <Person />, path: "/teachers", roles: ["student", "admin"] },
    { text: "Mis Materias", icon: <MenuBook />, path: "/subjects", roles: ["teacher"] },
    { text: "Mi Horario", icon: <Schedule />, path: "/schedules", roles: ["teacher"] },
    { text: "Administración", icon: <AdminPanelSettings />, path: "/admin", roles: ["admin"] },
  ]

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user?.role || "student"))

  const handleNavigation = (path: string) => {
    navigate(path)
    if (isMobile) {
      onClose()
    }
  }

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
                    color: location.pathname === item.path ? "inherit" : "text.secondary",
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
  )

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
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
  )
}
