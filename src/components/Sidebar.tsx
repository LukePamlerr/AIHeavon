import React from 'react';
import { Menu, Plus, Settings } from 'lucide-react';

interface SidebarProps {
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  chats: { id: string; title: string }[];
  activeChatId: string | null;
  onOpenSettings: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onNewChat,
  onSelectChat,
  chats,
  activeChatId,
  onOpenSettings,
  isOpen,
  onToggle,
}) => {
  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 rounded-md text-lime-400"
        onClick={onToggle}
      >
        <Menu />
      </button>

      {/* Sidebar Content */}
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-gray-950 border-r border-gray-800 transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-lime-400">AIHeavon</h1>
            <button 
              onClick={onNewChat} 
              className="p-2 hover:bg-gray-800 rounded-full text-lime-400"
              title="New Chat"
            >
              <Plus />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                  activeChatId === chat.id 
                    ? 'bg-lime-900/20 text-lime-400 border border-lime-900' 
                    : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
                }`}
              >
                <div className="truncate">{chat.title || 'New Chat'}</div>
              </button>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-gray-800">
            <button
              onClick={onOpenSettings}
              className="flex items-center w-full p-3 text-gray-400 hover:text-lime-400 transition-colors"
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings & API Keys
            </button>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default Sidebar;
