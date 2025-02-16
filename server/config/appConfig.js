import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

export const corsOptions = {
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

export const PORT = process.env.PORT || 8080;

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  CLIENT_URL: process.env.CLIENT_URL || '*'
};