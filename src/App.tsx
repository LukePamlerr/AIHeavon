import { useState, useEffect } from 'react';
import { useChat } from './hooks/useChat';
import Sidebar from './components/Sidebar';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import SettingsModal from './components/SettingsModal';
import ModelSelector from './components/ModelSelector';

function App() {
  const {
    chats,
    activeChat,
    activeChatId,
    loading,
    settings,
    createChat,
    setActiveChatId,
    sendMessage,
    setSettings,
  } = useChat();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentModelId, setCurrentModelId] = useState('openai/gpt-3.5-turbo');

  // Load last used model from chat or default
  useEffect(() => {
    if (activeChat) {
      setCurrentModelId(activeChat.model);
    }
  }, [activeChat]);

  const handleSend = (message: string) => {
    if (!activeChatId) {
      const newChatId = createChat(currentModelId);
      sendMessage(message, currentModelId, newChatId);
    } else {
      sendMessage(message, currentModelId);
    }
  };

  const handleNewChat = () => {
    createChat(currentModelId);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-gray-100 font-sans overflow-hidden">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={(id) => {
          setActiveChatId(id);
          if (window.innerWidth < 768) setIsSidebarOpen(false);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex flex-col md:ml-64 relative transition-all duration-300">
        {/* Header */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-950/50 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <div className="font-semibold text-lg hidden md:block">
              {activeChat?.title || 'New Chat'}
            </div>
            <ModelSelector
              currentModelId={currentModelId}
              onModelSelect={setCurrentModelId}
              apiKey={settings.openRouterKey}
            />
          </div>
          {/* Right side header items (e.g. Share) could go here */}
        </header>

        {/* Main Chat Area */}
        <main className="flex-1 overflow-hidden flex flex-col relative">
          {activeChat ? (
            <MessageList 
              messages={activeChat.messages} 
              loading={loading} 
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6">
              <div className="w-20 h-20 bg-lime-500/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">✨</span>
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-600">
                Welcome to AIHeavon
              </h2>
              <p className="text-gray-400 max-w-md">
                Access advanced AI models for free. Configure your API keys in settings to get started.
              </p>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-lime-400 border border-gray-700 transition-all flex items-center gap-2"
              >
                Configure Keys
              </button>
            </div>
          )}

          <div className="p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
             <ChatInput onSend={handleSend} disabled={loading} />
          </div>
        </main>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialSettings={settings}
        onSave={setSettings}
      />
    </div>
  );
}

export default App;