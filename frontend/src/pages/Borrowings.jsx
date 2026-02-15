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
} from '@mui/material';
import api from '../services/api';

const Borrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);

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
                <TableCell>Мәртебе</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {borrowings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Кітаптар жоқ
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
                    <TableCell>
                      <Chip
                        label={borrowing.status}
                        color={getStatusColor(borrowing.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Borrowings;
