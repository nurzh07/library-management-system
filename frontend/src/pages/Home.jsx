import React from 'react';
import { Container, Typography, Box, Button, Grid, Chip } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={7}>
          <Box>
            <Chip
              label="Кітапхана Ақпараттық Жүйесі"
              color="secondary"
              variant="outlined"
              sx={{
                mb: 2,
                borderRadius: 999,
                borderColor: 'rgba(148,163,184,0.5)',
                backgroundColor: 'rgba(15,23,42,0.7)',
              }}
            />
            <Typography variant="h2" component="h1" gutterBottom>
              Қазіргі заманғы{' '}
              <Box component="span" sx={{ color: 'secondary.main' }}>
                цифрлық кітапхана
              </Box>
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              paragraph
              sx={{ maxWidth: 520 }}
            >
              Кітаптарды, авторларды және оқырмандарды бір платформада басқарыңыз.
              Берулерді қадағалау, админ-панель және ыңғайлы іздеу — бәрі бір жерде.
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/books"
              >
                Кітаптарды көру
              </Button>
              <Button
                variant="outlined"
                size="large"
                color="secondary"
                component={Link}
                to="/register"
              >
                Тіркелу
              </Button>
            </Box>
            <Box
              sx={{
                mt: 4,
                display: 'flex',
                gap: 3,
                color: 'text.secondary',
                flexWrap: 'wrap',
              }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  24/7
                </Typography>
                <Typography variant="body2">Онлайн қолжетімділік</Typography>
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  CRUD
                </Typography>
                <Typography variant="body2">Кітаптар мен авторларды басқару</Typography>
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Admin
                </Typography>
                <Typography variant="body2">Статистика және бақылау</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              borderRadius: 5,
              p: 3,
              background:
                'radial-gradient(circle at top, rgba(129,140,248,0.65), transparent 55%), rgba(15,23,42,0.95)',
              border: '1px solid rgba(148,163,184,0.4)',
              boxShadow: '0 24px 60px rgba(15,23,42,0.9)',
            }}
          >
            <Typography variant="subtitle2" color="secondary.main" gutterBottom>
              Жүйе мүмкіндіктері
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              • JWT аутентификация және рөлдер (admin / user)
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              • Кітаптар, авторлар, оқырмандарға арналған толық CRUD
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              • Кітап беру/қайтару, мерзім мен қарызды бақылау
            </Typography>
            <Typography variant="body1">
              • Admin-панель: статистика, пайдаланушылар мен контентті басқару
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
