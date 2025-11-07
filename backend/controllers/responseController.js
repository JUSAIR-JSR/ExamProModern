// backend/controllers/responseController.js (or update your existing file)
import Question from "../models/Question.js";
import Response from "../models/Response.js";
import Exam from "../models/Exam.js";

export const submitExam = async (req, res) => {
  try {
    const { examId, answers, timeTakenSeconds = null } = req.body;

    // validate
    if (!examId || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    // fetch exam (optionally for exam-level totals)
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    // fetch questions
    const questions = await Question.find({ examId });
    if (!questions || questions.length === 0) {
      return res.status(404).json({ error: "No questions found for this exam" });
    }

    // initialize totals
    let totalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unattempted = 0;

    // aggregates
    const tierScores = {};    // { "I": { score:0, totalMarks:0, correct:0, wrong:0, unattempted:0 }, "II": {...} }
    const sectionScores = {}; // { "Quant": { score:0, totalMarks:0, correct:0, wrong:0, unattempted:0 } }

    // For quick lookup of answers by questionId
    const ansMap = new Map(answers.map((a) => [a.questionId, a.selected]));

    // detailed per-question results
    const detailedResults = questions.map((q) => {
      const qIdStr = q._id.toString();
      const selected = ansMap.has(qIdStr) ? ansMap.get(qIdStr) : null;

      // ensure numbers
      const marks = Number(q.marks) || 0;
      const negativeMarks = Number(q.negativeMarks) || 0;

      // initialize tier & section aggregates
      const tierKey = q.tier || "I";
      const sectionKey = q.section || "General";

      if (!tierScores[tierKey]) {
        tierScores[tierKey] = { score: 0, totalMarks: 0, correct: 0, wrong: 0, unattempted: 0 };
      }
      if (!sectionScores[sectionKey]) {
        sectionScores[sectionKey] = { score: 0, totalMarks: 0, correct: 0, wrong: 0, unattempted: 0 };
      }

      // increase totalMarks aggregates
      tierScores[tierKey].totalMarks += marks;
      sectionScores[sectionKey].totalMarks += marks;

      let earnedMarks = 0;
      let isCorrect = false;

      if (selected === null || selected === undefined) {
        unattempted++;
        tierScores[tierKey].unattempted += 1;
        sectionScores[sectionKey].unattempted += 1;
      } else if (selected === q.correctAnswer) {
        correctCount++;
        totalScore += marks;
        earnedMarks = marks;
        isCorrect = true;

        tierScores[tierKey].score += marks;
        tierScores[tierKey].correct += 1;

        sectionScores[sectionKey].score += marks;
        sectionScores[sectionKey].correct += 1;
      } else {
        wrongCount++;
        totalScore -= negativeMarks;
        earnedMarks = -negativeMarks;

        tierScores[tierKey].score -= negativeMarks;
        tierScores[tierKey].wrong += 1;

        sectionScores[sectionKey].score -= negativeMarks;
        sectionScores[sectionKey].wrong += 1;
      }

      return {
        questionId: q._id,
        question: q.text,
        image: q.image || null,
        options: q.options,
        correctAnswer: q.correctAnswer,
        selected,
        marks,
        negativeMarks,
        tier: tierKey,
        section: sectionKey,
        earnedMarks,
        isCorrect,
      };
    });

    // Save response document
    const responseDoc = await Response.create({
      examId,
      studentId: req.user?.id || null,
      answers,
      score: Number(totalScore.toFixed(2)),
      correctCount,
      wrongCount,
      unattempted,
      tierScores,
      sectionScores,
      timeTakenSeconds,
    });

    // Prepare payload for frontend
    const totalQuestions = questions.length;
    const totalMarks = questions.reduce((s, q) => s + (Number(q.marks) || 0), 0);

    res.status(200).json({
      responseId: responseDoc._id,
      examId,
      totalQuestions,
      totalMarks,
      correctCount,
      wrongCount,
      unattempted,
      score: Number(totalScore.toFixed(2)),
      tierScores,
      sectionScores,
      detailedResults,
      timeTakenSeconds,
    });
  } catch (err) {
    console.error("❌ Error during exam submission (tier/section):", err);
    res.status(500).json({ error: "Error during exam submission" });
  }
};


export const getMyResponses = async (req, res) => {
  try {
    const responses = await Response.find({ studentId: req.user.id })
      .populate("examId", "title totalMarks")
      .sort({ submittedAt: -1 });

    const formatted = responses.map((r) => ({
      examTitle: r.examId?.title || "Untitled Exam",
      totalMarks: r.examId?.totalMarks || 0,
      score: r.score,
      correctCount: r.correctCount,
      wrongCount: r.wrongCount,
      unattempted: r.unattempted,
      submittedAt: r.submittedAt,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Error fetching responses" });
  }
};
