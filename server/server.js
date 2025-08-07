require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const config = require("./config");
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");

const app = express();
const PORT = config.PORT;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174", 
  "http://localhost:3000",
  "http://localhost:3001",
  config.CLIENT_URL,
  "https://mern-lms-frontend-v9bc.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "LMS Backend is running!", 
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

// Database connection with improved error handling
const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(config.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2,
      });
      
      // Test the connection
      const db = mongoose.connection;
      db.on('error', (error) => {
        console.error('MongoDB connection error:', error);
      });
      
      db.on('disconnected', () => {
        console.log('MongoDB disconnected');
      });
      
      return;
    } catch (error) {
      if (i === retries - 1) {
        console.error("All MongoDB connection attempts failed");
        process.exit(1);
      }
      
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

connectDB();

// Routes configuration
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format"
    });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value"
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: config.NODE_ENV === 'production' ? "Internal server error" : err.message,
    ...(config.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
