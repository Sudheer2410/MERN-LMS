require("dotenv").config();

const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/lms",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  PAYPAL_SECRET_ID: process.env.PAYPAL_SECRET_ID,
  NODE_ENV: process.env.NODE_ENV || "development",
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100, // 100 requests per window
};

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0 && config.NODE_ENV === 'production') {
  console.error('❌ Missing required environment variables:', missingVars);
  process.exit(1);
}

module.exports = config; 