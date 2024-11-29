import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { corsOptions, PORT } from './config/appConfig.js';
import { createSocketServer } from './socket/socketServer.js';
import healthCheckRouter from './routes/healthCheck.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use(healthCheckRouter);

// Paths
const distPath = path.join(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');

// Build the application if needed
async function ensureBuild() {
  if (!existsSync(indexPath)) {
    console.log('Building application...');
    try {
      await execAsync('npm run build');
      console.log('Build completed successfully');
    } catch (error) {
      console.error('Build failed:', error.message);
      throw new Error('Failed to build application');
    }
  }
}

// Serve static files from dist directory
app.use(express.static(distPath));

// Handle client-side routing
app.get('*', (req, res) => {
  if (!existsSync(indexPath)) {
    return res.status(503).send('Application is building. Please try again in a moment.');
  }
  res.sendFile(indexPath);
});

// Socket.IO setup
createSocketServer(httpServer, corsOptions);

// Start server
async function startServer() {
  try {
    await ensureBuild();
    
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();