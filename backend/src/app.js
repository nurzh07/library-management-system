const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { sequelize } = require('./config/database');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const authorRoutes = require('./routes/authors');
const userRoutes = require('./routes/users');
const borrowingRoutes = require('./routes/borrowings');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/borrowings', borrowingRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection
sequelize.authenticate()
  .then(() => {
    logger.info('Database connection established successfully.');
    
    // Sync database (use with caution in production)
    if (process.env.NODE_ENV !== 'production') {
      sequelize.sync({ alter: true }).then(() => {
        logger.info('Database synced successfully.');
      });
    }
  })
  .catch(err => {
    logger.error('Unable to connect to the database:', err);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

module.exports = app;
