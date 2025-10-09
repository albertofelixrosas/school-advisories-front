"use client"

import type React from "react"

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Divider,
  // useTheme as useMuiTheme,
} from "@mui/material"
import { Menu as MenuIcon, Brightness4, Brightness7, AccountCircle, BugReport } from "@mui/icons-material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { useTheme } from "../../hooks/useTheme"

interface NavbarProps {
  onMenuClick: () => void
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate()
  const { user, logout, switchDevelopmentUser } = useAuth()
  const { mode, toggleTheme } = useTheme()
  // const theme = useMuiTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [devMenuAnchor, setDevMenuAnchor] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleProfile = () => {
    navigate("/profile")
    handleClose()
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
    handleClose()
  }

  // 🚀 Funciones para el menú de desarrollo
  const handleDevMenu = (event: React.MouseEvent<HTMLElement>) => {
    setDevMenuAnchor(event.currentTarget)
  }

  const handleDevMenuClose = () => {
    setDevMenuAnchor(null)
  }

  const handleSwitchUser = (role: "student" | "teacher" | "admin") => {
    switchDevelopmentUser(role)
    handleDevMenuClose()
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 2, display: { sm: "none" } }}>
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img src="/logo-itson.png" alt="ITSON" style={{ height: 40, marginRight: 16 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              display: { xs: "none", sm: "block" },
            }}
          >
            Asesorías Académicas
          </Typography>
        </Box>

        {/* 🚀 Botón de desarrollo - Solo para desarrollo */}
        <Chip
          label="DEV"
          size="small"
          onClick={handleDevMenu}
          sx={{ 
            mr: 1, 
            bgcolor: "warning.main", 
            color: "warning.contrastText",
            cursor: "pointer",
            "&:hover": {
              bgcolor: "warning.dark"
            }
          }}
          icon={<BugReport />}
        />

        <IconButton onClick={toggleTheme} color="inherit" sx={{ mr: 1 }}>
          {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        <IconButton onClick={handleMenu} color="inherit">
          {user?.avatar ? <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} /> : <AccountCircle />}
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleProfile}>Mi Perfil</MenuItem>
          <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
        </Menu>

        {/* 🚀 Menú de desarrollo para cambiar usuarios */}
        <Menu
          anchorEl={devMenuAnchor}
          open={Boolean(devMenuAnchor)}
          onClose={handleDevMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem disabled>
            <Typography variant="subtitle2" color="text.secondary">
              🛠️ Cambiar Usuario de Desarrollo
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleSwitchUser("student")}>
            👨‍🎓 Ana García (Estudiante)
          </MenuItem>
          <MenuItem onClick={() => handleSwitchUser("teacher")}>
            👨‍🏫 Dr. Juan Pérez (Profesor)
          </MenuItem>
          <MenuItem onClick={() => handleSwitchUser("admin")}>
            👩‍💼 María Admin (Administrador)
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
