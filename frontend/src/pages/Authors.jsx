import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Box,
  Pagination,
} from '@mui/material';
import api from '../services/api';

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAuthors();
  }, [page, search]);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/authors', {
        params: { page, limit: 12, search },
      });
      setAuthors(response.data.data.authors);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Авторлар
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
          placeholder="Автор аты бойынша іздеу"
        />
      </Box>
      {loading ? (
        <Typography>Жүктелуде...</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {authors.map((author) => (
              <Grid item xs={12} sm={6} md={4} key={author.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h2">
                      {author.firstName} {author.lastName}
                    </Typography>
                    {author.nationality && (
                      <Typography color="text.secondary">
                        {author.nationality}
                      </Typography>
                    )}
                    {author.books && author.books.length > 0 && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Кітаптар саны: {author.books.length}
                      </Typography>
                    )}
                  </CardContent>
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

export default Authors;
