const StudentCourses = require("../../models/StudentCourses");

const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Validate studentId
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    console.log("Searching for student courses with ID:", studentId);

    const studentBoughtCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    console.log("Found student courses:", studentBoughtCourses);

    // Check if studentBoughtCourses exists, if not return empty array
    const courses = studentBoughtCourses ? studentBoughtCourses.courses : [];

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error in getCoursesByStudentId:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
      error: error.message,
    });
  }
};

module.exports = { getCoursesByStudentId };
