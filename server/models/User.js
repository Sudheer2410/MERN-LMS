const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "User name is required"],
    trim: true,
    minlength: [2, "User name must be at least 2 characters long"]
  },
  userEmail: {
    type: String,
    required: [true, "User email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"]
  },
  role: {
    type: String,
    required: [true, "Role is required"],
    enum: ["student", "instructor"],
    default: "student"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", UserSchema);
