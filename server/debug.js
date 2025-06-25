const mongoose = require("mongoose");
const config = require("./config");

async function debugDatabase() {
  try {
    console.log("🔍 Debugging database connection...");
    console.log("📊 MongoDB URI:", config.MONGO_URI);
    
    // Connect to database
    await mongoose.connect(config.MONGO_URI);
    console.log("✅ Database connected successfully");
    
    // Test basic operations
    const Course = require("./models/Course");
    const User = require("./models/User");
    const StudentCourses = require("./models/StudentCourses");
    
    // Count documents
    const courseCount = await Course.countDocuments();
    const userCount = await User.countDocuments();
    const studentCoursesCount = await StudentCourses.countDocuments();
    
    console.log("📈 Document counts:");
    console.log("  - Courses:", courseCount);
    console.log("  - Users:", userCount);
    console.log("  - Student Courses:", studentCoursesCount);
    
    // List some courses if they exist
    if (courseCount > 0) {
      const courses = await Course.find().limit(3);
      console.log("📚 Sample courses:");
      courses.forEach((course, index) => {
        console.log(`  ${index + 1}. ${course.title} (${course.instructorName})`);
      });
    }
    
    // List some users if they exist
    if (userCount > 0) {
      const users = await User.find().limit(3);
      console.log("👥 Sample users:");
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.userName} (${user.role})`);
      });
    }
    
    console.log("✅ Debug completed successfully");
    
  } catch (error) {
    console.error("❌ Debug failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database disconnected");
  }
}

// Run debug if this file is executed directly
if (require.main === module) {
  debugDatabase();
}

module.exports = debugDatabase; 