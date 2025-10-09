"use client"

import type React from "react"

import { createContext, useState, useMemo, useEffect } from "react"
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material"
import { createAppTheme } from "../theme"

type ThemeMode = "light" | "dark"

interface ThemeContextType {
  mode: ThemeMode
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: "dark",
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("theme-mode")
    return (saved as ThemeMode) || "dark"
  })

  useEffect(() => {
    localStorage.setItem("theme-mode", mode)
  }, [mode])

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"))
  }

  const theme = useMemo(() => createAppTheme(mode), [mode])

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}
