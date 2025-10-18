import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  TrophyIcon
} from "../components/Icons";

export default function TakeExam() {
  const [exams, setExams] = useState([]);
  const [selected, setSelected] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Load exams on mount
  useEffect(() => {
    const loadExams = async () => {
      try {
        setIsLoading(true);
        const res = await API.get("/exams");
        setExams(res.data.filter(exam => exam.published));
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError("You must be logged in to take exams.");
        } else {
          setError("Failed to load exams.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadExams();
  }, []);

  // Start exam
  const start = async (exam) => {
    setIsLoading(true);
    try {
      setSelected(exam);
      const res = await API.get(`/questions/exam/${exam._id}`);
      setQuestions(res.data);
      setAnswers({});
      setFinished(false);
      setScore(0);
      setCurrentIdx(0);
      setExamStarted(true);
      setTimeLeft(exam.totalTime || res.data[0]?.timeLimit || 0);
    } catch (error) {
      alert("Failed to load exam questions");
    } finally {
      setIsLoading(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (!selected || finished || !examStarted) return;
    if (timeLeft <= 0) {
      if (selected.totalTime && selected.totalTime > 0) {
        submitAll();
      } else {
        if (currentIdx < questions.length - 1) {
          const nextIndex = currentIdx + 1;
          setCurrentIdx(nextIndex);
          setTimeLeft(questions[nextIndex].timeLimit);
        } else {
          submitAll();
        }
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, selected, finished, currentIdx, questions, examStarted]);

  // Choose answer
  const chooseAnswer = (qId, opt) => {
    setAnswers(prev => ({ ...prev, [qId]: opt }));
  };

  // Submit exam
  const submitAll = () => {
    let sc = 0;
    for (const q of questions) {
      if (answers[q._id] && answers[q._id] === q.correct) sc++;
    }
    setScore(sc);
    setFinished(true);
    setExamStarted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-4">{error}</h2>
          <button 
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading && !selected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading available exams...</p>
        </div>
      </div>
    );
  }

  // Exam list
  if (!selected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Available Exams</h1>
            <p className="text-lg text-slate-600">Choose an exam to begin your assessment</p>
          </div>

          {exams.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Exams Available</h3>
              <p className="text-slate-500">Check back later for new assessments</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {exams.map(exam => (
                <div key={exam._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden group">
                  <div className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <TrophyIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">{exam.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{exam.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{exam.totalTime ? formatTime(exam.totalTime) : "Per question"}</span>
                      </div>
                      <span>{exam.questions?.length || "?"} questions</span>
                    </div>

                    <button 
                      onClick={() => start(exam)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-lg"
                    >
                      <PlayIcon className="w-4 h-4" />
                      <span>Start Exam</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Exam finished
  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPassing = percentage >= 70;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isPassing ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isPassing ? (
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            ) : (
              <XCircleIcon className="w-12 h-12 text-red-600" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Exam Completed!</h2>
          <p className="text-slate-600 mb-6">You've finished {selected.title}</p>
          
          <div className="bg-slate-50 rounded-2xl p-6 mb-6">
            <div className="text-5xl font-bold text-slate-800 mb-2">{score}<span className="text-2xl text-slate-500">/{questions.length}</span></div>
            <div className={`text-2xl font-semibold ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
              {percentage}%
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 mt-4">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${
                  isPassing ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          <button 
            onClick={() => { setSelected(null); setQuestions([]); }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  // Ongoing exam
  const curr = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{selected.title}</h1>
              <p className="text-slate-600">Question {currentIdx + 1} of {questions.length}</p>
            </div>
            
            {/* Timer */}
            <div className={`flex items-center space-x-2 px-4 py-3 rounded-xl ${
              timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <ClockIcon className="w-5 h-5" />
              <span className="text-lg font-semibold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-2 mt-4">
            <div 
              className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        {curr && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {currentIdx + 1}
              </div>
              <h3 className="text-xl font-semibold text-slate-800 leading-relaxed">{curr.text}</h3>
            </div>

            <div className="space-y-3">
              {curr.options.map((opt, i) => (
                <label 
                  key={i}
                  className={`flex items-center space-x-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    answers[curr._id] === opt 
                      ? 'border-blue-500 bg-blue-50/50 shadow-md' 
                      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={curr._id}
                    checked={answers[curr._id] === opt}
                    onChange={() => chooseAnswer(curr._id, opt)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[curr._id] === opt 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-slate-300 bg-white'
                  }`}>
                    {answers[curr._id] === opt && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-slate-700 font-medium flex-1">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center bg-white rounded-3xl shadow-lg p-6">
          <button 
            onClick={() => setCurrentIdx(i => i - 1)}
            disabled={currentIdx === 0}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span>Previous</span>
          </button>

          {currentIdx < questions.length - 1 ? (
            <button 
              onClick={() => setCurrentIdx(i => i + 1)}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span>Next Question</span>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={submitAll}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <CheckCircleIcon className="w-5 h-5" />
              <span>Submit Exam</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}