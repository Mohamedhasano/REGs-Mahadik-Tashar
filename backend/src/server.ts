import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/auth.routes';
import traderRoutes from './routes/trader.routes';
import adminRoutes from './routes/admin.routes';
import shariahRoutes from './routes/shariah.routes';
import supportRoutes from './routes/support.routes';
import projectRoutes from './routes/project.routes';
import kycRoutes from './routes/kyc.routes';
import vipRoutes from './routes/vip.routes';
import twoFactorRoutes from './routes/twoFactor.routes';
import passwordRoutes from './routes/password.routes';
import sessionRoutes from './routes/session.routes';
import socialLinksRoutes from './routes/socialLinks.routes';
import zakatRoutes from './routes/zakat.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trader', traderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shariah', shariahRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/vip', vipRoutes);
app.use('/api/2fa', twoFactorRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/social-links', socialLinksRoutes);
app.use('/api/zakat', zakatRoutes);

// Serve static files for uploaded documents
app.use('/uploads', express.static('uploads'));

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

export default app;

