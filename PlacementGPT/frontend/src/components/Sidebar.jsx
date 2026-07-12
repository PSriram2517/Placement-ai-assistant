import React from 'react';
import { FiPlus, FiMessageSquare, FiTrash2, FiUpload, FiSettings, FiDatabase, FiBookmark, FiCode, FiMoon } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

const Sidebar = ({ 
  conversations, 
  activeId, 
  onSelect, 
  onNewChat, 
  onDelete,
  onOpenUpload,
  isMobileOpen,
  onCloseMobile,
  onOpenSettings,
  activeTab,
  onTabChange
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      
      {/* Sidebar container - Forced Dark Mode */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-[#0b1120] border-r border-slate-800
        flex flex-col transform transition-transform duration-300 ease-in-out text-slate-300
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header Logo */}
        <div className="p-5 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7v4" />
              <line x1="8" y1="16" x2="8" y2="16" />
              <line x1="16" y1="16" x2="16" y2="16" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight leading-tight">PlacementGPT</h1>
            <p className="text-[10px] text-slate-400 font-medium">Offline Placement Assistant</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 pb-4 space-y-3">
          <button 
            onClick={() => {
              onNewChat();
              onTabChange('chat');
            }}
            className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl font-medium transition-all duration-200 shadow-md active:scale-95"
          >
            <FiPlus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
          
          <button 
            onClick={() => {
              onOpenUpload();
              onTabChange('knowledge');
            }}
            className="w-full flex items-center justify-center space-x-2 bg-transparent hover:bg-slate-800 border border-slate-700 text-slate-300 p-2.5 rounded-xl font-medium transition-all duration-200 active:scale-95"
          >
            <FiUpload className="w-4 h-4" />
            <span>Upload PDF</span>
          </button>
        </div>

        {/* Main Navigation */}
        <div className="px-2 space-y-1">
          <button 
            onClick={() => {
              onTabChange('chat');
              if (window.innerWidth < 1024) onCloseMobile();
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
              activeTab === 'chat' 
                ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/20' 
                : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FiMessageSquare className="w-5 h-5" />
            <span>Chat</span>
          </button>
          <button 
            onClick={() => {
              onTabChange('knowledge');
              if (window.innerWidth < 1024) onCloseMobile();
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
              activeTab === 'knowledge' 
                ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/20' 
                : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FiDatabase className="w-5 h-5" />
            <span>Knowledge Base</span>
          </button>
          <button 
            onClick={() => {
              onTabChange('saved');
              if (window.innerWidth < 1024) onCloseMobile();
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
              activeTab === 'saved' 
                ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/20' 
                : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FiBookmark className="w-5 h-5" />
            <span>Saved Conversations</span>
          </button>
          <button 
            onClick={() => {
              onTabChange('topics');
              if (window.innerWidth < 1024) onCloseMobile();
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
              activeTab === 'topics' 
                ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/20' 
                : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FiCode className="w-5 h-5" />
            <span>Interview Topics</span>
          </button>
          <button 
            onClick={onOpenSettings}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-medium transition-colors"
          >
            <FiSettings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>

        {/* Recent Conversations */}
        <div className="flex-1 overflow-y-auto mt-6 px-4 custom-scrollbar">
          <h3 className="text-xs font-semibold text-slate-500 mb-3">Recent Conversations</h3>
          
          {conversations.length === 0 ? (
            <p className="text-sm text-slate-600 py-2">No recent chats</p>
          ) : (
            <div className="space-y-1">
              {conversations.map((conv) => (
                  <div 
                    key={conv.id}
                    className={`
                      group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200
                      ${activeId === conv.id 
                        ? 'bg-slate-800 text-slate-200' 
                        : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-300'
                      }
                    `}
                  onClick={() => {
                    onSelect(conv.id);
                    onCloseMobile();
                  }}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <FiMessageSquare className="w-4 h-4 flex-shrink-0 opacity-70" />
                    <span className="text-sm truncate">{conv.title || 'New Conversation'}</span>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-all rounded hover:bg-slate-700"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Settings */}
        <div className="p-4 space-y-4">
          <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-200">Llama 3.2 (Local)</span>
              </div>
              <p className="text-xs text-emerald-500/80 mt-0.5 ml-4">Running Locally</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center space-x-2 text-sm font-medium text-slate-400">
              <FiMoon className="w-4 h-4" />
              <span>Dark Mode</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
