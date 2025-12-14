import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

export const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: `მოგესალმებით! მე ვარ თქვენი პირადი AI მასწავლებელი, შექმნილი სპეციალურად აბიტურიენტებისთვის.

ჩემი მიზანია დაგეხმაროთ მათემატიკის ეროვნული გამოცდებისთვის მომზადებაში. თქვენ შეგიძლიათ:
• გამომიგზავნოთ ამოცანა, რომლის გაგებაც გიჭირთ;
• მომთხოვოთ თეორიული საკითხის (ალგებრა, გეომეტრია, ტრიგონომეტრია) ახსნა;
• გაიაროთ კონსულტაცია ნებისმიერ მათემატიკურ საკითხზე.

მზად ვარ გიპასუხოთ ნებისმიერ დროს, დაუზარელად და ამომწურავად.
აბა, რით შემიძლია დაგეხმაროთ დღეს?` 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userMsg.text);
      const botMsg: ChatMessage = { role: 'model', text: responseText };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = { role: 'model', text: 'სამწუხაროდ, კავშირი გაწყდა. გთხოვთ სცადოთ თავიდან.', isError: true };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col p-4">
      <div className="bg-white rounded-t-xl shadow-lg p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="text-2xl mr-2">🤖</span> AI რეპეტიტორი
        </h2>
        <p className="text-sm text-gray-500">დასვი კითხვები ამოცანების ან თეორიის შესახებ</p>
      </div>

      <div className="flex-1 bg-gray-50 overflow-y-auto p-4 space-y-4 shadow-inner border-x border-gray-200">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : msg.isError 
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-5 py-3 shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white p-4 rounded-b-xl shadow-lg border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="მაგ: ამიხსენი პითაგორას თეორემა..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            გაგზავნა
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};