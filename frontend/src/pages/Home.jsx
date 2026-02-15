import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box textAlign="center" py={8}>
        <Typography variant="h2" component="h1" gutterBottom>
          Кітапхана Ақпараттық Жүйесі
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Кітапхана ресурстарын тиімді басқару жүйесі
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/books"
            sx={{ mr: 2 }}
          >
            Кітаптарды көру
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/register"
          >
            Тіркелу
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
