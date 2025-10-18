import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";
import QuestionForm from "../components/QuestionForm";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  ClockIcon,
  DocumentTextIcon,
  AcademicCapIcon
} from "../components/Icons";

export default function ManageExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const load = async () => {
    try {
      setIsLoading(true);
      const [examRes, questionRes] = await Promise.all([
        API.get(`/exams/${id}`),
        API.get(`/questions/exam/${id}`)
      ]);
      setExam(examRes.data);
      setQuestions(questionRes.data);
    } catch (error) {
      console.error("Failed to load exam:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const remove = async (qid) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await API.delete(`/questions/${qid}`);
      load();
    } catch (error) {
      alert("Failed to delete question");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading exam details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors duration-200 p-2 hover:bg-white rounded-xl"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Manage Exam</h1>
              {exam && (
                <p className="text-slate-600 mt-1">Create and manage questions for your assessment</p>
              )}
            </div>
          </div>

          {exam && (
            <div className="flex flex-wrap gap-4">
              <div className="bg-white rounded-2xl px-4 py-3 shadow-lg border border-slate-200">
                <div className="flex items-center space-x-2 text-slate-600">
                  <DocumentTextIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{questions.length} Questions</span>
                </div>
              </div>
              {exam.totalTime && (
                <div className="bg-white rounded-2xl px-4 py-3 shadow-lg border border-slate-200">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <ClockIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{formatTime(exam.totalTime)} Total</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {exam && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-slate-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{exam.title}</h2>
                {exam.description && (
                  <p className="text-slate-600 mb-3">{exam.description}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <span>Created: {new Date(exam.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    exam.published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {exam.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Question Form Section */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  {editingQuestion ? (
                    <>
                      <PencilIcon className="w-5 h-5" />
                      <span>Edit Question</span>
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-5 h-5" />
                      <span>Add New Question</span>
                    </>
                  )}
                </h2>
              </div>

              <div className="p-6">
                <QuestionForm
                  examId={id}
                  onAdded={() => {
                    load();
                    setEditingQuestion(null);
                  }}
                  editQuestion={editingQuestion}
                  clearEdit={() => setEditingQuestion(null)}
                />
                
                {editingQuestion && (
                  <button
                    onClick={() => setEditingQuestion(null)}
                    className="w-full mt-4 py-3 px-4 border-2 border-slate-200 text-slate-700 rounded-2xl font-medium hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Questions List Section */}
          <div>
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <DocumentTextIcon className="w-5 h-5" />
                  <span>Exam Questions ({questions.length})</span>
                </h2>
              </div>

              <div className="p-6">
                {questions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DocumentTextIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No Questions Yet</h3>
                    <p className="text-slate-500 mb-6">Add your first question to get started</p>
                    <button
                      onClick={() => setShowQuestionForm(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    >
                      Create First Question
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {questions.map((q, index) => (
                      <div key={q._id} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-all duration-200">
                        {/* Question Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-slate-800 leading-relaxed">
                                {q.text}
                              </h3>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                                <span className="flex items-center space-x-1">
                                  <ClockIcon className="w-4 h-4" />
                                  <span>{formatTime(q.timeLimit)}</span>
                                </span>
                                <span>•</span>
                                <span>{q.points || 1} point{q.points !== 1 ? 's' : ''}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-2 mb-4">
                          {q.options.map((opt, i) => (
                            <div
                              key={i}
                              className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-200 ${
                                opt === q.correct
                                  ? 'border-green-500 bg-green-50/50'
                                  : 'border-slate-200 bg-white'
                              }`}
                            >
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                opt === q.correct
                                  ? 'border-green-500 bg-green-500 text-white'
                                  : 'border-slate-300 text-slate-400'
                              }`}>
                                <span className="text-xs font-bold">{String.fromCharCode(65 + i)}</span>
                              </div>
                              <span className={`font-medium ${
                                opt === q.correct ? 'text-green-800' : 'text-slate-700'
                              }`}>
                                {opt}
                              </span>
                              {opt === q.correct && (
                                <span className="ml-auto px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                  Correct Answer
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-3 pt-4 border-t border-slate-200">
                          <button
                            onClick={() => setEditingQuestion(q)}
                            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                          >
                            <PencilIcon className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => remove(q._id)}
                            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                          >
                            <TrashIcon className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}