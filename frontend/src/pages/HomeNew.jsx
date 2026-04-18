import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Button, Grid, Chip, 
  Card, CardContent, CardMedia, Paper, Fade, Zoom,
  useTheme, useMediaQuery, LinearProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../services/api';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import DevicesIcon from '@mui/icons-material/Devices';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [stats, setStats] = useState({ books: 0, users: 0, borrowings: 0 });
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentBooks();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats({
        books: response.data.data.totalBooks || 0,
        users: response.data.data.totalUsers || 0,
        borrowings: response.data.data.totalBorrowings || 0
      });
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  const fetchRecentBooks = async () => {
    try {
      const response = await api.get('/books?limit=4');
      setRecentBooks(response.data.data.books || []);
      setLoading(false);
    } catch (error) {
      console.error('Books fetch error:', error);
      setLoading(false);
    }
  };

  const statCards = [
    { icon: LibraryBooksIcon, label: 'Кітаптар', value: stats.books, color: '#60a5fa' },
    { icon: PeopleIcon, label: 'Оқырмандар', value: stats.users, color: '#34d399' },
    { icon: MenuBookIcon, label: 'Берулер', value: stats.borrowings, color: '#fbbf24' },
    { icon: TrendingUpIcon, label: 'Категориялар', value: 5, color: '#f472b6' }
  ];

  const features = [
    { icon: SpeedIcon, title: 'Жылдам іздеу', desc: 'Кітаптарды атавы, авторы немесе ISBN бойынша секундта табыңыз' },
    { icon: SecurityIcon, title: 'Қауіпсіздік', desc: 'JWT токендер + bcrypt хэштеу + рөлдік бақылау' },
    { icon: DevicesIcon, title: 'Кроссплатформалық', desc: 'Компьютер, планшет, телефон - барлығына ыңғайлы' }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Container sx={{ mt: 6, mb: 6 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <Fade in timeout={1000}>
              <Box>
                <Chip
                  label="Кітапхана АҚЖ v2.0"
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
              </Box>
            </Fade>
          </Grid>
          <Grid item xs={12} md={5}>
            <Zoom in timeout={1200}>
              <Box
                sx={{
                  borderRadius: 5,
                  p: 3,
                  background: 'radial-gradient(circle at top, rgba(129,140,248,0.65), transparent 55%), rgba(15,23,42,0.95)',
                  border: '1px solid rgba(148,163,184,0.4)',
                  boxShadow: '0 24px 60px rgba(15,23,42,0.9)',
                }}
              >
                <Typography variant="subtitle2" color="secondary.main" gutterBottom>
                  🚀 Жүйе мүмкіндіктері
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  • JWT аутентификация + рөлдер
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  • Толық CRUD операциялар
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  • Кітап беру/қайтару жүйесі
                </Typography>
                <Typography variant="body1">
                  • Admin панель + статистика
                </Typography>
              </Box>
            </Zoom>
          </Grid>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ backgroundColor: 'rgba(15,23,42,0.5)', py: 6 }}>
        <Container>
          <Grid container spacing={3}>
            {statCards.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Zoom in timeout={800 + index * 200}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      background: `linear-gradient(135deg, ${stat.color}20, transparent)`,
                      border: `1px solid ${stat.color}40`,
                      borderRadius: 3,
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'translateY(-5px)' }
                    }}
                  >
                    <stat.icon sx={{ fontSize: 40, color: stat.color, mb: 1 }} />
                    <Typography variant="h3" sx={{ fontWeight: 700, color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Paper>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" gutterBottom>
          Негізгі мүмкіндіктер
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Fade in timeout={1000 + index * 300}>
                <Paper sx={{ p: 4, height: '100%', borderRadius: 3, textAlign: 'center' }}>
                  <feature.icon sx={{ fontSize: 50, color: 'secondary.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Recent Books Section */}
      <Box sx={{ backgroundColor: 'rgba(15,23,42,0.3)', py: 8 }}>
        <Container>
          <Typography variant="h3" textAlign="center" gutterBottom>
            📚 Соңғы қосылған кітаптар
          </Typography>
          {loading ? (
            <LinearProgress />
          ) : (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {recentBooks.map((book, index) => (
                <Grid item xs={12} sm={6} md={3} key={book.id}>
                  <Fade in timeout={800 + index * 200}>
                    <Card 
                      component={Link} 
                      to={`/books/${book.id}`}
                      sx={{ 
                        height: '100%', 
                        textDecoration: 'none',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': { transform: 'scale(1.03)', boxShadow: 6 }
                      }}
                    >
                      <CardMedia
                        component="div"
                        sx={{
                          height: 140,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <LibraryBooksIcon sx={{ fontSize: 60, color: 'white' }} />
                      </CardMedia>
                      <CardContent>
                        <Typography variant="h6" noWrap>
                          {book.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {book.category?.name || 'Категориясыз'}
                        </Typography>
                        <Chip 
                          label={`${book.availableCopies}/${book.totalCopies} қолжетімді`}
                          size="small"
                          color={book.availableCopies > 0 ? 'success' : 'error'}
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          )}
          <Box textAlign="center" mt={4}>
            <Button variant="contained" size="large" component={Link} to="/books">
              Барлық кітаптар →
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
