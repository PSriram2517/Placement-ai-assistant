import React from 'react';
import { FiMessageSquare, FiChevronRight } from 'react-icons/fi';

const SavedConversationsView = ({ conversations, onSelectConversation }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
      <div className="max-w-3xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-normal text-[#1f1b16] dark:text-[#efe9de] tracking-[-0.02em] leading-tight">
            Saved conversations
          </h2>
          <p className="text-sm text-[#5e554a] dark:text-[#aaa398] mt-1.5">
            Previous chat sessions stored locally
          </p>
        </div>

        {conversations.length === 0 ? (
          <div className="bg-[#fdfbf7] dark:bg-[#1c1a18] border border-[#1f1b16]/8 dark:border-[#efe9de]/8 rounded-xl p-12 text-center flex flex-col items-center">
            <FiMessageSquare className="w-5 h-5 text-[#7b7266] dark:text-[#8a847a] mb-3" />
            <h3 className="text-sm font-medium text-[#1f1b16] dark:text-[#efe9de] mb-1">
              No conversations yet
            </h3>
            <p className="text-xs text-[#7b7266] dark:text-[#8a847a]">
              Start a new chat to see your history here
            </p>
          </div>
        ) : (
          <div className="bg-[#fdfbf7] dark:bg-[#1c1a18] border border-[#1f1b16]/8 dark:border-[#efe9de]/8 rounded-xl divide-y divide-[#1f1b16]/8 dark:divide-[#efe9de]/8">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className="w-full px-4 py-3.5 flex items-center justify-between gap-4 text-left hover:bg-[#efe9df]/60 dark:hover:bg-[#262421] transition-colors first:rounded-t-xl last:rounded-b-xl group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <FiMessageSquare className="w-4 h-4 text-[#7b7266] dark:text-[#8a847a] shrink-0" />
                  <span className="text-sm font-medium text-[#1f1b16] dark:text-[#efe9de] truncate">
                    {conv.title || 'New conversation'}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-[#7b7266] dark:text-[#8a847a] font-mono tabular-nums">
                    {new Date(conv.createdAt || Date.now()).toLocaleDateString()} · {conv.messages?.length || 0} msgs
                  </span>
                  <FiChevronRight className="w-4 h-4 text-[#7b7266] dark:text-[#8a847a] group-hover:text-[#b45309] dark:group-hover:text-[#d97706] transition-colors" />
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
