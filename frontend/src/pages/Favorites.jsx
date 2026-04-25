import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Pagination,
  Snackbar,
  Alert,
  IconButton,
  Skeleton,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [removingId, setRemovingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchFavorites();
  }, [page]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/favorites', {
        params: { page, limit: 12 },
      });
      setFavorites(response.data.data.favorites);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (bookId) => {
    try {
      setRemovingId(bookId);
      await api.delete(`/favorites/${bookId}`);
      setFavorites((prev) => prev.filter((f) => f.id !== bookId));
      setSnackbar({ open: true, message: 'Кітап сүйіктілерден жойылды', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Қате орын алды', severity: 'error' });
    } finally {
      setRemovingId(null);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" align="center">
          Сүйіктілерді көру үшін кіріңіз
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <FavoriteIcon color="error" sx={{ fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          Сүйіктілер
        </Typography>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card>
                <Skeleton variant="rectangular" height={140} />
                <CardContent>
                  <Skeleton variant="text" height={32} width="80%" />
                  <Skeleton variant="text" height={20} width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : favorites.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <FavoriteBorderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Сүйіктілер тізімі бос
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Кітаптар бетінен ұнаған кітаптарды қосыңыз
          </Typography>
          <Button variant="contained" sx={{ mt: 3 }} href="/books">
            Кітаптарды қарау
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {favorites.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" noWrap>
                      {book.title}
                    </Typography>
                    {book.authors && book.authors.length > 0 && (
                      <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                        {book.authors.map(a => `${a.firstName} ${a.lastName}`).join(', ')}
                      </Typography>
                    )}
                    {book.category && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <Box component="span" sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white', 
                          px: 1, 
                          py: 0.3, 
                          borderRadius: 1,
                          fontSize: '0.75rem'
                        }}>
                          {book.category.name}
                        </Box>
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Қолда бар: {book.availableCopies} / {book.totalCopies}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Button size="small" href={`/books`}>
                      Толығырақ
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => handleRemove(book.id)}
                      disabled={removingId === book.id}
                    >
                      {removingId === book.id ? (
                        <Skeleton variant="circular" width={24} height={24} />
                      ) : (
                        <FavoriteIcon />
                      )}
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
              />
            </Box>
          )}
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Favorites;
