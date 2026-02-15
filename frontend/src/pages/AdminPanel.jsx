import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AdminPanel = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Админ-панель
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography>Админ-панель функционалдығы мұнда болады</Typography>
      </Box>
    </Container>
  );
};

export default AdminPanel;
