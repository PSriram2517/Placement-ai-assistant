import React, { useState, useEffect } from 'react';
import { FiUpload, FiDatabase, FiFileText, FiRefreshCw } from 'react-icons/fi';
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
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <FiDatabase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Knowledge Base</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Manage documents uploaded to the local LLM.</p>
          </div>
        </div>

        <div 
          onClick={onOpenUpload}
          className="border-2 border-dashed border-indigo-300 dark:border-indigo-700/50 bg-indigo-50/50 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl p-10 text-center cursor-pointer transition-colors mb-8 group"
        >
          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-105 transition-transform">
            <FiUpload className="w-6 h-6 text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1">Upload New Document</h3>
          <p className="text-sm text-slate-500">PDFs up to 20MB are supported</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Uploaded Documents</h3>
            <button 
              onClick={fetchDocs}
              className="flex items-center space-x-1 text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
              disabled={loading}
            >
              <FiRefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-8 text-slate-500">Loading documents...</div>
          ) : documents.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center text-slate-500 dark:text-slate-400">
              <FiFileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No documents found.</p>
              <p className="text-xs mt-1 opacity-70">Upload a PDF to see it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-sm transition-shadow">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-lg">
                    <FiFileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-medium text-slate-700 dark:text-slate-200 truncate">{doc.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatSize(doc.size)} • {doc.type}
                    </p>
                  </div>
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
