import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import HomeIcon from '@mui/icons-material/Home';

const NotFound = () => {
  return (
    <Container
      sx={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(129,140,248,0.2) 0%, transparent 70%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <SearchOffIcon sx={{ fontSize: 100, color: 'secondary.main' }} />
      </Box>

      <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 700, mb: 2 }}>
        404
      </Typography>

      <Typography variant="h4" gutterBottom>
        Бет табылмады
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
        Кешіріңіз, сіз іздеп отырған бет жойылған немесе мекенжайы өзгерген.
      </Typography>

      <Button
        variant="contained"
        size="large"
        component={Link}
        to="/"
        startIcon={<HomeIcon />}
      >
        Басты бетке өту
      </Button>
    </Container>
  );
};

export default NotFound;
