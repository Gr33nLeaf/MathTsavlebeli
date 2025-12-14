import React, { useState } from 'react';
import { ExamYear, ViewState } from '../types';

interface ArchiveProps {
  setView?: (view: ViewState) => void;
}

export const Archive: React.FC<ArchiveProps> = ({ setView }) => {
  // 2024-1 is handled specially via code logic
  const pdfLinks: Record<string, string> = {};

  const years: ExamYear[] = Array.from({ length: 20 }, (_, i) => {
    const year = 2024 - i;
    return {
      year,
      variants: [
        { 
          id: `${year}-1`, 
          name: "I ვარიანტი", 
          pdfUrl: year === 2024 ? 'internal-reader' : undefined 
        },
        { 
          id: `${year}-2`, 
          name: "II ვარიანტი",
          pdfUrl: pdfLinks[`${year}-2`]
        },
        { 
          id: `${year}-3`, 
          name: "III ვარიანტი",
          pdfUrl: pdfLinks[`${year}-3`]
        },
      ]
    };
  });

  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  const toggleYear = (year: number) => {
    if (expandedYear === year) {
      setExpandedYear(null);
    } else {
      setExpandedYear(year);
    }
  };

  const handlePdfClick = (e: React.MouseEvent, variantId: string, url?: string) => {
    e.preventDefault();
    if (variantId === '2024-1' && setView) {
      setView('reader');
    } else if (url && url !== 'internal-reader') {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">ეროვნული გამოცდების არქივი (2005-2024)</h2>
      <p className="text-center text-gray-600 mb-10">აქ შეგიძლიათ ნახოთ ყველა წლის ტესტი და მათი პასუხები.</p>

      <div className="space-y-4">
        {years.map((item) => (
          <div key={item.year} className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
            <button
              onClick={() => toggleYear(item.year)}
              className="w-full flex justify-between items-center px-6 py-4 bg-gray-50 hover:bg-indigo-50 transition-colors duration-150 focus:outline-none"
            >
              <span className="text-lg font-semibold text-gray-800">{item.year} წელი</span>
              <svg
                className={`w-6 h-6 text-indigo-600 transform transition-transform duration-200 ${expandedYear === item.year ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedYear === item.year && (
              <div className="px-6 py-4 bg-white border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {item.variants.map((variant) => (
                    <div key={variant.id} className="p-4 border rounded-md hover:shadow-md transition-shadow">
                      <h4 className="font-medium text-gray-900 mb-2">{variant.name}</h4>
                      <div className="flex flex-col space-y-2 text-sm">
                        <button 
                          onClick={(e) => handlePdfClick(e, variant.id, variant.pdfUrl)}
                          className={`flex items-center text-left transition-colors ${variant.pdfUrl ? 'text-indigo-600 hover:text-indigo-800 font-bold' : 'text-gray-400 cursor-not-allowed'}`}
                          disabled={!variant.pdfUrl}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          {variant.pdfUrl ? 'ტესტის ნახვა' : 'PDF არ არის'}
                        </button>
                        <a href="#" className="flex items-center text-green-600 hover:text-green-800">
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          სწორი პასუხები
                        </a>
                        <a href="#" className="flex items-center text-orange-600 hover:text-orange-800">
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          ვიდეო განხილვა
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};