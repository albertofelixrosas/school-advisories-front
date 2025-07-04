import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Login/LoginPage';
import HomePage from './pages/HomePage';
import TableDemo from './pages/TableDemoPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard/Dashboard';
import Venues from './pages/Venues/List';

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
          <Route path="venues" element={<Venues />} />
          <Route path="tabledemo" element={<TableDemo />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
