import React from 'react';
import { FiBookOpen } from 'react-icons/fi';

const SourceCard = ({ source }) => {
  return (
    <div className="inline-flex items-center gap-2.5 bg-[#f2ede4] dark:bg-[#262421] border border-[#1f1b16]/8 dark:border-[#efe9de]/8 px-3 py-2 rounded-lg text-xs">
      <FiBookOpen className="w-4 h-4 text-[#b45309] dark:text-[#d97706] shrink-0" />
      <div className="min-w-0">
        <p className="font-medium text-[#1f1b16] dark:text-[#efe9de] truncate max-w-[180px]" title={source.file}>
          {source.file}
        </p>
        <div className="flex items-center gap-1.5 text-[#5e554a] dark:text-[#8a847a] mt-0.5 font-mono tabular-nums">
          <span>{source.category}</span>
          <span>·</span>
          <span className="text-[#b45309] dark:text-[#d97706]">p.{source.page}</span>
        </div>
      </div>
    </div>
  );
};

export default SourceCard;
