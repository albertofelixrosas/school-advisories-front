// Script de prueba para verificar conectividad con el backend
console.log("🔍 Verificando conexión con el backend...")

const API_URL = "http://localhost:3000"

async function testBackendConnection() {
  console.log(`📡 Probando conexión a: ${API_URL}`)
  
  try {
    // Probar endpoint básico
    const response = await fetch(`${API_URL}/health`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    
    console.log(`📊 Status: ${response.status}`)
    console.log(`📊 OK: ${response.ok}`)
    
    if (response.ok) {
      const data = await response.text()
      console.log("✅ Backend conectado:", data)
    } else {
      console.log("❌ Backend no responde correctamente")
    }
    
  } catch (error) {
    console.log("❌ Error de conexión:", error)
    console.log("🔧 Verifica que el backend esté corriendo en localhost:3001")
  }
}

async function testAuthenticatedEndpoint() {
  console.log("🔐 Probando endpoints autenticados...")
  
  const token = localStorage.getItem("access_token")
  
  if (!token) {
    console.log("❌ No hay token de acceso. Inicia sesión primero.")
    return
  }
  
  console.log("🎫 Token encontrado:", token.substring(0, 20) + "...")
  
  try {
    const response = await fetch(`${API_URL}/subjects`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    console.log(`📊 Status subjects: ${response.status}`)
    
    if (response.ok) {
      const subjects = await response.json()
      console.log("✅ Materias obtenidas:", subjects)
    } else {
      const error = await response.text()
      console.log("❌ Error en subjects:", error)
    }
    
  } catch (error) {
    console.log("❌ Error en llamada autenticada:", error)
  }
}

// Exportar funciones para uso en consola
declare global {
  interface Window {
    testBackend: () => Promise<void>;
    testAuth: () => Promise<void>;
  }
}

window.testBackend = testBackendConnection
window.testAuth = testAuthenticatedEndpoint

// Ejecutar prueba básica automáticamente
testBackendConnection()

export { testBackendConnection, testAuthenticatedEndpoint }