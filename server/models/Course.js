const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  public_id: String,
  freePreview: Boolean,
});

const CourseSchema = new mongoose.Schema({
  instructorId: String,
  instructorName: String,
  date: Date,
  title: String,
  category: String,
  level: String,
  primaryLanguage: String,
  subtitle: String,
  description: String,
  image: String,
  welcomeMessage: String,
  pricing: Number,
  objectives: String,
  students: [
    {
      studentId: String,
      studentName: String,
      studentEmail: String,
      paidAmount: String,
    },
  ],
  curriculum: [LectureSchema],
  isPublised: Boolean,
}, {
  timestamps: true
});

// Simple indexes for common queries
CourseSchema.index({ isPublised: 1 });
CourseSchema.index({ category: 1, level: 1 });
CourseSchema.index({ pricing: 1 });

module.exports = mongoose.model("Course", CourseSchema);
