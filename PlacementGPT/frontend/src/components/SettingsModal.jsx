import React from 'react';
import { FiX, FiTrash2, FiInfo } from 'react-icons/fi';

const SettingsModal = ({ isOpen, onClose, onClearAllChats }) => {
  if (!isOpen) return null;

  const handleClearChats = () => {
    if (window.confirm("Are you sure you want to delete all conversations? This cannot be undone.")) {
      onClearAllChats();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Settings</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Data Management</h4>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Clear All Chats</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Permanently delete all your conversation history.</p>
              </div>
              <button 
                onClick={handleClearChats}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Clear all chats"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">About</h4>
            <div className="flex items-start space-x-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-800 dark:text-indigo-300">
              <FiInfo className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">PlacementGPT (Local)</p>
                <p className="opacity-80 leading-relaxed">
                  Your offline, secure AI assistant powered by Ollama and Llama3. 
                  Upload PDFs to enhance its knowledge base.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-750 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
