import React, { useContext, useState, useEffect } from 'react';
import { 
  Container, Paper, Typography, Box, Grid, Card, CardContent, 
  LinearProgress, Button, TextField, Dialog, DialogTitle, 
  DialogContent, DialogActions, Chip 
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { TrendingUp, Book, CalendarToday, Warning } from '@mui/icons-material';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [goal, setGoal] = useState(null);
  const [goalDialog, setGoalDialog] = useState(false);
  const [targetBooks, setTargetBooks] = useState(12);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchGoal();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/reading/stats');
      setStats(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchGoal = async () => {
    try {
      const res = await api.get('/reading/goal');
      setGoal(res.data.data.goal);
      setTargetBooks(res.data.data.goal.targetBooks);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSetGoal = async () => {
    try {
      await api.post('/reading/goal', { targetBooks });
      setGoalDialog(false);
      fetchGoal();
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) {
    return <Container>Жүктелуде...</Container>;
  }

  const progress = goal ? (goal.completedBooks / goal.targetBooks) * 100 : 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Профиль
      </Typography>

      <Grid container spacing={3}>
        {/* User Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Ақпарат
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ mb: 1 }}><strong>Аты:</strong> {user.firstName}</Typography>
              <Typography sx={{ mb: 1 }}><strong>Тегі:</strong> {user.lastName}</Typography>
              <Typography sx={{ mb: 1 }}><strong>Email:</strong> {user.email}</Typography>
              {user.phone && <Typography sx={{ mb: 1 }}><strong>Телефон:</strong> {user.phone}</Typography>}
              <Chip 
                label={user.role === 'admin' ? 'Әкімші' : 'Оқырман'} 
                color={user.role === 'admin' ? 'error' : 'primary'}
                size="small"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Reading Goal */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Оқу мақсаты ({goal?.year || new Date().getFullYear()})
              </Typography>
              <Button size="small" onClick={() => setGoalDialog(true)}>
                Өзгерту
              </Button>
            </Box>
            
            {goal && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {goal.completedBooks} / {goal.targetBooks} кітап
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(progress)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ height: 10, borderRadius: 5, mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Қалды: {goal.targetBooks - goal.completedBooks} кітап
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Reading Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Статистика
            </Typography>
            
            {stats ? (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Book sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Бұл жылы оқылған
                    </Typography>
                    <Typography variant="h6">{stats.completedThisYear}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Барлығы оқылған
                    </Typography>
                    <Typography variant="h6">{stats.totalCompleted}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarToday sx={{ mr: 1, color: 'info.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Ағымдағы
                    </Typography>
                    <Typography variant="h6">{stats.currentBorrowings}</Typography>
                  </Box>
                </Box>
                
                {stats.overdueBorrowings > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Warning sx={{ mr: 1, color: 'error.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Мерзімі өткен
                      </Typography>
                      <Typography variant="h6" color="error">{stats.overdueBorrowings}</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Жүктелуде...
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Set Goal Dialog */}
      <Dialog open={goalDialog} onClose={() => setGoalDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Оқу мақсатын орнату</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="number"
            label="Жылына оқуға кітап саны"
            value={targetBooks}
            onChange={(e) => setTargetBooks(parseInt(e.target.value) || 12)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGoalDialog(false)}>Болдырмау</Button>
          <Button variant="contained" onClick={handleSetGoal}>Сақтау</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
