import React from 'react';
import { FiChevronRight, FiGrid, FiCode, FiUser, FiFileText, FiDatabase, FiBox } from 'react-icons/fi';

const SUGGESTED_QUESTIONS = [
  { text: "How to prepare for TCS?", category: "Company Preparation", icon: <FiGrid /> },
  { text: "Explain binary search.", category: "Data Structures", icon: <FiCode /> },
  { text: "Difference between BFS and DFS.", category: "Algorithms", icon: <FiBox /> },
  { text: "Top React interview questions.", category: "React", icon: <FiCode /> },
  { text: "Tell me HR interview tips.", category: "HR", icon: <FiUser /> },
  { text: "How should I build my resume?", category: "Resume", icon: <FiFileText /> },
  { text: "Give SQL interview questions.", category: "SQL", icon: <FiDatabase /> },
  { text: "What is OOP?", category: "Programming", icon: <FiCode /> },
];

const RightSidebar = ({ onQuestionClick }) => {
  return (
    <div className="hidden xl:flex w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Suggested Questions</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {SUGGESTED_QUESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => onQuestionClick(q.text)}
            className="w-full flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all group text-left"
          >
            <div className="flex items-start space-x-3 overflow-hidden">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-lg shrink-0">
                {q.icon}
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                  {q.text}
                </p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                  {q.category}
                </p>
              </div>
            </div>
            <FiChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 shrink-0 ml-2" />
          </button>
        ))}
        
        <button className="w-full p-3 flex items-center justify-center space-x-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors">
          <FiGrid className="w-4 h-4" />
          <span>Explore more topics</span>
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;
