import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { corsOptions, PORT } from './config/appConfig.js';
import { createSocketServer } from './socket/socketServer.js';
import healthCheckRouter from './routes/healthCheck.js';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors(corsOptions));

// Serve static files from dist directory
app.use(express.static('dist'));

// Routes
app.use(healthCheckRouter);

// Socket.IO setup
createSocketServer(httpServer, corsOptions);

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});