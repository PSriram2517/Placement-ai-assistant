import React from 'react';
import { FiChevronRight, FiGrid, FiCode, FiUser, FiFileText, FiDatabase, FiBox } from 'react-icons/fi';

const SUGGESTED_QUESTIONS = [
  { text: 'How to prepare for TCS?', category: 'Company prep', icon: FiGrid },
  { text: 'Explain binary search', category: 'Data structures', icon: FiCode },
  { text: 'Difference between BFS and DFS', category: 'Algorithms', icon: FiBox },
  { text: 'Top React interview questions', category: 'React', icon: FiCode },
  { text: 'Share HR interview tips', category: 'HR', icon: FiUser },
  { text: 'How should I structure my resume?', category: 'Resume', icon: FiFileText },
  { text: 'Common SQL interview questions', category: 'SQL', icon: FiDatabase },
  { text: 'What is OOP?', category: 'Programming', icon: FiCode },
];

const RightSidebar = ({ onQuestionClick, onExploreTopics }) => {
  return (
    <aside className="hidden xl:flex w-72 bg-[#f2ede4] dark:bg-[#12110f] border-l border-[#1f1b16]/8 dark:border-[#efe9de]/8 flex-col h-full overflow-hidden shrink-0">
      <div className="h-14 px-4 border-b border-[#1f1b16]/8 dark:border-[#efe9de]/8 flex items-center shrink-0">
        <h2 className="text-sm font-medium text-[#1f1b16] dark:text-[#efe9de]">Suggested prompts</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1 custom-scrollbar">
        {SUGGESTED_QUESTIONS.map((q, i) => {
          const Icon = q.icon;
          return (
            <button
              key={i}
              onClick={() => onQuestionClick(q.text)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#1f1b16]/5 dark:hover:bg-[#efe9de]/5 transition-colors group text-left"
            >
              <div className="flex items-start gap-3 overflow-hidden">
                <Icon className="w-4 h-4 shrink-0 text-[#7b7266] dark:text-[#8a847a] mt-0.5" />
                <div className="overflow-hidden">
                  <p className="text-sm text-[#1f1b16] dark:text-[#efe9de] truncate leading-snug">
                    {q.text}
                  </p>
                  <p className="text-xs text-[#7b7266] dark:text-[#8a847a] mt-0.5">{q.category}</p>
                </div>
              </div>
              <FiChevronRight className="w-4 h-4 text-[#7b7266] dark:text-[#8a847a] opacity-50 group-hover:opacity-100 shrink-0 ml-2 transition-opacity" />
            </button>
          );
        })}

        <button
          onClick={onExploreTopics}
          className="w-full h-9 px-3 mt-2 flex items-center justify-center gap-2 text-xs font-medium text-[#b45309] dark:text-[#d97706] hover:bg-[#1f1b16]/5 dark:hover:bg-[#efe9de]/5 rounded-lg transition-colors"
        >
          <FiGrid className="w-4 h-4" />
          <span>Explore all topics</span>
        </button>
      </div>
    </aside>
  );
};

export default RightSidebar;
