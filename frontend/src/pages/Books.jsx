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
  IconButton,
  Tabs,
  Tab,
  Rating,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import BookReviews from '../components/BookReviews';

const Books = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [detailBook, setDetailBook] = useState(null);
  const [detailTab, setDetailTab] = useState(0);
  const [borrowing, setBorrowing] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [togglingFavorite, setTogglingFavorite] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [advancedFilters, setAdvancedFilters] = useState({
    minYear: '',
    maxYear: '',
    availableOnly: false
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    if (user) {
      fetchFavorites();
    }
  }, [page, search, selectedCategory, advancedFilters]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites', { params: { limit: 100 } });
      const favoriteIds = response.data.data.favorites.map(b => b.id);
      setFavorites(new Set(favoriteIds));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (bookId) => {
    if (!user) {
      setSnackbar({ open: true, message: 'Сүйіктілерге қосу үшін кіріңіз', severity: 'warning' });
      return;
    }
    try {
      setTogglingFavorite(bookId);
      if (favorites.has(bookId)) {
        await api.delete(`/favorites/${bookId}`);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(bookId);
          return newSet;
        });
        setSnackbar({ open: true, message: 'Сүйіктілерден жойылды', severity: 'success' });
      } else {
        await api.post('/favorites', { bookId });
        setFavorites(prev => new Set(prev).add(bookId));
        setSnackbar({ open: true, message: 'Сүйіктілерге қосылды', severity: 'success' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Қате орын алды', severity: 'error' });
    } finally {
      setTogglingFavorite(null);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 12, search };
      if (selectedCategory) {
        params.categoryId = selectedCategory;
      }
      if (advancedFilters.minYear) {
        params.minYear = advancedFilters.minYear;
      }
      if (advancedFilters.maxYear) {
        params.maxYear = advancedFilters.maxYear;
      }
      if (advancedFilters.availableOnly) {
        params.availableOnly = 'true';
      }
      const response = await api.get('/books', { params });
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
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
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
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            label="Категория"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            SelectProps={{ native: true }}
          >
            <option value="">Барлық категориялар</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Advanced Search Filters */}
      <Accordion sx={{ mt: 2 }} expanded={showAdvanced} onChange={() => setShowAdvanced(!showAdvanced)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Кеңейтілген сүзгілеу</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Мин. жыл"
                type="number"
                value={advancedFilters.minYear}
                onChange={(e) => setAdvancedFilters({ ...advancedFilters, minYear: e.target.value })}
                placeholder="2020"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Макс. жыл"
                type="number"
                value={advancedFilters.maxYear}
                onChange={(e) => setAdvancedFilters({ ...advancedFilters, maxYear: e.target.value })}
                placeholder="2024"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Switch
                  checked={advancedFilters.availableOnly}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, availableOnly: e.target.checked })}
                />
                <Typography>Тек қолда бар</Typography>
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

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
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton
                      size="small"
                      color={favorites.has(book.id) ? 'error' : 'default'}
                      onClick={() => toggleFavorite(book.id)}
                      disabled={togglingFavorite === book.id}
                    >
                      {favorites.has(book.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
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

      <Dialog open={!!detailBook} onClose={() => setDetailBook(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {detailBook?.title}
            {detailBook?.category && (
              <Chip label={detailBook.category.name} size="small" color="primary" />
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          {detailBook && (
            <>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={detailTab} onChange={(_, v) => setDetailTab(v)}>
                  <Tab label="Ақпарат" />
                  <Tab label="Пікірлер" />
                </Tabs>
              </Box>
              
              {detailTab === 0 && (
                <Box sx={{ pt: 1 }}>
                  {detailBook.coverImage && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                      <img 
                        src={detailBook.coverImage} 
                        alt={detailBook.title}
                        style={{ maxHeight: 200, borderRadius: 8 }}
                      />
                    </Box>
                  )}
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
              
              {detailTab === 1 && (
                <BookReviews bookId={detailBook.id} />
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailBook(null)}>Жабу</Button>
          {detailBook && user && detailBook.availableCopies > 0 && detailTab === 0 && (
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
