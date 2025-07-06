import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  fullname: { type: String, required: [true, "Full name is required"] },
  address: { type: String, required: [true, "Address is required"] },
  school: { type: String, required: [true, "School name is required"] },
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
  phone: { type: String, required: [true, "Phone number is required"] },
  email: { type: String, required: [true, "Email is required"] },
  parentName: { type: String, required: [true, "Parent's name is required"] },
  parentPhone: { type: String, required: [true, "Parent's phone number is required"] },
  dob: { type: Date, required: [true, "Date of birth is required"] }
}, { timestamps: true });

export default mongoose.model("Registrations", examSchema);