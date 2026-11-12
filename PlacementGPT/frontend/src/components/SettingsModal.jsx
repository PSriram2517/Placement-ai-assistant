import React from 'react';
import { FiX, FiTrash2, FiInfo } from 'react-icons/fi';

const SettingsModal = ({ isOpen, onClose, onClearAllChats }) => {
  if (!isOpen) return null;

  const handleClearChats = () => {
    if (window.confirm('Delete all conversations? This cannot be undone.')) {
      onClearAllChats();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="bg-[#fdfbf7] dark:bg-[#1c1a18] border border-[#1f1b16]/10 dark:border-[#efe9de]/10 rounded-xl w-full max-w-md overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <div className="flex justify-between items-center px-5 py-4 border-b border-[#1f1b16]/8 dark:border-[#efe9de]/8">
          <h3 className="text-base font-medium text-[#1f1b16] dark:text-[#efe9de]">Settings</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7b7266] dark:text-[#8a847a] hover:text-[#1f1b16] dark:hover:text-[#efe9de] hover:bg-[#1f1b16]/5 dark:hover:bg-[#efe9de]/5 transition-colors"
            aria-label="Close settings"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          <div>
            <h4 className="text-xs font-medium text-[#7b7266] dark:text-[#8a847a] mb-2">Data management</h4>
            <div className="flex items-center justify-between p-3.5 bg-[#f2ede4] dark:bg-[#262421] border border-[#1f1b16]/8 dark:border-[#efe9de]/8 rounded-lg">
              <div>
                <p className="text-sm font-medium text-[#1f1b16] dark:text-[#efe9de]">Clear all chats</p>
                <p className="text-xs text-[#5e554a] dark:text-[#aaa398] mt-0.5">Permanently delete local conversation history</p>
              </div>
              <button
                onClick={handleClearChats}
                className="p-2 text-[#dc2626] dark:text-[#e5484d] hover:bg-[#dc2626]/10 dark:hover:bg-[#e5484d]/15 rounded-lg transition-colors"
                title="Clear all chats"
                aria-label="Clear all chats"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-[#7b7266] dark:text-[#8a847a] mb-2">About</h4>
            <div className="flex items-start gap-3 p-3.5 bg-[#f2ede4] dark:bg-[#262421] border border-[#1f1b16]/8 dark:border-[#efe9de]/8 rounded-lg">
              <FiInfo className="w-4 h-4 shrink-0 mt-0.5 text-[#b45309] dark:text-[#d97706]" />
              <div className="text-xs leading-relaxed">
                <p className="font-medium text-sm text-[#1f1b16] dark:text-[#efe9de] mb-1">PlacementGPT (local)</p>
                <p className="text-[#5e554a] dark:text-[#aaa398]">
                  Offline placement preparation workspace running on Ollama and Llama 3.2. Upload PDFs to expand the local knowledge base.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-3.5 bg-[#f2ede4] dark:bg-[#12110f] border-t border-[#1f1b16]/8 dark:border-[#efe9de]/8 flex justify-end">
          <button
            onClick={onClose}
            className="h-9 px-4 text-sm font-medium text-white bg-[#b45309] hover:bg-[#92400e] dark:bg-[#d97706] dark:hover:bg-[#f59e0b] dark:text-[#12110f] rounded-lg transition-colors active:scale-[0.98]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
