import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Login/LoginPage';
import HomePage from './pages/HomePage';
import TableDemo from './pages/TableDemoPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas con Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} /> {/* Muestra en "/" */}
          <Route path="tabledemo" element={<TableDemo />} /> {/* Muestra en "/contact" */}
          <Route path="*" element={<NotFoundPage />} /> {/* Para cualquier ruta no existente */}
        </Route>
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
