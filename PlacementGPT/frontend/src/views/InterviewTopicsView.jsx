import React from 'react';
import { FiCode, FiGrid, FiUser, FiFileText, FiDatabase, FiBox, FiChevronRight } from 'react-icons/fi';

const ALL_TOPICS = [
  { text: "How to prepare for TCS?", category: "Company Preparation", icon: <FiGrid /> },
  { text: "Explain binary search.", category: "Data Structures", icon: <FiCode /> },
  { text: "Difference between BFS and DFS.", category: "Algorithms", icon: <FiBox /> },
  { text: "Top React interview questions.", category: "React", icon: <FiCode /> },
  { text: "Tell me HR interview tips.", category: "HR", icon: <FiUser /> },
  { text: "How should I build my resume?", category: "Resume", icon: <FiFileText /> },
  { text: "Give SQL interview questions.", category: "SQL", icon: <FiDatabase /> },
  { text: "What is OOP?", category: "Programming", icon: <FiCode /> },
  { text: "Explain RESTful APIs.", category: "Web Development", icon: <FiCode /> },
  { text: "How to negotiate salary?", category: "HR", icon: <FiUser /> },
];

const InterviewTopicsView = ({ onSelectTopic }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <FiCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Interview Topics</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Explore common interview questions and topics.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_TOPICS.map((topic, i) => (
            <button
              key={i}
              onClick={() => onSelectTopic(topic.text)}
              className="flex flex-col text-left p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all group h-full"
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-lg shrink-0">
                  {topic.icon}
                </div>
                <FiChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>
              
              <h3 className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mb-1">
                {topic.text}
              </h3>
              
              <div className="mt-auto pt-2">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  {topic.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewTopicsView;
