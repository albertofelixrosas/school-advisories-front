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
  // useTheme as useMuiTheme,
} from "@mui/material"
import { Menu as MenuIcon, Brightness4, Brightness7, AccountCircle } from "@mui/icons-material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { useTheme } from "../../hooks/useTheme"

interface NavbarProps {
  onMenuClick: () => void
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { mode, toggleTheme } = useTheme()
  // const theme = useMuiTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

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

        <IconButton onClick={toggleTheme} color="inherit" sx={{ mr: 1 }}>
          {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        <IconButton onClick={handleMenu} color="inherit">
          {user?.photo_url ? <Avatar src={user.photo_url} sx={{ width: 32, height: 32 }} /> : <AccountCircle />}
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


      </Toolbar>
    </AppBar>
  )
}
