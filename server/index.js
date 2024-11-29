import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { corsOptions, PORT } from './config/appConfig.js';
import { createSocketServer } from './socket/socketServer.js';
import healthCheckRouter from './routes/healthCheck.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use(healthCheckRouter);

// Build check middleware
const checkBuildExists = (req, res, next) => {
  const indexPath = path.join(__dirname, '../dist/index.html');
  try {
    if (require('fs').existsSync(indexPath)) {
      next();
    } else {
      res.status(500).send('Application is building. Please try again in a moment.');
    }
  } catch (err) {
    res.status(500).send('Application is building. Please try again in a moment.');
  }
};

// Serve static files from dist directory if they exist
app.use(express.static(path.join(__dirname, '../dist')));

// Handle client-side routing with build check
app.get('*', checkBuildExists, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Socket.IO setup
createSocketServer(httpServer, corsOptions);

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});