import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SourceCard from './SourceCard';
import { FiUser, FiCopy, FiThumbsUp, FiThumbsDown, FiRefreshCw, FiCheck, FiChevronRight } from 'react-icons/fi';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-8 animate-fade-in`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-4 mt-1 hidden sm:block">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-md">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7v4" />
              <line x1="8" y1="16" x2="8" y2="16" />
              <line x1="16" y1="16" x2="16" y2="16" />
            </svg>
          </div>
        </div>
      )}

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[75%]`}>
        <div 
          className={`p-5 shadow-sm transition-all duration-300 hover:shadow-md relative group
            ${isUser 
              ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm' 
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm'
            }
          `}
        >
          <div className={`prose dark:prose-invert prose-sm md:prose-base max-w-none ${isUser ? 'text-white' : ''}`}>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className={`text-xl font-bold mt-4 mb-2 ${isUser ? 'text-white' : ''}`} {...props} />,
                h2: ({node, ...props}) => <h2 className={`text-lg font-bold mt-4 mb-2 ${isUser ? 'text-white' : ''}`} {...props} />,
                h3: ({node, ...props}) => <h3 className={`text-md font-bold mt-3 mb-2 ${isUser ? 'text-white' : ''}`} {...props} />,
                p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1 font-semibold" {...props} />,
                li: ({node, ...props}) => <li className="" {...props} />,
                code: ({node, inline, className, children, ...props}) => {
                  return inline ? (
                    <code className="bg-slate-800/10 dark:bg-white/10 rounded px-1.5 py-0.5 font-mono text-sm" {...props}>
                      {children}
                    </code>
                  ) : (
                    <div className="overflow-hidden rounded-lg bg-slate-900 my-4 border border-slate-700">
                      <div className="flex items-center px-4 py-2 bg-slate-800 text-xs text-slate-400 border-b border-slate-700">
                        Code Snippet
                      </div>
                      <pre className="p-4 overflow-x-auto">
                        <code className="text-sm font-mono text-slate-50" {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  );
                },
                table: ({node, ...props}) => (
                  <div className="overflow-x-auto mb-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700" {...props} />
                  </div>
                ),
                th: ({node, ...props}) => <th className="px-4 py-3 bg-slate-50 dark:bg-slate-800 text-left text-xs font-medium uppercase tracking-wider text-slate-500" {...props} />,
                td: ({node, ...props}) => <td className="px-4 py-3 whitespace-nowrap text-sm border-t border-slate-200 dark:border-slate-700" {...props} />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
          
          {/* Render Source Cards */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Sources</p>
              <div className="flex flex-wrap gap-2">
                {message.sources.map((source, idx) => (
                  <SourceCard key={`${source.file}-${source.page}-${idx}`} source={source} />
                ))}
                {message.sources.length > 3 && (
                  <button className="text-xs font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center">
                    View all ({message.sources.length}) <FiChevronRight className="ml-1" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons for Assistant */}
          {!isUser && (
            <div className="flex items-center justify-end space-x-1 mt-3 pt-2 text-slate-400">
              <span className="text-[10px] mr-auto pl-1">10:30 AM</span>
              <button onClick={handleCopy} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors" title="Copy">
                {copied ? <FiCheck className="w-4 h-4 text-emerald-500" /> : <FiCopy className="w-4 h-4" />}
              </button>
              <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors" title="Helpful">
                <FiThumbsUp className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors" title="Not Helpful">
                <FiThumbsDown className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors" title="Regenerate">
                <FiRefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* User message timestamp and checkmark */}
          {isUser && (
            <div className="flex justify-end items-center mt-1 space-x-1 text-indigo-200">
              <span className="text-[10px]">10:30 AM</span>
              <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 ml-4 mt-1 hidden sm:block">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 shadow-sm border border-slate-300 dark:border-slate-600">
            <FiUser className="w-5 h-5" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
