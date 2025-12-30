import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import quizService from "../../services/quizService";
import aiService from "../../services/aiService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import Modal from "../../components/common/Modal";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
  BookOpen,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";

const QuizResultPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  const [focusedInput, setFocusedInput] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId);
        setResults(data);
      } catch (error) {
        toast.error("Failed to load quiz results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60hv]">
        <Spinner />
      </div>
    );
  }

  if (!results || !results.data) {
    return (
      <div className="flex items-center justify-center min-h-[60hv]">
        <div className="text-center">
          <p className="text-indigo-600/80 text-lg ">
            No results available for this quiz.
          </p>
        </div>
      </div>
    );
  }

  const {
    data: { quiz, results: detailedResults },
  } = results;
  const score = quiz.score;
  const totalQuestions = detailedResults.length;
  const correctAnswers = detailedResults.filter((r) => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const getScoreColor = (score) => {
    if (score >= 80) return "from-cyan-400 to-cyan-600";
    if (score >= 60) return "from-indigo-500 to-purple-600";
    return "from-purple-500 to-violet-600";
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return "Excellent work!";
    if (score >= 60) return "Good job!";
    if (score >= 40) return "There is room for improvement.";
    return "Keep practicing to improve your score.";
  };

  const handleTakeAgain = () => {
    // Since quiz is already completed, offer to generate a new quiz
    setIsGenerateModalOpen(true);
  };

  const handleGenerateNewQuiz = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const documentId = quiz.document._id;
      await aiService.generateQuiz(documentId, { numQuestions });
      toast.success("New quiz generated successfully!");
      setIsGenerateModalOpen(false);
      // Navigate to document page to see the new quiz
      navigate(`/documents/${documentId}`);
    } catch (error) {
      toast.error(error?.message || "Failed to generate new quiz.");
      console.log(error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to={`/documents/${quiz.document._id}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
        >
          <ArrowLeft
            className="w-4 h-4  group-hover:-translate-x-1 transition-transform duration-200"
            strokeWidth={2}
          />
          Return to Source Document
        </Link>
      </div>

      <PageHeader title="Q Study" icon={Zap} />

      {/* Score Card */}
      <div className="bg-white/90 backdrop-blur-xl border-2 border-indigo-100/60 rounded-2xl shadow-xl shadow-indigo-200/30 p-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mx-auto shadow-lg shadow-indigo-500/20">
            <Trophy className="w-9 h-9 text-indigo-600" strokeWidth={2.5} />
          </div>

          <div className="text-sm font-semibold text-indigo-600/70 uppercase tracking-wide mb-2">
            <p>Quiz Performance</p>
            <div
              className={`inline-block text-6xl font-bold bg-gradient-to-r 
              ${getScoreColor(score)} bg-clip-text text-transparent mb-3
              `}
            >
              {score}%
            </div>
            <p className="text-xl font-semibold text-slate-900">
              {getScoreMessage(score)}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg">
              <Target className="w-4 h-4 text-indigo-600" strokeWidth={2} />
              <span className="text-sm font-semibold text-indigo-700">
                {totalQuestions} Total Questions
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-cyan-50 border border-cyan-200 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-cyan-600" strokeWidth={2} />
              <span className="text-sm font-semibold text-cyan-700">
                {correctAnswers} Correct Answers
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
              <XCircle className="w-4 h-4 text-purple-600" strokeWidth={2} />
              <span className="text-sm font-semibold text-purple-700">
                {incorrectAnswers} Incorrect Answers
              </span>
            </div>
          </div>

          {/* Take Again Button */}
          <div className="mt-8 pt-6 border-t border-indigo-100">
            <button
              onClick={handleTakeAgain}
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-100 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <RotateCcw
                  className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
                  strokeWidth={2.5}
                />
                <span>Retake Quiz</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Questions Review */}
      <div className="space-y-6 mb-12">
        {detailedResults.map((result, index) => {
          const selectedAnswer = result.selectedAnswer || "";
          const correctAnswer = result.correctAnswer || "";
          const questionText = result.question || `Question ${index + 1}`;

          const optionTone = (option) => {
            if (option === correctAnswer) return "correct";
            if (option === selectedAnswer && selectedAnswer !== correctAnswer)
              return "selected";
            return "neutral";
          };

          const toneToClasses = {
            correct:
              "border-cyan-500 bg-cyan-50 text-cyan-900 shadow-md shadow-cyan-100",
            selected:
              "border-purple-400 bg-purple-50 text-purple-900 shadow-md shadow-purple-100",
            neutral:
              "border-indigo-100 bg-indigo-50/30 text-slate-900 hover:border-indigo-200",
          };

          return (
            <div
              key={result.questionIndex ?? index}
              className="bg-white/90 backdrop-blur-md border-2 border-indigo-100/60 rounded-2xl shadow-md shadow-indigo-200/30 p-6 hover:shadow-lg hover:shadow-indigo-200/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <h4 className="text-lg font-semibold text-slate-900 leading-snug">
                  Question {index + 1}: {questionText}
                </h4>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${
                    result.isCorrect
                      ? "bg-cyan-100 text-cyan-700 border border-cyan-200"
                      : "bg-purple-100 text-purple-700 border border-purple-200"
                  }`}
                >
                  {result.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                </div>
              </div>

              <div className="space-y-3">
                {Array.isArray(result.options) && result.options.length > 0 && (
                  <div className="space-y-2">
                    {result.options.map((option, optIdx) => {
                      const tone = toneToClasses[optionTone(option)];
                      const isSelected = option === selectedAnswer;
                      const isCorrect = option === correctAnswer;
                      return (
                        <div
                          key={`${result.questionIndex ?? index}-${optIdx}`}
                          className={`flex items-center gap-3 p-3 border rounded-xl transition-colors duration-150 ${tone}`}
                        >
                          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/90 text-sm font-semibold text-indigo-700 border border-indigo-200 shadow-sm">
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <div className="flex-1 text-sm font-medium leading-relaxed">
                            {option}
                          </div>
                          {isCorrect && (
                            <CheckCircle2
                              className="w-5 h-5 text-cyan-600"
                              strokeWidth={2.5}
                            />
                          )}
                          {!isCorrect && isSelected && (
                            <XCircle
                              className="w-5 h-5 text-purple-600"
                              strokeWidth={2.5}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {result.explanation && (
                  <div className="mt-4 px-5 py-4 bg-indigo-50/30 border border-indigo-100 rounded-xl flex gap-3">
                    <BookOpen
                      className="w-5 h-5 text-indigo-600 shrink-0"
                      strokeWidth={2}
                    />
                    <div>
                      <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-1.5">
                        Explanation
                      </p>
                      <p className="text-sm text-slate-800 leading-relaxed">
                        {result.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Generate New Quiz Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Create New Quiz"
        size="md"
      >
        <form onSubmit={handleGenerateNewQuiz} className="space-y-6">
          <div>
            <p className="text-sm text-indigo-600/80 leading-relaxed mb-4">
              You have completed this quiz. To attempt more questions, generate
              a new quiz based on this document.
            </p>
            <label className="block text-sm font-semibold text-indigo-700 uppercase tracking-wide mb-2">
              Select Number of Questions
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={20}
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
                onFocus={() => setFocusedInput(true)}
                onBlur={() => setFocusedInput(false)}
                className={`w-full h-12 px-4 border-2 rounded-xl text-slate-900 text-sm font-medium transition-all duration-300 ${
                  focusedInput
                    ? "border-indigo-500 bg-white shadow-lg shadow-indigo-500/20"
                    : "border-indigo-100 bg-indigo-50/30 hover:border-indigo-200"
                } focus:outline-none focus:ring-4 focus:ring-indigo-300/30`}
                required
              />
              {focusedInput && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Zap className="w-4 h-4 text-indigo-500 animate-pulse" />
                </div>
              )}
            </div>
            <p className="text-xs text-indigo-600/70 mt-2">
              Tip: 5-10 questions is optimal for focused practice.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsGenerateModalOpen(false)}
              disabled={generating}
              className="px-6 h-11 border-2 border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={generating}
              className={`group relative px-6 h-11 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/30 overflow-hidden ${
                generating
                  ? "cursor-wait"
                  : "hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-100"
              } disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              <span className="relative z-10 flex items-center gap-2">
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Quiz...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Create New Quiz</span>
                  </>
                )}
              </span>
              {!generating && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default QuizResultPage;
