import React from 'react'
import { FileText, Plus } from 'lucide-react';

const EmptyState = ({onActionClick, title, description, buttonText}) => {
  return (
    <div className='flex flex-col items-center justify-center py-16 px-16 text-center bg-gradient-to-br from-indigo-50/50 to-white border-2 border-dashboard border-indigo-100 rounded-3xl'>
      <div className='inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-indigo-100 text-indigo-600'>
        <FileText className='w-8 h-8 text-indigo-500' strokeWidth={2} />
      </div>
      <h3 className='text-lg font-semibold text-slate-900 mb-2'>{title}</h3>
      <p className='text-sm text-indigo-600/70 mb-8 max-w-sm leading-relaxed'>{description}</p>
      {onActionClick && buttonText && (
        <button
          onClick={onActionClick}
          className="group relative inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-medium rounded-md shadow-lg shadow-indigo-500/30 transition"
        >
            <span className='relative '>
            <Plus className="w-4 h-4" strokeWidth={2} />
            {buttonText}
          </span>
          <div className='absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700' />
        </button>
      )}
    </div>
  )
}

export default EmptyState
