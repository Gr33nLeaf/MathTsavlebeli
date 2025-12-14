import React from 'react';
import { ViewState } from '../types';

interface HomeProps {
  setView: (view: ViewState) => void;
}

export const Home: React.FC<HomeProps> = ({ setView }) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-700 to-purple-800 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              მოემზადე ეროვნული გამოცდებისთვის
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 font-light">
              ყველა რესურსი ერთ სივრცეში: ტესტები, ამოხსნები, თეორია და პირადი AI ასისტენტი.
            </p>
            <button 
              onClick={() => setView('archive')}
              className="bg-yellow-400 text-indigo-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition shadow-lg transform hover:-translate-y-1"
            >
              დავიწყოთ მეცადინეობა
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
             <div className="text-9xl animate-pulse">📚</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            onClick={() => setView('archive')}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow group"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              📂
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">ტესტების არქივი</h3>
            <p className="text-gray-600">2005-2024 წლების ყველა ვარიანტი, პასუხებით და ამოხსნებით.</p>
          </div>

          <div 
             onClick={() => setView('tutor')}
             className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow group"
          >
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              🤖
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">AI მასწავლებელი</h3>
            <p className="text-gray-600">ვერ გაიგე ამოცანა? ჰკითხე ჩვენს AI-ს და მიიღე ამომწურავი პასუხი.</p>
          </div>

          <div 
             onClick={() => setView('exam')}
             className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow group"
          >
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              ⏱
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">საგამოცდო სივრცე</h3>
            <p className="text-gray-600">გაიარე სიმულაცია ონლაინ, დააკვირდი დროს და შეამოწმე შენი ძალები.</p>
          </div>
        </div>
      </div>
    </div>
  );
};