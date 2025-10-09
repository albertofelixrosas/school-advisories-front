"use client"

import { Outlet, Navigate } from "react-router-dom"
import { Box, Container } from "@mui/material"
import { useAuth } from "../hooks/useAuth"

export default function AuthLayout() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/home" replace />
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="sm">
        <Outlet />
      </Container>
    </Box>
  )
}
