import Question from "../models/Question.js";
import Response from "../models/Response.js";

export const submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;
    const questions = await Question.find({ examId });

    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unattempted = 0;

    // ✅ Build detailed results including image and scoring
    const detailedResults = questions.map((q) => {
      const userAns = answers.find((a) => a.questionId === q._id.toString());
      const selected = userAns ? userAns.selected : null;

      let isCorrect = false;
      let earnedMarks = 0;

      if (selected === null) {
        unattempted++;
      } else if (selected === q.correctAnswer) {
        correctCount++;
        score += q.marks;
        earnedMarks = q.marks;
        isCorrect = true;
      } else {
        wrongCount++;
        score -= q.negativeMarks;
        earnedMarks = -q.negativeMarks;
      }

      return {
        questionId: q._id,
        question: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        image: q.image || null,         // ✅ include image
        selected,
        marks: q.marks,                // ✅ include total marks
        negativeMarks: q.negativeMarks, // ✅ include penalty
        earnedMarks,                   // ✅ marks gained/lost for this question
        isCorrect,
      };
    });

    // ✅ Save the response (optional, for analytics)
    await Response.create({
      examId,
      answers,
      score,
    });

    // ✅ Send all computed details to frontend
    res.json({
      totalQuestions: questions.length,
      correctCount,
      wrongCount,
      unattempted,
      score,
      detailedResults,
    });
  } catch (err) {
    console.error("❌ Error during exam submission:", err);
    res.status(500).json({ error: "Error during submission" });
  }
};
