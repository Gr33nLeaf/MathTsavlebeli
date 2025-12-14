import React, { useState } from 'react';
import { exam2024_pages } from '../data/exam_2024_1';
import { ViewState } from '../types';

interface ExamReaderProps {
  setView: (view: ViewState) => void;
}

export const ExamReader: React.FC<ExamReaderProps> = ({ setView }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    if (currentPage < exam2024_pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col items-center py-8 px-4">
      {/* Toolbar */}
      <div className="fixed top-20 z-40 bg-gray-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center space-x-6">
        <button onClick={() => setView('archive')} className="hover:text-gray-300 flex items-center">
           <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          დახურვა
        </button>
        <div className="h-6 w-px bg-gray-600"></div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 0}
            className="disabled:opacity-30 hover:text-indigo-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-mono text-lg">
            {currentPage + 1} / {exam2024_pages.length}
          </span>
          <button 
            onClick={nextPage} 
            disabled={currentPage === exam2024_pages.length - 1}
            className="disabled:opacity-30 hover:text-indigo-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div className="bg-white w-full max-w-4xl min-h-[800px] shadow-2xl p-12 mt-16 rounded-sm relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-100 to-gray-200"></div>
        <div className="text-right text-gray-400 text-sm mb-8 font-mono">
           გვერდი {exam2024_pages[currentPage].page}
        </div>
        <div className="prose prose-lg max-w-none font-serif whitespace-pre-wrap leading-relaxed text-gray-800">
          {exam2024_pages[currentPage].content}
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-300 text-sm">
          mathწავლებელი PDF Reader
        </div>
      </div>
    </div>
  );
};