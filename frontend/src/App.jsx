import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider as CustomThemeProvider, useThemeMode } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingBar from './components/LoadingBar';
import Breadcrumbs from './components/Breadcrumbs';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Books from './pages/Books';
import Authors from './pages/Authors';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Borrowings from './pages/Borrowings';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';

const AppContent = () => {
  const { mode } = useThemeMode();
  
  return (
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <Box
            sx={{
              minHeight: '100vh',
              background: mode === 'dark'
                ? 'radial-gradient(circle at top left, #1d4ed8 0, transparent 55%), radial-gradient(circle at bottom right, #f97316 0, transparent 55%), #020617'
                : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              color: mode === 'dark' ? 'rgba(248,250,252,0.96)' : 'rgba(15,23,42,0.96)',
              transition: 'background 0.3s ease',
            }}
          >
            <Router
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <LoadingBar />
              <Navbar />
              <Box component="main" sx={{ py: 2, px: 3 }}>
                <Breadcrumbs />
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/authors" element={<Authors />} />
                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/borrowings"
                      element={
                        <PrivateRoute>
                          <Borrowings />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/favorites"
                      element={
                        <PrivateRoute>
                          <Favorites />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <PrivateRoute requiredRole="admin">
                          <AdminPanel />
                        </PrivateRoute>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ErrorBoundary>
              </Box>
            </Router>
          </Box>
        </NotificationProvider>
      </AuthProvider>
    </StyledEngineProvider>
  );
};

function App() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}

export default App;

