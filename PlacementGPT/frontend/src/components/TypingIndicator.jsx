import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex w-full items-start justify-start animate-pulse mb-6">
      <div className="bg-slate-200 dark:bg-slate-700 p-4 rounded-2xl rounded-tl-sm inline-flex items-center space-x-1.5 h-[44px]">
        <div className="w-2 h-2 rounded-full bg-slate-500 dark:bg-slate-400 typing-dot"></div>
        <div className="w-2 h-2 rounded-full bg-slate-500 dark:bg-slate-400 typing-dot" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 rounded-full bg-slate-500 dark:bg-slate-400 typing-dot" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
