const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

if (
  !isTest &&
  !isProd &&
  (!process.env.JWT_SECRET || !String(process.env.JWT_SECRET).trim())
) {
  process.env.JWT_SECRET = 'lms-local-dev-jwt-secret-not-for-production';
  // eslint-disable-next-line no-console
  console.warn(
    '[LMS] JWT_SECRET .env-та жоқ — әзірлеу үшін уақытша кілт қойылды. Production үшін міндетті өз кілтіңізді жазыңыз.'
  );
} else if (!isTest && isProd && (!process.env.JWT_SECRET || !String(process.env.JWT_SECRET).trim())) {
  // eslint-disable-next-line no-console
  console.warn(
    '[LMS] JWT_SECRET жоқ — production-да логин жұмыс істемейді. Орта айнымалысын қойыңыз.'
  );
}

const { sequelize } = require('./config/database');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const authorRoutes = require('./routes/authors');
const userRoutes = require('./routes/users');
const borrowingRoutes = require('./routes/borrowings');
const categoryRoutes = require('./routes/categories');
const adminRoutes = require('./routes/admin');
const { router: metricsRouter } = require('./routes/metrics');

const app = express();

// Security middleware
app.use(helmet());
const corsOrigins = (process.env.CORS_ORIGIN ||
  'http://localhost:3001,http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (corsOrigins.includes(origin)) return callback(null, true);
      callback(null, false);
    },
    credentials: true
  })
);

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

// Prometheus metrics (мониторинг; rate limit қолданылмайды)
app.use('/metrics', metricsRouter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/borrowings', borrowingRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection
sequelize
  .authenticate()
  .then(() => {
    logger.info('Database connection established successfully.');

    const syncOnStart =
      process.env.NODE_ENV !== 'production' ||
      process.env.DB_SYNC_ON_START === 'true';
    if (!syncOnStart) {
      logger.info('Database sync skipped (production). DB_SYNC_ON_START=true to create tables once.');
      return;
    }
    const alter = process.env.NODE_ENV !== 'production';
    return sequelize.sync({ alter }).then(() => {
      logger.info('Database synced successfully.');
    });
  })
  .catch((err) => {
    logger.error('Unable to connect to the database:', err);
  });

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
