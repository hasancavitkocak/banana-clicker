import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { corsOptions, PORT } from './config/appConfig.js';
import { createSocketServer } from './socket/socketServer.js';
import healthCheckRouter from './routes/healthCheck.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { errorHandler } from './utils/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { logger } from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(rateLimiter);

// Health check route
app.use('/health', healthCheckRouter);

// Ensure dist directory exists
const distPath = path.join(__dirname, '../dist');
try {
  await fs.ensureDir(distPath);
  logger.info('Dist directory ready');
} catch (error) {
  logger.error('Failed to create dist directory:', error);
}

// Serve static files from dist directory
app.use(express.static(distPath));

// Handle client-side routing
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(503).json({
      status: 'error',
      message: 'Application is building. Please try again in a moment.'
    });
  }
});

// Error handling
app.use(errorHandler);

// Socket.IO setup
const io = createSocketServer(httpServer, corsOptions);

// Start server
const server = httpServer.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});