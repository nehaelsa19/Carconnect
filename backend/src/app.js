const express = require('express');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const cors = require('cors');

const app = express();

// Middleware
const rawOrigins =
  process.env.CLIENT_URLS ||
  process.env.CLIENT_URL ||
  'http://localhost:3000,http://localhost:5173';
const allowedOrigins = rawOrigins
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const isLocalhostOrigin = origin =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin || '');

const corsOptions = {
  origin:
    allowedOrigins.length === 0
      ? true
      : (origin, callback) => {
          console.log('[CORS] Incoming origin:', origin);
          if (
            !origin ||
            allowedOrigins.includes(origin) ||
            isLocalhostOrigin(origin)
          ) {
            console.log('[CORS] Allowed origin:', origin || '(no origin)');
            return callback(null, true);
          }
          if (process.env.ALLOW_ANY_ORIGIN === 'true') {
            console.log('[CORS] ALLOW_ANY_ORIGIN enabled, allowing:', origin);
            return callback(null, true);
          }
          console.warn('[CORS] Blocked origin:', origin);
          return callback(new Error(`Not allowed by CORS: ${origin}`));
        },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'X-Requested-With',
  ],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'CarConnect API is running',
    documentation: 'http://localhost:5000/api-docs',
  });
});

app.use('/api', routes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
