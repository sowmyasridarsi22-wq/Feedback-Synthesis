import 'express-async-errors';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

const app = express();

/* =========================
   Security
========================= */

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);

/* =========================
   Body Parser
========================= */

app.use(express.json({ limit: '2mb' }));

/* =========================
   Routes
========================= */

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', analysisRoutes);
app.use('/api/reports', reportRoutes);

/* =========================
   Health Checks
========================= */

app.get('/', (req, res) => {
  res.json({
    message: 'AI Feedback Synthesis API is running'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    ok: true
  });
});

/* =========================
   Error Handler
========================= */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: err.message || 'Server error'
  });
});

/* =========================
   Server
========================= */

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });