import React, { useState, useEffect } from 'react';
import { FiUpload, FiFileText, FiRefreshCw } from 'react-icons/fi';
import { getDocuments } from '../services/api';

const KnowledgeBaseView = ({ onOpenUpload }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = async () => {
    setLoading(true);
    const docs = await getDocuments();
    setDocuments(docs);
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
      <div className="max-w-3xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-normal text-[#1f1b16] dark:text-[#efe9de] tracking-[-0.02em] leading-tight">
            Knowledge base
          </h2>
          <p className="text-sm text-[#5e554a] dark:text-[#aaa398] mt-1.5">
            Manage PDFs indexed by the local model
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenUpload}
          className="w-full border border-dashed border-[#1f1b16]/20 dark:border-[#efe9de]/20 bg-[#fdfbf7] dark:bg-[#1c1a18] hover:bg-[#efe9df]/60 dark:hover:bg-[#262421] rounded-xl p-8 text-center cursor-pointer transition-colors mb-8"
        >
          <FiUpload className="w-5 h-5 mx-auto text-[#b45309] dark:text-[#d97706] mb-3" />
          <p className="text-sm font-medium text-[#1f1b16] dark:text-[#efe9de] mb-1">
            Upload new document
          </p>
          <p className="text-xs text-[#7b7266] dark:text-[#8a847a]">
            PDF files up to 20 MB
          </p>
        </button>

        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-xs font-medium text-[#7b7266] dark:text-[#8a847a]">
              Indexed documents
            </h3>
            <button
              onClick={fetchDocs}
              className="flex items-center gap-1.5 text-xs font-medium text-[#b45309] dark:text-[#d97706] hover:underline transition-colors"
              disabled={loading}
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="py-8 text-center text-sm text-[#7b7266] dark:text-[#8a847a]">
              Loading documents…
            </div>
          ) : documents.length === 0 ? (
            <div className="bg-[#fdfbf7] dark:bg-[#1c1a18] border border-[#1f1b16]/8 dark:border-[#efe9de]/8 rounded-xl p-8 text-center">
              <FiFileText className="w-5 h-5 mx-auto mb-2 text-[#7b7266] dark:text-[#8a847a]" />
              <p className="text-sm font-medium text-[#1f1b16] dark:text-[#efe9de]">
                No documents found
              </p>
              <p className="text-xs mt-1 text-[#7b7266] dark:text-[#8a847a]">
                Upload a PDF to index it here
              </p>
            </div>
          ) : (
            <div className="bg-[#fdfbf7] dark:bg-[#1c1a18] border border-[#1f1b16]/8 dark:border-[#efe9de]/8 rounded-xl divide-y divide-[#1f1b16]/8 dark:divide-[#efe9de]/8">
              {documents.map((doc, idx) => (
                <div
                  key={doc.id || idx}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FiFileText className="w-4 h-4 text-[#7b7266] dark:text-[#8a847a] shrink-0" />
                    <span className="text-sm font-medium text-[#1f1b16] dark:text-[#efe9de] truncate">
                      {doc.name}
                    </span>
                  </div>
                  <span className="text-xs text-[#7b7266] dark:text-[#8a847a] font-mono tabular-nums shrink-0">
                    {formatSize(doc.size)} · {doc.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseView;
