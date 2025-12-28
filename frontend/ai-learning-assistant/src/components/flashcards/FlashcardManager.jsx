import React, { useState, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Sparkles,
  Brain,
  CheckCircle2,
  Zap,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import Modal from "../common/Modal";
import Spinner from "../common/Spinner";
import Flashcard from "./Flashcard";
import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";

const FlashcardManager = ({ documentId }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeliting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchFlashcardSets = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcardsForDocument(
        documentId
      );
      setFlashcards(response.data);
    } catch (error) {
      toast.error("Failed to load flashcards.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchFlashcardSets();
    }
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    setIsSuccess(false);
    try {
      await aiService.generateFlashcards(documentId);
      setIsSuccess(true);
      toast.success("Flashcards generated successfully!");
      fetchFlashcardSets();
    } catch (error) {
      toast.error("Failed to generate flashcards.");
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleNextCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) => (prevIndex + 1) % selectedSet.cards.length
      );
    }
  };

  const handlePrevCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) =>
          (prevIndex - 1 + selectedSet.cards.length) % selectedSet.cards.length
      );
    }
  };

  const handleReview = async (index) => {
    const currentCard = selectedSet?.cards[currentCardIndex];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id, index);
      toast.success("Flashcard marked as reviewed!");
    } catch (error) {
      toast.error("Failed to mark flashcard as reviewed.");
    }
  };

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      const updatedSets = flashcards.map((set) => {
        if (set._id === selectedSet._id) {
          const updatedCards = set.cards.map((card) =>
            card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
          );
          return { ...set, cards: updatedCards };
        }
        return set;
      });
      setFlashcards(updatedSets);
      setSelectedSet(updatedSets.find((set) => set._id === selectedSet._id));
    } catch (error) {
      toast.error("Failed to toggle star on flashcard.");
    }
  };

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;
    setDeliting(true);
    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);
      toast.success("Flashcard set deleted.");
      setIsDeleteModalOpen(false);
      setSetToDelete(null);
      fetchFlashcardSets();
    } catch (error) {
      toast.error("Failed to delete flashcard set.");
    } finally {
      setDeliting(false);
    }
  };

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  };

  const renderFlashcardViewer = () => {
    if (!selectedSet) return null;

    const currentCard = selectedSet.cards[currentCardIndex];
    const total = selectedSet.cards.length;
    if (!currentCard) return <div>No cards in this set.</div>;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header: Back to Sets */}
        <button
          type="button"
          onClick={() => setSelectedSet(null)}
          className="group inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-all duration-200 hover:gap-3"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Sets
        </button>

        <div className="w-full max-w-4xl mx-auto px-2 sm:px-0">
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />
          </div>
          
          <div className="mt-8 flex items-center gap-4 justify-center">
            <button
              type="button"
              onClick={handlePrevCard}
              disabled={currentCardIndex === 0}
              className="group inline-flex items-center gap-2 px-6 h-12 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 transition-all duration-200 shadow-md shadow-indigo-200/30 hover:shadow-lg hover:shadow-indigo-200/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Previous
            </button>

            <div className="px-6 h-12 inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30">
              <span className="text-sm">{currentCardIndex + 1} / {total}</span>
            </div>

            <button
              type="button"
              onClick={handleNextCard}
              disabled={currentCardIndex === total - 1}
              className="group inline-flex items-center gap-2 px-6 h-12 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 transition-all duration-200 shadow-md shadow-indigo-200/30 hover:shadow-lg hover:shadow-indigo-200/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
            >
              Next
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      );
    }

    if (flashcards.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center px-16 py-20 animate-in fade-in zoom-in-95 duration-500">
          <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-200 mb-6 transition-all duration-300 ${
            generating ? "animate-pulse scale-110" : ""
          }`}>
            <Brain className="w-10 h-10 text-cyan-600" strokeWidth={2} />
            {generating && (
              <div className="absolute inset-0 rounded-2xl bg-cyan-400 animate-ping opacity-20" />
            )}
            {isSuccess && (
              <div className="absolute -top-1 -right-1">
                <CheckCircle2 className="w-6 h-6 text-green-500 animate-in zoom-in duration-300" />
              </div>
            )}
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-900">
            No Flashcards Yet
          </h3>
          <p className="text-sm text-indigo-600/70 mb-10 text-center max-w-sm leading-relaxed">
            Generate flashcards from your document to start learning and
            reinforce your knowledge with AI-powered study cards.
          </p>
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className={`group relative inline-flex items-center gap-2 px-8 h-14 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-cyan-500/30 overflow-hidden transition-all duration-300 ${
              generating
                ? "cursor-wait"
                : "hover:from-cyan-500 hover:to-cyan-700 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-105 active:scale-100"
            } disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
                  <span>Generate Flashcards</span>
                </>
              )}
            </span>
            {!generating && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header with Generate Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Your Flashcard Sets
              {isSuccess && (
                <CheckCircle2 className="w-6 h-6 text-green-500 animate-in zoom-in duration-300" />
              )}
            </h3>
            <p className="text-sm text-indigo-600/70 mt-1.5">
              {flashcards.length}
              {flashcards.length === 1 ? " set" : " sets"} available
            </p>
          </div>
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className={`group relative inline-flex items-center gap-2 px-6 h-12 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-cyan-500/30 overflow-hidden transition-all duration-300 ${
              generating
                ? "cursor-wait"
                : "hover:from-cyan-500 hover:to-cyan-700 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-105 active:scale-100"
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
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
                  <span>Generate New Set</span>
                </>
              )}
            </span>
            {!generating && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            )}
          </button>
        </div>

        {/* Flashcard Sets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {flashcards.map((set, index) => (
            <div
              key={set._id}
              onClick={() => handleSelectSet(set)}
              className="group relative bg-gradient-to-br from-white to-cyan-50/20 backdrop-blur-xl border-2 border-cyan-100/70 rounded-2xl shadow-md shadow-cyan-200/20 p-6 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-200/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-600/0 group-hover:from-cyan-500/5 group-hover:to-cyan-600/5 rounded-2xl transition-all duration-300 pointer-events-none" />
              
              {/* Delete Button */}
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="absolute top-4 right-4 p-2 text-indigo-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2.5} />
              </button>

              {/* Set Content */}
              <div className="relative space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>

                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1.5">
                    Flashcard Set
                  </h4>
                  <p className="text-xs font-medium text-indigo-600/70 uppercase tracking-wide">
                    Created {moment(set.createdAt).fromNow()}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-cyan-100">
                  <div className="px-4 py-2 bg-cyan-50 border border-cyan-200 rounded-lg">
                    <span className="text-sm font-semibold text-cyan-700">
                      {set.cards.length}{" "}
                      {set.cards.length === 1 ? "card" : "cards"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <>
      <div className="bg-white/90 backdrop-blur-xl border border-indigo-100/60 rounded-2xl shadow-xl shadow-indigo-200/30 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {selectedSet ? renderFlashcardViewer() : renderSetList()}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set?"
        centered
        size="md"
      >
        <div className="space-y-6">
          <p className="text-sm text-indigo-600/80 leading-relaxed">
            Are you sure you want to delete this flashcard set? This action
            cannot be undone and all cards will be permanently removed.
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
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="px-6 h-11 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete Set"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FlashcardManager;
