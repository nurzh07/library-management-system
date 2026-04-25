import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, Badge } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import api from '../services/api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchOverdue();
    }
  }, [user]);

  const fetchOverdue = async () => {
    try {
      const response = await api.get('/borrowings');
      const borrowings = response.data.data.borrowings || [];
      const overdue = borrowings.filter(b => {
        if (b.status !== 'borrowed') return false;
        const dueDate = new Date(b.dueDate);
        return dueDate < new Date();
      });
      setOverdueCount(overdue.length);
    } catch (error) {
      console.error('Error fetching overdue:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Toolbar disableGutters>
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1.2,
          }}
        >
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '30%',
                mr: 1.5,
                background:
                  'radial-gradient(circle at 30% 30%, #facc15, transparent 60%), radial-gradient(circle at 70% 70%, #22c55e, transparent 55%), #0f172a',
                border: '1px solid rgba(148,163,184,0.6)',
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.04em',
              }}
            >
              LMS · Кітапхана
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Button color="inherit" component={Link} to="/books">
              Кітаптар
            </Button>
            <Button color="inherit" component={Link} to="/authors">
              Авторлар
            </Button>
            {user ? (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/borrowings"
                  startIcon={
                    overdueCount > 0 ? (
                      <Badge badgeContent={overdueCount} color="error">
                        <NotificationsIcon />
                      </Badge>
                    ) : null
                  }
                >
                  Менің кітаптарым
                  {overdueCount > 0 && (
                    <Box component="span" sx={{ 
                      ml: 1, 
                      px: 1, 
                      py: 0.2, 
                      bgcolor: 'error.main', 
                      color: 'white', 
                      borderRadius: 1,
                      fontSize: '0.75rem'
                    }}>
                      {overdueCount} мерзімі өтті
                    </Box>
                  )}
                </Button>
                <Button color="inherit" component={Link} to="/favorites">
                  Сүйіктілер
                </Button>
                {user.role === 'admin' && (
                  <Button color="inherit" component={Link} to="/admin">
                    Админ-панель
                  </Button>
                )}
                <Button color="inherit" component={Link} to="/profile">
                  Профиль
                </Button>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  data-testid="logout-button"
                  sx={{ ml: 1 }}
                >
                  Шығу
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={toggleTheme}
                  sx={{ ml: 1, minWidth: 40, p: 0.5 }}
                >
                  {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Кіру
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  component={Link}
                  to="/register"
                  sx={{
                    boxShadow: '0 10px 25px rgba(248,250,252,0.18)',
                  }}
                >
                  Тіркелу
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={toggleTheme}
                  sx={{ ml: 1, minWidth: 40, p: 0.5 }}
                >
                  {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </Button>
              </>
            )}
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
