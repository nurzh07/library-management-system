import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
                <Button color="inherit" component={Link} to="/borrowings">
                  Менің кітаптарым
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
                  sx={{ borderRadius: 999, px: 2 }}
                >
                  Шығу
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
              </>
            )}
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
