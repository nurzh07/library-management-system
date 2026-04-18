import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Books from './pages/Books';
import Authors from './pages/Authors';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Borrowings from './pages/Borrowings';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2563eb', // Tailwind blue-600 style
    },
    secondary: {
      main: '#f97316', // warm accent
    },
    background: {
      default: '#0f172a', // dark slate
      paper: '#020617',
    },
    text: {
      primary: '#e5e7eb',
      secondary: 'rgba(148,163,184,0.9)',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: [
      '"Inter"',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.04em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg,#0f172a,#111827,#1d4ed8)',
          boxShadow: '0 16px 40px rgba(15,23,42,0.6)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background:
            'radial-gradient(circle at top left, rgba(37,99,235,0.25), transparent 55%), #020617',
          border: '1px solid rgba(148,163,184,0.2)',
          boxShadow: '0 18px 40px rgba(15,23,42,0.8)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'lg',
      },
    },
  },
});

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <NotificationProvider>
            <Box
              sx={{
                minHeight: '100vh',
                background:
                  'radial-gradient(circle at top left, #1d4ed8 0, transparent 55%), radial-gradient(circle at bottom right, #f97316 0, transparent 55%), #020617',
                color: 'rgba(248,250,252,0.96)',
              }}
            >
              <Router
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              >
                <Navbar />
                <Box component="main" sx={{ py: 4 }}>
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
                    path="/admin"
                    element={
                      <PrivateRoute requiredRole="admin">
                        <AdminPanel />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Box>
              </Router>
            </Box>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;

