import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Кітапхана
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
              <Button color="inherit" onClick={handleLogout}>
                Шығу
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Кіру
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Тіркелу
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
