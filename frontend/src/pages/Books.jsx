import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import api from '../services/api';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Кітаптар
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Іздеу"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Кітап атауы немесе ISBN бойынша іздеу"
        />
      </Box>
      {loading ? (
        <Typography>Жүктелуде...</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {books.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <Card>
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
                    <Button size="small">Толығырақ</Button>
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
    </Container>
  );
};

export default Books;
