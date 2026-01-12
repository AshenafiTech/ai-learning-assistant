import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import quizService from "../../services/quizService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";

const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizService.getQuizById(quizId);
        const quizData = response?.data || null;
        // Ensure questions is always an array to avoid runtime errors
        const normalized = quizData
          ? {
              ...quizData,
              questions: Array.isArray(quizData.questions)
                ? quizData.questions
                : [],
            }
          : null;

        // Check if quiz has already been completed
        const alreadyCompleted = Boolean(
          (normalized?.userAnswers?.length || 0) > 0 || normalized?.completedAt
        );

        if (alreadyCompleted) {
          toast(
            "This quiz has already been completed. Redirecting to results..."
          );
          setTimeout(() => {
            navigate(`/quizzes/${quizId}/results`);
          }, 1500);
          return;
        }

        setQuiz(normalized);
      } catch (error) {
        toast.error("Failed to load quiz.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, navigate]);

  const handleNextQuestion = () => {
    if (
      quiz &&
      Array.isArray(quiz.questions) &&
      currentQuestionIndex < quiz.questions.length - 1
    ) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleOptionChange = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      // Adapt selectedAnswers (object keyed by question id) into the backend's expected array format
      const answersArray = Array.isArray(quiz?.questions)
        ? quiz.questions
            .map((q, index) => {
              const key = q._id || q.id;
              const val = selectedAnswers[key];
              const selectedAnswer =
                typeof val === "number" && Array.isArray(q.options)
                  ? q.options[val]
                  : typeof val === "string"
                  ? val
                  : null;

              return typeof selectedAnswer === "string"
                ? { questionIndex: index, selectedAnswer }
                : null;
            })
            .filter(Boolean)
        : [];

      await quizService.submitQuiz(quizId, answersArray);
      toast.success("Quiz submitted successfully!");
      navigate(`/quizzes/${quizId}/results`);
    } catch (error) {
      // Check if the error is about quiz already being completed
      const errorMessage =
        error?.error || error?.message || "Failed to submit quiz.";
      if (
        errorMessage.toLowerCase().includes("already been completed") ||
        errorMessage.toLowerCase().includes("already completed")
      ) {
        toast.error(
          "This quiz has already been completed. Redirecting to results..."
        );
        setTimeout(() => {
          navigate(`/quizzes/${quizId}/results`);
        }, 2000);
      } else {
        toast.error(errorMessage);
      }
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-slate-600 text-lg">
            No questions available for this quiz.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isAnswered = selectedAnswers.hasOwnProperty(
    currentQuestion._id || currentQuestion.id
  );
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div>
      <PageHeader title={quiz.title || "Take Quiz"} />

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm font-semibold text-slate-700">
            ({answeredCount} answered)
          </span>
        </div>
        <div className="relative h-2 bg-slate-100  rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
            style={{
              width: `${
                quiz.questions.length > 0
                  ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      {/* Question Card */}

      <div className="bg-white/90 backdrop-blur-md border-2 border-indigo-100 rounded-2xl shadow-xl shadow-indigo-200/30 p-6 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-indigo-100/50 rounded-full text-indigo-800 font-medium">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          <span className="">Question {currentQuestionIndex + 1}:</span>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="">
          {currentQuestion.options.map((option, idx) => {
            const isSelected =
              selectedAnswers[currentQuestion._id || currentQuestion.id] ===
              idx;
            return (
              <label
                key={idx}
                className={`group relative flex items-center p-4 mb-4 border rounded-lg cursor-pointer transition-colors 
                    ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/30"
                        : "border-indigo-100 bg-indigo-50/30 hover:bg-indigo-100 hover:border-indigo-200"
                    }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion._id || currentQuestion.id}`}
                  value={idx}
                  checked={isSelected}
                  onChange={() =>
                    handleOptionChange(
                      currentQuestion._id || currentQuestion.id,
                      idx
                    )
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {/* Custom radio Button */}
                <div
                  className={`shrink-0 w-5 h-5 rounded-full border-full border-2 transition-all duration-200
                      ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-500"
                          : "border-indigo-300 bg-white group-hover:border-indigo-400"
                      }`}
                >
                  {isSelected && (
                    <div className="">
                      <div className="" />
                    </div>
                  )}
                </div>

                {/* Option Text */}
                <span
                  className={`ml-4 text-sm font-medium transition-colors duration-200
                          ${
                            isSelected
                              ? "text-indigo-900"
                              : "text-slate-900 group-hover:text-slate-900"
                          }`}
                >
                  {option}
                </span>

                {/* Selected Checkmark */}

                {isSelected && (
                  <CheckCircle2
                    className="ml-auto w-5 h-5 text-indigo-500"
                    strokeWidth={2.5}
                  />
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0 || submitting}
          variant="secondary"
        >
          <ChevronLeft
            className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200"
            strokeWidth={2.5}
          />
          Previous
        </Button>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <Button
            onClick={handleSubmitQuiz}
            disabled={submitting}
            className="group relative px-8 h-12 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-pointer-not-allowed disabled:active:scale-100 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className=" w-4 h-4" strokeWidth={2.5} />
                  Submit Quiz
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-white/0 via/white-20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Button>
        ) : (
          <Button onClick={handleNextQuestion} disabled={submitting}>
            Next
            <ChevronRight
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200"
              strokeWidth={2.5}
            />
          </Button>
        )}
      </div>

      {/* Question Navigation Dots */}
      <div className="mt-0 flex items-center justify-center gap-3 flex-wrap">
        {quiz.questions.map((_, idx) => {
          const isCurrent = idx === currentQuestionIndex;
          const isAnsweredQuestion = selectedAnswers.hasOwnProperty(
            quiz.questions[idx]._id || quiz.questions[idx].id
          );

          return (
            <button
              key={idx}
              onClick={() => setCurrentQuestionIndex(idx)}
              disabled={submitting}
              className={`w-8 h-8 rounded-lg font-semibold text-xs transition-all duration-200 border
                ${
                  isCurrent
                    ? "bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-200 scale-105 border-transparent"
                    : isAnsweredQuestion
                    ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200"
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100"
                }
              `}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizTakePage;
