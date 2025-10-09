"use client"

import type React from "react"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import MainLayout from "../layouts/MainLayout"
import AuthLayout from "../layouts/AuthLayout"
import LoadingScreen from "../components/common/LoadingScreen"

// Public pages
import LandingPage from "../pages/public/LandingPage"
import LoginPage from "../pages/auth/LoginPage"
import RegisterPage from "../pages/auth/RegisterPage"

// Protected pages
import HomePage from "../pages/protected/HomePage"
import AppointmentsPage from "../pages/protected/AppointmentsPage"
import AdvisoriesPage from "../pages/protected/AdvisoriesPage"
import TeachersPage from "../pages/protected/TeachersPage"
import ProfilePage from "../pages/protected/ProfilePage"
import SubjectsPage from "../pages/protected/SubjectsPage"
import SchedulesPage from "../pages/protected/SchedulesPage"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen message="Verificando sesión..." />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<HomePage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/advisories" element={<AdvisoriesPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/schedules" element={<SchedulesPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
