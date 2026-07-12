import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiPaperclip, FiMic } from 'react-icons/fi';

const ChatInput = ({ onSend, isLoading, onOpenUpload }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + (prev ? ' ' : '') + transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (e) {
        console.error('Microphone access denied or error occurred', e);
        setIsRecording(false);
      }
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 bg-transparent pb-6 w-full max-w-4xl mx-auto">
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-end bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none transition-all p-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20"
      >
        <button
          type="button"
          onClick={onOpenUpload}
          className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shrink-0 mb-1"
        >
          <FiPaperclip className="w-5 h-5" />
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about placements..."
          disabled={isLoading}
          rows={1}
          className="flex-1 max-h-[200px] bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 resize-none outline-none py-3.5 px-2 min-h-[48px] custom-scrollbar disabled:opacity-50 text-sm"
        />

        <div className="flex items-center space-x-1 shrink-0 mb-1 mr-1">
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-3 transition-colors ${isRecording ? 'text-red-500 hover:text-red-600 animate-pulse' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            title={isRecording ? "Stop recording" : "Start recording"}
          >
            <FiMic className="w-5 h-5" />
          </button>
          
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed shadow-sm"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </form>
      <div className="text-center mt-3">
        <span className="text-[10px] text-slate-500 flex justify-center items-center space-x-1">
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>PlacementGPT runs locally using Llama through Ollama. Answers may require verification.</span>
        </span>
      </div>
    </div>
  );
};

export default ChatInput;
