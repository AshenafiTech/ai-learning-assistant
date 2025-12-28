import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from 'lucide-react';
import moment from 'moment';

// Helper function to truncate text
const formatFileSize = (bytes) => {
    if (bytes === undefined || bytes === null) return "N/A";

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < sizes.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)} ${sizes[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/documents/${document._id}`);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        if (onDelete) onDelete(document);
    };

    const flashcards = document.flashcardCount ?? document.flashcardSetCount ?? 0;
    const quizzes = document.quizCount ?? 0;

    return <div
                className='group relative bg-white/90 backdrop-blur-xl border border-indigo-100/60 rounded-2xl p-5 hover:border-indigo-200/60 hover:shadow-xl hover:shadow-indigo-200/30 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1'
                onClick={handleNavigate}
            >
            {/* Header Section */}
            <div>
                <div className='flex items-start justify-between gap-3 mb-4'>
                    <div className='shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600
                        rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 
                        group-hover:scale-110 transition-transform duration-300
                    '>
                        <FileText className='w-6 h-6 text-white' strokeWidth={2} />
                    </div>

                    <div className='flex items-center'>
                        <button
                            onClick={handleDeleteClick}
                            className='opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center text-indigo-400
                                hover:text-red-600 hover:bg-indigo-50 rounded-lg transition-all duration-200'
                            aria-label='Delete document'
                        >
                            <Trash2 className='w-4 h-4' strokeWidth={2.25} />
                        </button>
                    </div>
                </div>
                
                {/* Title */}
                <h3 className='text-base font-semibold text-slate-900 truncate mb-2' title={document.title}>
                    {document.title}
                </h3>

                {/* Document info  */}
                <div className=' flex items-center gap-3 text-xs text-indigo-600/70 mb-3'>
                    {document.fileSize !==undefined && (
                        <>
                            <span className='font-medium'>{formatFileSize(document.fileSize)}</span>
                        </>
                    )}
                </div>

                {/* Stats Section */}

                <div className='flex items-center gap-3 text-xs mb-4'>
                    <div className='flex items-center gap-1.5 px-2 py-1.5 bg-cyan-50 rounded-lg'>
                        <BookOpen className='w-3.5 h-3.5 text-cyan-600' strokeWidth={2} />
                        <span className='text-xs font-semibold text-cyan-700'>{flashcards} Flashcards</span>
                    </div>

                    <div className='flex items-center gap-1.5 px-2.5 py-1.5 bg-pink-50 rounded-lg'>
                        <BrainCircuit className='w-3.5 h-3.5 text-pink-600' strokeWidth={2} />
                        <span className='text-xs font-semibold text-pink-700'>{quizzes} Quizzes</span>
                    </div>
                </div>
                
            </div>

            {/* Footer Section */}

            <div className='mt-5 pt-4 border-t border-indigo-100'>
                <div className='flex items-center gap-1.5 text-xs text-indigo-600/70'>
                    <Clock className='w-3.5 h-3.5' strokeWidth={2} />
                    <span className=''>
                        Uploaded {moment(document.uploadedAt).fromNow()}
                    </span>
                </div>
            </div>

            {/* Hover Indicator */}

            <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none' />

        </div>
};

export default DocumentCard;