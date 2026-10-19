import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    rollNo: { type: String, required: true, unique: true, trim: true },
    course: { type: String, required: true, trim: true },
    year: { type: Number, min: 1, max: 8, default: 1 },
    phone: { type: String, trim: true },
    grade: { type: String, default: "-" },
    photo: { type: String, default: "" },
    photoConsent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
