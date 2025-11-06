import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function AddQuestion() {
  const { id: examId } = useParams();
  const [exam, setExam] = useState(null);
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [marks, setMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0);
  const [image, setImage] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editId, setEditId] = useState(null);

  // Load exam and questions
  useEffect(() => {
    API.get("/exams").then((res) => {
      setExam(res.data.find((e) => e._id === examId));
    });
    loadExamData();
  }, [examId]);

  const loadExamData = async () => {
    const res = await API.get(`/exams/${examId}/questions`);
    setQuestions(res.data);
  };

  const resetForm = () => {
    setText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
    setMarks(1);
    setNegativeMarks(0);
    setImage(null);
    setEditId(null);
  };

  const handleSave = async () => {
  try {
    if (!text.trim()) return alert("Enter question text");

    const formData = new FormData();
    formData.append("examId", examId);
    formData.append("text", text);
    formData.append("options", JSON.stringify(options));
    formData.append("correctAnswer", correctAnswer);
    formData.append("marks", marks);
    formData.append("negativeMarks", negativeMarks);

    // ✅ Append image only if one is selected
    if (image instanceof File) {
      formData.append("image", image);
    }

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };

    console.log("🧾 FormData entries:");
for (const [k, v] of formData.entries()) console.log(k, v);

    let res;
    if (editId) {
      res = await API.put(`/exams/questions/${editId}`, formData, config);
      alert("Question updated!");
    } else {
      res = await API.post(`/exams/questions`, formData, config);
      alert("Question added!");
    }

    console.log("✅ Upload Response:", res.data);

    resetForm();
    loadExamData();
  } catch (error) {
    console.error("❌ Upload Error:", error);
    alert("Failed to upload question. Check console for details.");
  }
};


  const handleEdit = (q) => {
    setEditId(q._id);
    setText(q.text);
    setOptions(q.options);
    setCorrectAnswer(q.correctAnswer);
    setMarks(q.marks);
    setNegativeMarks(q.negativeMarks);
    setImage(null); // image editing optional
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this question?")) return;
    await API.delete(`/exams/questions/${id}`);
    loadExamData();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">
        Manage Questions — {exam?.title}
      </h2>

      {/* ✅ Question Text */}
      <textarea
        placeholder="Question text (supports multiple lines and paragraphs)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="w-full border p-2 mb-3 rounded resize-y whitespace-pre-line"
      />

      {/* ✅ Optional Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-3"
      />

      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="preview"
          className="w-40 mb-3 rounded border"
        />
      )}

      {/* ✅ Options */}
      {options.map((opt, i) => (
        <input
          key={i}
          type="text"
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={(e) =>
            setOptions(options.map((o, idx) => (idx === i ? e.target.value : o)))
          }
          className="w-full border p-2 mb-2 rounded"
        />
      ))}

      {/* ✅ Marks + Answer */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <select
          className="border p-2 rounded flex-1"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(Number(e.target.value))}
        >
          {options.map((opt, i) => (
            <option key={i} value={i}>
              Option {i + 1} — {opt || "(empty)"}
            </option>
          ))}
        </select>



        <input
          type="number"
          placeholder="Marks"
          value={marks}
          onChange={(e) => setMarks(Number(e.target.value))}
          className="border p-2 rounded w-24"
        />

        <input
          type="number"
          placeholder="Neg"
          value={negativeMarks}
          onChange={(e) => setNegativeMarks(Number(e.target.value))}
          className="border p-2 rounded w-24"
        />
      </div>

      {/* ✅ Save/Update Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className={`${
            editId ? "bg-yellow-600" : "bg-green-600"
          } text-white px-4 py-2 rounded`}
        >
          {editId ? "Update Question" : "Add Question"}
        </button>

        {editId && (
          <button
            onClick={resetForm}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>

     {/* ✅ Existing Questions List */}
<div className="mt-8">
  <h3 className="text-lg font-bold mb-3">Existing Questions</h3>

  {questions.length === 0 ? (
    <p>No questions yet.</p>
  ) : (
    <ul className="space-y-3">
      {questions.map((q, i) => (
        <li
          key={q._id}
          className="border rounded p-3 bg-gray-50 flex justify-between items-start"
        >
          <div className="flex-1">
            {/* ✅ Show image securely with hover zoom */}
            {q.image ? (
              <div className="relative w-40 overflow-hidden rounded-lg border group mb-3">
                <img
                  src={q.image}
                  alt="question"
                  className="transition-transform duration-300 ease-in-out group-hover:scale-150 group-focus:scale-150"
                  tabIndex={0}
                />
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic">(No image)</p>
            )}

            {/* ✅ Question text */}
            <p className="font-semibold mb-1 whitespace-pre-line">
              {i + 1}. {q.text}
            </p>

            {/* ✅ Marks info */}
            <p className="text-sm text-gray-600 mb-1">
              Marks: <span className="font-medium text-green-700">+{q.marks}</span> | Neg:{" "}
              <span className="font-medium text-red-700">-{q.negativeMarks}</span>
            </p>

            {/* ✅ Options list */}
            <ul className="list-disc pl-6 text-sm mb-2">
              {q.options.map((opt, idx) => (
                <li
                  key={idx}
                  className={`${
                    idx === q.correctAnswer
                      ? "text-green-700 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {opt}
                </li>
              ))}
            </ul>

            {/* ✅ Correct answer indicator */}
            <p className="text-sm mt-1 text-green-700 font-medium">
              ✅ Correct Answer: Option {q.correctAnswer + 1} —{" "}
              <span className="italic">
                {q.options[q.correctAnswer] || "(undefined)"}
              </span>
            </p>
          </div>

          {/* Edit / Delete buttons */}
          <div className="flex flex-col gap-2 ml-4">
            <button
              onClick={() => handleEdit(q)}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(q._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>

    </div>
  );
}
