import React from 'react';
import { FiBook, FiFileText } from 'react-icons/fi';

const SourceCard = ({ source }) => {
  return (
    <div className="inline-flex items-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg shadow-sm text-xs mr-2 mb-2">
      <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-md text-primary dark:text-indigo-400">
        <FiBook className="w-3.5 h-3.5" />
      </div>
      <div>
        <p className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]" title={source.file}>
          {source.file}
        </p>
        <div className="flex items-center space-x-1 text-slate-500">
          <span className="bg-slate-100 dark:bg-slate-700 px-1 rounded text-[10px]">{source.category}</span>
          <span>•</span>
          <span>Pg {source.page}</span>
        </div>
      </div>
    </div>
  );
};

export default SourceCard;
