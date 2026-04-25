import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import api from '../services/api';

const Borrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);
  const [renewingId, setRenewingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/borrowings');
      setBorrowings(response.data.data.borrowings);
    } catch (error) {
      console.error('Error fetching borrowings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    try {
      setReturningId(id);
      await api.post(`/borrowings/${id}/return`);
      setSnackbar({ open: true, message: 'Кітап сәтті қайтарылды', severity: 'success' });
      fetchBorrowings();
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Қате', severity: 'error' });
    } finally {
      setReturningId(null);
    }
  };

  const handleRenew = async (id) => {
    try {
      setRenewingId(id);
      await api.post(`/borrowings/${id}/renew`);
      setSnackbar({ open: true, message: 'Кітап мерзімі ұзартылды', severity: 'success' });
      fetchBorrowings();
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Қате', severity: 'error' });
    } finally {
      setRenewingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'borrowed':
        return 'primary';
      case 'returned':
        return 'success';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Менің кітаптарым
      </Typography>
      {loading ? (
        <Typography>Жүктелуде...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Кітап</TableCell>
                <TableCell>Алу күні</TableCell>
                <TableCell>Қайтару күні</TableCell>
                <TableCell>Ұзартулар</TableCell>
                <TableCell>Мәртебе</TableCell>
                <TableCell align="right">Әрекет</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {borrowings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Кітаптар жоқ. Кітаптар бетінен кітап алыңыз.
                  </TableCell>
                </TableRow>
              ) : (
                borrowings.map((borrowing) => (
                  <TableRow key={borrowing.id}>
                    <TableCell>{borrowing.book?.title}</TableCell>
                    <TableCell>
                      {new Date(borrowing.borrowDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {borrowing.dueDate
                        ? new Date(borrowing.dueDate).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell>{borrowing.renewalCount || 0} / 2</TableCell>
                    <TableCell>
                      <Chip
                        label={borrowing.status}
                        color={getStatusColor(borrowing.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {borrowing.status === 'borrowed' && (
                        <>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => handleReturn(borrowing.id)}
                            disabled={returningId === borrowing.id}
                          >
                            Қайтару
                          </Button>
                          {(borrowing.renewalCount || 0) < 2 && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="secondary"
                              onClick={() => handleRenew(borrowing.id)}
                              disabled={renewingId === borrowing.id}
                              sx={{ ml: 1 }}
                            >
                              Ұзарту
                            </Button>
                          )}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Borrowings;
