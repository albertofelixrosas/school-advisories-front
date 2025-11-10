import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "./providers/ThemeProvider"
import { AuthProvider } from "./contexts/AuthContext"
import AppRoutes from "./routes"

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
