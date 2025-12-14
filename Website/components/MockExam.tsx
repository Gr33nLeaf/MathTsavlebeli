import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';

type Difficulty = 'easy' | 'medium' | 'hard';

// Placeholder generator to simulate 41 questions (37 MC + 4 Open)
const generateMockQuestions = (difficulty: Difficulty): QuizQuestion[] => {
  const baseQuestions: QuizQuestion[] = [
    { id: 1, question: "რას უდრის კვადრატის ფართობი, თუ მისი პერიმეტრია 20 სმ?", options: ["16 სმ²", "20 სმ²", "25 სმ²", "36 სმ²"], correctIndex: 2, type: 'multiple_choice' },
    { id: 2, question: "იპოვეთ x, თუ 3x - 5 = 10", options: ["3", "5", "4", "2.5"], correctIndex: 1, type: 'multiple_choice' },
    { id: 3, question: "რამდენია 100-ის 15%?", options: ["10", "15", "20", "25"], correctIndex: 1, type: 'multiple_choice' },
    { id: 4, question: "მართკუთხა სამკუთხედის ერთი კუთხე 30 გრადუსია. რას უდრის მეორე მახვილი კუთხე?", options: ["30", "45", "60", "90"], correctIndex: 2, type: 'multiple_choice' },
    { id: 5, question: "ფუნქცია y = x² განსაზღვრულია ნამდვილ რიცხვთა სიმრავლეზე. იპოვეთ ფუნქციის მნიშვნელობა x = -3 წერტილში.", options: ["-9", "6", "-6", "9"], correctIndex: 3, type: 'multiple_choice' },
  ];

  // Logic to expand to 37 questions
  const expandedMC: QuizQuestion[] = [];
  for (let i = 0; i < 37; i++) {
    const baseQ = baseQuestions[i % baseQuestions.length];
    expandedMC.push({
      ...baseQ,
      id: i + 1,
      question: `${baseQ.question} (ვარიანტი ${i + 1} - ${difficulty})` // Unique-ish
    });
  }

  const openQuestions: QuizQuestion[] = [
    { id: 38, question: "ამოხსენით განტოლება: log₂(x) = 3", options: [], type: 'open', correctAnswerText: "x = 8" },
    { id: 39, question: "იპოვეთ სამკუთხედის ფართობი, თუ გვერდებია 3, 4, 5", options: [], type: 'open', correctAnswerText: "S = 6" },
    { id: 40, question: "იპოვეთ არითმეტიკული პროგრესიის მეათე წევრი: 2, 5, 8...", options: [], type: 'open', correctAnswerText: "a₁₀ = 29" },
    { id: 41, question: "გამოთვალეთ: sin²30° + cos²30°", options: [], type: 'open', correctAnswerText: "1" },
  ];

  return [...expandedMC, ...openQuestions];
};

