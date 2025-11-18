const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const env = require('./config/env');
const routes = require('./routes');
const legacyRoutes = require('./routes/legacy');
const errorHandler = require('./middlewares/errorMiddleware');
const swaggerSpec = require('./docs/swagger');
const { apiSuccess } = require('./utils/apiResponse');

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || env.allowedOrigins.length === 0 || env.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use('/uploads', express.static(path.resolve(env.uploadsDir)));

app.get('/health', (req, res) =>
  apiSuccess(res, {
    message: 'API is healthy',
    data: {
      service: env.appName,
      time: new Date().toISOString(),
    },
  }),
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', legacyRoutes);
app.use('/api/v1', routes);

app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: 'Endpoint not found',
  });
});

app.use(errorHandler);

module.exports = app;


