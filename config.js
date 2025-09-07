/* global process */
import dotenv from 'dotenv';
dotenv.config();

export default {
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nexus",
  JWT_SECRET: process.env.JWT_SECRET || "super-secret-jwt-key-change-in-production",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
  PORT: process.env.PORT || 8080,
};