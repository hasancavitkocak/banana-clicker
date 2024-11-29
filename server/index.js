import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { corsOptions, PORT } from './config/appConfig.js';
import { createSocketServer } from './socket/socketServer.js';
import healthCheckRouter from './routes/healthCheck.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use(healthCheckRouter);

// Ensure dist directory exists
const distPath = path.join(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');

// Build check middleware
const ensureBuildExists = async (req, res, next) => {
  try {
    const exists = await fs.pathExists(indexPath);
    if (exists) {
      return next();
    }
    
    console.log('Build directory not found, triggering build process...');
    res.status(503).send('Application is building. Please try again in a moment.');
  } catch (err) {
    console.error('Error checking build directory:', err);
    res.status(500).send('Internal server error');
  }
};

// Serve static files from dist directory
app.use(express.static(distPath));

// Handle client-side routing
app.get('*', ensureBuildExists, (req, res) => {
  res.sendFile(indexPath);
});

// Socket.IO setup
createSocketServer(httpServer, corsOptions);

// Start server
const startServer = async () => {
  try {
    // Ensure dist directory exists before starting
    const buildExists = await fs.pathExists(indexPath);
    if (!buildExists) {
      console.log('Build directory not found. Please run npm run build first.');
      process.exit(1);
    }

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();