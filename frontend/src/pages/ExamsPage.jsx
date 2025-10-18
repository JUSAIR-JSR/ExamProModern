import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeOffIcon,
  PlayIcon,
  ClockIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  UsersIcon
} from "../components/Icons";

export default function ExamsPage({ user }) {
  const [exams, setExams] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalTime, setTotalTime] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/exams");
      setExams(res.data);
    } catch (error) {
      console.error("Failed to load exams:", error);
      if (error.response && error.response.status === 401) {
        setError("You must be logged in to view exams.");
      } else {
        setError("Failed to load exams. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!title.trim()) return alert("Please enter exam title");
    setIsSubmitting(true);
    try {
      await API.post("/exams", { title, description, totalTime: Number(totalTime), published: false });
      resetForm();
      load();
      setShowCreateForm(false);
    } catch {
      alert("Failed to create exam");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveEdit = async () => {
    setIsSubmitting(true);
    try {
      await API.put(`/exams/${editingId}`, { title, description, totalTime: Number(totalTime) });
      resetForm();
      load();
    } catch {
      alert("Failed to update exam");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setTotalTime(0);
    setShowCreateForm(false);
  };

  const del = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam? This action cannot be undone.")) return;
    try {
      await API.delete(`/exams/${id}`);
      load();
    } catch {
      alert("Failed to delete exam");
    }
  };

  const togglePublish = async (exam) => {
    try {
      await API.put(`/exams/${exam._id}`, { published: !exam.published });
      load();
    } catch {
      alert("Failed to update exam status");
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return "Per question";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading exams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DocumentTextIcon className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">{error}</h2>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              {user?.role === "teacher" ? "Manage Exams" : "Available Exams"}
            </h1>
            <p className="text-lg text-slate-600">
              {user?.role === "teacher" 
                ? "Create and manage your assessments" 
                : "Browse and take available exams"
              }
            </p>
          </div>

          {user?.role === "teacher" && !editingId && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="mt-4 lg:mt-0 flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create New Exam</span>
            </button>
          )}
        </div>

        {/* Create/Edit Form */}
        {user?.role === "teacher" && (showCreateForm || editingId) && (
          <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingId ? "Edit Exam" : "Create New Exam"}
              </h2>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Exam Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter exam title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Total Time (seconds)
                  </label>
                  <input
                    type="number"
                    placeholder="Leave 0 for per-question timing"
                    value={totalTime}
                    onChange={(e) => setTotalTime(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  <p className="text-sm text-slate-500 mt-1">
                    Set to 0 to use individual question time limits
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Enter exam description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              {!editingId ? (
                <button 
                  onClick={create} 
                  disabled={isSubmitting || !title.trim()}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-2xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <PlusIcon className="w-5 h-5" />
                  )}
                  <span>{isSubmitting ? "Creating..." : "Create Exam"}</span>
                </button>
              ) : (
                <button 
                  onClick={saveEdit} 
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <PencilIcon className="w-5 h-5" />
                  )}
                  <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
                </button>
              )}
              <button 
                onClick={resetForm}
                className="py-3 px-6 border-2 border-slate-300 text-slate-700 rounded-2xl font-medium hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Exams Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            Exam List <span className="text-slate-500 text-lg">({exams.length})</span>
          </h2>
        </div>

        {exams.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AcademicCapIcon className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Exams Found</h3>
            <p className="text-slate-500 mb-6">
              {user?.role === "teacher" 
                ? "Create your first exam to get started" 
                : "No exams are available at the moment"
              }
            </p>
            {user?.role === "teacher" && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Create First Exam
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {exams.map((exam) => (
              <div key={exam._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden group">
                <div className="p-6">
                  {/* Exam Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <AcademicCapIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      exam.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {exam.published ? 'Published' : 'Draft'}
                    </div>
                  </div>

                  {/* Exam Content */}
                  <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">{exam.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {exam.description || "No description provided"}
                  </p>

                  {/* Exam Metadata */}
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{formatTime(exam.totalTime)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DocumentTextIcon className="w-4 h-4" />
                      <span>{exam.questions?.length || 0} questions</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {user?.role === "teacher" ? (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(exam._id);
                            setTitle(exam.title);
                            setDescription(exam.description);
                            setTotalTime(exam.totalTime || 0);
                            setShowCreateForm(true);
                          }}
                          className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 text-sm font-medium"
                        >
                          <PencilIcon className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => togglePublish(exam)}
                          className="flex items-center space-x-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 text-sm font-medium"
                        >
                          {exam.published ? (
                            <EyeOffIcon className="w-4 h-4" />
                          ) : (
                            <EyeIcon className="w-4 h-4" />
                          )}
                          <span>{exam.published ? "Unpublish" : "Publish"}</span>
                        </button>
                        <button
                          onClick={() => navigate(`/manage/${exam._id}`)}
                          className="flex items-center space-x-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 text-sm font-medium"
                        >
                          <DocumentTextIcon className="w-4 h-4" />
                          <span>Manage</span>
                        </button>
                        <button
                          onClick={() => del(exam._id)}
                          className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 text-sm font-medium"
                        >
                          <TrashIcon className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate(`/take`)}
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <PlayIcon className="w-4 h-4" />
                        <span>Start Exam</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-6 py-3 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Created {new Date(exam.createdAt).toLocaleDateString()}</span>
                    <span>By {exam.creator?.name || "Unknown"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}