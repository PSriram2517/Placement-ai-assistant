import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

const TOPIC_GROUPS = [
  {
    category: 'Data structures & algorithms',
    items: [
      'Explain binary search',
      'Difference between BFS and DFS',
      'What is OOP?',
    ],
  },
  {
    category: 'Web & databases',
    items: [
      'Top React interview questions',
      'Common SQL interview questions',
      'Explain RESTful APIs',
    ],
  },
  {
    category: 'Company prep & HR',
    items: [
      'How to prepare for TCS?',
      'How should I build my resume?',
      'Share HR interview tips',
      'How to negotiate salary?',
    ],
  },
];

const InterviewTopicsView = ({ onSelectTopic }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
      <div className="max-w-3xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-normal text-[#1f1b16] dark:text-[#efe9de] tracking-[-0.02em] leading-tight">
            Interview topics
          </h2>
          <p className="text-sm text-[#5e554a] dark:text-[#aaa398] mt-1.5">
            Common placement questions grouped by subject
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {TOPIC_GROUPS.map((group) => (
            <section key={group.category}>
              <h3 className="text-xs font-medium text-[#7b7266] dark:text-[#8a847a] mb-2 px-1">
                {group.category}
              </h3>
              <div className="bg-[#fdfbf7] dark:bg-[#1c1a18] border border-[#1f1b16]/8 dark:border-[#efe9de]/8 rounded-xl divide-y divide-[#1f1b16]/8 dark:divide-[#efe9de]/8">
                {group.items.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => onSelectTopic(topic)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#efe9df]/60 dark:hover:bg-[#262421] transition-colors first:rounded-t-xl last:rounded-b-xl group"
                  >
                    <span className="text-sm text-[#1f1b16] dark:text-[#efe9de]">
                      {topic}
                    </span>
                    <FiChevronRight className="w-4 h-4 text-[#7b7266] dark:text-[#8a847a] group-hover:text-[#b45309] dark:group-hover:text-[#d97706] transition-colors shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewTopicsView;
