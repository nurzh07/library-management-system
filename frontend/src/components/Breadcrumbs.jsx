import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Typography, Box } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

const routeNames = {
  '/': 'Басты бет',
  '/books': 'Кітаптар',
  '/authors': 'Авторлар',
  '/login': 'Кіру',
  '/register': 'Тіркелу',
  '/profile': 'Профиль',
  '/admin': 'Админ панель',
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Басты бетте көрсетпеу
  if (location.pathname === '/') return null;

  return (
    <Box sx={{ mb: 2, mt: 1 }}>
      <MuiBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <HomeIcon fontSize="small" />
          Басты
        </Link>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const routeKey = `/${value}`;
          const name = routeNames[to] || routeNames[routeKey] || value;

          return last ? (
            <Typography color="text.primary" key={to}>
              {name}
            </Typography>
          ) : (
            <Link
              to={to}
              key={to}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              {name}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
