import React, { useState, useRef } from 'react';
import { FiUpload, FiX, FiFile, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { uploadPdf } from '../services/api';

const UploadPDF = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setError(null);
    setSuccess(null);
    
    if (selected && selected.type === 'application/pdf') {
      if (selected.size > 20 * 1024 * 1024) {
        setError('File exceeds 20MB limit.');
        setFile(null);
      } else {
        setFile(selected);
      }
    } else {
      setError('Please select a valid PDF file.');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const response = await uploadPdf(file, setProgress);
      setSuccess(`Success! ${response.chunks_added} sections added to knowledge base.`);
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();
      setTimeout(() => {
        onClose();
        setSuccess(null);
        setProgress(0);
      }, 3000);
    } catch (err) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Upload Knowledge PDF</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {!file && !success && (
            <div 
              className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiUpload className="w-10 h-10 mx-auto text-primary mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">Click or drag PDF to upload</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Maximum file size: 20MB</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".pdf,application/pdf" 
                className="hidden" 
              />
            </div>
          )}
          
          {file && !success && (
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                <FiFile className="w-8 h-8 text-secondary flex-shrink-0" />
                <div className="truncate">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={() => setFile(null)} 
                disabled={isUploading}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          )}

          {isUploading && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-slate-400">
                <span>Uploading and analyzing...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-start text-sm">
              <FiAlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-8 text-center text-accent">
              <FiCheckCircle className="w-16 h-16 mx-auto mb-4" />
              <p className="font-medium text-lg">{success}</p>
              <p className="text-sm text-slate-500 mt-2">Closing automatically...</p>
            </div>
          )}
        </div>
        
        {!success && (
          <div className="p-4 bg-slate-50 dark:bg-slate-750 border-t border-slate-200 dark:border-slate-700 flex justify-end">
            <button 
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg mr-2 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isUploading ? 'Processing...' : 'Upload to Knowledge Base'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPDF;
