import dotenv from 'dotenv';
dotenv.config(); // Must be first

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import bookingRoutes from './routes/bookings';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meeting-scheduler';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Security & middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors({ origin: [FRONTEND_URL, 'http://localhost:5173'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rate limiting
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many booking attempts. Please try again later.' },
});

app.use('/api', generalLimiter);
// bookingLimiter applied directly on POST route (see routes/bookings.ts)

// Routes
app.use('/api', bookingRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB disconnected on shutdown');
  process.exit(0);
});

export default app;
