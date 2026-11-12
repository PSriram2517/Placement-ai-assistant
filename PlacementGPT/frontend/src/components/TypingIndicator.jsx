import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex w-full items-start justify-start mb-6 animate-fade-in">
      <div className="shrink-0 mr-3 mt-1 hidden sm:block">
        <div className="w-8 h-8 bg-[#f2ede4] dark:bg-[#262421] border border-[#1f1b16]/8 dark:border-[#efe9de]/8 rounded-lg flex items-center justify-center text-[#b45309] dark:text-[#d97706]">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            <path d="M8 7h6" />
            <path d="M8 11h4" />
          </svg>
        </div>
      </div>

      <div className="bg-[#fdfbf7] dark:bg-[#1c1a18] border border-[#1f1b16]/8 dark:border-[#efe9de]/8 px-4 py-2.5 rounded-xl inline-flex items-center gap-2.5">
        <div className="inline-flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#b45309] dark:bg-[#d97706] typing-dot" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#b45309] dark:bg-[#d97706] typing-dot" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#b45309] dark:bg-[#d97706] typing-dot" />
        </div>
        <span className="text-xs text-[#7b7266] dark:text-[#8a847a]">Thinking</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
