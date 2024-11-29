import { AppError } from '../utils/errorHandler.js';

const requestCounts = new Map();
const WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS = 100;

export const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }
  
  const requests = requestCounts.get(ip);
  const windowStart = now - WINDOW_MS;
  
  // Remove old requests
  while (requests.length > 0 && requests[0] < windowStart) {
    requests.shift();
  }
  
  if (requests.length >= MAX_REQUESTS) {
    next(new AppError('Too many requests', 429));
    return;
  }
  
  requests.push(now);
  next();
};