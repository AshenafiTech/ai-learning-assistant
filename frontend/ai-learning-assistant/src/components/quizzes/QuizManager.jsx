import React, { useState, useEffect } from "react";
import { Plus, CheckCircle2, Zap, BrainCircuit, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import quizService from "../../services/quizService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Button from "../common/Button";
import Modal from "../common/Modal";
import QuizCard from "./QuizCard";
import EmptyState from "../common/EmptyState";

const QuizManager = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  const [focusedInput, setFocusedInput] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  const fetchQuizzes = async () => {
    if (!documentId) return;
    setLoading(true);
    try {
      const data = await quizService.getQuizzesForDocument(documentId);
      setQuizzes(data?.data ?? data ?? []);
    } catch (error) {
      toast.error("Failed to fetch quizzes.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setIsSuccess(false);
    try {
      await aiService.generateQuiz(documentId, { numQuestions });
      setIsSuccess(true);
      toast.success("Quiz generated successfully!");
      setIsGenerateModalOpen(false);
      fetchQuizzes();
    } catch (error) {
      toast.error("Failed to generate quiz.");
      console.log(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteQuiz = async (quiz) => {
    setSelectedQuizId(quiz);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await quizService.deleteQuiz(selectedQuizId);
      toast.success("Quiz deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchQuizzes();
    } catch (error) {
      toast.error("Failed to delete quiz.");
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  const renderQuizContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      );
    }

    if (quizzes.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center px-16 py-20 animate-in fade-in zoom-in-95 duration-500">
          <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 mb-6 transition-all duration-300 ${
            generating ? "animate-pulse scale-110" : ""
          }`}>
            <BrainCircuit className="w-10 h-10 text-purple-600" strokeWidth={2} />
            {generating && (
              <div className="absolute inset-0 rounded-2xl bg-purple-400 animate-ping opacity-20" />
            )}
            {isSuccess && (
              <div className="absolute -top-1 -right-1">
                <CheckCircle2 className="w-6 h-6 text-green-500 animate-in zoom-in duration-300" />
              </div>
            )}
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-900">
            No Quizzes Available
          </h3>
          <p className="text-sm text-indigo-600/70 mb-10 text-center max-w-sm leading-relaxed">
            Generate quizzes based on your document to test your knowledge and track your progress.
          </p>
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="group relative inline-flex items-center gap-2 px-8 h-14 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-500/30 overflow-hidden transition-all duration-300 hover:from-purple-600 hover:to-violet-700 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 active:scale-100"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
              <span>Generate Quiz</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>
      );
    }

    return (
      <div className="grid gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {quizzes.map((quiz, index) => (
          <div
            key={quiz._id || quiz.id}
            className="animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <QuizCard
              quiz={quiz}
              onDelete={handleDeleteQuiz}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-indigo-100/60 rounded-2xl shadow-xl shadow-indigo-200/30 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Your Quizzes
            {isSuccess && (
              <CheckCircle2 className="w-6 h-6 text-green-500 animate-in zoom-in duration-300" />
            )}
          </h3>
          <p className="text-sm text-indigo-600/70 mt-1.5">
            {quizzes.length} {quizzes.length === 1 ? "quiz" : "quizzes"} available
          </p>
        </div>
        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="group relative inline-flex items-center gap-2 px-6 h-12 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 active:scale-100"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
            <span>Generate Quiz</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>
      </div>

      {renderQuizContent()}

      {/* Generate Quiz Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Quiz"
        size="md"
      >
        <form onSubmit={handleGenerateQuiz} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-indigo-700 uppercase tracking-wide mb-2">
              Number of Questions
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
              Recommended: 5-10 questions for best results
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
              className={`group relative px-6 h-11 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30 overflow-hidden ${
                generating
                  ? "cursor-wait"
                  : "hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 active:scale-100"
              } disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              <span className="relative z-10 flex items-center gap-2">
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Generate</span>
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

      {/* Delete Confirmation */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Quiz?"
        centered
        size="md"
      >
        <div className="space-y-6">
          <p className="text-sm text-indigo-600/80 leading-relaxed">
            Are you sure you want to delete this quiz? This action cannot be
            undone.
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
              className="px-6 h-11 border-2 border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="px-6 h-11 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete Quiz"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuizManager;
