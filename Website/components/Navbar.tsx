import React, { useState } from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { id: ViewState; label: string }[] = [
    { id: 'home', label: 'მთავარი' },
    { id: 'archive', label: 'ტესტების არქივი' },
    { id: 'materials', label: 'მასალები' },
    { id: 'exam', label: 'გამოცდა' },
    { id: 'tutor', label: 'AI მასწავლებელი' },
  ];

  return (
    <nav className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
            <span className="font-bold text-xl tracking-tight flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              mathწავლებელი
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentView === item.id
                      ? 'bg-indigo-800 text-white border border-indigo-500'
                      : 'text-indigo-100 hover:bg-indigo-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="bg-indigo-800 inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-600 focus:outline-none"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-indigo-800">
             {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    currentView === item.id
                      ? 'bg-indigo-900 text-white'
                      : 'text-indigo-100 hover:bg-indigo-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
};