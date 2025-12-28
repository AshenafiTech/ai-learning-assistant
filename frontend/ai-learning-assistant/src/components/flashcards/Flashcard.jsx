import React, { useState } from "react";
import { Star, RotateCcw } from "lucide-react";

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const baseStarClass =
    "w-9 h-9 flex items-center justify-center rounded-xl transition duration-200";
  const starredFrontClass =
    "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-[0_8px_24px_rgba(245,158,11,0.35)] hover:shadow-[0_12px_32px_rgba(245,158,11,0.45)]";
  const unstarredFrontClass = "bg-indigo-100 text-indigo-500 hover:bg-indigo-200";
  const starredBackClass =
    "bg-gradient-to-br from-amber-400/90 to-amber-500 text-white shadow-[0_8px_24px_rgba(245,158,11,0.35)] hover:shadow-[0_12px_32px_rgba(245,158,11,0.45)]";
  const unstarredBackClass =
    "bg-white/20 backdrop-blur-sm text-white/80 hover:bg-white/30";

  return (
    <div className="relative w-full h-72" style={{ perspective: "1000px" }}>
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-gpu ease-in-out cursor-pointer`}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={handleFlip}
      >
        {/* Front of the Card (Question) */}
        <div
          className="absolute inset-0 w-full h-full bg-white/90 backdrop-blur-md border-2 border-indigo-100/60 rounded-2xl shadow-xl shadow-indigo-200/30 p-8 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Star Button */}
          <div className="flex items-start justify-between">
            <div className="bg-indigo-100 text-[10px] text-indigo-600 rounded px-4 py-1 uppercase">
              {flashcard?.difficulty}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard?._id ?? flashcard?.id);
              }}
              className={`mt-2 ${baseStarClass} ${
                flashcard.isStarred ? starredFrontClass : unstarredFrontClass
              }`}
              aria-label={
                flashcard.isStarred ? "Unstar flashcard" : "Star flashcard"
              }
              aria-pressed={flashcard.isStarred}
            >
              <Star className="w-4 h-4" />
            </button>
          </div>

          {/* Question Content */}
          <div className="flex-1 flex items-center justify-center px-4 py-6">
            <p className="text-lg font-semibold text-slate-900 text-center leading-relaxed">
              {flashcard?.question}
            </p>
          </div>

          {/* Flip Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-indigo-400 font-medium">
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Click to reveal answer</span>
          </div>
        </div>

        {/* Back of the Card (Answer) */}

        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-indigo-400/60 rounded-2xl shadow-xl shadow-indigo-500/30 p-8 flex flex-col justify-between text-white"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Star Button */}
          <div className="flex items-start justify-between">
            <div className="bg-slate-100/10 text-[10px] text-slate-200 rounded px-4 py-1 uppercase">
              {flashcard?.difficulty}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard?._id ?? flashcard?.id);
              }}
              className={`${baseStarClass} ${
                flashcard.isStarred ? starredBackClass : unstarredBackClass
              }`}
              aria-label={
                flashcard.isStarred ? "Unstar flashcard" : "Star flashcard"
              }
              aria-pressed={flashcard.isStarred}
            >
              <Star className="w-4 h-4" />
            </button>
          </div>

          {/* Answer Content */}
          <div className="flex-1 flex items-center justify-center px-4 py-6">
            <p className="text-lg font-semibold text-white text-center leading-relaxed">
              {flashcard?.answer}
            </p>
          </div>

          {/* Flip Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-200 font-medium">
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Click to go back</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
