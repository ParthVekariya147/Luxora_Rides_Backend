const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');
const routes = require('./routes/index');
const { errorHandler, notFound } = require('./middlewares/error.middleware');

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// Allowed origins array
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3001',
  'http://localhost:3002'
].filter(Boolean); // Removes any undefined or falsy values

// CORS configuration with origin function
app.use(cors({
<<<<<<< HEAD
  origin: process.env.FRONTEND_URL || 'http://localhost:3001' || 'http://localhost:3002'|| 'http://localhost:3003',
=======
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
>>>>>>> f86470af0d32456346b4ba3082e606c93c54055c
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/', routes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;
