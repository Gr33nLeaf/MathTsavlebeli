"use client";
import { useState } from "react";
import 'katex/dist/katex.min.css'; // Import CSS for math
import Latex from 'react-latex-next'; // The Math component

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [pointsFilter, setPointsFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  
  // Chat State
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [userQuery, setUserQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. FETCH QUESTIONS FROM BACKEND
  async function fetchQuestions() {
    let url = "http://127.0.0.1:8000/get-questions/";
    
    // Add query params
    const params = new URLSearchParams();
    if (pointsFilter) params.append("points", pointsFilter);
    if (topicFilter) params.append("topic", topicFilter);
    
    const res = await fetch(`${url}?${params.toString()}`);
    const data = await res.json();
    setQuestions(data);
  }

  // 2. ASK THE AI TUTOR
  async function askTutor() {
    if (!selectedQuestion) return;
    setLoading(true);

    const payload = {
      user_query: userQuery,
      question_text: selectedQuestion.question_georgian + " " + selectedQuestion.latex,
      official_solution: "The answer is in the options." // Or fetch real solution if you have it
    };

    const res = await fetch("http://127.0.0.1:8000/explain-solution/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setAiResponse(data.reply);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <h1 className="text-3xl font-bold text-blue-800 mb-8">Mathწავლებელი 🎓</h1>

      {/* --- SEARCH BAR --- */}
      <div className="flex gap-4 mb-8">
        <input 
          type="number" 
          placeholder="ქულა (მაგ. 1)"
          className="p-2 border rounded text-black"
          onChange={(e) => setPointsFilter(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="თემა (მაგ. ალგებრა)"
          className="p-2 border rounded text-black"
          onChange={(e) => setTopicFilter(e.target.value)}
        />
        <button 
          onClick={fetchQuestions}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          იპოვე დავალებები
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* --- LEFT: QUESTIONS LIST --- */}
        <div className="space-y-4">
          {questions.map((q: any) => (
            <div key={q.id} className="bg-white p-6 rounded-lg shadow border hover:border-blue-300 text-black">
              <div className="flex justify-between mb-2">
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                  {q.points} Points
                </span>
                <span className="text-gray-500 text-sm">{q.topic}</span>
              </div>
              
              {/* RENDER MATH AND TEXT */}
              <div className="mb-4 text-gray-800">
                <p>{q.question_georgian}</p>
                <div className="mt-2 text-lg">
                  {/* Handle Latex rendering safely */}
                  {q.latex ? <Latex>{q.latex}</Latex> : null}
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedQuestion(q);
                  setAiResponse("");
                  setUserQuery("");
                }}
                className="text-blue-600 font-semibold text-sm hover:underline"
              >
                Ask AI Tutor Help →
              </button>
            </div>
          ))}
        </div>

        {/* --- RIGHT: AI CHAT WINDOW --- */}
        <div className="bg-white p-6 rounded-lg shadow border h-fit sticky top-10 text-black">
          <h2 className="text-xl font-bold mb-4">Mathბოტი 🤖</h2>
          
          {!selectedQuestion ? (
            <p className="text-gray-400">აირჩიეთ დავალება რომლის გარჩევაც გსურთ</p>
          ) : (
            <>
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm font-bold">არჩეული კითხვა:</p>
                <div className="mt-1">
                    {selectedQuestion.latex ? <Latex>{selectedQuestion.latex}</Latex> : selectedQuestion.question_georgian}
                </div>
              </div>

              <textarea
                className="w-full border p-2 rounded mb-2 h-24 text-black"
                placeholder="I don't understand the second step..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
              />
              
              <button 
                onClick={askTutor}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded disabled:bg-indigo-300"
              >
                {loading ? "Thinking..." : "Explain"}
              </button>

              {aiResponse && (
                <div className="mt-4 p-4 bg-indigo-50 rounded border border-indigo-100">
                  <h3 className="font-bold text-indigo-800 text-sm mb-2">Tutor:</h3>
                  {/* The AI responds in Markdown/Latex, so we render it */}
                  <div className="text-sm leading-relaxed">
                    <Latex>{aiResponse}</Latex>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}