import Exam from "../models/Exam.js";
import Question from "../models/Question.js";

// ✅ Get all exams
export const getExams = async (req, res) => {
  try {
    let exams;

    if (req.user.role === "teacher") {
      // Teacher sees only their exams
      exams = await Exam.find({ teacher: req.user.id });
    } else if (req.user.role === "student") {
      // Student sees all exams available
      exams = await Exam.find().select("-questions"); // optional: hide questions list
    } else if (req.user.role === "admin") {
      // Admin sees all exams
      exams = await Exam.find();
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    res.json(exams);
  } catch (err) {
    console.error("Error fetching exams:", err);
    res.status(500).json({ message: "Error fetching exams" });
  }
};



// ✅ Add a new exam
export const addExam = async (req, res) => {
  try {
    console.log("User from token:", req.user); // 👈 debug
    const { title, duration, totalMarks } = req.body;

    const exam = await Exam.create({
      title,
      duration,
      totalMarks,
      teacher: req.user.id,
    });

    res.status(201).json(exam);
  } catch (error) {
    console.error("Add Exam Error:", error);
    res.status(500).json({ message: "Failed to create exam", error: error.message });
  }
};



// ✅ Delete exam + related questions
export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // ✅ Prevent deleting another teacher’s exam
    if (req.user.role === "teacher" && exam.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "You cannot delete another teacher's exam" });
    }

    await exam.deleteOne();
    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete exam" });
  }
};


// ✅ Get all questions of a specific exam
export const getQuestions = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // ✅ Restrict teacher access
    if (req.user.role === "teacher" && exam.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied to another teacher's exam" });
    }

    const questions = await Question.find({ examId: req.params.id });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch questions" });
  }
};


// ✅ Add new question (supports Cloudinary image)
export const addQuestion = async (req, res) => {
  try {
    console.log("📥 Add Question API hit");
    console.log("🧾 req.body:", req.body);
    console.log("🖼️ req.file:", req.file);

    const { examId, text, options, correctAnswer, marks, negativeMarks, section } =
      req.body;

    if (!examId || !text)
      return res.status(400).json({ message: "Exam ID and question text required" });

    let parsedOptions = [];
    try {
      parsedOptions = typeof options === "string" ? JSON.parse(options) : options;
    } catch (err) {
      console.error("❌ Invalid JSON in options:", err.message);
      return res.status(400).json({ message: "Invalid options format" });
    }

    const imageUrl = req.file?.path || req.file?.url || null;
    console.log("✅ Uploaded Image URL:", imageUrl);

    const question = await Question.create({
      examId,
      text,
      options: parsedOptions,
      correctAnswer,
      marks,
      negativeMarks,
      section,
      image: imageUrl,
    });

    console.log("✅ Question created:", question._id);
    res.status(201).json(question);
  } catch (err) {
    console.error("❌ ADD QUESTION ERROR OCCURRED!");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Full error object:", JSON.stringify(err, null, 2));
    console.error("Stack trace:\n", err.stack);

    res.status(500).json({
      message: "Error adding question",
      error: err.message || "Unknown error",
    });
  }
};



// ✅ Update question (optional image)
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.options && typeof data.options === "string")
      data.options = JSON.parse(data.options);

    if (req.file) data.image = req.file.path;

    const updated = await Question.findByIdAndUpdate(id, data, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("❌ Update Question Error:", err);
    res.status(500).json({ message: "Error updating question" });
  }
};

// ✅ Delete question
import { v2 as cloudinary } from "cloudinary";

export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    // ✅ Delete image from Cloudinary if exists
    if (question.image) {
      // Extract the public_id from the Cloudinary URL
      const publicId = question.image
        .split("/")
        .slice(-1)[0]
        .split(".")[0];
      await cloudinary.uploader.destroy(`exam_app_questions/${publicId}`);
      console.log(`🗑️ Deleted Cloudinary image: ${publicId}`);
    }

    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Question and image deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting question:", err);
    res.status(500).json({ message: "Error deleting question" });
  }
};
