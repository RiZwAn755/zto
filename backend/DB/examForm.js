import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Full name is required"],
    minlength: [3, "Full name must be at least 3 characters"],
    maxlength: [50, "Full name must be at most 50 characters"]
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    minlength: [5, "Address must be at least 5 characters"],
    maxlength: [100, "Address must be at most 100 characters"]
  },
  school: {
    type: String,
    required: [true, "School name is required"],
    minlength: [2, "School name must be at least 2 characters"],
    maxlength: [100, "School name must be at most 100 characters"]
  },
  class: {
    type: Number,
    required: [true, "Class is required"],
    enum: {
      values: [8, 9, 10, 11, 12],
      message: "Class must be 8, 9, 10, 11, or 12"
    }
  },
  zone: {
    type: String,
    required: [true, "Zone is required"],
    enum: {
      values: ["Badlapur", "Singhramau", "Dhakwa", "Khutahan", "MaharajGanj"],
      message: "Zone must be one of the specified values"
    }
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^\d{10}$/, "Phone number must be 10 digits"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email address"]
  },
  parentName: {
    type: String,
    required: [true, "Parent's name is required"],
    minlength: [3, "Parent's name must be at least 3 characters"],
    maxlength: [50, "Parent's name must be at most 50 characters"]
  },
  parentPhone: {
    type: String,
    required: [true, "Parent's phone number is required"],
    match: [/^\d{10}$/, "Parent's phone number must be 10 digits"]
  },
  dob: {
    type: Date,
    required: [true, "Date of birth is required"],
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: "Date of birth cannot be in the future"
    }
  },
  payment:{type:Boolean}
}, { timestamps: true });

export default mongoose.model("Registrations", examSchema);