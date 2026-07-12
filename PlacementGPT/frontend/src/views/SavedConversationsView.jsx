import React from 'react';
import { FiBookmark, FiMessageSquare, FiChevronRight, FiClock } from 'react-icons/fi';

const SavedConversationsView = ({ conversations, onSelectConversation }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <FiBookmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Saved Conversations</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">All your previous chat history.</p>
          </div>
        </div>

        {conversations.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
              <FiMessageSquare className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1">No Conversations Yet</h3>
            <p className="text-slate-500">Start a new chat to see your history here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className="flex flex-col text-left p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                    <FiMessageSquare className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Chat</span>
                  </div>
                  <FiChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </div>
                
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2 line-clamp-2">
                  {conv.title || 'New Conversation'}
                </h3>
                
                <div className="mt-auto flex items-center space-x-1.5 text-xs text-slate-400">
                  <FiClock className="w-3.5 h-3.5" />
                  <span>{new Date(conv.createdAt || Date.now()).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{conv.messages?.length || 0} messages</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedConversationsView;
