require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
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

// More flexible CORS configuration for development and production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174", 
  "http://localhost:3000",
  "http://localhost:3001",
  config.CLIENT_URL, // This will include your production frontend URL
  "https://mern-lms-frontend-v9bc.onrender.com" // Add your specific frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "LMS Backend is running!", 
    timestamp: new Date().toISOString(),
    cors: {
      allowedOrigins: allowedOrigins
    }
  });
});

//database connection
mongoose
  .connect(config.MONGO_URI)
  .then(() => console.log("✅ MongoDB is connected successfully"))
  .catch((e) => {
    console.error("❌ MongoDB connection error:", e);
    process.exit(1);
  });

//routes configuration
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is now running on port ${PORT}`);
  console.log(`📱 Allowed origins: ${allowedOrigins.join(", ")}`);
});
