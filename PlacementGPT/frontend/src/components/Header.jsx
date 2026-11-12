import React from 'react';
import { FiMenu, FiSettings } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

const Header = ({ title, onMenuClick, onOpenSettings }) => {
  return (
    <header className="h-14 bg-[#f7f4ee] dark:bg-[#161513] border-b border-[#1f1b16]/8 dark:border-[#efe9de]/8 px-4 md:px-6 sticky top-0 z-30 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="p-2 lg:hidden rounded-lg text-[#5e554a] dark:text-[#aaa398] hover:bg-[#1f1b16]/5 dark:hover:bg-[#efe9de]/5 transition-colors"
          aria-label="Open menu"
        >
          <FiMenu className="w-4 h-4" />
        </button>
        <h1 className="font-medium text-[#1f1b16] dark:text-[#efe9de] text-sm truncate">
          {title || 'PlacementGPT'}
        </h1>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg text-[#5e554a] dark:text-[#aaa398] hover:bg-[#1f1b16]/5 dark:hover:bg-[#efe9de]/5 transition-colors"
          aria-label="Open settings"
          title="Settings"
        >
          <FiSettings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
