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
      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
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

  useEffect(() => { adjustTextareaHeight(); }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="px-4 pb-5 pt-2 w-full max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-1 bg-[#fdfbf7] dark:bg-[#1c1a18] border border-[#1f1b16]/12 dark:border-[#efe9de]/12 rounded-xl p-2 focus-within:border-[#b45309] dark:focus-within:border-[#d97706] transition-colors"
      >
        <button
          type="button"
          onClick={onOpenUpload}
          className="p-2.5 rounded-lg text-[#7b7266] dark:text-[#8a847a] hover:text-[#1f1b16] dark:hover:text-[#efe9de] hover:bg-[#1f1b16]/5 dark:hover:bg-[#efe9de]/5 transition-colors shrink-0"
          title="Upload PDF"
          aria-label="Upload PDF"
        >
          <FiPaperclip className="w-4 h-4" />
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about interviews, companies, or PDFs"
          disabled={isLoading}
          rows={1}
          className="flex-1 max-h-[200px] bg-transparent text-[#1f1b16] dark:text-[#efe9de] placeholder-[#7b7266] dark:placeholder-[#8a847a] resize-none outline-none py-2.5 px-2 min-h-[40px] custom-scrollbar disabled:opacity-40 text-sm leading-relaxed"
        />

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2.5 rounded-lg transition-colors ${
              isRecording
                ? 'text-[#dc2626] dark:text-[#e5484d] bg-[#dc2626]/10 dark:bg-[#e5484d]/10'
                : 'text-[#7b7266] dark:text-[#8a847a] hover:text-[#1f1b16] dark:hover:text-[#efe9de] hover:bg-[#1f1b16]/5 dark:hover:bg-[#efe9de]/5'
            }`}
            title={isRecording ? 'Stop recording' : 'Start voice input'}
            aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
          >
            <FiMic className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-white dark:bg-[#d97706] dark:hover:bg-[#f59e0b] dark:text-[#12110f] transition-colors disabled:opacity-35 disabled:cursor-not-allowed active:scale-[0.98]"
            aria-label="Send message"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </div>
      </form>

      <p className="text-center mt-2 text-xs text-[#7b7266] dark:text-[#8a847a]">
        Runs locally via Ollama · verify critical facts
      </p>
    </div>
  );
};

export default ChatInput;
