import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Box,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Skeleton,
  Chip,
  CardMedia,
} from '@mui/material';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Books = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [detailBook, setDetailBook] = useState(null);
  const [borrowing, setBorrowing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchBooks();
  }, [page, search]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/books', {
        params: { page, limit: 12, search },
      });
      setBooks(response.data.data.books);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (book) => {
    if (!user) {
      setSnackbar({ open: true, message: 'Кітап алу үшін кіріңіз', severity: 'warning' });
      return;
    }
    if (book.availableCopies < 1) {
      setSnackbar({ open: true, message: 'Кітап қолда жоқ', severity: 'error' });
      return;
    }
    try {
      setBorrowing(true);
      await api.post('/borrowings', { bookId: book.id });
      setSnackbar({ open: true, message: 'Кітап сәтті алынды', severity: 'success' });
      setDetailBook(null);
      fetchBooks();
    } catch (error) {
      const msg = error.response?.data?.message || 'Қате';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Кітаптар
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Іздеу"
          data-testid="books-search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Кітап атауы немесе ISBN бойынша іздеу"
        />
      </Box>
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card>
                <Skeleton variant="rectangular" height={140} />
                <CardContent>
                  <Skeleton variant="text" height={32} width="80%" />
                  <Skeleton variant="text" height={20} width="60%" />
                  <Skeleton variant="text" height={20} width="40%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <Grid container spacing={3} data-testid="books-grid">
            {books.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <Card data-testid="book-card">
                  <CardContent>
                    <Typography variant="h6" component="h2">
                      {book.title}
                    </Typography>
                    <Typography color="text.secondary">
                      ISBN: {book.isbn}
                    </Typography>
                    {book.authors && book.authors.length > 0 && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Авторлар: {book.authors.map(a => `${a.firstName} ${a.lastName}`).join(', ')}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Қолда бар: {book.availableCopies} / {book.totalCopies}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => setDetailBook(book)}>
                      Толығырақ
                    </Button>
                    {user && book.availableCopies > 0 && (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => handleBorrow(book)}
                        disabled={borrowing}
                      >
                        Кітап алу
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                data-testid="books-pagination"
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
              />
            </Box>
          )}
        </>
      )}

      <Dialog open={!!detailBook} onClose={() => setDetailBook(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{detailBook?.title}</DialogTitle>
        <DialogContent>
          {detailBook && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                ISBN: {detailBook.isbn}
              </Typography>
              {detailBook.authors && detailBook.authors.length > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Авторлар: {detailBook.authors.map(a => `${a.firstName} ${a.lastName}`).join(', ')}
                </Typography>
              )}
              {detailBook.description && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {detailBook.description}
                </Typography>
              )}
              {detailBook.publicationYear && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Шығарылым жылы: {detailBook.publicationYear}
                </Typography>
              )}
              {detailBook.publisher && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Баспа: {detailBook.publisher}
                </Typography>
              )}
              <Typography variant="body2" sx={{ mt: 1 }}>
                Қолда бар: {detailBook.availableCopies} / {detailBook.totalCopies}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailBook(null)}>Жабу</Button>
          {detailBook && user && detailBook.availableCopies > 0 && (
            <Button
              variant="contained"
              onClick={() => handleBorrow(detailBook)}
              disabled={borrowing}
            >
              Кітап алу
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Books;
