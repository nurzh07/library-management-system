import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Avatar,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const BookReviews = ({ bookId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState({ average: 0, total: 0, distribution: {} });
  const [loading, setLoading] = useState(true);
  const [myReview, setMyReview] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [hover, setHover] = useState(-1);
  const [editing, setEditing] = useState(false);

  const labels = {
    1: 'Нашар',
    2: 'Қанағаттанарлықсыз',
    3: 'Жақсы',
    4: 'Өте жақсы',
    5: 'Керемет',
  };

  useEffect(() => {
    fetchReviews();
  }, [bookId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reviews/book/${bookId}`);
      setReviews(response.data.data.reviews);
      setRatingStats(response.data.data.ratingStats);
      
      // Найти мой отзыв
      if (user) {
        const mine = response.data.data.reviews.find(r => r.user?.id === user.id);
        setMyReview(mine);
        if (mine) {
          setNewRating(mine.rating);
          setNewComment(mine.comment || '');
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editing && myReview) {
        await api.put(`/reviews/${myReview.id}`, { rating: newRating, comment: newComment });
      } else {
        await api.post('/reviews', { bookId, rating: newRating, comment: newComment });
      }
      fetchReviews();
      setEditing(false);
      setNewRating(0);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Пікірді жоясыз ба?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      fetchReviews();
      setMyReview(null);
      setNewRating(0);
      setNewComment('');
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setNewRating(myReview.rating);
    setNewComment(myReview.comment || '');
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  if (loading) return <Typography>Жүктелуде...</Typography>;

  return (
    <Box>
      {/* Статистика рейтингов */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="bold">{ratingStats.average}</Typography>
          <Rating value={parseFloat(ratingStats.average)} precision={0.1} readOnly />
          <Typography variant="body2" color="text.secondary">
            {ratingStats.total} баға
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingStats.distribution[star] || 0;
            const percentage = ratingStats.total > 0 ? (count / ratingStats.total) * 100 : 0;
            return (
              <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="body2" sx={{ width: 20 }}>{star}</Typography>
                <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                <Box sx={{ flexGrow: 1, height: 8, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
                  <Box sx={{ width: `${percentage}%`, height: '100%', bgcolor: 'warning.main' }} />
                </Box>
                <Typography variant="body2" sx={{ width: 30, textAlign: 'right' }}>{count}</Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Форма добавления отзыва */}
      {user && !myReview || editing ? (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            {editing ? 'Пікірді өңдеу' : 'Бағалау'}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Rating
              value={newRating}
              precision={1}
              onChange={(e, newValue) => setNewRating(newValue)}
              onChangeActive={(e, newHover) => setHover(newHover)}
              size="large"
            />
            {newRating !== null && (
              <Typography sx={{ ml: 1 }} component="span">
                {labels[hover !== -1 ? hover : newRating]}
              </Typography>
            )}
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Пікіріңіз (міндетті емес)"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleSubmit} disabled={newRating === 0}>
              {editing ? 'Жаңарту' : 'Жіберу'}
            </Button>
            {editing && (
              <Button variant="outlined" onClick={() => { setEditing(false); setNewRating(0); setNewComment(''); }}>
                Болдырмау
              </Button>
            )}
          </Box>
        </Box>
      ) : null}

      {/* Мой отзыв */}
      {myReview && !editing && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Chip label="Сіздің пікіріңіз" color="primary" size="small" />
            <Rating value={myReview.rating} readOnly size="small" />
            <Box sx={{ flexGrow: 1 }} />
            <IconButton size="small" onClick={handleEdit}><EditIcon /></IconButton>
            <IconButton size="small" color="error" onClick={() => handleDelete(myReview.id)}><DeleteIcon /></IconButton>
          </Box>
          {myReview.comment && (
            <Typography variant="body2">{myReview.comment}</Typography>
          )}
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Список отзывов */}
      <Typography variant="h6" gutterBottom>Пікірлер ({reviews.length})</Typography>
      
      {reviews.filter(r => r.user?.id !== user?.id).length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
          Басқа пайдаланушылардан пікірлер жоқ
        </Typography>
      ) : (
        reviews
          .filter(r => r.user?.id !== user?.id)
          .map((review) => (
            <Box key={review.id} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                  {getInitials(review.user?.firstName, review.user?.lastName)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">
                    {review.user?.firstName} {review.user?.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Rating value={review.rating} readOnly size="small" />
              </Box>
              {review.comment && (
                <Typography variant="body2" sx={{ pl: 6 }}>{review.comment}</Typography>
              )}
            </Box>
          ))
      )}
    </Box>
  );
};

export default BookReviews;
