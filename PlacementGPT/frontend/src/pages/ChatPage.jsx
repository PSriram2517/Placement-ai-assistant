import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import UploadPDF from '../components/UploadPDF';
import SettingsModal from '../components/SettingsModal';
import RightSidebar from '../components/RightSidebar';
import KnowledgeBaseView from '../views/KnowledgeBaseView';
import SavedConversationsView from '../views/SavedConversationsView';
import InterviewTopicsView from '../views/InterviewTopicsView';
import { askQuestion, checkHealth } from '../services/api';
import { FiMessageSquare, FiAlertTriangle, FiArrowDown } from 'react-icons/fi';

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);
  const [backendStatus, setBackendStatus] = useState({ checked: false, healthy: true, message: '' });
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Load conversations from local storage
  useEffect(() => {
    const saved = localStorage.getItem('placementgpt_conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed);
        if (parsed.length > 0) {
          setActiveId(parsed[0].id);
        } else {
          startNewChat();
        }
      } catch (e) {
        console.error('Failed to parse conversations', e);
        startNewChat();
      }
    } else {
      startNewChat();
    }
    
    // Check backend health
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    const health = await checkHealth();
    if (health.status !== 'healthy' || health.ollama !== 'connected') {
      setBackendStatus({
        checked: true,
        healthy: false,
        message: health.ollama_message || 'Backend server is not running or Ollama is not connected.'
      });
    } else {
      setBackendStatus({
        checked: true,
        healthy: true,
        message: ''
      });
    }
  };

  // Save conversations to local storage when they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('placementgpt_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      if (scrollHeight - scrollTop - clientHeight > 150) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, isLoading]);

  const activeConversation = conversations.find(c => c.id === activeId) || null;

  const startNewChat = () => {
    const newConv = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date().toISOString()
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveId(newConv.id);
    if (window.innerWidth < 1024) setIsMobileMenuOpen(false);
  };

  const deleteConversation = (id) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeId === id) {
      const remaining = conversations.filter(c => c.id !== id);
      if (remaining.length > 0) {
        setActiveId(remaining[0].id);
      } else {
        startNewChat();
      }
    }
  };

  const clearAllChats = () => {
    setConversations([]);
    setActiveId(null);
    localStorage.removeItem('placementgpt_conversations');
    startNewChat();
  };

  const handleSend = async (question) => {
    if (!activeConversation) return;
    
    // Make sure we are on the chat tab
    if (activeTab !== 'chat') {
      setActiveTab('chat');
    }

    // Ensure backend is healthy before sending
    if (!backendStatus.healthy) {
      await checkBackendHealth();
      if (!backendStatus.healthy) return;
    }

    const userMessage = { role: 'user', content: question };
    
    // Update conversation with user message
    setConversations(prev => prev.map(conv => {
      if (conv.id === activeId) {
        // Set title based on first question if not already set
        const title = conv.messages.length === 0 
          ? (question.length > 30 ? question.substring(0, 30) + '...' : question)
          : conv.title;
          
        return {
          ...conv,
          title,
          messages: [...conv.messages, userMessage]
        };
      }
      return conv;
    }));

    setIsLoading(true);

    try {
      const response = await askQuestion(question, activeId);
      
      const assistantMessage = { 
        role: 'assistant', 
        content: response.answer,
        sources: response.sources 
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === activeId) {
          return {
            ...conv,
            messages: [...conv.messages, assistantMessage]
          };
        }
        return conv;
      }));
    } catch (error) {
      const errorMessage = { 
        role: 'assistant', 
        content: `**Error:** ${error.message}\n\nPlease check if your backend and Ollama are running correctly.` 
      };
      
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeId) {
          return {
            ...conv,
            messages: [...conv.messages, errorMessage]
          };
        }
        return conv;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = (id) => {
    setActiveId(id);
    setActiveTab('chat');
    if (window.innerWidth < 1024) setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0f172a]">
      {/* Left Sidebar */}
      <Sidebar 
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelectConversation}
        onNewChat={startNewChat}
        onDelete={deleteConversation}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full w-full min-w-0 relative">
        <Header 
          title={activeConversation?.title} 
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        
        {/* Backend Warning Banner */}
        {backendStatus.checked && !backendStatus.healthy && (
          <div className="bg-red-500 text-white p-3 text-sm text-center flex items-center justify-center space-x-2">
            <FiAlertTriangle className="w-5 h-5" />
            <span>{backendStatus.message}</span>
          </div>
        )}

        {/* Tab Routing */}
        {activeTab === 'chat' && (
          <>
            <div 
              className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar"
              ref={chatContainerRef}
              onScroll={handleScroll}
            >
              <div className="max-w-4xl mx-auto w-full">
                {(!activeConversation || activeConversation.messages.length === 0) ? (
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100 dark:border-indigo-800/50">
                      <FiMessageSquare className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                      Welcome to PlacementGPT
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10">
                      Your offline AI assistant for job placements, technical interviews, resume building, and career preparation.
                    </p>
                  </div>
                ) : (
                  <div className="pb-10">
                    {activeConversation.messages.map((msg, idx) => (
                      <ChatMessage key={idx} message={msg} />
                    ))}
                    {isLoading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>

            {showScrollButton && (
              <button 
                onClick={scrollToBottom}
                className="absolute bottom-28 right-8 md:right-12 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all z-20 animate-fade-in flex items-center justify-center"
                title="Scroll to bottom"
              >
                <FiArrowDown className="w-5 h-5" />
              </button>
            )}

            <ChatInput onSend={handleSend} isLoading={isLoading || (!backendStatus.healthy && backendStatus.checked)} onOpenUpload={() => setIsUploadOpen(true)} />
          </>
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeBaseView key={uploadKey} onOpenUpload={() => setIsUploadOpen(true)} />
        )}

        {activeTab === 'saved' && (
          <SavedConversationsView 
            conversations={conversations} 
            onSelectConversation={handleSelectConversation} 
          />
        )}

        {activeTab === 'topics' && (
          <InterviewTopicsView onSelectTopic={(topic) => handleSend(topic)} />
        )}
      </div>

      {/* Right Sidebar (Suggested Questions) */}
      {activeTab === 'chat' && (
        <RightSidebar onQuestionClick={handleSend} />
      )}

      <UploadPDF 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onUploadSuccess={() => setUploadKey(prev => prev + 1)}
      />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onClearAllChats={clearAllChats} 
      />
    </div>
  );
};

export default ChatPage;
