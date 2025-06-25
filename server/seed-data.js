const mongoose = require("mongoose");
const config = require("./config");
const Course = require("./models/Course");
const User = require("./models/User");

async function seedData() {
  try {
    console.log("🌱 Seeding database with YouTube courses...");
    
    // Connect to database
    await mongoose.connect(config.MONGO_URI);
    console.log("✅ Database connected successfully");
    
    // Get an instructor user
    const instructor = await User.findOne({ role: "instructor" });
    
    if (!instructor) {
      console.log("❌ No instructor found. Creating a sample instructor...");
      const newInstructor = new User({
        userName: "Sample Instructor",
        userEmail: "instructor@example.com",
        password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
        role: "instructor"
      });
      await newInstructor.save();
      console.log("✅ Sample instructor created");
    }
    
    const instructorId = instructor?._id || (await User.findOne({ role: "instructor" }))._id;
    
    // Sample courses data with YouTube videos
    const sampleCourses = [
      {
        instructorId: instructorId,
        instructorName: "Traversy Media",
        date: new Date(),
        title: "HTML & CSS Crash Course",
        category: "web-development",
        level: "beginner",
        primaryLanguage: "english",
        subtitle: "Learn HTML & CSS from scratch with Brad Traversy",
        description: "A comprehensive crash course on HTML and CSS fundamentals. Perfect for beginners who want to start their web development journey.",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop",
        welcomeMessage: "Welcome to the HTML & CSS Crash Course! Let's build amazing websites together.",
        pricing: 29.99,
        objectives: "Master HTML structure,Create responsive layouts,Style with CSS,Build real projects,Understand web fundamentals",
        students: [],
        curriculum: [
          {
            title: "HTML Basics & Structure",
            videoUrl: "https://www.youtube.com/embed/UB1O30fR-EE",
            public_id: "html_basics_1",
            freePreview: true
          },
          {
            title: "CSS Fundamentals & Styling",
            videoUrl: "https://www.youtube.com/embed/yfoY53QXEnI",
            public_id: "css_fundamentals_2",
            freePreview: false
          },
          {
            title: "Responsive Design Principles",
            videoUrl: "https://www.youtube.com/embed/srvUrASNj0s",
            public_id: "responsive_design_3",
            freePreview: false
          }
        ],
        isPublised: true
      },
      {
        instructorId: instructorId,
        instructorName: "The Net Ninja",
        date: new Date(),
        title: "JavaScript Tutorial for Beginners",
        category: "web-development",
        level: "beginner",
        primaryLanguage: "english",
        subtitle: "Complete JavaScript course with practical examples",
        description: "Learn JavaScript from the ground up with this comprehensive tutorial series. Perfect for beginners and intermediate developers.",
        image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500&h=300&fit=crop",
        welcomeMessage: "Welcome to JavaScript Tutorial for Beginners! Let's master JavaScript together.",
        pricing: 39.99,
        objectives: "Understand JavaScript fundamentals,Work with DOM manipulation,Handle events and forms,Use modern ES6+ features,Build interactive applications",
        students: [],
        curriculum: [
          {
            title: "JavaScript Basics & Variables",
            videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
            public_id: "js_basics_1",
            freePreview: true
          },
          {
            title: "Functions & Scope",
            videoUrl: "https://www.youtube.com/embed/xUI5Tsl2JpY",
            public_id: "js_functions_2",
            freePreview: false
          },
          {
            title: "DOM Manipulation",
            videoUrl: "https://www.youtube.com/embed/0ik6X4DJKCc",
            public_id: "js_dom_3",
            freePreview: false
          }
        ],
        isPublised: true
      },
      {
        instructorId: instructorId,
        instructorName: "Academind",
        date: new Date(),
        title: "React.js - The Complete Guide",
        category: "web-development",
        level: "intermediate",
        primaryLanguage: "english",
        subtitle: "Dive deep into React with hooks, context, and more",
        description: "Master React.js with this comprehensive guide covering everything from basics to advanced concepts like hooks and context.",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop",
        welcomeMessage: "Welcome to React.js - The Complete Guide! Let's build amazing React applications.",
        pricing: 59.99,
        objectives: "Master React fundamentals,Use hooks effectively,Implement context API,Build complex applications,Optimize performance",
        students: [],
        curriculum: [
          {
            title: "React Basics & Components",
            videoUrl: "https://www.youtube.com/embed/Ke90Tje7VS0",
            public_id: "react_basics_1",
            freePreview: true
          },
          {
            title: "React Hooks Deep Dive",
            videoUrl: "https://www.youtube.com/embed/TNhaISOUy6Q",
            public_id: "react_hooks_2",
            freePreview: false
          },
          {
            title: "Context API & State Management",
            videoUrl: "https://www.youtube.com/embed/35lXWvCuM8o",
            public_id: "react_context_3",
            freePreview: false
          }
        ],
        isPublised: true
      },
      {
        instructorId: instructorId,
        instructorName: "Programming with Mosh",
        date: new Date(),
        title: "JavaScript for Beginners",
        category: "web-development",
        level: "beginner",
        primaryLanguage: "english",
        subtitle: "Learn JavaScript from scratch with Mosh Hamedani",
        description: "Master JavaScript fundamentals with this comprehensive beginner-friendly course. Perfect for anyone starting their programming journey.",
        image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500&h=300&fit=crop",
        welcomeMessage: "Welcome to JavaScript for Beginners! Let's master JavaScript together with Mosh.",
        pricing: 39.99,
        objectives: "Understand JavaScript fundamentals,Work with variables and data types,Master functions and scope,Handle events and DOM manipulation,Build interactive applications",
        students: [],
        curriculum: [
          {
            title: "JavaScript for Beginners - Full Course",
            videoUrl: "https://www.youtube.com/embed/EerdGm-ehJQ",
            public_id: "js_beginners_mosh_1",
            freePreview: true
          },
          {
            title: "JavaScript Variables & Data Types",
            videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
            public_id: "js_variables_2",
            freePreview: false
          },
          {
            title: "JavaScript Functions & Scope",
            videoUrl: "https://www.youtube.com/embed/xUI5Tsl2JpY",
            public_id: "js_functions_3",
            freePreview: false
          }
        ],
        isPublised: true
      },
      {
        instructorId: instructorId,
        instructorName: "Dev Ed",
        date: new Date(),
        title: "CSS Grid & Flexbox Masterclass",
        category: "web-development",
        level: "intermediate",
        primaryLanguage: "english",
        subtitle: "Master modern CSS layout techniques",
        description: "Learn CSS Grid and Flexbox to create beautiful, responsive layouts. Essential skills for modern web development.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop",
        welcomeMessage: "Welcome to CSS Grid & Flexbox Masterclass! Let's create stunning layouts.",
        pricing: 34.99,
        objectives: "Master CSS Grid,Understand Flexbox,Create responsive layouts,Build complex designs,Optimize for all devices",
        students: [],
        curriculum: [
          {
            title: "CSS Grid Fundamentals",
            videoUrl: "https://www.youtube.com/embed/jV8B24rSN5o",
            public_id: "css_grid_1",
            freePreview: true
          },
          {
            title: "Flexbox Deep Dive",
            videoUrl: "https://www.youtube.com/embed/JJSoEo8JSnc",
            public_id: "flexbox_deep_2",
            freePreview: false
          },
          {
            title: "Combining Grid & Flexbox",
            videoUrl: "https://www.youtube.com/embed/0xMQfnTU6oo",
            public_id: "grid_flexbox_3",
            freePreview: false
          }
        ],
        isPublised: true
      },
      {
        instructorId: instructorId,
        instructorName: "freeCodeCamp",
        date: new Date(),
        title: "Python for Beginners",
        category: "programming",
        level: "beginner",
        primaryLanguage: "english",
        subtitle: "Learn Python programming from scratch",
        description: "Start your programming journey with Python. This course covers everything from basics to building real applications.",
        image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500&h=300&fit=crop",
        welcomeMessage: "Welcome to Python for Beginners! Let's learn programming together.",
        pricing: 24.99,
        objectives: "Master Python syntax,Work with data structures,Handle file operations,Build simple applications,Understand OOP concepts",
        students: [],
        curriculum: [
          {
            title: "Python Basics & Variables",
            videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8",
            public_id: "python_basics_1",
            freePreview: true
          },
          {
            title: "Data Structures & Loops",
            videoUrl: "https://www.youtube.com/embed/W8KRzm-HUcc",
            public_id: "python_data_2",
            freePreview: false
          },
          {
            title: "Functions & Modules",
            videoUrl: "https://www.youtube.com/embed/9Os0o3wzS_I",
            public_id: "python_functions_3",
            freePreview: false
          }
        ],
        isPublised: true
      }
    ];
    
    // Check if courses already exist
    const existingCourses = await Course.countDocuments();
    
    if (existingCourses > 0) {
      console.log(`📚 ${existingCourses} courses already exist in database`);
      console.log("🗑️ Clearing existing courses to add new YouTube courses...");
      await Course.deleteMany({});
      console.log("✅ Existing courses cleared");
    }
    
    // Insert sample courses
    const insertedCourses = await Course.insertMany(sampleCourses);
    console.log(`✅ Successfully created ${insertedCourses.length} YouTube courses`);
    
    // Display created courses
    console.log("📚 Created YouTube courses:");
    insertedCourses.forEach((course, index) => {
      console.log(`  ${index + 1}. ${course.title} by ${course.instructorName} - $${course.pricing}`);
    });
    
    console.log("🎉 Database seeding completed successfully!");
    console.log("🎥 All courses now feature real YouTube educational content!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database disconnected");
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = seedData; 