import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Student from "../models/Student.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "uploads");
const router = Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_r, file, cb) =>
      cb(null, Date.now() + "-" + Math.round(Math.random() * 1e6) + path.extname(file.originalname).toLowerCase()),
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_r, file, cb) =>
    /^image\/(jpeg|png|webp)$/.test(file.mimetype) ? cb(null, true) : cb(new Error("Only JPG, PNG or WEBP images allowed")),
});

const removeFile = (p) => {
  if (p) fs.unlink(path.join(uploadDir, path.basename(p)), () => {});
};

// List + search
router.get("/", async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    const filter = q
      ? { $or: ["name", "email", "rollNo", "course"].map((f) => ({ [f]: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") })) }
      : {};
    res.json(await Student.find(filter).sort({ createdAt: -1 }));
  } catch (e) { next(e); }
});

// Create
router.post("/", upload.single("photo"), async (req, res, next) => {
  try {
    const consent = req.body.photoConsent === "true";
    if (req.file && !consent) {
      removeFile(req.file.filename);
      return res.status(403).json({ message: "Photo permission not granted" });
    }
    const student = await Student.create({
      ...req.body,
      photoConsent: !!req.file && consent,
      photo: req.file ? `/uploads/${req.file.filename}` : "",
    });
    res.status(201).json(student);
  } catch (e) { if (req.file) removeFile(req.file.filename); next(e); }
});

// Update
router.put("/:id", upload.single("photo"), async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const consent = req.body.photoConsent === "true";
    if (req.file && !consent) {
      removeFile(req.file.filename);
      return res.status(403).json({ message: "Photo permission not granted" });
    }
    const { photoConsent, ...fields } = req.body;
    Object.assign(student, fields);
    if (req.file) {
      removeFile(student.photo);
      student.photo = `/uploads/${req.file.filename}`;
      student.photoConsent = true;
    }
    if (req.body.removePhoto === "true" && !req.file) {
      removeFile(student.photo);
      student.photo = "";
      student.photoConsent = false;
    }
    await student.save();
    res.json(student);
  } catch (e) { if (req.file) removeFile(req.file.filename); next(e); }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  try {
    const s = await Student.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ message: "Student not found" });
    removeFile(s.photo);
    res.json({ message: "Deleted" });
  } catch (e) { next(e); }
});

export default router;
