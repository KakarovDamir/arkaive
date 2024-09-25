const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
// const rateLimiter = require('./utils/rateLimiter');
const morgan = require('morgan');
const logger = require('./utils/logger');

dotenv.config();

const app = express();

// Использование morgan для логирования HTTP-запросов
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) }}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(rateLimiter);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => logger.info('MongoDB Connected'))
  .catch((err) => logger.error(`MongoDB Connection Error: ${err.message}`));

const ocrRouter = require('./routes/ocrRoutes');
app.use('/api/ocr', ocrRouter);

// Логирование ошибок маршрутов
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ status: 'error', message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));
