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
        setError('File exceeds 20 MB limit');
        setFile(null);
      } else {
        setFile(selected);
      }
    } else {
      setError('Select a valid PDF file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const response = await uploadPdf(file, setProgress);
      setSuccess(`${response.chunks_added} sections added to knowledge base`);
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();
      setTimeout(() => {
        onClose();
        setSuccess(null);
        setProgress(0);
      }, 2500);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="bg-[#fdfbf7] dark:bg-[#1c1a18] border border-[#1f1b16]/10 dark:border-[#efe9de]/10 rounded-xl w-full max-w-md overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <div className="flex justify-between items-center px-5 py-4 border-b border-[#1f1b16]/8 dark:border-[#efe9de]/8">
          <h3 className="text-base font-medium text-[#1f1b16] dark:text-[#efe9de]">Upload knowledge PDF</h3>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-1.5 rounded-lg text-[#7b7266] dark:text-[#8a847a] hover:text-[#1f1b16] dark:hover:text-[#efe9de] hover:bg-[#1f1b16]/5 dark:hover:bg-[#efe9de]/5 transition-colors disabled:opacity-40"
            aria-label="Close modal"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          {!file && !success && (
            <div
              className="border border-dashed border-[#1f1b16]/20 dark:border-[#efe9de]/20 rounded-lg p-8 text-center cursor-pointer hover:bg-[#efe9df]/50 dark:hover:bg-[#262421]/60 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiUpload className="w-5 h-5 mx-auto text-[#b45309] dark:text-[#d97706] mb-3" />
              <p className="text-sm font-medium text-[#1f1b16] dark:text-[#efe9de] mb-1">Select a PDF file</p>
              <p className="text-xs text-[#7b7266] dark:text-[#8a847a]">Maximum file size 20 MB</p>
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
            <div className="bg-[#f2ede4] dark:bg-[#262421] border border-[#1f1b16]/8 dark:border-[#efe9de]/8 rounded-lg p-3 mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <FiFile className="w-4 h-4 text-[#b45309] dark:text-[#d97706] shrink-0" />
                <div className="truncate">
                  <p className="text-sm font-medium text-[#1f1b16] dark:text-[#efe9de] truncate">{file.name}</p>
                  <p className="text-xs text-[#7b7266] dark:text-[#8a847a] font-mono tabular-nums">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                disabled={isUploading}
                className="p-1.5 text-[#7b7266] dark:text-[#8a847a] hover:text-[#dc2626] dark:hover:text-[#e5484d] transition-colors disabled:opacity-40"
                aria-label="Remove file"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}

          {isUploading && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5 text-[#5e554a] dark:text-[#aaa398] font-mono tabular-nums">
                <span>Uploading and indexing</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-[#efe9df] dark:bg-[#262421] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#b45309] dark:bg-[#d97706] h-1.5 w-full rounded-full origin-left transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ transform: `scaleX(${progress / 100})` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-[#dc2626]/10 dark:bg-[#e5484d]/15 border border-[#dc2626]/25 dark:border-[#e5484d]/30 text-[#dc2626] dark:text-[#e5484d] rounded-lg flex items-start gap-2 text-sm">
              <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="py-8 text-center">
              <FiCheckCircle className="w-6 h-6 mx-auto mb-3 text-[#16a34a] dark:text-[#4cc38a]" />
              <p className="font-medium text-sm text-[#1f1b16] dark:text-[#efe9de]">{success}</p>
              <p className="text-xs text-[#7b7266] dark:text-[#8a847a] mt-1">Closing automatically</p>
            </div>
          )}
        </div>

        {!success && (
          <div className="px-5 py-3.5 bg-[#f2ede4] dark:bg-[#12110f] border-t border-[#1f1b16]/8 dark:border-[#efe9de]/8 flex justify-end gap-2">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="h-9 px-4 text-sm font-medium text-[#5e554a] dark:text-[#aaa398] hover:bg-[#1f1b16]/5 dark:hover:bg-[#efe9de]/5 rounded-lg transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="h-9 px-4 text-sm font-medium text-white bg-[#b45309] hover:bg-[#92400e] dark:bg-[#d97706] dark:hover:bg-[#f59e0b] dark:text-[#12110f] rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isUploading ? 'Processing…' : 'Upload PDF'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPDF;
