import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Login/LoginPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard/Dashboard';
import VenuesList from './pages/Venues/List';
import CreateVenue from './pages/Venues/Create';
import DetailVenue from './pages/Venues/Detail';
import EditVenue from './pages/Venues/Edit';

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} /> {/* Muestra en "/" */}
          <Route path="venues" element={<VenuesList />} />
          <Route path="venues/create" element={<CreateVenue />} />
          <Route path="venues/:id" element={<DetailVenue />} />
          <Route path="venues/:id/edit" element={<EditVenue />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
