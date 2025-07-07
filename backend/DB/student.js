import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },

  lastName: { type: String },
  phone: { type: String, required: [true, "Phone number is required"] },

  school: { type: String, required: [true, "School/coaching name is required"] },

  classs:{type:Number, required : true},
  email: { type: String },
  
  password: { type: String, required: [true, "Passwmimage.pngord is required"], minlength: 0 }
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);