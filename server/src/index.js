const crypto = require('crypto');
if (!global.crypto) {
  global.crypto = crypto.webcrypto || crypto;
}
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');
const globalErrorHandler = require('./middleware/errorHandler');

const app = express();

// --- db connection
connectDB();

// --- middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({ origin: '*', credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

// rate limiting
// app.use(
//     rateLimit({
//         windowMs: 15 * 60 * 1000,
//         max: 100,
//         message: 'Too many requests, please try again later',
//     })
// );

// --- routes
app.get('/', (req, res) => {
    res.send('Hello World from healthcare server!');
});
app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Handle unhandled routes
app.use((req, res, next) => {
  const AppError = require('./utils/AppError');
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// --- global error handler
app.use(globalErrorHandler);

// --- start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));