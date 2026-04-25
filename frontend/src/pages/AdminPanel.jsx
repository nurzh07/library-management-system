import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';

const AdminPanel = () => {
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState(null);

  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [authors, setAuthors] = useState([]);
  const [authorsLoading, setAuthorsLoading] = useState(true);

  const [authorDialog, setAuthorDialog] = useState({ open: false, mode: 'add', author: null });
  const [bookDialog, setBookDialog] = useState({ open: false, mode: 'add', book: null });
  const [categoryDialog, setCategoryDialog] = useState({ open: false, mode: 'add', category: null });
  const [authorForm, setAuthorForm] = useState({ firstName: '', lastName: '', biography: '', nationality: '' });
  const [bookForm, setBookForm] = useState({
    title: '', isbn: '', description: '', publicationYear: '', publisher: '', totalCopies: 1,
    categoryId: '', authorIds: []
  });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchBooks();
    fetchAuthors();
    fetchCategories();
  }, []);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await api.get('/admin/stats');
      setStats(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data.categories || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await api.get('/users', { params: { page: 1, limit: 50 } });
      setUsers(res.data.data.users);
    } catch (e) {
      console.error(e);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      setBooksLoading(true);
      const res = await api.get('/books', { params: { page: 1, limit: 50 } });
      setBooks(res.data.data.books);
    } catch (e) {
      console.error(e);
    } finally {
      setBooksLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      setAuthorsLoading(true);
      const res = await api.get('/authors', { params: { page: 1, limit: 50 } });
      setAuthors(res.data.data.authors);
    } catch (e) {
      console.error(e);
    } finally {
      setAuthorsLoading(false);
    }
  };

  const handleUserFieldChange = (id, field, value) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, [field]: value } : u)));
  };

  const handleSaveUser = async (user) => {
    try {
      setSavingUserId(user.id);
      await api.put(`/users/${user.id}`, {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
      });
      await fetchUsers();
      fetchStats();
      showSnackbar('Пайдаланушы жаңартылды');
    } catch (e) {
      showSnackbar(e.response?.data?.message || 'Қате', 'error');
    } finally {
      setSavingUserId(null);
    }
  };

  const openAuthorDialog = (mode, author = null) => {
    if (mode === 'add') {
      setAuthorForm({ firstName: '', lastName: '', biography: '', nationality: '' });
    } else {
      setAuthorForm({
        firstName: author.firstName,
        lastName: author.lastName,
        biography: author.biography || '',
        nationality: author.nationality || '',
      });
    }
    setAuthorDialog({ open: true, mode, author });
  };

  const handleSaveAuthor = async () => {
    try {
      if (authorDialog.mode === 'add') {
        await api.post('/authors', authorForm);
        showSnackbar('Автор қосылды');
      } else {
        await api.put(`/authors/${authorDialog.author.id}`, authorForm);
        showSnackbar('Автор жаңартылды');
      }
      setAuthorDialog({ open: false });
      fetchAuthors();
      fetchStats();
    } catch (e) {
      showSnackbar(e.response?.data?.message || 'Қате', 'error');
    }
  };

  const handleDeleteAuthor = async (id) => {
    if (!window.confirm('Авторды жоюды қалайсыз ба?')) return;
    try {
      await api.delete(`/authors/${id}`);
      showSnackbar('Автор жойылды');
      fetchAuthors();
      fetchStats();
    } catch (e) {
      showSnackbar(e.response?.data?.message || 'Қате', 'error');
    }
  };

  const openCategoryDialog = (mode, category = null) => {
    if (mode === 'add') {
      setCategoryForm({ name: '', description: '' });
    } else {
      setCategoryForm({
        name: category.name,
        description: category.description || '',
      });
    }
    setCategoryDialog({ open: true, mode, category });
  };

  const handleSaveCategory = async () => {
    try {
      if (categoryDialog.mode === 'add') {
        await api.post('/categories', categoryForm);
        showSnackbar('Категория қосылды');
      } else {
        await api.put(`/categories/${categoryDialog.category.id}`, categoryForm);
        showSnackbar('Категория жаңартылды');
      }
      setCategoryDialog({ open: false });
      fetchCategories();
    } catch (e) {
      showSnackbar(e.response?.data?.message || 'Қате', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Категорияны жоюды қалайсыз ба?')) return;
    try {
      await api.delete(`/categories/${id}`);
      showSnackbar('Категория жойылды');
      fetchCategories();
    } catch (e) {
      showSnackbar(e.response?.data?.message || 'Қате', 'error');
    }
  };

  const openBookDialog = (mode, book = null) => {
    if (mode === 'add') {
      setBookForm({
        title: '', isbn: '', description: '', publicationYear: '', publisher: '', totalCopies: 1,
        categoryId: '', authorIds: []
      });
    } else {
      setBookForm({
        title: book.title,
        isbn: book.isbn,
        description: book.description || '',
        publicationYear: book.publicationYear || '',
        publisher: book.publisher || '',
        totalCopies: book.totalCopies || 1,
        categoryId: book.categoryId || '',
        authorIds: book.authors?.map((a) => a.id) || []
      });
    }
    setBookDialog({ open: true, mode, book });
  };

  const handleSaveBook = async () => {
    try {
      const payload = {
        ...bookForm,
        categoryId: bookForm.categoryId || null,
        authorIds: Array.isArray(bookForm.authorIds) ? bookForm.authorIds : [],
        publicationYear: bookForm.publicationYear ? parseInt(bookForm.publicationYear) : null,
        totalCopies: parseInt(bookForm.totalCopies) || 1
      };
      if (bookDialog.mode === 'add') {
        await api.post('/books', payload);
        showSnackbar('Кітап қосылды');
      } else {
        await api.put(`/books/${bookDialog.book.id}`, payload);
        showSnackbar('Кітап жаңартылды');
      }
      setBookDialog({ open: false });
      fetchBooks();
      fetchStats();
    } catch (e) {
      showSnackbar(e.response?.data?.message || 'Қате', 'error');
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Кітапты жоюды қалайсыз ба?')) return;
    try {
      await api.delete(`/books/${id}`);
      showSnackbar('Кітап жойылды');
      fetchBooks();
      fetchStats();
    } catch (e) {
      showSnackbar(e.response?.data?.message || 'Қате', 'error');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Админ-панель
      </Typography>

      {statsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">Пайдаланушылар</Typography>
                <Typography variant="h5">{stats.users}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">Кітаптар</Typography>
                <Typography variant="h5">{stats.books}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">Авторлар</Typography>
                <Typography variant="h5">{stats.authors}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">Берулер (белсенді)</Typography>
                <Typography variant="h5">{stats.activeBorrowings} / {stats.borrowings}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Пайдаланушылар" />
          <Tab label="Кітаптар" />
          <Tab label="Авторлар" />
          <Tab label="Категориялар" />
        </Tabs>
      </Box>

      {tab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>Пайдаланушыларды басқару</Typography>
          {usersLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Аты</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Рөл</TableCell>
                    <TableCell>Мәртебе</TableCell>
                    <TableCell align="right">Әрекет</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.firstName} {user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Рөл</InputLabel>
                          <Select
                            label="Рөл"
                            value={user.role}
                            onChange={(e) => handleUserFieldChange(user.id, 'role', e.target.value)}
                          >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? 'Белсенді' : 'Белсенді емес'}
                          color={user.isActive ? 'success' : 'default'}
                          onClick={() => handleUserFieldChange(user.id, 'isActive', !user.isActive)}
                          sx={{ cursor: 'pointer' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" onClick={() => handleSaveUser(user)} disabled={savingUserId === user.id}>
                          {savingUserId === user.id ? <CircularProgress size={20} /> : <SaveIcon />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {tab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Кітаптарды басқару</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => openBookDialog('add')}>
              Кітап қосу
            </Button>
          </Box>
          {booksLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Атауы</TableCell>
                    <TableCell>ISBN</TableCell>
                    <TableCell>Қолда бар</TableCell>
                    <TableCell>Категория</TableCell>
                    <TableCell align="right">Әрекет</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.id}</TableCell>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.isbn}</TableCell>
                      <TableCell>{book.availableCopies} / {book.totalCopies}</TableCell>
                      <TableCell>{book.category?.name || '-'}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => openBookDialog('edit', book)}><EditIcon /></IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteBook(book.id)}><DeleteIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {tab === 2 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Авторларды басқару</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => openAuthorDialog('add')}>
              Автор қосу
            </Button>
          </Box>
          {authorsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Аты-тегі</TableCell>
                    <TableCell>Ұлты</TableCell>
                    <TableCell>Кітаптар</TableCell>
                    <TableCell align="right">Әрекет</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {authors.map((author) => (
                    <TableRow key={author.id}>
                      <TableCell>{author.id}</TableCell>
                      <TableCell>{author.firstName} {author.lastName}</TableCell>
                      <TableCell>{author.nationality || '-'}</TableCell>
                      <TableCell>{author.books?.length || 0}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => openAuthorDialog('edit', author)}><EditIcon /></IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteAuthor(author.id)}><DeleteIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {tab === 3 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Категорияларды басқару</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => openCategoryDialog('add')}>
              Категория қосу
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Атауы</TableCell>
                  <TableCell>Сипаттама</TableCell>
                  <TableCell align="right">Әрекет</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => openCategoryDialog('edit', category)}><EditIcon /></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteCategory(category.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Dialog open={categoryDialog.open} onClose={() => setCategoryDialog({ open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>{categoryDialog.mode === 'add' ? 'Категория қосу' : 'Категорияны өңдеу'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Атауы" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
            <TextField label="Сипаттама" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} multiline rows={3} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryDialog({ open: false })}>Болдырмау</Button>
          <Button variant="contained" onClick={handleSaveCategory}>Сақтау</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={authorDialog.open} onClose={() => setAuthorDialog({ open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>{authorDialog.mode === 'add' ? 'Автор қосу' : 'Авторды өңдеу'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Аты" value={authorForm.firstName} onChange={(e) => setAuthorForm({ ...authorForm, firstName: e.target.value })} required />
            <TextField label="Тегі" value={authorForm.lastName} onChange={(e) => setAuthorForm({ ...authorForm, lastName: e.target.value })} required />
            <TextField label="Өмірбаяны" value={authorForm.biography} onChange={(e) => setAuthorForm({ ...authorForm, biography: e.target.value })} multiline rows={3} />
            <TextField label="Ұлты" value={authorForm.nationality} onChange={(e) => setAuthorForm({ ...authorForm, nationality: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAuthorDialog({ open: false })}>Болдырмау</Button>
          <Button variant="contained" onClick={handleSaveAuthor}>Сақтау</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={bookDialog.open} onClose={() => setBookDialog({ open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>{bookDialog.mode === 'add' ? 'Кітап қосу' : 'Кітапты өңдеу'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Атауы" value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} required />
            <TextField label="ISBN" value={bookForm.isbn} onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })} required />
            <TextField label="Сипаттама" value={bookForm.description} onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })} multiline rows={2} />
            <TextField label="Шығарылым жылы" type="number" value={bookForm.publicationYear} onChange={(e) => setBookForm({ ...bookForm, publicationYear: e.target.value })} />
            <TextField label="Баспа" value={bookForm.publisher} onChange={(e) => setBookForm({ ...bookForm, publisher: e.target.value })} />
            <TextField label="Дәптер саны" type="number" value={bookForm.totalCopies} onChange={(e) => setBookForm({ ...bookForm, totalCopies: parseInt(e.target.value) || 1 })} />
            <FormControl fullWidth>
              <InputLabel>Категория</InputLabel>
              <Select
                label="Категория"
                value={bookForm.categoryId}
                onChange={(e) => setBookForm({ ...bookForm, categoryId: e.target.value })}
              >
                <MenuItem value="">—</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Авторлар</InputLabel>
              <Select
                label="Авторлар"
                multiple
                value={bookForm.authorIds}
                onChange={(e) => setBookForm({ ...bookForm, authorIds: e.target.value })}
                renderValue={(ids) => authors.filter((a) => ids.includes(a.id)).map((a) => `${a.firstName} ${a.lastName}`).join(', ')}
              >
                {authors.map((a) => (
                  <MenuItem key={a.id} value={a.id}>{a.firstName} {a.lastName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookDialog({ open: false })}>Болдырмау</Button>
          <Button variant="contained" onClick={handleSaveBook}>Сақтау</Button>
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

export default AdminPanel;
