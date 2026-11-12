import React, { useState } from 'react';
import { FiPlus, FiMessageSquare, FiTrash2, FiUpload, FiDatabase, FiBookmark, FiCode, FiLogOut, FiUser } from 'react-icons/fi';

const NAV_ITEMS = [
  { id: 'chat', label: 'Chat', icon: FiMessageSquare },
  { id: 'knowledge', label: 'Knowledge base', icon: FiDatabase },
  { id: 'saved', label: 'Saved', icon: FiBookmark },
  { id: 'topics', label: 'Interview topics', icon: FiCode },
];

const Sidebar = ({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
  onOpenUpload,
  isMobileOpen,
  onCloseMobile,
  activeTab,
  onTabChange,
  isGenerating = false,
  ollamaConnected = true,
  user,
  onLogout,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-[#f2ede4] dark:bg-[#12110f]
          border-r border-[#1f1b16]/8 dark:border-[#efe9de]/8
          flex flex-col transform transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand */}
        <div className="h-14 px-4 flex items-center gap-2.5 shrink-0 border-b border-[#1f1b16]/8 dark:border-[#efe9de]/8">
          <div className="w-7 h-7 rounded-md bg-[#b45309] dark:bg-[#d97706] text-white dark:text-[#12110f] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              <path d="M8 7h6" />
              <path d="M8 11h4" />
            </svg>
          </div>
          <span className="text-[#1f1b16] dark:text-[#efe9de] font-medium text-base tracking-tight">
            PlacementGPT
          </span>
        </div>

        {/* Primary actions */}
        <div className="p-4 flex flex-col gap-2">
          <button
            onClick={() => { onNewChat(); onTabChange('chat'); }}
            className="w-full h-9 flex items-center justify-center gap-2 bg-[#b45309] hover:bg-[#92400e] text-white dark:bg-[#d97706] dark:hover:bg-[#f59e0b] dark:text-[#12110f] px-4 rounded-lg text-sm font-medium transition-colors active:scale-[0.98]"
          >
            <FiPlus className="w-4 h-4 shrink-0" />
            <span>New chat</span>
          </button>

          <button
            onClick={() => { onOpenUpload(); onTabChange('knowledge'); }}
            className="w-full h-9 flex items-center justify-center gap-2 bg-[#fdfbf7] dark:bg-[#1c1a18] border border-[#1f1b16]/10 dark:border-[#efe9de]/10 hover:bg-[#efe9df] dark:hover:bg-[#262421] text-[#5e554a] dark:text-[#aaa398] hover:text-[#1f1b16] dark:hover:text-[#efe9de] px-4 rounded-lg text-sm font-medium transition-colors"
          >
            <FiUpload className="w-4 h-4 shrink-0" />
            <span>Upload PDF</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  onTabChange(id);
                  if (window.innerWidth < 1024) onCloseMobile();
                }}
                className={`w-full h-9 flex items-center gap-3 px-3 rounded-lg text-sm font-medium transition-colors text-left
                  ${isActive
                    ? 'bg-[#e6dfd3] dark:bg-[#262421] text-[#1f1b16] dark:text-[#efe9de] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                    : 'text-[#5e554a] dark:text-[#8a847a] hover:text-[#1f1b16] dark:hover:text-[#efe9de] hover:bg-[#1f1b16]/5 dark:hover:bg-[#efe9de]/5'
                  }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#b45309] dark:text-[#d97706]' : ''}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Recent conversations */}
        <div className="flex-1 overflow-y-auto mt-6 px-3 custom-scrollbar">
          <p className="text-xs text-[#7b7266] dark:text-[#8a847a] mb-2 px-3">Recent</p>

          {conversations.length === 0 ? (
            <p className="text-xs text-[#7b7266] dark:text-[#8a847a] py-2 px-3">No recent chats</p>
          ) : (
            <div className="flex flex-col gap-0.5">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group h-8 flex items-center justify-between px-3 rounded-lg cursor-pointer transition-colors
                    ${activeId === conv.id && activeTab === 'chat'
                      ? 'bg-[#e6dfd3] dark:bg-[#262421] text-[#1f1b16] dark:text-[#efe9de]'
                      : 'text-[#5e554a] dark:text-[#8a847a] hover:bg-[#1f1b16]/5 dark:hover:bg-[#efe9de]/5 hover:text-[#1f1b16] dark:hover:text-[#efe9de]'
                    }`}
                  onClick={() => { onSelect(conv.id); onCloseMobile(); }}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <FiMessageSquare className="w-4 h-4 shrink-0 opacity-60" />
                    <span className="text-sm truncate">{conv.title || 'New conversation'}</span>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#7b7266] hover:text-[#dc2626] dark:text-[#8a847a] dark:hover:text-[#e5484d] transition-colors rounded"
                    aria-label="Delete conversation"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer: account + local-model status */}
        <div className="border-t border-[#1f1b16]/8 dark:border-[#efe9de]/8 px-3 py-3 flex flex-col gap-2">
          {user && (
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2.5 min-w-0">
                {user.photoURL && !imgError ? (
                  <img
                    src={user.photoURL}
                    alt={user.name || 'Profile'}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-8 h-8 rounded-lg object-cover shrink-0 border border-[#1f1b16]/10 dark:border-[#efe9de]/10"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-[#e6dfd3] dark:bg-[#262421] border border-[#1f1b16]/10 dark:border-[#efe9de]/10 flex items-center justify-center text-xs font-medium text-[#5e554a] dark:text-[#aaa398] shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : <FiUser className="w-4 h-4" />}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#1f1b16] dark:text-[#efe9de] truncate">
                    {user.name}
                  </p>
                  {user.email && (
                    <p className="text-[11px] text-[#7b7266] dark:text-[#8a847a] truncate">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg text-[#5e554a] dark:text-[#8a847a] hover:text-[#dc2626] dark:hover:text-[#e5484d] hover:bg-[#1f1b16]/5 dark:hover:bg-[#efe9de]/5 transition-colors shrink-0"
                  aria-label="Log out"
                  title="Log out"
                >
                  <FiLogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 px-1">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                ollamaConnected ? 'bg-[#16a34a] dark:bg-[#4cc38a]' : 'bg-[#7b7266] dark:bg-[#8a847a]'
              } ${isGenerating ? 'animate-live' : ''}`}
            />
            <span className="text-xs font-mono text-[#5e554a] dark:text-[#8a847a] truncate">
              {ollamaConnected ? 'llama3.2:3b · local' : 'Ollama offline'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
