const express = require("express");
const instructorCourseRoutes = require("../instructor-routes/course-routes");
const studentCourseRoutes = require("../student-routes/course-routes");
const studentCourseProgressRoutes = require("../student-routes/course-progress-routes");
const studentCoursesRoutes = require("../student-routes/student-courses-routes");

const router = express.Router();

// Instructor course routes
router.use("/instructor", instructorCourseRoutes);

// Student course routes
router.use("/student", studentCourseRoutes);

// Student course progress routes
router.use("/student/progress", studentCourseProgressRoutes);

// Student purchased courses routes
router.use("/student/purchased", studentCoursesRoutes);

module.exports = router; 