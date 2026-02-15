import React, { useContext } from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Container>Жүктелуде...</Container>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Профиль
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography><strong>Аты:</strong> {user.firstName}</Typography>
          <Typography><strong>Тегі:</strong> {user.lastName}</Typography>
          <Typography><strong>Email:</strong> {user.email}</Typography>
          {user.phone && <Typography><strong>Телефон:</strong> {user.phone}</Typography>}
          <Typography><strong>Рөл:</strong> {user.role === 'admin' ? 'Әкімші' : 'Оқырман'}</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
