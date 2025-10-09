import { Box, Typography } from "@mui/material"

export default function ProfilePage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Mi Perfil
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Gestiona tu información personal y preferencias.
      </Typography>
    </Box>
  )
}
