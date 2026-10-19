import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import studentRoutes from "./routes/students.js";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/students", studentRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 400).json({ message: err.message || "Something went wrong" });
});

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/student_management")
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`API running on http://localhost:${port}`));
  })
  .catch((e) => console.error("MongoDB connection failed:", e.message));
