import React from "react";
import { Link } from "react-router-dom";
import { Play, BarChart2, Trash2, Award } from "lucide-react";
import moment from "moment";
import Button from "../common/Button";

const QuizCard = ({ quiz, onDelete }) => {
  return (
    <div className="group relative bg-white/90 backdrop-blur-md border-2 border-indigo-100/60 rounded-2xl shadow-xl shadow-indigo-200/30 p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(quiz?._id || quiz?.id);
        }}
        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 hover:bg-indigo-200 shadow-[0_4px_12px_rgba(99,102,241,0.3)] transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
      >
        <Trash2 className="w-4 h-4" strokeWidth={2} />
      </button>

      <div className="space-y-4">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium w-max">
          <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1">
            <Award className="w-3.5 h-3.5 text-indigo-600" strokeWidth={2} />
            <span className="text-indigo-700">Score: {quiz?.score ?? 0}</span>
          </div>
        </div>
        <div>
          <h3
            className="text-base font-semibold text-slate-900 mb-1 line-clamp-2"
            title={quiz?.title}
          >
            {quiz?.title ||
              `Quiz taken on ${moment(quiz?.createdAt).format("MMM D, YYYY")}`}
          </h3>
          <p className="text-xs font-medium text-indigo-600/70 uppercase tracking-wide">
            Created{" "}
            {quiz?.createdAt
              ? moment(quiz.createdAt).format("MMM D, YYYY")
              : "—"}
          </p>
        </div>

        {/* Quiz Info */}

        <div className="flex items-center gap-3 pt-2 border-t border-indigo-100">
          <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg">
            <span className="text-sm font-medium text-indigo-700">
              {quiz?.questions?.length ?? 0}{" "}
              {(quiz?.questions?.length ?? 0) === 1 ? "Question" : "Questions"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}

      <div className="mt-2 pt-4 border-t border-indigo-100">
        {quiz?.userAnswers?.length > 0 ? (
          <Link to={`/quizzes/${quiz._id}/results`}>
            <Button className="group/btn w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-medium rounded-md shadow-lg shadow-indigo-500/30 transition">
              <BarChart2 className="w-4 h-4" strokeWidth={2} />
              View Results
            </Button>
          </Link>
        ) : (
          <Link to={`/quizzes/${quiz._id}`}>
            <Button className="group/btn relative w-full h-11 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-medium rounded-md shadow-lg shadow-indigo-500/30 overflow-hidden transition">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Play className="w-4 h-4" strokeWidth={2} />
                Start Quiz
              </span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
