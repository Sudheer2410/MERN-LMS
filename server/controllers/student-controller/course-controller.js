const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category,
      level,
      primaryLanguage,
      sortBy = "price-lowtohigh",
      page = 1,
      limit = 12
    } = req.query;

    let filters = { isPublised: true };
    
    if (category && category.length > 0) {
      filters.category = { $in: category.split(",") };
    }
    if (level && level.length > 0) {
      filters.level = { $in: level.split(",") };
    }
    if (primaryLanguage && primaryLanguage.length > 0) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",") };
    }

    let sortParam = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sortParam.pricing = 1;
        break;
      case "price-hightolow":
        sortParam.pricing = -1;
        break;
      case "title-atoz":
        sortParam.title = 1;
        break;
      case "title-ztoa":
        sortParam.title = -1;
        break;
      default:
        sortParam.pricing = 1;
        break;
    }

    // Simple pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [coursesList, totalCount] = await Promise.all([
      Course.find(filters)
        .select('title instructorName category level primaryLanguage subtitle image pricing students date')
        .sort(sortParam)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(), // Use lean() for better performance
      Course.countDocuments(filters)
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      success: true,
      data: coursesList,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error in getAllStudentViewCourses:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id).lean();

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (error) {
    console.error('Error in getStudentViewCourseDetails:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const checkCoursePurchaseInfo = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    const studentCourses = await StudentCourses.findOne({ userId: studentId })
      .select('courses')
      .lean();

    const ifStudentAlreadyBoughtCurrentCourse = studentCourses 
      ? studentCourses.courses.findIndex((item) => item.courseId === id) > -1
      : false;
      
    res.status(200).json({
      success: true,
      data: ifStudentAlreadyBoughtCurrentCourse,
    });
  } catch (error) {
    console.error('Error in checkCoursePurchaseInfo:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
  checkCoursePurchaseInfo,
};
