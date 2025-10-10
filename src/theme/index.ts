import { createTheme, type ThemeOptions } from "@mui/material/styles"

const getThemeOptions = (mode: "light" | "dark"): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: mode === "dark" ? "#4A90E2" : "#0A5DA6", // Azul más claro para modo oscuro
      light: mode === "dark" ? "#7BB3F0" : "#3D7FBF",
      dark: mode === "dark" ? "#2E5B8C" : "#074173",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#1a1a1a",
      light: "#333333",
      dark: "#000000",
      contrastText: "#ffffff",
    },
    background: {
      default: mode === "dark" ? "#0a0a0a" : "#ffffff",
      paper: mode === "dark" ? "#1a1a1a" : "#f5f5f5",
    },
    text: {
      primary: mode === "dark" ? "#ffffff" : "#1a1a1a",
      secondary: mode === "dark" ? "#a3a3a3" : "#666666",
    },
    divider: mode === "dark" ? "#333333" : "#e5e5e5",
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "1.875rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          padding: "10px 20px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: mode === "dark" ? "0 1px 3px rgba(0, 0, 0, 0.5)" : "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: mode === "dark" ? "1px solid #333" : "1px solid #e5e5e5",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: mode === "dark" ? "1px solid #333" : "1px solid #e5e5e5",
        },
        head: {
          fontWeight: 600,
          backgroundColor: mode === "dark" ? "#1a1a1a" : "#f5f5f5",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          // Estilos específicos para inputs de tiempo en tema oscuro
          '& input[type="time"]': mode === "dark" ? {
            "&::-webkit-calendar-picker-indicator": {
              filter: "invert(1)",
              cursor: "pointer",
            },
            "&::-webkit-inner-spin-button": {
              display: "none",
            },
            "&::-webkit-outer-spin-button": {
              display: "none",
            },
          } : {},
        },
      },
    },
  },
})

export const createAppTheme = (mode: "light" | "dark") => {
  return createTheme(getThemeOptions(mode))
}
