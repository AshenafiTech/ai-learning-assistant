import React from "react";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  centered = false,
  size = "lg",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className={`flex ${
          centered ? "items-center" : "items-start"
        } justify-center min-h-screen px-4 py-8 md:py-12`}
      >
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        <div
          className={`relative w-full ${
            size === "lg"
              ? "max-w-4xl"
              : size === "md"
              ? "max-w-lg"
              : "max-w-sm"
          } bg-white/95 backdrop-blur-xl border border-indigo-100/60 rounded-2xl shadow-2xl shadow-indigo-900/20 z-10 animate-in fade-in slide-in-from-bottom-4 duration-300 ${
            centered ? "" : "max-h-[calc(100vh-4rem)] flex flex-col"
          }`}
        >
          {/* Header - Fixed */}
          <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-indigo-100/60 shrink-0">
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight pr-4">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all duration-200 shrink-0"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className={`flex-1 overflow-y-auto px-8 py-6 ${
            centered ? "" : "min-h-0"
          }`}>
            <div className="custom-scrollbar">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