export const MockExam: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60);
  // Store selected option index for MC, and boolean for "revealed"
  const [answers, setAnswers] = useState<number[]>([]); 
  // Store boolean if the user has clicked/locked in an answer for a specific question to show feedback
  const [feedbackRevealed, setFeedbackRevealed] = useState<boolean[]>([]);
  
  const [score, setScore] = useState(0);

  const startExam = (diff: Difficulty) => {
    const q = generateMockQuestions(diff);
    setQuestions(q);
    setAnswers(new Array(q.length).fill(-1));
    setFeedbackRevealed(new Array(q.length).fill(false));
    setDifficulty(diff);
    setStarted(true);
    setFinished(false);
    setTimeLeft(3 * 60 * 60);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    let timer: any;
    if (started && !finished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && started && !finished) {
      finishExam();
    }
    return () => clearInterval(timer);
  }, [started, finished, timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectMC = (qIndex: number, optionIndex: number) => {
    // If already answered/revealed, do nothing
    if (feedbackRevealed[qIndex]) return;

    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);

    const newFeedback = [...feedbackRevealed];
    newFeedback[qIndex] = true;
    setFeedbackRevealed(newFeedback);
  };

  // For open questions, we just mark as "revealed" to show the correct answer text
  const handleShowOpenAnswer = (qIndex: number) => {
     if (feedbackRevealed[qIndex]) return;
     const newFeedback = [...feedbackRevealed];
     newFeedback[qIndex] = true;
     setFeedbackRevealed(newFeedback);
  };

  const finishExam = () => {
    let newScore = 0;
    questions.forEach((q, idx) => {
      if (q.type === 'multiple_choice') {
        if (answers[idx] === q.correctIndex) {
          newScore += 1;
        }
      }
      // For open questions in this mock engine, we aren't auto-grading, 
      // but usually, you'd calculate score here. 
      // For now, score is based on MC only.
    });
    setScore(newScore);
    setFinished(true);
    window.scrollTo(0, 0);
  };

  const resetExam = () => {
    setStarted(false);
    setFinished(false);
    setDifficulty(null);
  };

  // Intro Screen
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-indigo-600">
          <div className="text-6xl mb-6">📝</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">იმიტირებული საგამოცდო სივრცე ონლაინ</h2>
          <p className="text-gray-600 mb-8 text-lg">
            გაიარე სრული იმიტირებული გამოცდა. ტესტი შედგება 37 არჩევითი და 4 ღია კითხვისგან.
          </p>
          
          <h3 className="text-xl font-bold text-gray-700 mb-4">აირჩიეთ სირთულე:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <button 
              onClick={() => startExam('easy')}
              className="bg-green-100 hover:bg-green-200 text-green-800 py-4 px-6 rounded-xl font-bold transition-colors border-2 border-green-200 hover:border-green-300"
            >
              მარტივი
            </button>
            <button 
              onClick={() => startExam('medium')}
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 py-4 px-6 rounded-xl font-bold transition-colors border-2 border-yellow-200 hover:border-yellow-300"
            >
              საშუალო
            </button>
            <button 
              onClick={() => startExam('hard')}
              className="bg-red-100 hover:bg-red-200 text-red-800 py-4 px-6 rounded-xl font-bold transition-colors border-2 border-red-200 hover:border-red-300"
            >
              რთული
            </button>
          </div>

          <div className="text-left bg-gray-50 p-6 rounded-lg">
             <h4 className="font-bold text-gray-700 mb-2">წესები:</h4>
             <ul className="list-disc list-inside text-gray-600 space-y-1">
               <li>დრო: 3 საათი</li>
               <li>სულ 41 საკითხი</li>
               <li>არჩევით პასუხზე დაჭერისას ეგრევე გაიგებთ სწორია თუ არა (მწვანე/წითელი)</li>
             </ul>
          </div>
        </div>
      </div>
    );
  }

  // Result Screen
  if (finished) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">გამოცდა დასრულებულია</h2>
          <div className="text-5xl font-black text-indigo-600 mb-6">
            {score} / 37
            <span className="text-lg text-gray-400 block mt-2 font-normal">(ტესტური ნაწილი)</span>
          </div>
          <p className="text-gray-600 mb-8">
             ღია კითხვების პასუხები შეამოწმეთ დამოუკიდებლად.
          </p>
          <button
            onClick={resetExam}
            className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
          >
            მთავარზე დაბრუნება
          </button>
        </div>
      </div>
    );
  }

  // Active Exam Screen
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6 sticky top-20 z-40 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-700 mb-2 sm:mb-0">
          ვარიანტი: <span className="uppercase text-indigo-600">{difficulty}</span>
        </h2>
        <div className={`text-xl font-mono font-bold px-4 py-1 rounded ${timeLeft < 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-indigo-50 text-indigo-700'}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      <div className="space-y-8">
        {questions.map((q, idx) => {
          const isRevealed = feedbackRevealed[idx];
          
          if (q.type === 'multiple_choice') {
            return (
              <div key={q.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex">
                  <span className="text-gray-400 font-bold mr-3">{idx + 1}.</span>
                  {q.question}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
                  {q.options.map((opt, optIdx) => {
                    let btnClass = "border-gray-200 hover:bg-gray-50";
                    // Feedback Logic
                    if (isRevealed) {
                        if (optIdx === q.correctIndex) {
                            btnClass = "bg-green-100 border-green-500 text-green-800"; // Correct Answer
                        } else if (answers[idx] === optIdx) {
                            btnClass = "bg-red-100 border-red-500 text-red-800"; // Wrong User Selection
                        } else {
                            btnClass = "border-gray-100 opacity-50"; // Other irrelevent options
                        }
                    } else if (answers[idx] === optIdx) {
                        btnClass = "bg-indigo-50 border-indigo-500"; // Selected but not revealed (shouldn't happen with immediate logic, but safe fallback)
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectMC(idx, optIdx)}
                        disabled={isRevealed}
                        className={`text-left p-4 rounded-lg border-2 transition-all font-medium ${btnClass}`}
                      >
                        <span className="mr-2 font-bold text-sm text-gray-500 uppercase">{String.fromCharCode(97 + optIdx)})</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {isRevealed && (
                    <div className={`mt-4 ml-8 p-3 rounded text-sm font-bold ${answers[idx] === q.correctIndex ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                        {answers[idx] === q.correctIndex ? "სწორია! 🎉" : "არასწორია ❌"}
                    </div>
                )}
              </div>
            );
          } else {
             // Open Question
             return (
              <div key={q.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-indigo-500">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex">
                  <span className="text-indigo-500 font-bold mr-3">{idx + 1}.</span>
                  {q.question} <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded self-center">ღია დავალება</span>
                </h3>
                <div className="pl-8">
                    {!isRevealed ? (
                        <button 
                            onClick={() => handleShowOpenAnswer(idx)}
                            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm underline"
                        >
                            პასუხის ნახვა
                        </button>
                    ) : (
                        <div className="bg-indigo-50 p-4 rounded text-gray-800">
                            <span className="font-bold block mb-1">სწორი პასუხი:</span>
                            {q.correctAnswerText}
                        </div>
                    )}
                </div>
              </div>
             );
          }
        })}
      </div>

      <div className="mt-12 text-center pb-12">
        <button
          onClick={finishExam}
          className="bg-gray-800 text-white text-lg font-bold px-12 py-4 rounded-full shadow-lg hover:bg-gray-900 transition-all transform hover:-translate-y-1"
        >
          შედეგის ნახვა
        </button>
      </div>
    </div>
  );
};
