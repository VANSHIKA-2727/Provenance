// src/config/env.js
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  supabaseUrl: process.env.SUPABASE_URL,      // Required - throws error if missing
  ocrUrl: process.env.OCR_SERVICE_URL || 'http://localhost:8000',
  nodeEnv: process.env.NODE_ENV || 'development'
};

// Throws early if critical vars missing
if (!config.supabaseUrl) {
  throw new Error('SUPABASE_URL is required in .env');
}