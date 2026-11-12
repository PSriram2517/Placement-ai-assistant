import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SourceCard from './SourceCard';
import { FiCopy, FiCheck } from 'react-icons/fi';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = React.useState(false);

  const formattedTime = React.useMemo(() => {
    const date = message.timestamp ? new Date(message.timestamp) : new Date();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [message.timestamp]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex w-full justify-end mb-5 animate-fade-in">
        <div className="flex flex-col items-end max-w-[85%] md:max-w-[72%]">
          <div className="px-4 py-2.5 rounded-xl bg-[#efe9df] dark:bg-[#262421] text-[#1f1b16] dark:text-[#efe9de] border border-[#1f1b16]/8 dark:border-[#efe9de]/8 text-sm leading-relaxed">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          <span className="text-[11px] text-[#7b7266] dark:text-[#8a847a] font-mono tabular-nums mt-1 px-1">
            {formattedTime}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-start mb-6 animate-fade-in">
      <div className="shrink-0 mr-3 mt-1 hidden sm:block">
        <div className="w-8 h-8 bg-[#f2ede4] dark:bg-[#262421] border border-[#1f1b16]/8 dark:border-[#efe9de]/8 rounded-lg flex items-center justify-center text-[#b45309] dark:text-[#d97706]">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            <path d="M8 7h6" />
            <path d="M8 11h4" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col items-start max-w-[85%] md:max-w-[76%]">
        <div className="px-4 py-3 rounded-xl bg-[#fdfbf7] dark:bg-[#1c1a18] text-[#1f1b16] dark:text-[#efe9de] border border-[#1f1b16]/8 dark:border-[#efe9de]/8">
          <div className="prose dark:prose-invert prose-sm md:prose-base max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-lg font-medium mt-4 mb-2 text-[#1f1b16] dark:text-[#efe9de]" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-base font-medium mt-4 mb-2 text-[#1f1b16] dark:text-[#efe9de]" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-sm font-medium mt-3 mb-1.5 text-[#1f1b16] dark:text-[#efe9de]" {...props} />,
                p: ({ node, ...props }) => <p className="mb-3 last:mb-0 leading-relaxed text-[#1f1b16] dark:text-[#efe9de]" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                code: ({ node, inline, className, children, ...props }) => {
                  return inline ? (
                    <code className="bg-[#efe9df] dark:bg-[#262421] rounded px-1.5 py-0.5 font-mono text-xs text-[#1f1b16] dark:text-[#efe9de]" {...props}>
                      {children}
                    </code>
                  ) : (
                    <div className="overflow-hidden rounded-lg bg-[#161513] my-3 border border-[#1f1b16]/12 dark:border-[#efe9de]/10">
                      <div className="flex items-center px-4 py-1.5 bg-[#1c1a18] text-xs text-[#8a847a] border-b border-[#efe9de]/8 font-mono">
                        code
                      </div>
                      <pre className="p-4 overflow-x-auto">
                        <code className="text-sm font-mono text-[#efe9de]" {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  );
                },
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto mb-3 border border-[#1f1b16]/10 dark:border-[#efe9de]/10 rounded-lg">
                    <table className="min-w-full divide-y divide-[#1f1b16]/10 dark:divide-[#efe9de]/10" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th className="px-4 py-2.5 bg-[#f2ede4] dark:bg-[#262421] text-left text-xs font-medium text-[#5e554a] dark:text-[#aaa398]" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="px-4 py-2.5 text-sm border-t border-[#1f1b16]/8 dark:border-[#efe9de]/8" {...props} />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#1f1b16]/8 dark:border-[#efe9de]/8">
              <p className="text-xs text-[#7b7266] dark:text-[#8a847a] mb-2">Sources</p>
              <div className="flex flex-wrap gap-2">
                {message.sources.map((source, idx) => (
                  <SourceCard key={`${source.file}-${source.page}-${idx}`} source={source} />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 mt-2.5 pt-2 border-t border-[#1f1b16]/6 dark:border-[#efe9de]/6">
            <span className="text-[11px] text-[#7b7266] dark:text-[#8a847a] font-mono tabular-nums">
              {formattedTime}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 text-[#7b7266] dark:text-[#8a847a] hover:text-[#1f1b16] dark:hover:text-[#efe9de] hover:bg-[#1f1b16]/5 dark:hover:bg-[#efe9de]/5 rounded-md transition-colors"
              title="Copy response"
              aria-label="Copy response"
            >
              {copied ? <FiCheck className="w-4 h-4 text-[#16a34a] dark:text-[#4cc38a]" /> : <FiCopy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
