import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Archive } from './components/Archive';
import { Materials } from './components/Materials';
import { AITutor } from './components/AITutor';
import { MockExam } from './components/MockExam';
import { ExamReader } from './components/ExamReader';
import { ViewState } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home setView={setCurrentView} />;
      case 'archive':
        return <Archive setView={setCurrentView} />;
      case 'materials':
        return <Materials />;
      case 'tutor':
        return <AITutor />;
      case 'exam':
        return <MockExam />;
      case 'reader':
        return <ExamReader setView={setCurrentView} />;
      default:
        return <Home setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {currentView !== 'reader' && <Navbar currentView={currentView} setView={setCurrentView} />}
      <main className="flex-grow">
        {renderView()}
      </main>
      {currentView !== 'reader' && (
        <footer className="bg-gray-800 text-gray-400 py-6 text-center">
          <p>© 2024 mathწავლებელი - შექმნილია აბიტურიენტებისთვის სიყვარულით.</p>
        </footer>
      )}
    </div>
  );
}

export default App;