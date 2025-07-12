import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [50, "Name must be at most 50 characters"]
  },
  lastName: {
    type: String,
    minlength: [2, "Last name must be at least 2 characters"],
    maxlength: [50, "Last name must be at most 50 characters"]
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^\d{10}$/, "Phone number must be 10 digits"]
  },
  school: {
    type: String,
    required: [true, "School/coaching name is required"],
    minlength: [2, "School name must be at least 2 characters"],
    maxlength: [100, "School name must be at most 100 characters"]
  },
  classs: {
    type: Number,
    required: [true, "Class is required"],
    enum: {
      values: [8, 9, 10, 11, 12],
      message: "Class must be 8, 9, 10, 11, or 12"
    }
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email address"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  }
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);