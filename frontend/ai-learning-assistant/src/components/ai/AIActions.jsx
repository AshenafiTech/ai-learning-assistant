import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, BookOpen, Lightbulb, CheckCircle2, Zap } from "lucide-react";
import aiService from "../../services/aiService";
import toast from "react-hot-toast";
import MarkdownRenderer from "../common/MarkdownRenderer";
import Modal from "../common/Modal";

const AIActions = () => {
  const { id: documentId } = useParams();
  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [concept, setConcept] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedInput, setFocusedInput] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => setIsSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleGenerateSummary = async () => {
    setLoadingAction("summary");
    setIsSuccess(false);
    try {
      const summaryResponse = await aiService.generateSummary(documentId);
      const summary =
        summaryResponse?.summary ||
        summaryResponse?.data?.summary ||
        summaryResponse?.data?.data?.summary ||
        "";
      setModalTitle("Generated Summary");
      setModalContent(summary);
      setIsSuccess(true);
      setIsModalOpen(true);
      toast.success("Summary generated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to generate summary.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (e) => {
    e.preventDefault();
    if (!concept.trim()) {
      toast.error("Please enter a concept to explain.");
      return;
    }
    setLoadingAction("explain");
    setIsSuccess(false);
    try {
      const explainResponse = await aiService.explainConcept(
        documentId,
        concept
      );
      const explanation =
        explainResponse?.explanation ||
        explainResponse?.data?.explanation ||
        explainResponse?.data?.data?.explanation ||
        "";
      setModalTitle(`Explanation: "${concept}"`);
      setModalContent(explanation || "No explanation returned.");
      setIsSuccess(true);
      setIsModalOpen(true);
      setConcept("");
      toast.success("Concept explained successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to explain concept.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      <div className="bg-white/90 backdrop-blur-xl border border-indigo-100/60 rounded-2xl shadow-xl shadow-indigo-200/30 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header with animated icon */}
        <div className="px-6 py-5 border-b border-indigo-100/60 bg-gradient-to-br from-indigo-50/50 via-white/50 to-purple-50/30">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-white animate-pulse" strokeWidth={2} />
              </div>
              {loadingAction && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-ping" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                AI Assistant
                {isSuccess && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 animate-in zoom-in duration-300" />
                )}
              </h3>
              <p className="text-xs text-indigo-600/70 mt-0.5">Powered by advanced AI</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Generate Summary Card */}
          <div className={`group relative p-6 bg-gradient-to-br from-white to-indigo-50/20 rounded-2xl border-2 transition-all duration-300 ${
            loadingAction === "summary" 
              ? "border-indigo-300 shadow-xl shadow-indigo-200/40" 
              : "border-indigo-100/70 shadow-md shadow-indigo-200/20 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-200/30 hover:-translate-y-0.5"
          }`}>
            {/* Animated background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-300 pointer-events-none" />
            
            <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className={`relative shrink-0 transition-all duration-300 ${
                    loadingAction === "summary" ? "animate-pulse" : ""
                  }`}>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                      <BookOpen
                        className="w-7 h-7 text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                    {loadingAction === "summary" && (
                      <div className="absolute inset-0 rounded-xl bg-cyan-400 animate-ping opacity-20" />
                    )}
                  </div>
                  <div className="space-y-2 flex-1">
                    <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                      Generate Summary
                      {loadingAction === "summary" && (
                        <Zap className="w-4 h-4 text-indigo-500 animate-pulse" />
                      )}
                    </h4>
                    <p className="text-indigo-600/70 text-sm leading-relaxed">
                      Get a concise summary of the entire document with key insights and main points.
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleGenerateSummary}
                disabled={loadingAction === "summary"}
                className={`relative w-full md:w-auto h-12 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/30 overflow-hidden group/btn ${
                  loadingAction === "summary"
                    ? "cursor-wait"
                    : "hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-100"
                } disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  {loadingAction === "summary" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Summarize</span>
                      <Sparkles className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                    </>
                  )}
                </span>
                {!loadingAction && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                )}
              </button>
            </div>
          </div>

          {/* Explain Concept Card */}
          <div className={`group relative p-6 bg-gradient-to-br from-white to-pink-50/20 rounded-2xl border-2 transition-all duration-300 ${
            loadingAction === "explain" 
              ? "border-pink-300 shadow-xl shadow-pink-200/40" 
              : "border-pink-100/70 shadow-md shadow-pink-200/20 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-200/30 hover:-translate-y-0.5"
          }`}>
            {/* Animated background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-rose-500/0 group-hover:from-pink-500/5 group-hover:to-rose-500/5 rounded-2xl transition-all duration-300 pointer-events-none" />
            
            <form
              onSubmit={handleExplainConcept}
              className="relative flex flex-col gap-5"
            >
              <div className="flex items-start gap-4">
                <div className={`relative shrink-0 transition-all duration-300 ${
                  loadingAction === "explain" ? "animate-pulse" : ""
                }`}>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Lightbulb
                      className="w-7 h-7 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  {loadingAction === "explain" && (
                    <div className="absolute inset-0 rounded-xl bg-pink-400 animate-ping opacity-20" />
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    Explain a Concept
                    {loadingAction === "explain" && (
                      <Zap className="w-4 h-4 text-pink-500 animate-pulse" />
                    )}
                  </h4>
                  <p className="text-indigo-600/70 text-sm leading-relaxed">
                    Enter a topic or concept from the document to get a detailed explanation with examples.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    onFocus={() => setFocusedInput(true)}
                    onBlur={() => setFocusedInput(false)}
                    placeholder="e.g., 'React Hooks', 'Machine Learning', etc."
                    className={`w-full h-14 px-5 border-2 rounded-xl text-slate-900 placeholder-indigo-400/60 text-sm font-medium transition-all duration-300 ${
                      focusedInput
                        ? "border-indigo-500 bg-white shadow-lg shadow-indigo-500/20"
                        : "border-indigo-100 bg-indigo-50/30 hover:border-indigo-200 hover:bg-indigo-50/50"
                    } focus:outline-none focus:ring-4 focus:ring-indigo-300/30`}
                    disabled={loadingAction === "explain"}
                  />
                  {focusedInput && concept && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loadingAction === "explain" || !concept.trim()}
                  className={`relative w-full md:w-auto shrink-0 h-14 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/30 overflow-hidden group/btn ${
                    loadingAction === "explain"
                      ? "cursor-wait"
                      : concept.trim()
                      ? "hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-100"
                      : ""
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                >
                  <span className="relative z-10 flex items-center gap-2 justify-center">
                    {loadingAction === "explain" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Explaining...</span>
                      </>
                    ) : (
                      <>
                        <span>Explain</span>
                        <Lightbulb className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                  {!loadingAction && concept.trim() && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Result Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={modalTitle}
            size="lg"
          >
            <div className="prose prose-lg max-w-none animate-in fade-in duration-300">
              <MarkdownRenderer>{modalContent}</MarkdownRenderer>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default AIActions;
