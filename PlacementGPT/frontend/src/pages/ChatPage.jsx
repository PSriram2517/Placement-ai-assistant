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
import { FiAlertTriangle, FiArrowDown, FiChevronRight } from 'react-icons/fi';

const STARTER_PROMPTS = [
  'How to prepare for TCS?',
  'Explain binary search with time complexity',
  'How should I structure my resume?',
  'Common SQL interview questions',
];

const ChatPage = ({ user, onLogout }) => {
  const storageKey = user?.email ? `placementgpt_conversations_${user.email}` : 'placementgpt_conversations';
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

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
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

    checkBackendHealth();
  }, [storageKey]);

  const checkBackendHealth = async () => {
    const health = await checkHealth();
    const isHealthy = health.status === 'healthy' && health.ollama === 'connected';
    if (!isHealthy) {
      setBackendStatus({
        checked: true,
        healthy: false,
        message: health.ollama_message || 'Backend server is not running or Ollama is not connected'
      });
    } else {
      setBackendStatus({
        checked: true,
        healthy: true,
        message: ''
      });
    }
    return isHealthy;
  };

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(conversations));
    }
  }, [conversations, storageKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 150);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, isLoading]);

  const activeConversation = conversations.find(c => c.id === activeId) || null;

  const startNewChat = () => {
    const newConv = {
      id: Date.now().toString(),
      title: 'New conversation',
      messages: [],
      createdAt: new Date().toISOString()
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveId(newConv.id);
    if (window.innerWidth < 1024) setIsMobileMenuOpen(false);
  };

  const deleteConversation = (id) => {
    const remaining = conversations.filter(c => c.id !== id);
    setConversations(remaining);
    if (activeId === id) {
      if (remaining.length > 0) {
        setActiveId(remaining[0].id);
      } else {
        localStorage.removeItem(storageKey);
        startNewChat();
      }
    }
  };

  const clearAllChats = () => {
    setConversations([]);
    setActiveId(null);
    localStorage.removeItem(storageKey);
    startNewChat();
  };

  const handleSend = async (question) => {
    if (!activeConversation) return;

    if (activeTab !== 'chat') {
      setActiveTab('chat');
    }

    if (!backendStatus.healthy) {
      const isHealthy = await checkBackendHealth();
      if (!isHealthy) return;
    }

    const userMessage = { role: 'user', content: question, timestamp: new Date().toISOString() };

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeId) {
        const title = conv.messages.length === 0
          ? (question.length > 36 ? question.substring(0, 36) + '…' : question)
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
        sources: response.sources,
        timestamp: new Date().toISOString()
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
        content: `**Error:** ${error.message}\n\nCheck that the backend and Ollama are running.`,
        timestamp: new Date().toISOString()
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

  const headerTitle =
    activeTab === 'knowledge'
      ? 'Knowledge base'
      : activeTab === 'saved'
        ? 'Saved conversations'
        : activeTab === 'topics'
          ? 'Interview topics'
          : activeConversation?.title || 'PlacementGPT';

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f4ee] dark:bg-[#161513]">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelectConversation}
        onNewChat={startNewChat}
        onDelete={deleteConversation}
        onOpenUpload={() => setIsUploadOpen(true)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isGenerating={isLoading}
        ollamaConnected={backendStatus.healthy}
        user={user}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col h-full w-full min-w-0 relative">
        <Header
          title={headerTitle}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {backendStatus.checked && !backendStatus.healthy && (
          <div className="bg-[#dc2626] dark:bg-[#e5484d] text-white px-4 py-2 text-xs text-center flex items-center justify-center gap-2">
            <FiAlertTriangle className="w-4 h-4 shrink-0" />
            <span>{backendStatus.message}</span>
          </div>
        )}

        {activeTab === 'chat' && (
          <>
            <div
              className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar"
              ref={chatContainerRef}
              onScroll={handleScroll}
            >
              <div className="max-w-4xl mx-auto w-full">
                {(!activeConversation || activeConversation.messages.length === 0) ? (
                  <div className="flex flex-col justify-center min-h-[60vh] max-w-xl mx-auto px-2 py-8">
                    <h2 className="font-serif text-3xl font-normal text-[#1f1b16] dark:text-[#efe9de] mb-2 tracking-[-0.02em] leading-tight">
                      Placement preparation, offline
                    </h2>
                    <p className="text-sm text-[#5e554a] dark:text-[#aaa398] mb-6 leading-relaxed">
                      Ask about coding interviews, company hiring stages, resume structure, or query your own study PDFs
                    </p>

                    <div className="border border-[#1f1b16]/8 dark:border-[#efe9de]/8 bg-[#fdfbf7] dark:bg-[#1c1a18] rounded-xl divide-y divide-[#1f1b16]/8 dark:divide-[#efe9de]/8">
                      {STARTER_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => handleSend(prompt)}
                          className="w-full px-4 py-3 flex items-center justify-between text-left text-sm text-[#1f1b16] dark:text-[#efe9de] hover:bg-[#efe9df]/60 dark:hover:bg-[#262421] transition-colors first:rounded-t-xl last:rounded-b-xl group"
                        >
                          <span>{prompt}</span>
                          <FiChevronRight className="w-4 h-4 text-[#7b7266] dark:text-[#8a847a] group-hover:text-[#b45309] dark:group-hover:text-[#d97706] transition-colors shrink-0 ml-3" />
                        </button>
                      ))}
                    </div>
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
                className="absolute bottom-24 right-6 md:right-10 bg-[#fdfbf7] dark:bg-[#262421] text-[#1f1b16] dark:text-[#efe9de] p-2.5 rounded-lg border border-[#1f1b16]/12 dark:border-[#efe9de]/12 hover:bg-[#efe9df] dark:hover:bg-[#302d29] transition-colors z-20 animate-fade-in flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                title="Scroll to bottom"
                aria-label="Scroll to bottom"
              >
                <FiArrowDown className="w-4 h-4" />
              </button>
            )}

            <ChatInput
              onSend={handleSend}
              isLoading={isLoading || (!backendStatus.healthy && backendStatus.checked)}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
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

      {activeTab === 'chat' && (
        <RightSidebar
          onQuestionClick={handleSend}
          onExploreTopics={() => setActiveTab('topics')}
        />
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
