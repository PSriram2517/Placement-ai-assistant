import React from 'react';
import { FiMenu, FiSettings } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

const Header = ({ title, onMenuClick, onOpenSettings }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-30 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onMenuClick}
          className="p-2 lg:hidden rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          <FiMenu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-semibold text-primary dark:text-indigo-400 text-xl tracking-tight">
            PlacementGPT
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block mt-0.5">
            AI-powered offline placement preparation
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Badges - Hidden on very small screens */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/10">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Ollama Connected</span>
          </div>
          
          <div className="px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-50 dark:bg-indigo-900/10">
            <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">Llama 3.2:3b</span>
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-700 pl-3 md:pl-4">
          <ThemeToggle />
          <button 
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            <FiSettings className="w-5 h-5 hover:rotate-45 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
